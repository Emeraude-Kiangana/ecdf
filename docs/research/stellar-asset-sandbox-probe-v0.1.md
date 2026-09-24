# Stellar Asset Sandbox Probe v0.1

**Checkpoint:** P03-CP03-D

**Date:** 2026-09-24

**Status:** RESEARCH REQUIRED

**Asset created:** NO

## Objective

Determine whether the official Stellar Asset Sandbox can support a controlled
test-asset experiment before any custom asset code is considered for eCDF.

This checkpoint does not authorize an asset named eCDF, Mainnet activity,
custom token code, a Stellar adapter, a wallet installation or a persistent
Sandbox account.

## Official tool verification

The Stellar developer documentation identifies the Asset Sandbox hosted by
Cheesecake Labs as a sandbox supported by the Stellar Development Foundation
for experimenting with asset issuance on Stellar Testnet.

Verified entry point:

- <https://stellar.cheesecakelabs.com/>

## Routes observed

| Route | Observed purpose | Required boundary | Probe result |
|---|---|---|---|
| Non-custodial Asset Sandbox | Create and manage Testnet tokens through a Freighter wallet | Freighter browser extension set to Testnet, plus issuing, distribution and recipient addresses | BLOCKED — required wallet extension is not available |
| Custodial Asset Sandbox | Institution-focused Testnet token management through a hosted interface | Persistent Sandbox account and authentication | BLOCKED — no authorized account or credentials are available |

## Non-custodial route evidence

The Sandbox displayed these prerequisites before asset configuration:

1. install the Freighter Wallet browser extension;
2. change Freighter from Mainnet to Testnet;
3. create three Stellar addresses representing issuing, distribution and
   recipient accounts.

The next screen requested the issuing account public key through the selected
Freighter account. Without the extension, the workflow could not progress to
asset definition or signing.

No extension was installed. No wallet permission was granted. No key was
created, imported or transmitted.

## Custodial route evidence

The hosted route presented an email/password sign-in form and a sign-up action.
The probe stopped before authentication or account creation.

No personal data, credentials or persistent account were created or submitted.

## Findings relevant to eCDF

| Question | Finding |
|---|---|
| Can the official Sandbox be reached? | YES |
| Is it explicitly Testnet-oriented? | YES |
| Does it expose non-custodial and custodial routes? | YES |
| Can this environment complete the non-custodial route as-is? | NO — Freighter is required |
| Can this environment complete the custodial route as-is? | NO — authenticated account access is required |
| Was issuance tested? | NO |
| Were trustlines tested? | NO |
| Were authorization, freeze or clawback tested? | NO |
| Was transfer of an issued asset tested? | NO |
| Does the probe justify custom asset code? | NO |

## Required gate for a future controlled experiment

A later checkpoint may proceed only with explicit authorization for one of
these mutually exclusive routes:

### Route A — non-custodial

- install or provide an approved Freighter environment;
- confirm the wallet is on Stellar Testnet;
- use three disposable Testnet accounts;
- choose a clearly fictitious asset code that is not `eCDF`, `CDF`, `USDC` or
  another real or official-looking identifier;
- disclose and approve each signing action before submission;
- capture public accounts, transaction hashes and ledger results only;
- discard disposable secrets after the experiment.

### Route B — custodial

- provide an authorized Sandbox account through the secure authentication
  flow;
- prohibit real organization, customer, financial or KYC data;
- use only a fictitious Testnet asset;
- export evidence without credentials or private data.

## Decision

```text
OFFICIAL ASSET SANDBOX   VERIFIED
SANDBOX ROUTES           DOCUMENTED
ASSET ISSUANCE           NOT TESTED
TRUSTLINE                NOT TESTED
ASSET TRANSFER           NOT TESTED
CUSTOM ASSET CODE        NOT JUSTIFIED
NEXT STATUS              RESEARCH REQUIRED
```

CP03-D does not pass the asset-feasibility gate. It establishes the exact tool
and authorization prerequisites for a later experiment while preserving the
rule that official tooling must be tested before custom implementation.