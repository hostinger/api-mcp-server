---
name: secure-vps
description: "Harden a Hostinger VPS (KVM plans) to a baseline: a Hostinger firewall group that only opens the ports in use, SSH keys alongside or instead of password login, the Monarx malware scanner, and a check of the backup status and of the ports reachable from outside. Reads first, proposes each change with what it closes or removes, applies it only after the user agrees, and never locks the user out. Triggers: secure my VPS, lock down my server, harden my VPS, is my VPS safe, close open ports, set up a firewall on my server, disable password login, enable malware scanning, scan my server for malware, are my VPS backups on."
---

# Secure a VPS

Baseline hardening for one server. Read and report first; each change is proposed with what it closes or removes and made only after the user agrees. The rule that matters most: never lock the user, or the agent, out of SSH. An account-wide review is `audit-vps`; a server that is already broken is `troubleshoot-vps`.

## Calling the operations

- Read the `inputSchema` that `search` returns before the first call of each operation. If a name below is rejected as unknown, `search` for what the step does (e.g. "firewall rule").
- Only the public operations that `search` returns can be called. The backup schedule, the Monarx file list and the SSH and firewall resets live in hPanel; say where when a step needs them.
- Batch reads with `multi-execute`; values pass between steps as `$steps.<i>.<path>`. A batch stops at its first failure.
- `Too Many Attempts` is the API rate limit: wait about a minute, then retry that call once, and send no other calls meanwhile. `[VPS:9999] Request failed` (HTTP 500) is usually temporary: retry a read once later. Never resend a change that failed with 500 straight away: it may have gone through, so check the outcome with the matching read or `vps_actions_list` first, and tell the user what you found.
- A VPS runs one action at a time. Most changes return an action: poll `vps_actions_get`, waiting longer between checks, until `state` is `success` or `error`. Firewall sync and delete answer `Request accepted` instead; check the result with the matching read operation.
- Confirm with the user before each of these, listing exactly what changes: `vps_firewall_activate` (closes every port without an accept rule), `vps_firewall_replace-all-rules-in-group`, `vps_firewall_delete-rule`, `vps_firewall_update-rule`, `vps_firewall_deactivate`, `vps_firewall_delete`, `vps_ssh-keys_remove-virtual-machine`, turning off password login, `vps_monarx_install` (locks the VPS for up to an hour), `vps_monarx_uninstall`, and `vps_snapshots_create` (replaces the snapshot).
- SSH keys: `vps_ssh-keys_*`; the `vps_public-keys_*` operations are deprecated. Firewall sync: `vps_firewall_sync-to-all-assigned-v-ms`; `vps_firewall_sync` is deprecated.

## 1. Find the server

`vps_virtual-machines_list`; keep `id`, `ipv4[0].address`, `state` (must be `running`), `template.name` and `firewall_group_id`. `.hostinger/vps.json` in the project names the server from an earlier deploy.

## 2. Read the current state (read-only)

One batch:

- `vps_firewall_get` with `firewall_group_id`: rules (`protocol`, `port`, `source`, `source_detail`) and `is_synced`. `vps_firewall_list` and `vps_virtual-machines_list` show which other servers share the group.
- `vps_ssh-keys_list-virtual-machine`: keys on `root` added through Hostinger. Keys added on the server by hand do not appear, so an empty list does not prove password-only login. The SSH check below shows it.
- `vps_backups_list`: the newest backup. Backups are weekly by default; on the weekly schedule the first one appears after a full 7-day cycle (on daily, within a day). The API cannot show or change the schedule.
- `vps_monarx_scan-metrics`, alone or last in the batch: `[VPS:2042] Monarx is not installed` means it is not installed, and the error stops the batch; otherwise it returns the `malicious` and `compromised` counts.

From outside, which ports actually answer:

```bash
nc -zv -w 3 IP 21; nc -zv -w 3 IP 22; nc -zv -w 3 IP 25; nc -zv -w 3 IP 80; nc -zv -w 3 IP 443; nc -zv -w 3 IP 3306
nc -zv -w 3 IP 5432; nc -zv -w 3 IP 6379; nc -zv -w 3 IP 8080; nc -zv -w 3 IP 9200; nc -zv -w 3 IP 11211; nc -zv -w 3 IP 27017
```

Run each port as its own `nc`, with the IP written out: a loop or a shell variable makes Claude Code ask for approval every time, and macOS `nc` stops after the first port when given a list. Run the same commands against `192.0.2.1`, a reserved address with no server, first. Any port that answers there is faked by the local network (a VPN or proxy; 80, 443 and 8080 are common), so judge it with `curl` instead. On macOS add `-G 3` to `nc`; without it a port that drops traffic hangs for over a minute.

Over SSH, what listens and how SSH is set up:

```bash
ss -ltnp
sshd -T | grep -Ei '^(permitrootlogin|passwordauthentication|pubkeyauthentication) '
ufw status 2>/dev/null | head -3
```

## 3. Report and propose

```
srv123.hstgr.cloud (203.0.113.10) — Ubuntu 24.04
- No Hostinger firewall group; 22, 80, 443 and 3306 (MySQL) answer from anywhere
- Password login on, 1 SSH key on root
- Monarx: not installed
- Backups: last one 3 days ago (weekly)

Proposed:
1. Firewall group "web-srv123": SSH 22, HTTP 80, HTTPS 443 from any; 3306 closed (only this server's app uses it)
2. Turn off SSH password login (your key works — tested)
3. Install Monarx (free, detects only; the VPS is locked for up to an hour while it installs)
```

Every port that answers from outside must be either in the proposed rules or named as closing. Ask which services from `ss -ltnp` must stay reachable when it is not obvious. Wait for the user to agree, item by item if they prefer.

## 4. Hostinger firewall

An active group drops all inbound traffic that no accept rule matches, on IPv4 and IPv6, and needs at least one rule. Each server has at most one active group. It applies before the guest firewall: a Hostinger drop wins over an accept in ufw or iptables, and rules in both places must agree.

1. No group: `vps_firewall_create` (name like `web-<hostname>`), then `vps_firewall_create-rule` per port — `protocol: "SSH"` with `port: "22"`, `"HTTP"`/`"80"`, `"HTTPS"`/`"443"`, `"TCP"` with the app's port for anything else, `source: "any"` with `source_detail: "any"`, or `source: "custom"` with an IP or CIDR for admin ports. Then `vps_firewall_activate` with the group and the server, and once it succeeds, `vps_firewall_sync-to-all-assigned-v-ms`: a new group reads `is_synced: false` until it is synced, even though activation already applied its rules.
2. Existing group: change only the agreed rules, or `vps_firewall_replace-all-rules-in-group` with the complete new set and `sync: true`. A shared group changes every server using it — say which.
3. The SSH rule stays. Restrict it to the user's IP only when they ask, after confirming their current public IP; agent and laptop addresses change.
4. `vps_firewall_sync-to-all-assigned-v-ms` after rule changes. It answers `Request accepted`, not an action; check `vps_firewall_get` until it shows `is_synced: true`. New connections follow the new rules within about two minutes; open connections are kept.
5. Re-run the outside port check. Only the agreed ports may answer.

## 5. SSH keys and password login

1. No key yet: `vps_ssh-keys_add-virtual-machine` with `keys: ["<contents of the .pub file>"]`.
2. Prove key login in a new connection: `ssh -o BatchMode=yes -o PasswordAuthentication=no root@IP true`. Do not continue until it works.
3. With the user's agreement, keeping the current session open:

```bash
printf 'PasswordAuthentication no\nKbdInteractiveAuthentication no\n' > /etc/ssh/sshd_config.d/10-hardening.conf
sshd -t && (systemctl reload ssh 2>/dev/null || systemctl reload sshd)
sshd -T | grep -Ei '^(passwordauthentication|kbdinteractiveauthentication) '
```

The unit is `ssh` on Debian and Ubuntu and `sshd` on AlmaLinux, Rocky and CentOS. Both lines from `sshd -T` must say `no`. If either does not, this `sshd_config` does not read `sshd_config.d/` (older images such as CentOS 7 and AlmaLinux 8) or sets the option earlier: set both options in `/etc/ssh/sshd_config` itself, reload, and check again. Test key login again from a new connection; if it fails, undo the change and reload from the open session. Tell the user the way back if they are ever locked out: hPanel → Settings → Reset SSH configuration restores the default `sshd_config`, and the hPanel browser terminal works without SSH.

4. Unknown keys in `vps_ssh-keys_list-virtual-machine`: name them and ask. Remove only the ones the user identifies: `vps_ssh-keys_remove-virtual-machine` with `keys: ["<the full public key line>"]` (the OpenSSH key text, not a name or id), then confirm with `vps_ssh-keys_list-virtual-machine`. If the key is still listed, delete its line from `/root/.ssh/authorized_keys` over SSH. List again after the next reboot — a removed key can come back from cloud-init.

## 6. Malware scanning

`vps_monarx_install` installs the free Monarx agent, which detects malware in files but does not remove it; automatic removal needs a paid licence bought in hPanel. Installing can take up to 60 minutes and the VPS accepts no other actions meanwhile — poll the action at long intervals, or tell the user it is installing and check later. Results and the list of infected files are in hPanel → Security → Malware Scanner; `vps_monarx_scan-metrics` gives only the counts. Propose cleaning only after the user has seen the file list.

## 7. Backups and a checkpoint

- Weekly backups are free on every KVM plan; daily backups are a paid add-on. Turning them on or off, or switching to daily, is hPanel → Snapshots & Backups → Manage schedule (or Overview → Edit backup schedule) — not available through the API. Backups are stored in a different data center, do not count against the disk, cannot be downloaded, and the two latest of each type are kept.
- After the hardening is verified, offer `vps_snapshots_create` as a checkpoint. It replaces any existing snapshot and lasts one day — ask first.

## Not available through the API

- The backup schedule (weekly, daily, off) — hPanel.
- The Monarx infected-file list and removal licence — hPanel.
- Reset SSH configuration and Reset firewall configuration (the firewall inside the server: iptables, ufw) — hPanel → Settings → Main settings.
- Anything inside the OS (sshd, services, the guest firewall) — SSH or the hPanel browser terminal.
