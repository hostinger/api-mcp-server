---
name: troubleshoot-vps
description: "Diagnose and fix a Hostinger VPS (KVM plans) that is unreachable, down, slow, out of disk or running a broken service. Checks the server from outside, reads state, actions, metrics, firewall and Docker Manager logs through the Hostinger MCP, continues over SSH or the hPanel browser terminal, names the cause with evidence, and applies the fix once the user agrees; hPanel resets, emergency mode and restores are the last resorts. Triggers: my VPS is down, can't SSH into my server, connection refused, site on my VPS not loading, 502 from my server, server is slow, high CPU, CPU limited, disk full, docker container keeps restarting, my VPS is suspended, I lost my root password."
---

# Troubleshoot a VPS

One server and one symptom in; a named cause, the evidence for it, and a fix out. Stay read-only until the cause is stated and the user agrees to the fix. Deploying something new is `deploy-to-vps`; reinstalling is `provision-vps`.

## Calling the operations

- Read the `inputSchema` that `search` returns before the first call of each operation. If a name below is rejected as unknown, `search` for what the step does (e.g. "virtual machine metrics").
- Only the public operations that `search` returns can be called. Several fixes exist only in hPanel or Hostinger Agent — resetting SSH or the guest firewall, removing a CPU limit, cleaning the disk, running commands without SSH. When the fix needs one, tell the user where it is in hPanel.
- Batch reads with `multi-execute`; values pass between steps as `$steps.<i>.<path>`. A batch stops at its first failure. The Hostinger Connector runs `vps` and `dns` as separate servers.
- A VPS runs one action at a time. Most changes return an action: poll `vps_actions_get`, waiting longer between checks, until `state` is `success` or `error` (`created`, `sent`, `delayed`, `started` are still running). Firewall sync and delete answer `Request accepted` instead; check the result with the matching read operation. Typical durations: start and stop up to 5 minutes, restart up to 10, emergency mode up to 20, a backup restore from 10 minutes to a few hours.
- Confirm with the user before each of these, naming the server and what happens: `vps_virtual-machines_restart` and `vps_virtual-machines_stop` (downtime), `vps_virtual-machines_set-root-password`, `vps_recovery_start` and `vps_recovery_stop` (reboots), `vps_snapshots_restore` and `vps_backups_restore` (overwrite the disk), `vps_snapshots_create` (replaces the snapshot). A request to fix the server is not consent to any of them.

## 1. Find the server and its state

`vps_virtual-machines_list`; keep `id`, `ipv4[0].address`, `state`, `actions_lock`, `template.name`, `plan`, `memory` and `disk` (MB), `bandwidth` and `firewall_group_id`. Then `vps_actions_list`: a recent `error`, or a restore or reinstall the user did not mention, is often the whole story.

| `state` | Meaning | Next |
| --- | --- | --- |
| `running` | the hypervisor sees it up | step 2 |
| `stopped` | stopped from the dashboard, or by Hostinger after malware was found; data is kept | ask the user whether they stopped it; if not, check hPanel and email for a malware notice before `vps_virtual-machines_start` |
| `suspended` | suspended for non-payment or abuse | non-payment: renew in hPanel (data kept for up to 21 days after expiry). Abuse: the suspension email gives the reason; fix it and reply to that email. Nothing the API can do |
| `initial` | bought, waiting for setup | `provision-vps` |
| `error` | the last operation failed | Hostinger support; the VPS stays locked until they act |
| any other (`starting`, `stopping`, `restoring`, `recreating`, …) with `actions_lock: locked` | an action is running | wait and poll `vps_actions_list`. An action `sent` for 12 hours is stuck — Hostinger support |

A server shown as `running` can still have an expired plan; `billing_subscriptions_list` tells.

## 2. Look at it from outside

```bash
ping -c 3 IP
nc -zv -w 5 IP 22; nc -zv -w 5 IP 80; nc -zv -w 5 IP 443
curl -sS -o /dev/null -w "%{http_code} ttfb=%{time_starttransfer}s\n" http://IP/
dig +short A DOMAIN
```

Before trusting `nc`, run it against `192.0.2.1`, a reserved address with no server. Any port that answers there is faked by the local network (a VPN or proxy; 80, 443 and 8080 are common), so judge those ports only by an HTTP answer from `curl`. On macOS add `-G 5` to `nc`; without it a port that drops traffic hangs for over a minute.

- Every port closed, state `running` → firewall (step 3) or the guest OS (step 4 through the browser terminal).
- Port 22 closed, 80/443 open → SSH rule missing (step 3), or sshd or the guest firewall (step 6).
- Ports open, HTTP `502`/`503` → the app or proxy (step 4).
- Slow → step 5.
- `dig` returns another IP → DNS, not the server: `dns_records_list` and `deploy-to-vps` step 6.

## 3. Hostinger firewall

`firewall_group_id` set → `vps_firewall_get`. An active group drops all inbound traffic without an accept rule, on IPv4 and IPv6, and overrides any accept rule inside the OS. Check there is a rule for every port the user expects (an SSH rule restricted to an old IP is a classic cause) and that `is_synced` is true; `false` means changes are not pushed — `vps_firewall_sync-to-all-assigned-v-ms`, which answers `Request accepted`; confirm with `vps_firewall_get` showing `is_synced: true`. Missing rule → propose `vps_firewall_create-rule`, then sync. Changes reach new connections within about two minutes.

## 4. Inside the server

`ssh root@IP`, or the hPanel browser terminal (Web Console on the VPS Overview), which works without SSH. Collect before changing anything:

```bash
uptime; free -m; df -h /; df -i /
systemctl --failed
journalctl -p err -n 50 --no-pager | grep -v 'sshd-session.*preauth'
ss -ltnp
docker ps -a 2>/dev/null
```

The `grep` drops failed SSH logins from the internet, which are normal noise on a public server and would hide the real errors.

| Evidence | Cause | Fix to propose |
| --- | --- | --- |
| `df -h /` near 100 % | disk full | find the growth (`du -xh / --max-depth=2 \| sort -h \| tail`, `journalctl --disk-usage`, `docker system df`) and remove what the user agrees to. If `/var/log` is what grew, hPanel → Settings → Main settings → Delete unnecessary logs clears it; the public API has no cleanup operation |
| a service in `systemctl --failed`, error in its journal | the app crashed | the log line names it; fix config or env, then restart the service |
| `Out of memory: Killed process` in the journal | memory exhaustion | fewer workers or containers, swap, or a plan upgrade |
| a container `Restarting` | crash loop | `docker logs <name>`, or `vps_docker_logs` for a Docker Manager project |
| nginx or the app not listening in `ss` | the service is down | `systemctl status <service>`, its journal, then restart |

Docker Manager projects: `vps_docker_list` (`[VPS:2044]` means this server has no Docker Manager; availability does not follow the template name), `vps_docker_containers` for `status` and `health`, `vps_docker_logs` for the last 300 lines; `vps_docker_restart` after the log shows the cause.

## 5. Slow server

- `vps_virtual-machines_metrics` with `date_from`/`date_to` for the last 24 h: `cpu_usage` (%), `ram_usage` and `disk_space` (bytes, compare with `memory` and `disk` in MB), traffic and `uptime`. Over SSH, `top -bn1 | head -20` names the process.
- **CPU limit.** Sustained high CPU makes Hostinger limit the VPS. The user sees "resources limited due to CPU overuse" in hPanel; inside the server it shows as steal time (`st` in `top`). The limit lifts on its own after CPU use drops, or the user can press "Remove limitations" in hPanel once every 7 days. Find and fix the process first, or the limit returns.
- **Bandwidth.** Inbound plus outbound traffic over the plan's monthly `bandwidth` is throttled until the quota resets; it is not charged. Sum the month's traffic from the metrics to check.
- A legitimately busy server needs a bigger plan — hPanel Upgrade.

## 6. Locked out, or the server will not boot

In this order, each confirmed with the user first:

1. **hPanel resets** (user, in hPanel → Settings): Reset SSH configuration restores the default `sshd_config` (port 22, standard authentication) and keeps passwords and keys; Reset firewall configuration is the documented way back when a firewall locked the user out — Hostinger's documents disagree on whether it resets the guest firewall (ufw, iptables, fail2ban bans) or the Hostinger firewall group, so tell the user to check the firewall rules afterwards. The API has neither.
2. **Root password**: `vps_virtual-machines_set-root-password` (password rules as in `provision-vps`), then add a key with `vps_ssh-keys_add-virtual-machine`.
3. **Restart**: `vps_virtual-machines_restart`; loses nothing on disk.
4. **Emergency mode**: `vps_recovery_start` with a temporary `root_password` that applies only to the rescue system. The server boots a separate rescue system with the original disk mounted under `/mnt` (find the main partition with `lsblk`, e.g. `/mnt/sda1`; `chroot` into it to act as the server). SSH and the browser terminal work in it for up to 24 hours, but the Hostinger firewall may still block SSH — check step 3 first. Say what will change before changing files, then `vps_recovery_stop`.
5. **Restore** — overwrites the whole disk, cannot be stopped or undone, and deletes the current snapshot:
   - `vps_snapshots_restore`: the single snapshot, kept for one day only (`vps_snapshots_get` for its `created_at`; 404 means none).
   - `vps_backups_restore` with a `backupId` from `vps_backups_list`: weekly by default, the two latest kept (plus two daily with the paid add-on). A backup taken on another OS brings that OS back.
   Name the date and everything that will be lost after it, and wait for the user's "yes".
6. **Reinstall**: a clean OS, everything on the disk gone — only when the user asks; `provision-vps` step 5.

## Apply the fix

State the cause, the evidence and the single change proposed, and make it only after the user agrees. Re-run the step 2 checks to show the symptom is gone.

## Not available through the API

- Running commands without SSH, resetting SSH or the guest firewall, disk cleanup, removing a CPU limit — hPanel (Web Console, Settings, the CPU warning).
- Lifting a suspension — renew, or answer the abuse email.
- Downloading a backup — copy data off a running server with `rsync` or SFTP.
- Restoring a backup onto a different server — not self-service.
