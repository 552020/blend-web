---
layout: ../layouts/Base.astro
title: Blend
description: Blend sends encrypted files to any Ethereum address, paid in USDC, using vetKeys on the Internet Computer. What it is, how it works, and what our review found.
---

# Blend

Send an encrypted file to any Ethereum address, paying in USDC. The recipient needs no account anywhere: the sender encrypts to the address itself, and the recipient later signs in with the wallet that owns it and decrypts in the browser.

Blend was built by Daniil Tolmacov, Stefano Lombardo and Léonard Mangallon for the WCHL 2025 qualification round, the World Computer Hacker League run by DFINITY and ICP HUBS. The name is a contraction of "bumping Lund's Base Send": Kristofer Lund had published the frontend of such an app as a weekend prototype on 29 June 2025, and the project took his earlier [send_file_to_eth demo](https://github.com/kristoferlund/send_file_to_eth_demo) as its base on 15 July 2025. Authentication uses Lund's [ic-siwe](https://github.com/kristoferlund/ic-siwe), Sign-In with Ethereum for ICP. A precursor, built at ETHGlobal Cannes a week earlier with Walrus storage and USDC on Base, lives in the [wetkeys](https://github.com/552020/wetkeys) repository.

What the team added to the demo: the switch from the chain-key testing canister to the production management canister; a Base-to-ICP bridge through OneSec, so the USDC a sender pays is swapped into cycles that top up the canister; SIWE embedded in the backend instead of a separate provider canister; a Privy embedded wallet; configurable expiry with ICP timers for clean-up; test suites for both sides.

## How a transfer works

1. The sender signs in with an Ethereum wallet. The canister verifies the signature and issues a session.
2. The browser fetches the canister's vetKD master public key, free of charge, and encrypts the file to the recipient's address with identity-based encryption. Only ciphertext leaves the browser.
3. The sender pays the fee in USDC on Base. The canister checks the transaction through the EVM RPC canister before storing the file.
4. The recipient signs in with the wallet that owns the address. The canister asks the subnet to derive the key for that address, encrypted to a transport key the recipient's browser generated.
5. The browser decrypts the key, then the file.

The fee is the canister's own cost passed on: storage per gigabyte-day, the derive call, the RPC call, plus the bridge commission. For a 10 MB file kept one day that is about two US cents, almost all of it the derive price.

## What the review found

We reviewed the code in October 2026, with the result on the [vetKeys page](/vetkeys) as background. Four points in the July 2025 state of the repository:

- The backend derived keys with the test key, `test_key_1`, while computing the fee at the production price. DFINITY lists the test key for development only.
- The function that checks the payment logged "Insufficient payment, but it is fine" and returned success, so any confirmed USDC transfer of any amount passed.
- The vetKD context was empty, against DFINITY's guidance to use a domain separator per application.
- The derive price was charged on every transfer, although the derivation happens once per recipient address.

A clean-up commit of 11 October 2026 corrects the key, the context and the payment check; it sits on the `archive` branch and is not yet on `main`. Changing the key or the context makes files stored before the change undecryptable, since derivation is deterministic per key and context, so the old transfers are gone with it.

## What Blend is, honestly

A working demonstration of the primitive, not a product. Sending to a bare address with no recipient set-up is real and is the one thing a Proton link or Bitwarden Send cannot do, but Lit Protocol and TACo offer it too, with the same custodial shape. The USDC fee is not monetisation; it is a workaround for ICP's reverse gas model, in which the canister, not the user, pays for computation. The use case was chosen after the technology, to fit sponsor tracks, and nobody asked for it.

If it were to become something, the pitch would be the one on the vetKeys page: encrypted hand-over for programs and addresses that already live on chain, with the custodian named. Repository: [552020/blend](https://github.com/552020/blend).
