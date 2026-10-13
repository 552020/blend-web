---
layout: ../layouts/Base.astro
title: Sources
description: Sources used for the vetKeys and Blend analysis.
---

# Sources

Read between 10 and 13 October 2026.

## vetKeys and the Internet Computer

- Cerulli, Connolly, Neven, Rodríguez-Henríquez, Shoup, "vetKeys: How a Blockchain Can Keep Many Secrets", [IACR ePrint 2023/616](https://eprint.iacr.org/2023/616).
- Boneh and Franklin, "Identity-Based Encryption from the Weil Pairing", 2001, [PDF](https://crypto.stanford.edu/~dabo/papers/bfibe.pdf). Section 6 on distributed key generation and on escrow.
- DFINITY, [vetKeys concepts page](https://docs.internetcomputer.org/concepts/vetkeys/): status, costs, key names, determinism.
- DFINITY, [vetKeys API reference](https://docs.internetcomputer.org/building-apps/network-features/vetkeys/api/).
- DFINITY, ["How vetKeys work"](https://uc7il-jaaaa-aaaam-ai2gq-cai.icp0.io/references/vetkeys-overview), reference page on the ICP-hosted copy of the documentation; source of the sentence "two-thirds of the nodes must cooperate to reconstruct the master key" and of the backup on a second subnet.
- DFINITY, [Trust in canisters](https://docs.internetcomputer.org/building-apps/best-practices/trust-in-canisters): what a controller can do.
- NNS proposals [136589](https://ic-api.internetcomputer.org/api/v3/proposals/136589), [137075](https://ic-api.internetcomputer.org/api/v3/proposals/137075) and [137151](https://ic-api.internetcomputer.org/api/v3/proposals/137151): creation, backup and enabling of the production key.
- IC API, [subnet pzp6e](https://ic-api.internetcomputer.org/api/v3/subnets/pzp6e-ekpqk-3c5x7-2h6so-njoeq-mt45d-h3h6c-q3mxf-vpeq5-fk5o7-yae): node count.
- DFINITY forum, [test key announcement, May 2025](https://forum.dfinity.org/t/threshold-key-derivation-privacy-on-the-ic/16560/206) and [production key and II subnet downtime, June 2025](https://forum.dfinity.org/t/vetkeys-production-key-and-ii-subnet-downtime/50370).
- DFINITY, [Onchain privacy in action: a guide to vetKeys use cases](https://medium.com/dfinity/onchain-privacy-in-action-a-guide-to-vetkeys-use-cases-d733aa6f9da5).
- [dfinity/vetkeys](https://github.com/dfinity/vetkeys) on GitHub; [Oisy wallet Notes documentation](https://docs.oisy.com/using-oisy-wallet/notes); [ldclabs/ic-cose](https://github.com/ldclabs/ic-cose); [jorgenbuilder/vaultdrop](https://github.com/jorgenbuilder/vaultdrop).

## The other systems

- Bitwarden, [security whitepaper](https://bitwarden.com/help/bitwarden-security-white-paper/) and [Send encryption](https://bitwarden.com/help/send-encryption/).
- 1Password, [security design](https://support.1password.com/1password-security/).
- Signal, [Secure Value Recovery](https://signal.org/blog/secure-value-recovery/), [Secure Backups](https://signal.org/blog/introducing-secure-backups/), [Sesame specification](https://signal.org/docs/specifications/sesame/).
- Apple, [escrow security for iCloud Keychain](https://support.apple.com/guide/security/escrow-security-for-icloud-keychain-sec3e341e75d/web) and [Advanced Data Protection](https://support.apple.com/en-us/102651).
- Proton, [Proton Drive security model](https://proton.me/blog/protondrive-security).
- WhatsApp, [key transparency](https://engineering.fb.com/2023/04/13/security/whatsapp-key-transparency/); Telegram, [FAQ](https://telegram.org/faq).
- Wladimir Palant, [What's in a PR statement: LastPass breach explained](https://palant.info/2022/12/26/whats-in-a-pr-statement-lastpass-breach-explained/).
- [age](https://github.com/FiloSottile/age); MetaMask, [API method deprecation](https://metamask.io/news/metamask-api-method-deprecation) for the browser-wallet encryption methods.
- Lit Protocol, [encryption documentation](https://developer.litprotocol.com/lit-actions/migration/encryption); Threshold Network, [TACo key concepts](https://docs.threshold.network/applications/threshold-access-control/key-concepts); Lighthouse, [encrypted uploads](https://docs.lighthouse.storage/lighthouse-1/how-to/upload-encrypted-data).
- Wikipedia, [Identity-based encryption](https://en.wikipedia.org/wiki/Identity-based_encryption), on revocation.

## Blend

- [552020/blend](https://github.com/552020/blend), backend `src/backend/src/lib.rs` and `payment_manager.rs` as of commit 971e2f7 (July 2025) and the archive branch (October 2026).
- Kristofer Lund, [send_file_to_eth demo](https://github.com/kristoferlund/send_file_to_eth_demo), [ic-siwe](https://github.com/kristoferlund/ic-siwe), and the [Base Send prototype post](https://x.com/kristoferlund/status/1939308821932916811) of 29 June 2025.
- [WCHL 2025](https://dorahacks.io/hackathon/wchl25-qualification-round/info-resources-t&cs) qualification round; [ETHGlobal Cannes prizes](https://ethglobal.com/events/cannes/prizes).
