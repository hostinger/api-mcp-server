---
name: deploy-to-vps
description: "Deploy an existing project to a Hostinger VPS (KVM plans): sets up SSH key access, applies a Hostinger firewall group, runs Docker Compose projects through the Docker Manager where the server has it, or over SSH on any server, points a domain at the server, takes a snapshot before risky changes and verifies the result from outside. Triggers: deploy this to my VPS, run this docker-compose on my Hostinger server, put my app on the server, set up nginx and SSL on my VPS, point my domain to my VPS, redeploy on the VPS, add my SSH key to the VPS."
---

# Deploy to VPS

Ship a project that already exists — on disk or in a Git repository — to a Hostinger VPS in state `running`. Buying, setting up or reinstalling a server is the `provision-vps` skill; a server that is down or misbehaving is `troubleshoot-vps`.

The public API cannot run a command on the server. Packages, services, web servers, certificates and files are handled over SSH or in the hPanel browser terminal, so step 2 comes first whenever a shell is needed.

## Calling the operations

- Read the `inputSchema` that `search` returns before the first call of each operation. If a name below is rejected as unknown, `search` for what the step does (e.g. "add ssh key to virtual machine").
- Only the public operations that `search` returns can be called. Hostinger Agent tools in hPanel (running commands, resetting SSH or the guest firewall, disk cleanup) are not available here; when a step needs them, send the user to hPanel.
- Batch reads with `multi-execute`; values pass between steps as `$steps.<i>.<path>`. A batch stops at its first failure. The Hostinger Connector runs `vps` and `dns` as separate servers, so a batch chains operations from one of them only.
- `Too Many Attempts` is the API rate limit: wait about a minute, then retry that call once, and send no other calls meanwhile. `[VPS:9999] Request failed` (HTTP 500) is usually temporary: retry a read once later. Never resend a change that failed with 500 straight away: it may have gone through, so check the outcome with the matching read or `vps_actions_list` first, and tell the user what you found.
- A VPS runs one action at a time. Most operations that change it return an action (firewall sync and delete answer `Request accepted` instead; check those with the matching read operation): poll `vps_actions_get` with its `id`, waiting longer between checks, until `state` is `success` or `error` (`created`, `sent`, `delayed`, `started` are still running). Do not send another change while `vps_virtual-machines_get` shows `actions_lock: locked`. An action in `error` keeps the VPS locked and needs Hostinger support.
- Confirm with the user before: `vps_snapshots_create` (it replaces the existing snapshot), `vps_docker_create` on a project name that already exists (it replaces the project), `vps_docker_stop`, `vps_docker_delete` (removes containers, networks, volumes and images), and `dns_records_update` with `overwrite: true`. Reinstalling is never part of a deploy — hand over to `provision-vps`.
- SSH keys: use `vps_ssh-keys_*`; the account-level `vps_public-keys_*` operations are deprecated. Firewall sync: use `vps_firewall_sync-to-all-assigned-v-ms`; the single-VM `vps_firewall_sync` is deprecated.

## 1. Pick the target server

- `.hostinger/vps.json` in the project: reuse its `virtual_machine_id`, `ipv4` and `domain` — without asking only when you or the user wrote it in an earlier deploy. If it came with a clone or download, name the server and confirm with the user first.
- Otherwise `vps_virtual-machines_list` and let the user choose by `hostname` or IP. Keep `id`, `ipv4[0].address`, `ipv4[0].id` (for reverse DNS), `template.name`, `firewall_group_id` and `state`.
- `state` other than `running`: hand over to `troubleshoot-vps`. `initial` means bought but not set up yet — `provision-vps`.

## 2. Get SSH access

Fresh templates log in as `root` with the root password set at setup; keys are optional. Skip this step when `ssh -o BatchMode=yes root@IP true` already succeeds.

1. Find or create a local key: `~/.ssh/id_ed25519.pub`, else `ssh-keygen -t ed25519 -N "" -f ~/.ssh/id_ed25519 -C hostinger-agent`.
2. `vps_ssh-keys_add-virtual-machine` with `keys: ["<contents of the .pub file>"]`. The key is written to `root`'s `authorized_keys` by the guest agent; check it with `vps_ssh-keys_list-virtual-machine`.
3. `ssh -o StrictHostKeyChecking=accept-new root@IP 'uname -a'`. If it is refused straight after adding the key, wait a minute and try again before changing anything else.

Still refused: port 22 closed from outside (`nc -zv -w 5 IP 22`) points at the firewall (step 3) or the guest OS; anything beyond that is `troubleshoot-vps`. Never store the private key in the project, and never print it.

## 3. Firewall

A Hostinger firewall group drops all inbound traffic that no accept rule matches, for IPv4 and IPv6, and needs at least one rule. Each VPS has at most one active group; a group can be shared by several servers. Rule changes reach new connections within about two minutes after a sync; open connections are kept.

1. `vps_firewall_list`; reuse a group whose rules match, else `vps_firewall_create` with a name like `web-<hostname>`.
2. `vps_firewall_create-rule` per port: `protocol: "SSH"` with `port: "22"`, `"HTTP"`/`"80"`, `"HTTPS"`/`"443"`, `source: "any"`, `source_detail: "any"`, plus the app's own ports only if they must be reached directly (prefer a reverse proxy on 80/443). Add the SSH rule before activating, or step 2 stops working.
3. `vps_firewall_activate` with the group and the server, then `vps_firewall_sync-to-all-assigned-v-ms` once it succeeds: a new group reads `is_synced: false` until synced, even though activation already applied its rules. Sync again after any later rule change. The sync answers `Request accepted`; `vps_firewall_get` shows `is_synced: true` when it is done.
4. Verify from outside: `nc -zv -w 5 IP 22` (on macOS add `-G 5`), and `curl -s -o /dev/null -w "%{http_code}\n" http://IP/` for port 80. Do not judge 80 or 443 by `nc`: some networks (VPNs, proxies) accept those ports for any address.

The guest OS firewall (ufw, iptables) applies as well; a Hostinger drop wins over a guest accept. Change a shared group only after saying which other servers use it.

## 4. Snapshot before changes

On a server that already serves something, offer a checkpoint. A VPS keeps one snapshot, a new one replaces it, and it expires after one day — it is a short undo for this deploy, not a backup. `vps_snapshots_get` answers 404 when there is none; when one exists, show its `created_at` and ask before replacing it. Creating it can take up to an hour; the VPS keeps running but is locked for other actions meanwhile.

## 5. Choose the deploy

| Project | Path |
| --- | --- |
| Compose file, server where `vps_docker_list` answers | **Docker Manager** (5a), or SSH (5b) |
| Compose file, server where `vps_docker_list` returns `[VPS:2044]` | **SSH** (5b) with Docker installed |
| Anything else (Node.js, Python, PHP, static) | **SSH** (5b) |

### 5a. Docker Manager

Docker Manager is available on some servers and not others, and availability does not follow the template name. Call `vps_docker_list` first: `[VPS:2044]` means this server has no Docker Manager, so use 5b.

1. `vps_docker_list` for existing projects. A `project_name` that already exists is replaced — confirm first.
2. `vps_docker_create` with `project_name` (letters, digits, dashes, underscores), `content` and optional `environment` (`.env` lines). `content` is the compose YAML itself, or a direct URL to the compose file; for GitHub pass the raw file URL with the branch named in it rather than the repository URL.
3. Use pre-built images. Do not rely on `build:` — whether the Docker Manager builds from source is unresolved, so build and push the image to a registry first. Private registries need credentials added by the user in hPanel's Docker Manager.
4. Bind app ports that sit behind a reverse proxy to `127.0.0.1`, and add firewall rules (step 3) for any port that must be public.
5. `vps_docker_containers` for each container's `status`, `health` and `ports`; `vps_docker_logs` (last 300 lines) on failure. Later: `vps_docker_update` pulls images and recreates containers, keeping volumes; `vps_docker_restart` and `vps_docker_start` keep everything.
6. To deploy on every push to GitHub: the `hostinger/deploy-on-vps@v2` GitHub Action, which deploys the compose project through the Docker Manager, so only on servers where `vps_docker_list` answers. The user sets it up in the repository with `api-key` (a Hostinger API key, kept as a repository secret) and `virtual-machine` (the VM id), plus optional `project-name`, `docker-compose-path` and `environment-variables`.

### 5b. Over SSH

This is ordinary Linux administration on the user's own server; say what will be installed before installing it.

1. Code to `/opt/<app>` (`git clone` on the server, or `rsync -az --exclude node_modules --exclude .git ./ root@IP:/opt/<app>/`). Secrets go in a file with mode 600, never in the repository.
2. Compose projects: install Docker if the template lacks it, then `docker compose up -d` in the project directory.
3. Other apps: a systemd service with `Restart=always`, behind a reverse proxy (nginx) on 80/443, and a Let's Encrypt certificate (`certbot --nginx -d <domain>`) once the domain resolves to the server (step 6) and port 80 is open.

## 6. Point a domain at the server

- Domain on Hostinger DNS: `dns_records_list` first. Then `dns_records_validate` and `dns_records_update` with the same body: `zone: [{ name: "@" or "sub", type: "A", ttl: 300, records: [{ content: "<ipv4>" }] }]`, with `overwrite` set explicitly — it defaults to `true`, which replaces records of the same name and type. Use `overwrite: true` only to replace an existing A record, after naming it to the user.
- Domain elsewhere: give the user the A record to create.
- Reverse DNS when the server sends mail: `vps_ptr_create` with `ipAddressId` from `ipv4[0].id` and `domain`. `vps_virtual-machines_set-hostname` does not change the PTR.
- `dig +short A <domain>` must return the IP before requesting a certificate.

## 7. Verify and record

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://DOMAIN/
curl -s https://DOMAIN/ | grep -o "TEXT THE PROJECT RENDERS"
```

Containers `running` and healthy (5a) or the service active (5b), plus the real page over HTTPS from outside. Write `.hostinger/vps.json` in the project: `{ "virtual_machine_id", "ipv4", "domain", "deploy": "docker-manager" | "ssh", "project_name" or "service" }`, keeping fields already there.

## Not available through the API

- Running a command or reading a file on the server — SSH or the hPanel browser terminal (`vps_docker_logs` is the exception, for Docker Manager projects).
- Docker registry credentials — hPanel's Docker Manager.
- Downloading a backup or snapshot — copy data off the live server with `rsync` or SFTP.
- Changing the data center — a reinstall in the new location from hPanel (Overview → VPS details → Server location → edit) that erases data, backups and snapshots and changes the IP.
- Changing plan size — a whole-plan upgrade in hPanel.
