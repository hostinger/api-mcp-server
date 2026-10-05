# Changelog

Generated at release time from the diff between the previous and current
build. Tool changes are listed individually; everything else is summarised
by area.

## v2.7.1 — 2026-10-05

### Operations

- Added `hosting_git_deploy-website-repository` — Deploy website Git repository
- Added `hosting_git_list-website-repositories` — List website Git repositories
- Added `hosting_git_ssh-public-key` — Get Git SSH public key
- Added `hosting_git_generate-ssh-key` — Generate Git SSH key

### Also in this release

- Documentation: `README.md`
- Dependencies: `package-lock.json`
- Request handling and authentication: `src/core/runtime.js`, `src/core/runtime.ts`
- Build and packaging: `types.d.ts`

## v2.7.0 — 2026-10-01

### Also in this release

- Dependencies: `package-lock.json`
- Request handling and authentication: `src/core/runtime.js`, `src/core/runtime.ts`

## v2.6.0 — 2026-09-30

### Operations

- Changed the input schema of `billing_catalog_list`

### Also in this release

- Request handling and authentication: `src/core/runtime.js`, `src/core/runtime.ts`

## v2.5.1 — 2026-09-30

### Also in this release

- Bundled agent skills: 5 files
- Server instructions: `src/core/instructions.js`, `src/core/instructions.ts`
- Other files: `src/core/skills.js`, `src/core/skills.ts`

## v2.5.0 — 2026-09-30

### Also in this release

- Dependencies: `package-lock.json`
- Other files: `src/core/skills.js`, `src/core/skills.ts`
- Bundled agent skills: 6 files

## v2.4.0 — 2026-09-29

### Operations

- Added `domains_transfer_start` — Start domain transfer

### Also in this release

- Documentation: `README.md`
- Dependencies: `package-lock.json`
- Request handling and authentication: `src/core/runtime.js`, `src/core/runtime.ts`
- Build and packaging: `types.d.ts`

## v2.3.0 — 2026-09-28

### Operations

- Added `hosting_websites_list-setups` — List website setups
- Changed the description of `hosting_databases_create-remote-connection`
- Changed the description of `hosting_files_generate-upload-url`
- Changed the description of `hosting_websites_list`
- Changed the description of `hosting_websites_create`

### Also in this release

- Documentation: `README.md`
- Request handling and authentication: `src/core/runtime.js`, `src/core/runtime.ts`
- Build and packaging: `types.d.ts`

## v2.2.0 — 2026-09-28

### Also in this release

- Dependencies: `package-lock.json`, `package.json`
- Request handling and authentication: `src/core/runtime.js`, `src/core/runtime.ts`
- Server entry points: `src/servers/all.js`, `src/servers/all.ts`
- Other files: `src/core/skills.js`, `src/core/skills.ts`

## v2.1.0 — 2026-09-28

### Operations

- Added `agency-hosting_deploy-node-static-website` — Deploy node-static website
- Added `agency-hosting_deploy-php-application` — Deploy PHP application
- Added `hosting_import-wordpress-website` — Import WordPress website
- Added `hosting_deploy-wordpress-plugin` — Deploy WordPress plugin
- Added `hosting_deploy-wordpress-theme` — Deploy WordPress theme
- Added `hosting_deploy-js-application` — Deploy JavaScript application
- Added `hosting_deploy-static-website` — Deploy static website
- Added `hosting_list-js-deployments` — List JavaScript deployments
- Added `hosting_show-js-deployment-logs` — Show JavaScript deployment logs
- Removed `agency-hosting_deployNodeStaticWebsite`
- Removed `agency-hosting_deployPhpApplication`
- Removed `hosting_importWordpressWebsite`
- Removed `hosting_deployWordpressPlugin`
- Removed `hosting_deployWordpressTheme`
- Removed `hosting_deployJsApplication`
- Removed `hosting_deployStaticWebsite`
- Removed `hosting_listJsDeployments`
- Removed `hosting_showJsDeploymentLogs`
- Renamed `agency-hosting_listAvailableDatacentersV1` → `agency-hosting_datacenters_list`
- Renamed `agency-hosting_changeWebsiteDomainV1` → `agency-hosting_domains_change-website`
- Renamed `agency-hosting_linkDomainToWebsiteV1` → `agency-hosting_domains_link-to-website`
- Renamed `agency-hosting_listDomainsV1` → `agency-hosting_domains_list`
- Renamed `agency-hosting_unlinkDomainFromWebsiteV1` → `agency-hosting_domains_unlink-from-website`
- Renamed `agency-hosting_generateUploadURLV1` → `agency-hosting_files_generate-upload-url`
- Renamed `agency-hosting_importWebsiteFromArchiveV1` → `agency-hosting_files_import-website-from-archive`
- Renamed `agency-hosting_listAgencyPlanOrderDiskUsageMetricsV1` → `agency-hosting_metrics_list-plan-order-disk-usage`
- Renamed `agency-hosting_listOrdersV1` → `agency-hosting_orders_list`
- Renamed `agency-hosting_listOrderResourceUsageMetricsV1` → `agency-hosting_metrics_list-order-resource-usage`
- Renamed `agency-hosting_listPHPExtensionsForAWebsiteV1` → `agency-hosting_php_list-extensions-for-website`
- Renamed `agency-hosting_replaceWebsitePHPExtensionsV1` → `agency-hosting_php_replace-website-extensions`
- Renamed `agency-hosting_listPHPOptionsForAWebsiteV1` → `agency-hosting_php_list-options-for-website`
- Renamed `agency-hosting_replaceWebsitePHPOptionsV1` → `agency-hosting_php_replace-website-options`
- Renamed `agency-hosting_listAvailablePHPVersionsForAnOrderV1` → `agency-hosting_php_list-versions-for-order`
- Renamed `agency-hosting_listAvailablePHPVersionsForAWebsiteV1` → `agency-hosting_php_list-versions-for-website`
- Renamed `agency-hosting_updateWebsitePHPVersionV1` → `agency-hosting_php_update-website-version`
- Renamed `agency-hosting_createANewWebsiteV1` → `agency-hosting_website-setups_create`
- Renamed `agency-hosting_getWebsiteSetupStatusV1` → `agency-hosting_website-setups_status`
- Renamed `agency-hosting_reinstallWebsiteSSLV1` → `agency-hosting_ssl_reinstall-website`
- Renamed `agency-hosting_installWebsiteSSLV1` → `agency-hosting_ssl_install-website`
- Renamed `agency-hosting_getWebsiteSSLStatusV1` → `agency-hosting_ssl_website-status`
- Renamed `agency-hosting_uninstallWebsiteSSLV1` → `agency-hosting_ssl_uninstall-website`
- Renamed `agency-hosting_buildWebsiteNodeJSAssetsV1` → `agency-hosting_websites_build-nodejs-assets`
- Renamed `agency-hosting_clearWebsiteCacheV1` → `agency-hosting_cache_clear-website`
- Renamed `agency-hosting_listWebsiteCronJobsV1` → `agency-hosting_cron-jobs_list-website`
- Renamed `agency-hosting_createWebsiteCronJobV1` → `agency-hosting_cron-jobs_create-website`
- Renamed `agency-hosting_deleteWebsiteCronJobV1` → `agency-hosting_cron-jobs_delete-website`
- Renamed `agency-hosting_listWebsiteDatabasesV1` → `agency-hosting_databases_list-website`
- Renamed `agency-hosting_createWebsiteDatabaseV1` → `agency-hosting_databases_create-website`
- Renamed `agency-hosting_deleteWebsiteDatabaseV1` → `agency-hosting_databases_delete-website`
- Renamed `agency-hosting_createWebsiteDatabaseUserV1` → `agency-hosting_databases_create-website-user`
- Renamed `agency-hosting_deleteWebsiteDatabaseUserV1` → `agency-hosting_databases_delete-website-user`
- Renamed `agency-hosting_getWebsiteDetailsV1` → `agency-hosting_websites_get`
- Renamed `agency-hosting_deleteWebsiteV1` → `agency-hosting_websites_delete`
- Renamed `agency-hosting_listAgencyPlanWebsitesV1` → `agency-hosting_websites_list-plan`
- Renamed `agency-hosting_listWebsiteProcessesV1` → `agency-hosting_websites_list-processes`
- Renamed `agency-hosting_changeWordPressVersionV1` → `agency-hosting_wordpress_change-version`
- Renamed `agency-hosting_getWordPressSettingsV1` → `agency-hosting_wordpress_settings`
- Renamed `agency-hosting_listAvailableWordPressVersionsV1` → `agency-hosting_wordpress_list-versions`
- Renamed `billing_getCatalogItemListV1` → `billing_catalog_list`
- Renamed `billing_createPurchaseOrderV1` → `billing_orders_create-purchase`
- Renamed `billing_setDefaultPaymentMethodV1` → `billing_payment-methods_set-default`
- Renamed `billing_deletePaymentMethodV1` → `billing_payment-methods_delete`
- Renamed `billing_getPaymentMethodListV1` → `billing_payment-methods_list`
- Renamed `billing_getSubscriptionListV1` → `billing_subscriptions_list`
- Renamed `billing_disableAutoRenewalV1` → `billing_subscriptions_disable-auto-renewal`
- Renamed `billing_enableAutoRenewalV1` → `billing_subscriptions_enable-auto-renewal`
- Renamed `billing_renewSubscriptionV1` → `billing_subscriptions_renew`
- Renamed `DNS_getDNSSnapshotV1` → `dns_snapshots_get`
- Renamed `DNS_getDNSSnapshotListV1` → `dns_snapshots_list`
- Renamed `DNS_restoreDNSSnapshotV1` → `dns_snapshots_restore`
- Renamed `DNS_getDNSRecordsV1` → `dns_records_list`
- Renamed `DNS_updateDNSRecordsV1` → `dns_records_update`
- Renamed `DNS_deleteDNSRecordsV1` → `dns_records_delete`
- Renamed `DNS_resetDNSRecordsV1` → `dns_records_reset`
- Renamed `DNS_validateDNSRecordsV1` → `dns_records_validate`
- Renamed `v2_getDomainVerificationsDIRECT` → `domains_verifications_direct`
- Renamed `domains_suggestDomainNamesFromADescriptionV1` → `domains_availability_suggest-names-from-description`
- Renamed `domains_suggestDomainNamesFromADomainV1` → `domains_availability_suggest-names-from`
- Renamed `domains_checkDomainAvailabilityV1` → `domains_availability_check`
- Renamed `domains_getDomainForwardingV1` → `domains_forwarding_get`
- Renamed `domains_updateDomainForwardingV1` → `domains_forwarding_update`
- Renamed `domains_deleteDomainForwardingV1` → `domains_forwarding_delete`
- Renamed `domains_createDomainForwardingV1` → `domains_forwarding_create`
- Renamed `domains_getPendingIRTPVerificationV1` → `domains_whois_pending-irtp-verification`
- Renamed `domains_cancelPendingIRTPVerificationV1` → `domains_whois_cancel-pending-irtp-verification`
- Renamed `domains_getIncomingDomainMoveV1` → `domains_move_incoming`
- Renamed `domains_acceptIncomingDomainMoveV1` → `domains_move_accept-incoming`
- Renamed `domains_rejectIncomingDomainMoveV1` → `domains_move_reject-incoming`
- Renamed `domains_getIncomingDomainMoveListV1` → `domains_move_incoming-list`
- Renamed `domains_getOutgoingDomainMoveV1` → `domains_move_outgoing`
- Renamed `domains_startOutgoingDomainMoveV1` → `domains_move_start-outgoing`
- Renamed `domains_cancelOutgoingDomainMoveV1` → `domains_move_cancel-outgoing`
- Renamed `domains_getOutgoingDomainMoveListV1` → `domains_move_outgoing-list`
- Renamed `domains_getDomainAuthorizationCodeV1` → `domains_portfolio_authorization-code`
- Renamed `domains_claimFreeDomainV1` → `domains_portfolio_claim-free`
- Renamed `domains_enableDomainLockV1` → `domains_portfolio_enable-lock`
- Renamed `domains_disableDomainLockV1` → `domains_portfolio_disable-lock`
- Renamed `domains_getDomainDetailsV1` → `domains_portfolio_get`
- Renamed `domains_getDomainListV1` → `domains_portfolio_list`
- Renamed `domains_purchaseNewDomainV1` → `domains_portfolio_purchase`
- Renamed `domains_enablePrivacyProtectionV1` → `domains_portfolio_enable-privacy-protection`
- Renamed `domains_disablePrivacyProtectionV1` → `domains_portfolio_disable-privacy-protection`
- Renamed `domains_getDomainRenewalInformationV1` → `domains_portfolio_renewal-information`
- Renamed `domains_completeDomainSetupV1` → `domains_portfolio_complete-setup`
- Renamed `domains_updateDomainNameserversV1` → `domains_portfolio_update-nameservers`
- Renamed `domains_claimFreeDomainTransferV1` → `domains_transfer_claim-free`
- Renamed `domains_getTransferV1` → `domains_transfer_get`
- Renamed `domains_getTransferListV1` → `domains_transfer_list`
- Renamed `domains_changeWHOISProfileForDomainV1` → `domains_whois_change-for`
- Renamed `domains_setWHOISProfileAsDefaultV1` → `domains_whois_set-as-default`
- Renamed `domains_unsetDefaultWHOISProfileV1` → `domains_whois_unset-default`
- Renamed `domains_getWHOISProfileV1` → `domains_whois_get`
- Renamed `domains_deleteWHOISProfileV1` → `domains_whois_delete`
- Renamed `domains_getWHOISProfileListV1` → `domains_whois_list`
- Renamed `domains_createWHOISProfileV1` → `domains_whois_create`
- Renamed `domains_getWHOISProfileUsageV1` → `domains_whois_usage`
- Renamed `ecommerce_listDiscountsV1` → `ecommerce_discounts_list`
- Renamed `ecommerce_createADiscountV1` → `ecommerce_discounts_create`
- Renamed `ecommerce_getCustomStorefrontSetupInstructionsV1` → `ecommerce_miscellaneous_custom-storefront-setup-instructions`
- Renamed `ecommerce_cancelAnOrderV1` → `ecommerce_orders_cancel`
- Renamed `ecommerce_fulfilAnOrderV1` → `ecommerce_orders_fulfil`
- Renamed `ecommerce_listStoreOrdersV1` → `ecommerce_orders_list-store`
- Renamed `ecommerce_retrieveAnOrderV1` → `ecommerce_orders_retrieve`
- Renamed `ecommerce_enableManualPaymentMethodV1` → `ecommerce_payments_enable-manual-method`
- Renamed `ecommerce_createAPaymentProviderConnectLinkV1` → `ecommerce_payments_create-provider-connect-link`
- Renamed `ecommerce_listStorePaymentProvidersV1` → `ecommerce_payments_list-store-providers`
- Renamed `ecommerce_createAProductImageUploadURLV1` → `ecommerce_products_create-image-upload-url`
- Renamed `ecommerce_deleteAProductV1` → `ecommerce_products_delete`
- Renamed `ecommerce_updateAProductV1` → `ecommerce_products_update`
- Renamed `ecommerce_createDigitalProductV1` → `ecommerce_products_create-digital`
- Renamed `ecommerce_listProductsV1` → `ecommerce_products_list`
- Renamed `ecommerce_createPhysicalProductV1` → `ecommerce_products_create-physical`
- Renamed `ecommerce_uploadAndAttachAProductImageV1` → `ecommerce_products_upload-and-attach-image`
- Renamed `ecommerce_listSalesChannelsV1` → `ecommerce_sales-channels_list`
- Renamed `ecommerce_createASalesChannelV1` → `ecommerce_sales-channels_create`
- Renamed `ecommerce_updateSalesChannelV1` → `ecommerce_sales-channels_update`
- Renamed `ecommerce_setStoreShippingV1` → `ecommerce_shipping_set-store`
- Renamed `ecommerce_deleteStoreV1` → `ecommerce_stores_delete`
- Renamed `ecommerce_getStoresV1` → `ecommerce_stores_list`
- Renamed `ecommerce_createStoreV1` → `ecommerce_stores_create`
- Renamed `ecommerce_getStoreMetadataV1` → `ecommerce_stores_metadata`
- Renamed `ecommerce_updateProductVariantsInBatchV1` → `ecommerce_product-variants_update-in-batch`
- Renamed `ecommerce_deleteAProductVariantV1` → `ecommerce_product-variants_delete`
- Renamed `ecommerce_listProductVariantsV1` → `ecommerce_product-variants_list`
- Renamed `ecommerce_createAProductVariantV1` → `ecommerce_product-variants_create`
- Renamed `horizons_cloneWebsiteV1` → `horizons_websites_clone`
- Renamed `horizons_getWebsiteListV1` → `horizons_websites_list`
- Renamed `horizons_createWebsiteV1` → `horizons_websites_create`
- Renamed `horizons_editWebsiteV1` → `horizons_websites_edit`
- Renamed `horizons_publishWebsiteV1` → `horizons_websites_publish`
- Renamed `horizons_getWebsiteV1` → `horizons_websites_get`
- Renamed `hosting_clearWebsiteCacheV1` → `hosting_cache_clear-website`
- Renamed `hosting_toggleCachelessModeV1` → `hosting_cache_toggle-cacheless`
- Renamed `hosting_toggleWebsiteCacheV1` → `hosting_cache_toggle-website`
- Renamed `hosting_listAccountCronJobsV1` → `hosting_cron-jobs_list`
- Renamed `hosting_createAccountCronJobV1` → `hosting_cron-jobs_create`
- Renamed `hosting_deleteAccountCronJobV1` → `hosting_cron-jobs_delete`
- Renamed `hosting_getCronJobOutputV1` → `hosting_cron-jobs_output`
- Renamed `hosting_changeDatabasePasswordV1` → `hosting_databases_change-password`
- Renamed `hosting_listAccountDatabasesV1` → `hosting_databases_list`
- Renamed `hosting_createAccountDatabaseV1` → `hosting_databases_create`
- Renamed `hosting_deleteAccountDatabaseV1` → `hosting_databases_delete`
- Renamed `hosting_createDatabaseRemoteConnectionV1` → `hosting_databases_create-remote-connection`
- Renamed `hosting_deleteDatabaseRemoteConnectionV1` → `hosting_databases_delete-remote-connection`
- Renamed `hosting_listDatabaseRemoteConnectionsV1` → `hosting_databases_list-remote-connections`
- Renamed `hosting_repairDatabaseV1` → `hosting_databases_repair`
- Renamed `hosting_setupWebsiteDatabaseV1` → `hosting_databases_setup-website`
- Renamed `hosting_getPhpMyAdminLinkV1` → `hosting_databases_phpmyadmin-link`
- Renamed `hosting_listAvailableDatacentersV1` → `hosting_datacenters_list`
- Renamed `hosting_generateAFreeSubdomainV1` → `hosting_domains_generate-free-subdomain`
- Renamed `hosting_listWebsiteParkedDomainsV1` → `hosting_domains_list-website-parked`
- Renamed `hosting_createWebsiteParkedDomainV1` → `hosting_domains_create-website-parked`
- Renamed `hosting_deleteWebsiteParkedDomainV1` → `hosting_domains_delete-website-parked`
- Renamed `hosting_listWebsiteSubdomainsV1` → `hosting_domains_list-website-subdomains`
- Renamed `hosting_createWebsiteSubdomainV1` → `hosting_domains_create-website-subdomain`
- Renamed `hosting_deleteWebsiteSubdomainV1` → `hosting_domains_delete-website-subdomain`
- Renamed `hosting_verifyDomainOwnershipV1` → `hosting_domains_verify-ownership`
- Renamed `hosting_generateUploadURLV1` → `hosting_files_generate-upload-url`
- Renamed `hosting_listWebsiteFilesAndDirectoriesV1` → `hosting_files_list-website-and-directories`
- Renamed `hosting_getWebsiteFileContentV1` → `hosting_files_website-content`
- Renamed `hosting_getGitAutoDeploymentSettingsV1` → `hosting_git_auto-deployment-settings`
- Renamed `hosting_updateGitAutoDeploymentSettingsV1` → `hosting_git_update-auto-deployment-settings`
- Renamed `hosting_deleteGitAutoDeploymentSettingsV1` → `hosting_git_delete-auto-deployment-settings`
- Renamed `hosting_listGitInstallationsV1` → `hosting_git_list-installations`
- Renamed `hosting_listGitInstallationRepositoriesV1` → `hosting_git_list-installation-repositories`
- Renamed `hosting_listNodeJSBuildsV1` → `hosting_nodejs_list-builds`
- Renamed `hosting_startNode_jsBuildV1` → `hosting_nodejs_start-build`
- Renamed `hosting_getNode_jsBuildSettingsV1` → `hosting_nodejs_build-settings`
- Renamed `hosting_updateNode_jsBuildSettingsV1` → `hosting_nodejs_update-build-settings`
- Renamed `hosting_getNode_jsBuildSettingsFromArchiveV1` → `hosting_nodejs_build-settings-from-archive`
- Renamed `hosting_listNode_jsEnvironmentVariablesV1` → `hosting_nodejs_list-environment-variables`
- Renamed `hosting_replaceNode_jsEnvironmentVariablesV1` → `hosting_nodejs_replace-environment-variables`
- Renamed `hosting_analyseFailedNode_jsBuildV1` → `hosting_nodejs_analyse-failed-build`
- Renamed `hosting_getNode_jsBuildDetailsV1` → `hosting_nodejs_build`
- Renamed `hosting_getNodeJSBuildLogsV1` → `hosting_nodejs_build-logs`
- Renamed `hosting_getNode_jsRuntimeLogsV1` → `hosting_nodejs_runtime-logs`
- Renamed `hosting_clearNode_jsRuntimeLogsV1` → `hosting_nodejs_clear-runtime-logs`
- Renamed `hosting_restartNode_jsApplicationV1` → `hosting_nodejs_restart-application`
- Renamed `hosting_listNode_jsVulnerabilitiesV1` → `hosting_nodejs_list-vulnerabilities`
- Renamed `hosting_patchNode_jsVulnerabilitiesV1` → `hosting_nodejs_patch-vulnerabilities`
- Renamed `hosting_listOrdersV1` → `hosting_orders_list`
- Renamed `hosting_resetPHPExtensionsV1` → `hosting_php_reset-extensions`
- Renamed `hosting_getPHPDetailsV1` → `hosting_php_get`
- Renamed `hosting_getPHPInfoV1` → `hosting_php_info`
- Renamed `hosting_updatePHPExtensionsV1` → `hosting_php_update-extensions`
- Renamed `hosting_updatePHPOptionsV1` → `hosting_php_update-options`
- Renamed `hosting_updatePHPVersionV1` → `hosting_php_update-version`
- Renamed `hosting_listWebsiteRedirectsV1` → `hosting_redirects_list-website`
- Renamed `hosting_createWebsiteRedirectV1` → `hosting_redirects_create-website`
- Renamed `hosting_deleteWebsiteRedirectV1` → `hosting_redirects_delete-website`
- Renamed `hosting_installSSLV1` → `hosting_ssl_install`
- Renamed `hosting_getSSLStatusV1` → `hosting_ssl_status`
- Renamed `hosting_toggleHTTPSRedirectV1` → `hosting_ssl_toggle-https-redirect`
- Renamed `hosting_uninstallSSLV1` → `hosting_ssl_uninstall`
- Renamed `hosting_listWebsitesV1` → `hosting_websites_list`
- Renamed `hosting_createWebsiteV1` → `hosting_websites_create`
- Renamed `hosting_deployStaticSiteArchiveV1` → `hosting_websites_deploy-static-site-archive`
- Renamed `hosting_deleteWebsiteV1` → `hosting_websites_delete`
- Renamed `mail_createAliasV1` → `mail_aliases_create-alias`
- Renamed `mail_deleteAliasV1` → `mail_aliases_delete-alias`
- Renamed `mail_listAliasesV1` → `mail_aliases_list`
- Renamed `mail_createAPITokenV1` → `mail_api-tokens_create`
- Renamed `mail_revokeAPITokenV1` → `mail_api-tokens_revoke`
- Renamed `mail_listAPITokensV1` → `mail_api-tokens_list`
- Renamed `mail_createAutoreplyV1` → `mail_autoreplies_create`
- Renamed `mail_updateAutoreplyV1` → `mail_autoreplies_update`
- Renamed `mail_deleteAutoreplyV1` → `mail_autoreplies_delete`
- Renamed `mail_listAutorepliesV1` → `mail_autoreplies_list`
- Renamed `mail_createCatchAllV1` → `mail_catchalls_create-catch-all`
- Renamed `mail_deleteCatchAllV1` → `mail_catchalls_delete-catch-all`
- Renamed `mail_listCatchAllsV1` → `mail_catchalls_list-catch-alls`
- Renamed `mail_resendCatchAllConfirmationV1` → `mail_catchalls_resend-catch-all-confirmation`
- Renamed `mail_createForwarderV1` → `mail_forwarders_create`
- Renamed `mail_deleteForwarderV1` → `mail_forwarders_delete`
- Renamed `mail_listForwardersV1` → `mail_forwarders_list`
- Renamed `mail_resendForwarderConfirmationV1` → `mail_forwarders_resend-confirmation`
- Renamed `mail_updateForwarderKeepCopySettingV1` → `mail_forwarders_update-keep-copy-setting`
- Renamed `mail_listAccessLogsV1` → `mail_logs_list-access`
- Renamed `mail_listActionLogsV1` → `mail_logs_list-action`
- Renamed `mail_listInboundLogsV1` → `mail_logs_list-inbound`
- Renamed `mail_listMailboxActionLogsV1` → `mail_logs_list-mailbox-action`
- Renamed `mail_listOutboundLogsV1` → `mail_logs_list-outbound`
- Renamed `mail_listMailboxesV1` → `mail_mailboxes_list`
- Renamed `mail_createMailboxV1` → `mail_mailboxes_create-mailbox`
- Renamed `mail_deleteMailboxV1` → `mail_mailboxes_delete-mailbox`
- Renamed `mail_changeMailboxPasswordV1` → `mail_mailboxes_change-mailbox-password`
- Renamed `mail_listOrdersV1` → `mail_orders_list`
- Renamed `mail_getOrderPlanV1` → `mail_orders_plan`
- Renamed `mail_createWebhookV1` → `mail_webhooks_create`
- Renamed `mail_listWebhookDeliveryLogsV1` → `mail_webhooks_list-delivery-logs`
- Renamed `mail_getWebhookV1` → `mail_webhooks_get`
- Renamed `mail_deleteWebhookV1` → `mail_webhooks_delete`
- Renamed `mail_updateWebhookV1` → `mail_webhooks_update`
- Renamed `mail_listWebhooksV1` → `mail_webhooks_list`
- Renamed `mail_regenerateWebhookSecretV1` → `mail_webhooks_regenerate-secret`
- Renamed `mail_testWebhookV1` → `mail_webhooks_test`
- Renamed `reach_getAutomationDetailsV1` → `reach_automations_get`
- Renamed `reach_listAutomationsV1` → `reach_automations_list`
- Renamed `reach_listAutomationStepsV1` → `reach_automations_list-steps`
- Renamed `reach_getCampaignDetailsV1` → `reach_campaigns_get`
- Renamed `reach_listCampaignsV1` → `reach_campaigns_list`
- Renamed `reach_createADraftCampaignV1` → `reach_campaigns_create-draft`
- Renamed `reach_getCampaignPerformanceV1` → `reach_campaigns_performance`
- Renamed `reach_deleteAContactV1` → `reach_contacts_delete`
- Renamed `reach_deleteAContactFieldV1` → `reach_contact-fields_delete`
- Renamed `reach_updateAContactFieldV1` → `reach_contact-fields_update`
- Renamed `reach_listContactFieldsV1` → `reach_contact-fields_list`
- Renamed `reach_createAContactFieldV1` → `reach_contact-fields_create`
- Renamed `reach_listContactGroupsV1` → `reach_contacts_list-groups`
- Renamed `reach_listContactsV1` → `reach_contacts_list`
- Renamed `reach_createANewContactV1` → `reach_contacts_create`
- Renamed `reach_getContactDetailsV1` → `reach_contacts_get`
- Renamed `reach_deleteAProfileContactV1` → `reach_contacts_delete-profile`
- Renamed `reach_updateAContactV1` → `reach_contacts_update`
- Renamed `reach_createContactsInBulkV1` → `reach_contacts_create-in-bulk`
- Renamed `reach_listProfileContactsV1` → `reach_contacts_list-profile`
- Renamed `reach_createNewContactsV1` → `reach_contacts_create-bulk`
- Renamed `reach_listSegmentsV1` → `reach_segments_list`
- Renamed `reach_createANewContactSegmentV1` → `reach_segments_create`
- Renamed `reach_countProfileSegmentContactsV1` → `reach_segments_count-profile-contacts`
- Renamed `reach_listProfileSegmentContactsV1` → `reach_segments_list-profile-contacts`
- Renamed `reach_getProfileSegmentDetailsV1` → `reach_segments_profile`
- Renamed `reach_updateAProfileSegmentV1` → `reach_segments_update-profile`
- Renamed `reach_deleteAProfileSegmentV1` → `reach_segments_delete-profile`
- Renamed `reach_listSegmentFilterAttributesV1` → `reach_segments_list-filter-attributes`
- Renamed `reach_previewContactsMatchingConditionsV1` → `reach_segments_preview-contacts-matching-conditions`
- Renamed `reach_listProfileSegmentsV1` → `reach_segments_list-profile`
- Renamed `reach_createAProfileSegmentV1` → `reach_segments_create-profile`
- Renamed `reach_listSegmentContactsV1` → `reach_segments_list-contacts`
- Renamed `reach_getSegmentDetailsV1` → `reach_segments_get`
- Renamed `reach_assignAContactToATagV1` → `reach_tags_assign-contact-to`
- Renamed `reach_removeAContactFromATagV1` → `reach_tags_remove-contact-from`
- Renamed `reach_assignContactsToATagV1` → `reach_tags_assign-contacts-to`
- Renamed `reach_removeContactsFromATagV1` → `reach_tags_remove-contacts-from`
- Renamed `reach_deleteATagV1` → `reach_tags_delete`
- Renamed `reach_renameATagV1` → `reach_tags_rename`
- Renamed `reach_listProfileTagsV1` → `reach_tags_list-profile`
- Renamed `reach_createOrFindTagsV1` → `reach_tags_create-or-find`
- Renamed `reach_getFormDetailsV1` → `reach_forms_get`
- Renamed `reach_deleteFormV1` → `reach_forms_delete`
- Renamed `reach_listFormsV1` → `reach_forms_list`
- Renamed `reach_getProfileDomainDNSStatusV1` → `reach_profiles_domain-dns-status`
- Renamed `reach_getConnectedSendingDomainV1` → `reach_profiles_connected-sending-domain`
- Renamed `reach_listPlanFeatureAccessV1` → `reach_profiles_list-plan-feature-access`
- Renamed `reach_getRemainingPlanLimitsV1` → `reach_profiles_remaining-plan-limits`
- Renamed `reach_listProfilesV1` → `reach_profiles_list`
- Renamed `reach_listEmailTemplatesV1` → `reach_templates_list-email`
- Renamed `reach_createAnEmailTemplateV1` → `reach_templates_create-email`
- Renamed `VPS_getDataCenterListV1` → `vps_data-centers_list`
- Renamed `VPS_getProjectContainersV1` → `vps_docker_containers`
- Renamed `VPS_getProjectContentsV1` → `vps_docker_get`
- Renamed `VPS_deleteProjectV1` → `vps_docker_delete`
- Renamed `VPS_getProjectListV1` → `vps_docker_list`
- Renamed `VPS_createNewProjectV1` → `vps_docker_create`
- Renamed `VPS_getProjectLogsV1` → `vps_docker_logs`
- Renamed `VPS_restartProjectV1` → `vps_docker_restart`
- Renamed `VPS_startProjectV1` → `vps_docker_start`
- Renamed `VPS_stopProjectV1` → `vps_docker_stop`
- Renamed `VPS_updateProjectV1` → `vps_docker_update`
- Renamed `VPS_activateFirewallV1` → `vps_firewall_activate`
- Renamed `VPS_deactivateFirewallV1` → `vps_firewall_deactivate`
- Renamed `VPS_getFirewallDetailsV1` → `vps_firewall_get`
- Renamed `VPS_deleteFirewallV1` → `vps_firewall_delete`
- Renamed `VPS_getFirewallListV1` → `vps_firewall_list`
- Renamed `VPS_createNewFirewallV1` → `vps_firewall_create`
- Renamed `VPS_updateFirewallRuleV1` → `vps_firewall_update-rule`
- Renamed `VPS_deleteFirewallRuleV1` → `vps_firewall_delete-rule`
- Renamed `VPS_replaceAllFirewallRulesInGroupV1` → `vps_firewall_replace-all-rules-in-group`
- Renamed `VPS_createFirewallRuleV1` → `vps_firewall_create-rule`
- Renamed `VPS_syncFirewallToAllAssignedVMsV1` → `vps_firewall_sync-to-all-assigned-v-ms`
- Renamed `VPS_syncFirewallV1` → `vps_firewall_sync`
- Renamed `VPS_getPostInstallScriptV1` → `vps_post-install-scripts_get`
- Renamed `VPS_updatePostInstallScriptV1` → `vps_post-install-scripts_update`
- Renamed `VPS_deletePostInstallScriptV1` → `vps_post-install-scripts_delete`
- Renamed `VPS_getPostInstallScriptsV1` → `vps_post-install-scripts_list`
- Renamed `VPS_createPostInstallScriptV1` → `vps_post-install-scripts_create`
- Renamed `VPS_attachPublicKeyV1` → `vps_public-keys_attach`
- Renamed `VPS_deletePublicKeyV1` → `vps_public-keys_delete`
- Renamed `VPS_getPublicKeysV1` → `vps_public-keys_list`
- Renamed `VPS_createPublicKeyV1` → `vps_public-keys_create`
- Renamed `VPS_getTemplateDetailsV1` → `vps_templates_get`
- Renamed `VPS_getTemplatesV1` → `vps_templates_list`
- Renamed `VPS_getActionDetailsV1` → `vps_actions_get`
- Renamed `VPS_getActionsV1` → `vps_actions_list`
- Renamed `VPS_getAttachedPublicKeysV1` → `vps_virtual-machines_attached-public-keys`
- Renamed `VPS_getBackupsV1` → `vps_backups_list`
- Renamed `VPS_restoreBackupV1` → `vps_backups_restore`
- Renamed `VPS_setHostnameV1` → `vps_virtual-machines_set-hostname`
- Renamed `VPS_resetHostnameV1` → `vps_virtual-machines_reset-hostname`
- Renamed `VPS_getVirtualMachineDetailsV1` → `vps_virtual-machines_get`
- Renamed `VPS_getVirtualMachinesV1` → `vps_virtual-machines_list`
- Renamed `VPS_purchaseNewVirtualMachineV1` → `vps_virtual-machines_purchase`
- Renamed `VPS_getScanMetricsV1` → `vps_monarx_scan-metrics`
- Renamed `VPS_installMonarxV1` → `vps_monarx_install`
- Renamed `VPS_uninstallMonarxV1` → `vps_monarx_uninstall`
- Renamed `VPS_getMetricsV1` → `vps_virtual-machines_metrics`
- Renamed `VPS_setNameserversV1` → `vps_virtual-machines_set-nameservers`
- Renamed `VPS_createPTRRecordV1` → `vps_ptr_create`
- Renamed `VPS_deletePTRRecordV1` → `vps_ptr_delete`
- Renamed `VPS_setPanelPasswordV1` → `vps_virtual-machines_set-panel-password`
- Renamed `VPS_startRecoveryModeV1` → `vps_recovery_start`
- Renamed `VPS_stopRecoveryModeV1` → `vps_recovery_stop`
- Renamed `VPS_recreateVirtualMachineV1` → `vps_virtual-machines_recreate`
- Renamed `VPS_restartVirtualMachineV1` → `vps_virtual-machines_restart`
- Renamed `VPS_setRootPasswordV1` → `vps_virtual-machines_set-root-password`
- Renamed `VPS_setupPurchasedVirtualMachineV1` → `vps_virtual-machines_setup`
- Renamed `VPS_getSnapshotV1` → `vps_snapshots_get`
- Renamed `VPS_createSnapshotV1` → `vps_snapshots_create`
- Renamed `VPS_deleteSnapshotV1` → `vps_snapshots_delete`
- Renamed `VPS_restoreSnapshotV1` → `vps_snapshots_restore`
- Renamed `VPS_startVirtualMachineV1` → `vps_virtual-machines_start`
- Renamed `VPS_stopVirtualMachineV1` → `vps_virtual-machines_stop`
- Renamed `hosting_showAIOptionStatusV1` → `wordpress_ai-tools_show-option-status`
- Renamed `hosting_setAIOptionStatusV1` → `wordpress_ai-tools_set-option-status`
- Renamed `hosting_checkIfWordPressInstallationsAreValidV1` → `wordpress_installations_check-if-are-valid`
- Renamed `hosting_deleteWordPressInstallationV1` → `wordpress_installations_delete`
- Renamed `hosting_detectWordPressInstallationsV1` → `wordpress_installations_detect`
- Renamed `hosting_importWordPressWebsiteV1` → `wordpress_installations_import-website`
- Renamed `hosting_installWordPressV1` → `wordpress_installations_install`
- Renamed `hosting_listWordPressInstallationsV1` → `wordpress_installations_list`
- Renamed `hosting_listAvailableWordPressCoreUpdatesV1` → `wordpress_installations_list-core-updates`
- Renamed `hosting_getInstallationJWTTokenV1` → `wordpress_installations_jwt-token`
- Renamed `hosting_showWordPressCoreVersionV1` → `wordpress_installations_show-core-version`
- Renamed `hosting_updateWordPressCoreV1` → `wordpress_installations_update-core`
- Renamed `hosting_purgeLiteSpeedCacheV1` → `wordpress_litespeed-cache_purge-lite-speed`
- Renamed `hosting_showLiteSpeedCacheStatusV1` → `wordpress_litespeed-cache_show-lite-speed-status`
- Renamed `hosting_createLoginLinksV1` → `wordpress_login_create-links`
- Renamed `hosting_showMaintenanceStatusV1` → `wordpress_maintenance_show-status`
- Renamed `hosting_toggleMaintenanceModeV1` → `wordpress_maintenance_toggle`
- Renamed `hosting_showMemcachedObjectCacheStatusV1` → `wordpress_object-cache_show-memcached-status`
- Renamed `hosting_toggleMemcachedObjectCacheV1` → `wordpress_object-cache_toggle-memcached`
- Renamed `hosting_activateWordPressPluginV1` → `wordpress_plugins_activate`
- Renamed `hosting_deactivateWordPressPluginV1` → `wordpress_plugins_deactivate`
- Renamed `hosting_deployWordPressPluginV1` → `wordpress_plugins_deploy`
- Renamed `hosting_installWordPressPluginsV1` → `wordpress_plugins_install`
- Renamed `hosting_listAvailableWordPressPluginsV1` → `wordpress_plugins_list`
- Renamed `hosting_listInstalledWordPressPluginsV1` → `wordpress_plugins_list-installed`
- Renamed `hosting_searchWordPressPluginsV1` → `wordpress_plugins_search`
- Renamed `hosting_listSuggestedWordPressPluginsV1` → `wordpress_plugins_list-suggested`
- Renamed `hosting_checkIfWooCommerceIsInstalledV1` → `wordpress_plugins_check-if-woo-commerce-is-installed`
- Renamed `hosting_uninstallWordPressPluginsV1` → `wordpress_plugins_uninstall`
- Renamed `hosting_updateHostingerWordPressPluginV1` → `wordpress_plugins_update-hostinger`
- Renamed `hosting_updateWordPressPluginsV1` → `wordpress_plugins_update`
- Renamed `hosting_activateWordPressThemeV1` → `wordpress_themes_activate`
- Renamed `hosting_deployWordPressThemeV1` → `wordpress_themes_deploy`
- Renamed `hosting_installWordPressThemeV1` → `wordpress_themes_install`
- Renamed `hosting_listInstalledWordPressThemesV1` → `wordpress_themes_list-installed`
- Renamed `hosting_listWordPressThemesV1` → `wordpress_themes_list`
- Renamed `hosting_uninstallWordPressThemesV1` → `wordpress_themes_uninstall`
- Renamed `hosting_updateWordPressThemesV1` → `wordpress_themes_update`

### Also in this release

- Documentation: `README.md`
- Bundled agent skills: 6 files
- Server instructions: `src/core/instructions.js`, `src/core/instructions.ts`
- Request handling and authentication: `src/core/runtime.js`, `src/core/runtime.ts`
- Build and packaging: `types.d.ts`

## v2.0.0 — 2026-09-28

### Also in this release

- Documentation: `README.md`
- Dependencies: `package-lock.json`
- Bundled agent skills: 6 files
- Server instructions: `src/core/instructions.js`, `src/core/instructions.ts`
- Request handling and authentication: 4 files

## v1.63.4 — 2026-09-25

### Tools

- Changed the description and input schema of `hosting_createWebsiteV1`

### Also in this release

- Documentation: `README.md`
- Dependencies: `package-lock.json`
- Request handling and authentication: `src/core/runtime.js`, `src/core/runtime.ts`
- Build and packaging: `types.d.ts`

## v1.63.3 — 2026-09-23

### Also in this release

- Dependencies: `package-lock.json`, `package.json`

## v1.63.2 — 2026-09-21

### Tools

- Added `hosting_setupWebsiteDatabaseV1` — Setup website database

### Also in this release

- Documentation: `README.md`
- Request handling and authentication: `src/core/runtime.js`, `src/core/runtime.ts`
- Build and packaging: `types.d.ts`

## v1.63.1 — 2026-09-21

### Also in this release

- Release automation: `.github/workflows/build-release.yaml`

## v1.63.0 — 2026-09-21

### Tools

- Added `agency-hosting_reinstallWebsiteSSLV1` — Reinstall website SSL
- Added `agency-hosting_installWebsiteSSLV1` — Install website SSL
- Added `agency-hosting_getWebsiteSSLStatusV1` — Get website SSL status
- Added `agency-hosting_uninstallWebsiteSSLV1` — Uninstall website SSL

### Also in this release

- Documentation: `README.md`
- Request handling and authentication: `src/core/runtime.js`, `src/core/runtime.ts`
- Build and packaging: `types.d.ts`

## v1.62.0 — 2026-09-21

### Also in this release

- Bundled agent skills: `skills/headless/SKILL.md`, `skills/headless/references/SETUP.md`, `skills/headless/references/DATABASE.md`
- Request handling and authentication: `src/core/runtime.js`, `src/core/runtime.ts`
- Server entry points: 6 files
- Server instructions: `src/core/instructions.js`, `src/core/instructions.ts`

## v1.61.2 — 2026-09-21

### Also in this release

- Dependencies: `package-lock.json`
- Request handling and authentication: `src/core/runtime.js`, `src/core/runtime.ts`
- Other files: `.gitignore`

## v1.61.1 — 2026-09-17

### Also in this release

- Request handling and authentication: `src/core/runtime.js`, `src/core/runtime.ts`

## v1.61.0 — 2026-09-16

### Tools

- Added `hosting_installSSLV1` — Install SSL
- Added `hosting_getSSLStatusV1` — Get SSL status
- Added `hosting_toggleHTTPSRedirectV1` — Toggle HTTPS redirect
- Added `hosting_uninstallSSLV1` — Uninstall SSL

### Also in this release

- Documentation: `README.md`
- Request handling and authentication: `src/core/runtime.js`, `src/core/runtime.ts`
- Build and packaging: `types.d.ts`

## v1.60.2 — 2026-09-16

### Tools

- Added `hosting_getGitAutoDeploymentSettingsV1` — Get Git auto-deployment settings
- Added `hosting_updateGitAutoDeploymentSettingsV1` — Update Git auto-deployment settings
- Added `hosting_deleteGitAutoDeploymentSettingsV1` — Delete Git auto-deployment settings
- Changed the description of `hosting_listGitInstallationsV1`
- Changed the description of `hosting_listGitInstallationRepositoriesV1`
- Changed the description and input schema of `hosting_startNode_jsBuildV1`

### Also in this release

- Documentation: `README.md`
- Dependencies: `package-lock.json`
- Request handling and authentication: `src/core/runtime.js`, `src/core/runtime.ts`
- Build and packaging: `types.d.ts`

## v1.60.1 — 2026-09-15

### Tools

- Added `hosting_listGitInstallationsV1` — List Git installations
- Added `hosting_listGitInstallationRepositoriesV1` — List Git installation repositories

### Also in this release

- Documentation: `README.md`
- Dependencies: `package-lock.json`
- Request handling and authentication: `src/core/runtime.js`, `src/core/runtime.ts`
- Build and packaging: `types.d.ts`

## v1.60.0 — 2026-09-14

### Also in this release

- Dependencies: `package-lock.json`
- Request handling and authentication: `src/core/runtime.js`, `src/core/runtime.ts`

## v1.59.0 — 2026-09-11

### Tools

- Added `domains_completeDomainSetupV1` — Complete domain setup

### Also in this release

- Documentation: `README.md`
- Request handling and authentication: `src/core/runtime.js`, `src/core/runtime.ts`
- Build and packaging: `types.d.ts`

## v1.58.1 — 2026-09-11

### Also in this release

- Dependencies: `package-lock.json`
- Request handling and authentication: `src/core/runtime.js`, `src/core/runtime.ts`

## v1.58.0 — 2026-09-09

### Tools

- Changed the description of `billing_createPurchaseOrderV1`
- Changed the description of `billing_renewSubscriptionV1`
- Changed the description of `domains_purchaseNewDomainV1`
- Changed the description of `VPS_purchaseNewVirtualMachineV1`

### Also in this release

- Documentation: `README.md`
- Request handling and authentication: `src/core/runtime.js`, `src/core/runtime.ts`
- Build and packaging: `types.d.ts`

## v1.57.4 — 2026-09-09

### Tools

- Changed the description and input schema of `ecommerce_uploadAndAttachAProductImageV1`

### Also in this release

- Documentation: `README.md`
- Request handling and authentication: `src/core/runtime.js`, `src/core/runtime.ts`
- Build and packaging: `types.d.ts`

## v1.57.3 — 2026-09-09

### Tools

- Added `horizons_cloneWebsiteV1` — Clone website
- Added `horizons_getWebsiteListV1` — Get website list
- Added `horizons_editWebsiteV1` — Edit website
- Added `horizons_publishWebsiteV1` — Publish website
- Changed the description of `horizons_createWebsiteV1`
- Changed the description of `horizons_getWebsiteV1`

### Also in this release

- Documentation: `README.md`
- Dependencies: `package-lock.json`
- Request handling and authentication: `src/core/runtime.js`, `src/core/runtime.ts`
- Build and packaging: `types.d.ts`

## v1.57.2 — 2026-09-07

### Also in this release

- Request handling and authentication: `src/core/runtime.js`, `src/core/runtime.ts`

## v1.57.1 — 2026-09-07

### Also in this release

- Dependencies: `package-lock.json`
- Request handling and authentication: `src/core/runtime.js`, `src/core/runtime.ts`

## v1.57.0 — 2026-09-04

### Tools

- Added `hosting_getNode_jsBuildSettingsV1` — Get Node.js build settings
- Added `hosting_updateNode_jsBuildSettingsV1` — Update Node.js build settings
- Added `hosting_analyseFailedNode_jsBuildV1` — Analyse failed Node.js build
- Added `hosting_getNode_jsBuildDetailsV1` — Get Node.js build details
- Added `hosting_getNode_jsRuntimeLogsV1` — Get Node.js runtime logs
- Added `hosting_clearNode_jsRuntimeLogsV1` — Clear Node.js runtime logs

### Also in this release

- Documentation: `README.md`
- Dependencies: `package-lock.json`
- Request handling and authentication: `src/core/runtime.js`, `src/core/runtime.ts`
- Build and packaging: `types.d.ts`

## v1.56.0 — 2026-09-04

### Tools

- Added `VPS_syncFirewallToAllAssignedVMsV1` — Sync firewall to all assigned VMs
- Changed the description of `VPS_syncFirewallV1`

### Also in this release

- Documentation: `README.md`
- Request handling and authentication: `src/core/runtime.js`, `src/core/runtime.ts`
- Build and packaging: `types.d.ts`

## v1.55.1 — 2026-09-03

### Also in this release

- Request handling and authentication: `src/core/runtime.js`, `src/core/runtime.ts`

## v1.55.0 — 2026-09-03

### Also in this release

- Release automation: `.github/workflows/build-release.yaml`

## v1.54.0 — 2026-09-03

### Tools

- Changed the input schema of `agency-hosting_createANewWebsiteV1`

### Also in this release

- Request handling and authentication: `src/core/runtime.js`, `src/core/runtime.ts`
- Build and packaging: `types.d.ts`

## v1.53.1 — 2026-09-03

### Tools

- Added `reach_createADraftCampaignV1` — Create a draft campaign
- Added `reach_listEmailTemplatesV1` — List email templates
- Added `reach_createAnEmailTemplateV1` — Create an email template

### Also in this release

- Documentation: `README.md`
- Dependencies: `package-lock.json`
- Request handling and authentication: `src/core/runtime.js`, `src/core/runtime.ts`
- Build and packaging: `types.d.ts`

## v1.53.0 — 2026-09-02

### Also in this release

- Dependencies: `package-lock.json`
- Distribution manifests: `server.json`

## v1.52.2 — 2026-09-01

No changes to the published artifact.

## v1.52.1 — 2026-09-01

### Also in this release

- Dependencies: `package-lock.json`
- Request handling and authentication: `src/core/runtime.js`, `src/core/runtime.ts`

## v1.52.0 — 2026-08-28

### Also in this release

- Release automation: `.github/workflows/build-release.yaml`
- Documentation: `README.md`
- Distribution manifests: `gemini-extension.json`, `server.json`
- Dependencies: `package-lock.json`, `package.json`
- Bundled agent skills: `skills/headless/entry/bootstrap.mjs`

## v1.51.1 — 2026-08-27

### Tools

- Changed the description and input schema of `VPS_replaceAllFirewallRulesInGroupV1`

### Also in this release

- Documentation: `README.md`
- Request handling and authentication: `src/core/runtime.js`, `src/core/runtime.ts`
- Build and packaging: `types.d.ts`

## v1.51.0 — 2026-08-27

### Tools

- Updated the title and annotations of 372 tools (all)

### Also in this release

- Request handling and authentication: `src/core/runtime.js`, `src/core/runtime.ts`

## v1.50.0 — 2026-08-27

### Tools

- Added `VPS_replaceAllFirewallRulesInGroupV1`

### Also in this release

- Documentation: `README.md`
- Request handling and authentication: `src/core/runtime.js`, `src/core/runtime.ts`
- Build and packaging: `types.d.ts`

## v1.49.0 — 2026-08-27

### Also in this release

- Dependencies: `package-lock.json`
- Request handling and authentication: `src/core/runtime.js`, `src/core/runtime.ts`

## v1.48.0 — 2026-08-26

### Tools

- Added `hosting_listNode_jsEnvironmentVariablesV1`
- Added `hosting_replaceNode_jsEnvironmentVariablesV1`

### Also in this release

- Documentation: `README.md`
- Dependencies: `package-lock.json`
- Request handling and authentication: `src/core/runtime.js`, `src/core/runtime.ts`
- Build and packaging: `types.d.ts`

## v1.47.0 — 2026-08-25

### Also in this release

- Release automation: `.github/workflows/build-release.yaml`
