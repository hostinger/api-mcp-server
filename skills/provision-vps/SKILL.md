---
name: provision-vps
description: "Set up a Hostinger VPS (KVM plans) or reinstall an existing one: picks the plan and billing term from the catalog, the location and the Linux template, buys only after the user explicitly agrees to the plan, price, renewal price and location, sets up a server waiting for setup, polls until it is running, adds the user's SSH key, applies a firewall and hands over a reachable root@ip. Triggers: create a new VPS, buy a server on Hostinger, which VPS plan should I get, set up a VPS with Ubuntu and Docker, my VPS says waiting for setup, reinstall my VPS, change the OS of my server, start over on a clean server."
---

# Provision a VPS

From a need ("a small server for n8n in Europe") to a running server the agent can SSH into. Putting an app on it afterwards is `deploy-to-vps`; a server that is up but misbehaving is `troubleshoot-vps`.

## Calling the operations

- Read the `inputSchema` that `search` returns before the first call of each operation. If a name below is rejected as unknown, `search` for what the step does (e.g. "list vps templates").
- Batch reads with `multi-execute`; values pass between steps as `$steps.<i>.<path>`. A batch stops at its first failure. The Hostinger Connector runs `vps` and `billing` as separate servers, so a batch chains operations from one of them only.
- Purchase and reinstall need the user's explicit "yes" in the conversation, after you have shown what is described in step 2 or step 5. Never infer consent from the request itself.
- Setup, reinstall and restart return an action (firewall sync answers `Request accepted` instead; check it with `vps_firewall_get`): poll `vps_actions_get` with its `id`, waiting longer between checks, until `state` is `success` or `error`, and `vps_virtual-machines_get` until `state` is `running` and `actions_lock` is `unlocked`. Setup usually finishes within minutes (control-panel templates take longer); a reinstall takes about 5–20 minutes. An action still `sent` after 12 hours is stuck — the user contacts Hostinger support.
- Root `password`: Hostinger rejects passwords found in public leak databases. 12–50 characters, no spaces, at least one upper-case letter, one lower-case letter, one digit and one of `-().&@?'#,/;+`, using only latin letters, digits and those symbols. `panel_password` (control-panel templates only) allows only the symbols `#%+:?@`. Generate strong ones, give them to the user once, and never store them in the project.

## 1. Reuse before buying

`vps_virtual-machines_list`. A server in state `initial` is bought and waiting for setup (hPanel shows "Waiting for setup"): go to step 4 with it. A server the user wants wiped: step 5. Only when neither applies, buy.

## 2. Choose plan, location and template

- **Plan and price**: `billing_catalog_list` with `category: "VPS"`. Each item has `name` (KVM 1, KVM 2, KVM 4, KVM 8; the list also holds Game Panel 1–8, which are for game servers — offer them only when the user asks for one), `metadata` (`cpus`, `memory` and `disk_space` in MB, `bandwidth`) and `prices`: one entry per term with its own `id` — the `item_id` to buy — and `first_period_price` and `price` (the renewal price), both in cents. Prices differ by country and change with promotions; promotional prices apply to the first period only.
- **Location**: `vps_data-centers_list` for `id`, `city`, `location` (country code) and `continent`. The location is fixed after setup: moving later is a reinstall in the new location that erases all data, backups and snapshots and changes the IP, and Hostinger does not promise it. Pick the location closest to the users; when the city they name is not listed, say which one you chose and why.
- **Template**: `vps_templates_list`. Linux only; Windows is not offered. A plain OS when the agent will install things itself; an app template when the user named that app. The "with Docker" templates (Ubuntu 24.04 and 26.04) come with Docker installed. Whether a server gets the Docker Manager (`deploy-to-vps` 5a) does not follow the template name; check with `vps_docker_list` after setup. Control-panel templates (cPanel, Plesk, DirectAdmin and others) need a separately bought licence, which is non-refundable.
- **Post-install script** (optional): `vps_post-install-scripts_list` to reuse one, or `vps_post-install-scripts_create` with `name` and `content` (max 48 KB; run once as root after install, output in `/post_install.log`). Keep secrets out of it; it is stored on the account.

Before buying, show the user: plan, term, first-period price and renewal price, location (fixed after setup), template, and that new purchases have a 30-day money-back guarantee (not for crypto payments; refunding cancels the server and its data). Wait for their "yes".

## 3. Purchase

`billing_payment-methods_list` first. An empty list means the account has no saved payment method and the purchase cannot go through the API: stop, and send the user to hPanel → VPS → Get VPS to buy there, then continue at step 1 with the new server. Otherwise `vps_virtual-machines_purchase` with `item_id` (the price `id` from step 2), optional `payment_method_id` and the `setup` fields from step 4. The default payment method is used when none is given.

A `202 Accepted` means the payment is still being processed and the server was not set up: read the response's `status`, tell the user, and poll `vps_virtual-machines_list` for a new server in state `initial` before step 4. If setup fails for any reason, the user finishes it in hPanel; say which server and why. A just-bought server can take a moment to appear in the list.

## 4. Set up a server in `initial` state

`vps_virtual-machines_setup` with `template_id`, `data_center_id`, optional `post_install_script_id`, `hostname`, root `password`, `public_key: { name, key }` with the user's SSH public key, `enable_backups: true` (free weekly backups on every KVM plan; the first backup appears after a full 7-day cycle; daily backups are a paid add-on in hPanel), and `install_monarx: true` only when the user wants the malware scanner — its free agent detects but does not remove malware, and installing can take up to 60 minutes, during which the VPS accepts no other actions. Then poll until `running`.

## 5. Reinstall an existing server

Only on the user's explicit request. Show first: the server, its current `template.name`, and what a reinstall does —

- all data on the disk is erased, and the snapshot is deleted;
- existing backups are kept, and a backup taken on the previous OS restores that OS;
- the IP address may change;
- SSH keys, hostname, reverse DNS, firewall group and Monarx after a reinstall are not documented — check each in step 6 and set them again where needed.

Offer `vps_backups_list` so the user knows the last backup, and copy anything they want to keep off the server first (backups cannot be downloaded). After their "yes": `vps_virtual-machines_recreate` with `template_id`, optional `password`, `panel_password` and `post_install_script_id`, and poll.

## 6. First login and hand-over

1. `vps_virtual-machines_get`: `ipv4[0].address`, `hostname`, `state: running`.
2. `vps_ssh-keys_list-virtual-machine`; add the user's key with `vps_ssh-keys_add-virtual-machine` if it is missing.
3. `ssh -o StrictHostKeyChecking=accept-new root@IP 'tail -n 20 /post_install.log 2>/dev/null; uname -a'`.
4. A Hostinger firewall group before anything is exposed: `vps_firewall_create`, accept rules for SSH, HTTP and HTTPS with `vps_firewall_create-rule`, then `vps_firewall_activate` for this server and, once it succeeds, `vps_firewall_sync-to-all-assigned-v-ms` (a new group reads `is_synced: false` until synced). `secure-vps` goes further.
5. Reverse DNS when the server will send mail: `vps_ptr_create` with `ipAddressId` from `ipv4[0].id` and `domain`.

Hand over: `root@IP`, hostname, template, location, plan and renewal date, what the post-install script did, and the next step (`deploy-to-vps`). Write `.hostinger/vps.json` in the project when there is one: `{ "virtual_machine_id", "ipv4", "hostname" }`.

## Not available through the API

- Upgrading the plan — hPanel Upgrade: whole plan only, up to 10 minutes, files, IP and location stay; KVM 8 cannot be upgraded and no downgrade exists.
- Changing location — hPanel Overview → VPS details → Server location → edit (erases data, backups and snapshots).
- Moving a VPS to another Hostinger account — not supported.
- Turning daily backups on, buying control-panel or Monarx removal licences, refunds — hPanel Billing.
- Adding a payment method that is not already on the account.
