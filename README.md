# eCDF

## Status

**Research Prototype — v0.1**

Repository Foundation for a test-only, pre-production experiment.

## Purpose

eCDF is a technology research prototype for testing whether an explicitly
authorized test-value transfer can produce a verifiable and reproducible result
through a minimal settlement adapter.

## Core Hypothesis

If a test-value transfer is modeled as an explicit state machine and authorized
locally with a disposable Testnet key, then a prototype actor can submit and
independently verify a minimal Stellar Classic payment with an unambiguous
observable result, without production custody or a real-world fiat claim.

## Scope

The planned prototype compares one canonical transfer intent through:

- a deterministic centralized baseline; and
- a minimal Stellar Classic Testnet path.

INC-01 creates only the executable repository foundation and bootstrap health
test. Domain and network behavior are not implemented yet.

## Non-Goals

- real funds or Mainnet;
- CDF backing, redemption, stablecoin or official-currency claims;
- production custody, banking, mobile-money or KYC integration;
- Soroban, custom smart contracts or the Stellar Asset Contract;
- a production API, web UI, database, deployment or high availability;
- legal, regulatory, security or product-market validation.

## Architecture

The technical source of truth is under [`docs/architecture/`](docs/architecture/).
Research, ADR and prototype build records are maintained separately under
`docs/`.

## Requirements

- Node.js 24.x
- npm 11.x
- Git for repository operations

## Installation

```bash
npm ci
```

## Configuration

INC-01 requires no active RPC connection or secret. For later local
experiments, copy `.env.example` to `.env` and replace placeholders only with
disposable Testnet configuration. `.env` is ignored by Git.

Never use a Mainnet or value-bearing private key.

## Run

```bash
npm run health
```

The command compiles the minimal source and prints safe project/runtime/config
metadata. It performs no network call.

## Test

```bash
npm test
npm run typecheck
npm run verify
```

`npm run verify` runs deterministic local checks only. Live Testnet tests will
use a separate explicit command in a later increment.

## Evidence

INC-01 evidence consists of observed command exit codes, test counts, runtime
versions, the dependency lockfile, tracked-file inventory, security scan and Git
commit metadata. Generated runtime evidence directories remain ignored until a
future explicit review/export step.

## Security

No real secret, mnemonic, credential, personal data or value-bearing key belongs
in this repository. See [`SECURITY.md`](SECURITY.md). The health command never
prints environment values or secret material.

## Limitations

This foundation does not establish that a user problem is validated, that
Stellar is necessary, that a payment has executed, or that eCDF is production
ready, legally permissible, secure, scalable or economically viable.

## Disclaimer

eCDF is a technology research prototype. It is not an official currency, CBDC,
bank, payment service, investment product, deposit or claim on Congolese francs.
Testnet assets have no represented monetary value.
