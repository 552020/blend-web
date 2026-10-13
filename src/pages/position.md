---
layout: ../layouts/Base.astro
title: vetKeys against other ways of passing a key
description: Sharing an encrypted document was never the problem. The problem is sharing the key. A comparison of vetKeys with the other ways of doing it.
---

# vetKeys against other ways of passing a key

## Premise

Sharing an encrypted document was never the problem. Ciphertext can travel over any channel, mail, a public chat, a pastebin, and nobody learns anything. The problem is sharing the key. Every system below is an answer to that one question, and the anchor is giving the key by hand: the only answer with no third party at all. Everything else is a way of avoiding the meeting.

## The question

Share encrypted content between A and B, or keep it in sync across one person's devices.

Device sync is sharing with yourself. There "by hand" is cheap, you carry the secret in your head or on a QR code, which is why Bitwarden and Signal both do exactly that. The custodial systems win on convenience only.

## Two definitions

**Custodian.** A party that can produce the decryption key without A or B taking part. Access by design: the system works only because that party can produce the key, so it can do so at any time, after the fact, at scale, without anyone noticing. The subnet quorum, the canister controller, Amazon's HSM operators are in this class.

**Access by attack.** Someone has to be in the right place at the right moment, and it leaves a trace: the paper handover photographed over a shoulder, the spoken key recorded, the meeting observed, a device seized or infected, its owner coerced. No system prevents this. An attacker must act once, in person, against one pair; a custodian can act later, remotely, against everyone. This is also why by hand does not scale: every handover is one more exposed moment.

**Verification does opposite work.** In Signal the private keys are generated on the two phones and never leave them; the server only passes public keys around. The one trick the server could play is to hand A its own key instead of B's. Comparing the safety number rules that out, and from then on the only copies of the keys are on the two phones: no custodian. In vetKeys B never generates a key; it is computed from a master secret the subnet holds in shares, when the canister asks. "Verifiable" means B can check the key was correctly derived from the real master key. It does not stop the holders of the master key from deriving the same key for themselves. In Signal verification removes the trusted party; in vetKeys it confirms the trusted party did its job honestly this time.

## The table

"Setup for B" is what the recipient must have before A can send. "Machines" is whether a program can be A or B without a human in the loop. The endpoint, the phone, the browser, the server, is the weakest point of every row and can be cracked in all of them; that is a constant, so the column records what a cracked endpoint yields, which is where the rows differ.

The first column after the name is the asymmetry the rest follows from: either B makes his own key on his own device and nobody else ever has it, or someone makes the key for B and therefore has it.

| System | Who makes B's key | Who else can get the key | Setup for B | Device sync | Machines | Cracked endpoint yields | Weak point |
|---|---|---|---|---|---|---|---|
| Key by hand | A or B, on their own device; handed over in person | No one by design; only the handover moment and the two endpoints | A meeting, or a channel you already trust | Carry it yourself | Yes, but a human provisions each machine and the key sits in clear on it | That copy of the key, so everything under it past and future, until re-keyed by hand | Does not scale, one key per pair, no revocation |
| B publishes his own public key (age, PGP, SSH keys on GitHub) | B, on his own device; only the public half is published | No one by design, if the key is really B's | A published key pair | Carry the private key | Yes, standard for deploy keys and encrypted config | The private key, so everything ever encrypted to it, until B publishes a new one | Is this really B's key |
| Signal (WhatsApp, iMessage similar) | B's phone, one pair per device; the server only lists the public halves | No one by design once the safety number is verified; before that, the provider's directory | An account, so a phone number and the app | Linked devices by QR, backup with a recovery key | Unofficial only (signal-cli), one phone number per bot | What is on that device and its own keys; unlink it; messages elsewhere stay closed, keys rotate per message | Directory trust until verified, phone number, not for programs |
| Password manager sharing (Bitwarden, 1Password, Proton) | B's device, from his master password; the vendor never sees it | No one by design; the server holds ciphertext | An account on the same service | Master password typed on each device | Service accounts exist; then the vendor's server and the machine hold keys | The unlocked vault, so everything; rotate the account key afterwards | Master password strength, same platform for both |
| Link with the key in the URL (Bitwarden Send, Proton link, one-time secret) | A's browser, a random key written into the link | Anyone with the link | Nothing | Not applicable | Yes, trivially | That one secret | The link is the secret, so it needs Signal or a meeting |
| Custodial KMS (Vault, AWS KMS, cloud secret managers) | The KMS, inside the operator's hardware; B only gets to use it | The operator | An identity the KMS recognises | Every machine asks the KMS | Built for it, policy and audit log | The machine's credential, so everything that identity may fetch until it is revoked; the audit log shows it | One company, one jurisdiction |
| vetKeys (ICP) | The subnet, from its master key, when the canister asks; B generates nothing | Two thirds of the subnet nodes under NNS governance, and the canister controller | Only an identifier, login at decrypt time | Any device that logs in derives the same key, nothing to carry | Yes, but only from an ICP canister | B's identity, so the same key for everything past and future; no rotation, and revoking access does not invalidate a key already derived | Custodian, identity is everything, no rotation, must live on ICP |
| Threshold networks (Lit, TACo) | The network's nodes, from shares; B generates nothing | The network's node quorum | A wallet address, signature at decrypt time | Same as vetKeys | Yes, chain-agnostic SDK | The wallet, so everything its conditions allow until the conditions are changed | Custodian, young networks |

## Reading it

**Person to person.** By hand first, then Signal with verified safety numbers, then a shared password manager. vetKeys ranks below these because it adds a custodian without removing a step B would have taken anyway. The link methods are last on their own and fine when the link goes through Signal.

**Your own devices.** The best systems already make you carry the secret: the master password, the QR scan. vetKeys replaces carrying with logging in. That is the one convenience it offers, bought with escrow and with the login becoming the whole security.

**Programs.** By hand still works for provisioning, but the machine then holds the key in clear. When the program must obtain the key on demand after a check, a custodian is needed, and the choice is a KMS or a threshold network. vetKeys is the right one if the program is already a canister, and the only one if the recipient is a blockchain address with no account anywhere. That is its niche, and nothing above it in the table reaches it.

## The endpoint is a constant

The endpoint is the weakest point of every row: Signal's phone, Bitwarden's browser, the browser tab that holds a decrypted vetKey. A phone can be cracked, seized, infected, its owner coerced. No cryptography in the table prevents this. Because it is the same for all rows, it does not separate the systems; the custodian column does. On this axis the systems equalize.

What is not constant is what a cracked endpoint yields. On Signal the attacker gets what is on that phone and that device's keys, which can be unlinked, and past messages not on the phone stay closed because keys rotate per message. Under vetKeys a cracked session is B's identity, and the identity derives the same key for everything B was ever sent and everything to come, with no rotation. Deterministic derivation makes the endpoint compromise worse, not better.

## A custodian who cannot access the key

Three known ways, each moving the trust rather than removing it. Lock the key in hardware: an HSM or enclave performs operations but never exports the key (Apple's iCloud Keychain escrow, admin cards shredded, ten guesses then the record is wiped; Signal's Secure Value Recovery in SGX). Trust moves to the chip maker, the firmware and the attestation; SGX has been broken by side-channel research. Split the key: "no one" becomes "no fewer than t parties", and the guarantee is their independence (vetKeys). Make the user a necessary piece: the custodian holds a share, the user's device or passcode is the other; the custodian alone truly cannot, and the user has to carry something again. Combining the three gets close to the ideal; nothing commercial does all three for arbitrary content, and "no one can access it" can never be checked from outside.

## Where this leaves vetKeys

A sound primitive that is key escrow by construction: a two-thirds quorum of the subnet and the canister controller can derive every key. The real win is multi-device and sharing without key sync, and code-enforced access policy. The honest pitch is "secrets for programs that already live on ICP", not a competitor to Bitwarden, Signal or Proton. For a person sending a person a password, Signal is enough and safer. The [vetKeys page](/vetkeys) goes through the claims one by one; the [Blend page](/blend) is the worked example.
