---
name: audit-vps
description: "Audit every Hostinger VPS (KVM plans) on the account and report what needs attention: server state and failed actions, CPU, memory, disk and monthly traffic use, firewall missing or not synced, SSH keys, Monarx malware counts, backup age, Docker Manager projects that are not healthy, old OpenVZ servers, and VPS plans about to lapse. Read-only; produces a prioritised to-do list and names the skill or hPanel page that fixes each item. Triggers: what VPS do I have, audit my servers, check all my VPS, which servers need attention, health check my VPS, are my servers secure, is my VPS backed up, when does my VPS expire."
---

# Audit VPS

Read-only from start to finish. The output is a report; every fix is a separate, confirmed step through another skill or in hPanel.

## Calling the operations

- Read the `inputSchema` that `search` returns before the first call of each operation. If a name below is rejected as unknown, `search` for what the step does (e.g. "virtual machine metrics").
- Batch reads with `multi-execute`, up to 20 steps a batch. Batches chain operations from one server only — the Hostinger Connector runs `vps` and `billing` as separate servers. When a product group is switched off, skip its checks and say which were skipped.
- `vps_virtual-machines_list` returns a plain array; paged lists (`vps_actions_list`, `vps_backups_list`, `vps_firewall_list`) return `data` and `meta`.
- `Too Many Attempts` is the API rate limit: wait about a minute, then retry that call once, and send no other calls meanwhile. `[VPS:9999] Request failed` (HTTP 500) is usually temporary: retry once later, and if it fails again, report that server as not checked.
- Call only read operations. Do not take a snapshot, sync a firewall, install Monarx or restart anything during the audit.

## 1. Inventory

- `vps_virtual-machines_list` — per server `id`, `hostname`, `plan`, `state`, `actions_lock`, `template.name`, `memory` and `disk` (MB), `bandwidth`, `firewall_group_id`, `subscription_id`, `ipv4[0].address`, `created_at`.
- `vps_firewall_list` — every firewall group with its rules and `is_synced`.
- `vps_data-centers_list` — to name each server's location from `data_center_id`.
- `billing_subscriptions_list` (billing product) — joined to servers on `subscription_id`.

Tell the user the size (servers by plan and location) before the checks. For large accounts offer to scope the audit.

## 2. Checks

Per server, one batch for every read below except `vps_monarx_scan-metrics` and `vps_docker_list`. Their errors stop a batch, so call each of those two on its own:

- **State.** `running` is normal; `stopped` may be the user's own stop or a Hostinger stop after malware was found; `suspended` is non-payment or abuse; `error` needs Hostinger support; `initial` is bought and waiting for setup. Any other state with `actions_lock: locked` is an action in progress. Expired plans can still show `running` — use the subscription.
- **Actions.** `vps_actions_list` (first page): an `error` in the last 7 days, or an action still `sent` after 12 hours (stuck — Hostinger support).
- **Usage.** `vps_virtual-machines_metrics` for the last 24 h. `disk_space` and `ram_usage` are in bytes, while `disk` and `memory` are in MB, so convert before comparing: `disk_space` above 85 % of `disk`, `ram_usage` above 90 % of `memory` most of the day, `cpu_usage` above 90 % most of the day. Sustained high CPU leads Hostinger to limit the server's CPU; whether a limit is active shows only in hPanel.
- **Traffic.** The same metrics from the 1st of the month: inbound plus outbound traffic near the plan's monthly `bandwidth` means the server will be throttled for the rest of the month. By mid-month the result is over 100 KB per server, too large to read whole. When it comes back saved to a file, add up `incoming_traffic` and `outgoing_traffic` with a short script on that file. If the script cannot run, use the last 7 days, scale them to the month and say the figure is an estimate.
- **Backups.** `vps_backups_list`: no backup newer than 8 days on a server older than 7 days means the weekly schedule is probably off. The API cannot show the schedule; the user checks hPanel → VPS → Snapshots & Backups, where Auto-backups shows it.
- **SSH keys.** `vps_ssh-keys_list-virtual-machine` shows only keys added through Hostinger (hPanel or the API). Keys added on the server by hand do not appear, so an empty list means "no SSH key added through Hostinger", not that login is password-only. secure-vps checks password login over SSH.
- **Malware.** `vps_monarx_scan-metrics`: `[VPS:2042] Monarx is not installed` means it is not installed; counts mean it is. `malicious` or `compromised` above 0 is a finding.
- **Docker Manager.** `vps_docker_list` on every server; an empty list means no projects. `[VPS:2044]` means this server has no Docker Manager, so skip it. Availability does not follow the template name. For each project, flag any container not `running`, or with `health` other than `healthy`.
- **OpenVZ.** A plan named `KVM n` is KVM and is never flagged. Flag a server whose plan name does not start with `KVM`. Only when the plan name is missing or unclear, use `created_at` before 18 April 2023 as a hint, because VPS bought on hostinger.com before then were usually OpenVZ. For a flagged server, the user checks hPanel and follows Hostinger's OpenVZ-to-KVM migration guide.

**Firewall**, from the API only. In hPanel a group's rules sit behind an Actions menu the agent cannot open, so read them here and never send the user to hPanel to read them. Match each server's `firewall_group_id` to a group from `vps_firewall_list` (or `vps_firewall_get` with that id), then check:

- `firewall_group_id: null`: no group is active, so every port the OS listens on is reachable.
- `is_synced: false`: rule changes are not applied yet. hPanel does not show this.
- an `accept` rule with `source: "any"` on a database or cache port (3306, 5432, 6379, 27017).

hPanel's Firewall page lists every group on the account with an on/off switch per server, and its rule counts run one higher than the API's. Count rules from the API.

Plans: auto-renew off (`is_auto_renewed: false`, status `non_renewing`) **and** `expires_at` within 30 days. After expiry a VPS is suspended for up to 21 days with data kept, then cancelled; it can be restored from hPanel for 9 more days and is then destroyed.

From outside, per server:

```bash
nc -zv -w 3 IP 22
curl -s -o /dev/null -w "%{http_code}\n" --max-time 10 http://IP/
nc -zv -w 3 IP 3306; nc -zv -w 3 IP 5432; nc -zv -w 3 IP 6379; nc -zv -w 3 IP 27017
```

Run each port as its own `nc`, with the IP written out. A loop or a shell variable makes Claude Code ask for approval every time, and macOS `nc` stops after the first port when given a list.

Before trusting the scan, run the same check against `192.0.2.1`, a reserved address with no server. Any port that answers there is faked by the local network (a VPN or proxy; 80, 443 and 8080 are common), so check it with `curl` instead. On macOS add `-G 3` to `nc`; without it a port that drops traffic hangs for over a minute.

A database port answering from outside is a finding whatever the rules say.

## 3. Report

```
# VPS audit
4 servers (2 KVM 2, 1 KVM 4, 1 KVM 8) · Vilnius 3, Düsseldorf 1

## Fix now
- srv100 (203.0.113.10) — state error since the restart 2 days ago → Hostinger support
- srv101 — Monarx counts 3 malicious files → secure-vps, file list in hPanel
- srv102 — disk 96 % full → troubleshoot-vps

## Soon
- srv101 — KVM 2 expires in 9 days, auto-renew off → renew in hPanel
- srv103 — no firewall group; 22, 80, 443, 6379 answer from the internet → secure-vps
- srv100 — no backup in the last 30 days → hPanel → Snapshots & Backups → Manage schedule

## Worth knowing
- srv102 — no SSH key added through Hostinger → secure-vps
- srv103 — firewall group "web" not synced → secure-vps

## Healthy
srv104
```

- **Fix now:** state `error`, `suspended`, or `stopped` without the user's knowledge; a failed or stuck action; malware counts above 0; disk above 95 %; a Docker project down; a plan already lapsed; an OpenVZ server.
- **Soon:** no firewall group, or a database port open to the internet; no backup in 8 days; a plan lapsing within 30 days; disk above 85 %; CPU or memory saturated most of the day; monthly traffic near the quota.
- **Worth knowing:** no SSH key added through Hostinger; firewall group not synced; Monarx not installed.

Each item names the evidence and what fixes it: `troubleshoot-vps`, `secure-vps`, `deploy-to-vps`, `provision-vps`, Hostinger support, or the hPanel page. Hand back without fixing anything.

## Not available through the API

What runs inside each server, whether a CPU limit is active, the backup schedule and the Monarx file list. Mention them once at the end so the user knows what the audit could not see.
