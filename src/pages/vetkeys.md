---
layout: ../layouts/Base.astro
title: vetKeys, what it guarantees and what it does not
description: A claims-against-reality reading of vetKeys (vetKD) on the Internet Computer, its trust model, what it genuinely solves, and its adoption as of October 2026.
---

# vetKeys, what it guarantees and what it does not

vetKeys is the Internet Computer's name for vetKD, verifiably encrypted threshold key derivation. A subnet holds one BLS master key in shares. A canister asks the subnet for a key derived from that master key for a given context and input, typically a user identifier, and the subnet returns it encrypted to a transport key the user generated, so neither the canister nor any single node sees the key in clear. The user can verify the result against the master public key. Because derivation is deterministic, the same canister, context and input always give the same key, which is what makes multi-device access and encryption to an identifier work.

Facts checked on 2026-10-13 against DFINITY's documentation and the NNS record: the API is live on mainnet; the production key `key_1` was enabled on subnet pzp6e, which has 34 nodes, by proposal 137151 on 2025-06-30; a derive call costs about 26 billion cycles on the production key and 10 billion on the test key, roughly 3.5 and 1.4 US cents; fetching the public key is free; the only curve is BLS12-381 G2.

## Claims against reality

The claims are quoted from our own notes of July 2025, written from DFINITY's material while we prepared for the hackathon.

| Claim | Verdict | Why |
|---|---|---|
| "Keys are derived collaboratively by ICP subnet nodes; no single node ever holds the full key." | True | Threshold sharing; one node cannot derive, a two-thirds quorum can. |
| "Sensitive key material is never exposed to the backend or the network." | Partly | True against the nodes and the relay. False against the backend's own controller: the canister decides who gets which key and can request any key with its own transport key. |
| "The key derivation process is transparent and can be audited for correctness." | Partly | The recipient can check the key matches the master public key. Nothing audits the canister's access decisions unless the canister logs them. |
| "Canister-only API, ensuring strong access control." | Hype | Only canisters can call it, true. The access control is whatever the canister's code and controller say. |
| "Safer than Telegram's cloud mode and more secure than WhatsApp's trust in their key servers." | Half | Any end-to-end scheme beats Telegram cloud chats. WhatsApp runs the Signal protocol with key transparency since 2023; vetKD has the same directory problem, the canister is the directory, plus a quorum that can derive keys, and no transparency log. |
| "vetKeys prevent server-side decryption or data leaks like the 2022 LastPass breach." | Hype | LastPass servers could not decrypt vaults either. The breach was operational, weak PBKDF2 on old accounts and unencrypted URLs. vetKD removes offline cracking, which is real, but adds two decryptors LastPass never had: the subnet quorum and the canister controller. |
| "Decentralized, verifiable, non-reconstructible encryption and signing." | False | DFINITY's own reference: two-thirds of the nodes must cooperate to reconstruct the master key. Reconstructible by design. |
| "No central key repository; full auditability and revocation via access logic." | Partly | Revocation stops future derivations only. A key already fetched stays valid, because derivation is deterministic. The classic weakness of identity-based encryption. |
| "Built-in multi-user, multi-device, and conditional access support." | True, at a price | Any device that can authenticate gets the same key. The authenticator, Internet Identity or a wallet signature, becomes the whole root of trust. |
| "Production-ready vetKeys, available since June 2025." | True | Proposal 137151, executed 2025-06-30. |

## The trust model, stated plainly

| | Who can decrypt your data besides you | Offline cracking of stolen ciphertext | Recovery and multi-device |
|---|---|---|---|
| vetKeys (ICP) | A two-thirds quorum of the 34 nodes of pzp6e; the canister's controllers; anyone holding your session | Impossible, no password-derived key | Free: any authenticated device derives the same key; no rotation |
| Bitwarden | Nobody; the server holds ciphertext | Possible; depends on the master password and the KDF settings | Account key wrapped by the master key; organisation keys wrapped to each member's public key |
| 1Password | Nobody; a recovery group can recover vault keys, never the account password or Secret Key | Not feasible: a random 128-bit Secret Key is mixed into the derivation | The Secret Key must be carried to each device |
| Signal | Nobody. Secure Value Recovery keeps a PIN-protected key in enclaves with a guess limit; Secure Backups use a recovery key never sent to Signal | Not applicable to backups, random key | Per-device keys, QR linking; backup restore needs the key |
| Apple | Keychain escrow in HSM clusters, ten attempts then the record is destroyed; under Advanced Data Protection only trusted devices hold the keys | HSM rate-limited; random keys under ADP | Recovery contact or recovery key required under ADP |
| Proton Drive | Nobody; share passphrases encrypted to each member's address key; link passwords stay in the URL fragment | Keys protected by the account key; Proton holds ciphertext only | Address keys synced encrypted |

Three things to keep in view when weighing the first row. All 34 nodes run the same replica binary, built by DFINITY and rolled out through NNS proposals, so the honesty of 23 operators is in practice the honesty of one code pipeline and of the NNS majority that approves it. The NNS can also reshare the master key to other nodes by proposal, which is how the backup copy was made. And the quorum is not the weakest link: the canister controller is a single party with a single key.

## What it genuinely solves

Boneh and Franklin's identity-based encryption of 2001 already allowed a distributed key generator and already noted that escrow is inherent to the scheme. vetKD adds the two missing pieces that let a public blockchain act as that generator: the shares are encrypted to the user's transport key so the combiner never sees the key, and the shares are verifiable so bad shares are discarded. On top of that come Groth's non-interactive distributed key generation with resharing, forward-secure share distribution, and NNS-governed backup.

What this buys, concretely:

- Encryption to an identity with no pre-registration: an address, a principal, an email, a timestamp. Lit Protocol and TACo offer the same user-facing property with condition-based threshold decryption; vetKD's version is cleaner, one primitive and one key, and native to ICP.
- Timelock encryption, threshold BLS signatures and verifiable randomness, with real uses in sealed bids, delayed reveals and front-running protection.
- Multi-device and sharing without key sync, recovery phrases or re-encryption, enforced by code. This is the one practical advantage over Bitwarden, 1Password or Proton for ordinary users, and it is bought entirely with escrow.

Worth it for programs whose logic already runs on an ICP subnet and whose users already accept that subnet: sealed-ballot voting, token-gated content, auctions, on-chain games, agents that need a secret they cannot be trusted to hold. Not worth it for a password manager, a personal file vault or a messenger whose selling point is that no operator can read the data.

## Adoption, October 2026

The production key has been live since 2025-06-30. The libraries moved on: the Rust crate `ic-vetkeys` reached version 0.9.0 in September 2026, a Motoko port exists, and the `dfinity/vetkeys` repository was last pushed in September 2026, with 21 stars. We found no published external audit; DFINITY spoke of internal reviews in May 2025.

The one DFINITY product using it is the Notes feature of the [Oisy wallet](https://docs.oisy.com/using-oisy-wallet/notes), built on the EncryptedMaps library. Sharing a note there does not use vetKeys at all: the share link carries a browser-generated AES key in the URL fragment. On GitHub, about forty distinct owners depend on the libraries, most of them hackathon and sample repositories. The serious ones we found are ldclabs' `ic-cose`, a configuration and secrets service where vetKeys is one option beside X25519 keys, research-ag's DailyBid exchange backend, `vaultdrop` for dead-drop sharing, and two AI-agent projects. OpenChat shows no integration. There are no usage statistics and no breakout application.

## Our position

The primitive is sound and the people who built it are serious; the escrow is the design, not a flaw. The use-cases material oversells it by describing a custodial system in the language of a non-custodial one. vetKeys cannot be used without moving the backend onto ICP, so every sale is a re-platforming, and the security story then starts with explaining the NNS to someone who asked for a feature. The honest pitch is secrets for programs that already live on ICP. For everything else, the [table](/) says which tool is enough.
