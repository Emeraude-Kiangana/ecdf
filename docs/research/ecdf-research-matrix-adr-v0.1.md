# P03 — eCDF

## RESEARCH MATRIX v0.1 + ARCHITECTURE DECISION REGISTER v0.1

**Milestone:** P03-M01 — Whitepaper + Architecture v0.1  
**Cycle:** 2 — Research before architecture commitment  
**Date:** 2026-09-16  
**Evidence status:** Candidate artifacts only; not registered as Evidence Records  
**Truth vocabulary:** KNOWN / VERIFIED / CLAIMED / ASSUMPTION / RESEARCH REQUIRED / EXPERIMENT REQUIRED / DECIDED / REJECTED / UNKNOWN

## Executive finding

**KNOWN:** P03 targets a technology prototype, not a production financial system.  
**VERIFIED:** Stellar offers accounts, transactions, issued assets, trustlines, multisignature, sponsorship, smart contracts, a Stellar Asset Contract (SAC), RPC, Horizon and test networks. These are capabilities, not proof of product–problem fit.  
**ASSUMPTION:** eCDF may address a Congolese need involving verifiable transfer or representation of value. No user segment, current workflow, pain metric or field evidence has yet been established.  
**DECIDED:** Real funds, a fiat claim, production custody and claims of regulatory compliance remain out of scope for prototype v0.1.  
**RESEARCH REQUIRED:** The problem, user and legal perimeter must be established before selecting a ledger or defining an asset.  
**EXPERIMENT REQUIRED:** Compare one identical test-value transfer implemented centrally and on Stellar Testnet.  

**Cycle 2 conclusion:** architecture commitment is premature. The defensible output is a bounded option set, reversible ADRs and minimum experiments.

---

# 1. RESEARCH MATRIX v0.1

| ID | Question | Why it matters | Current status | Evidence/source | Decision impact | Next verification | Whitepaper impact |
|---|---|---|---|---|---|---|---|
| RQ-eCDF-001 | What precise observable problem does eCDF solve? | Determines whether a prototype deserves to exist. | **UNKNOWN / RESEARCH REQUIRED** | Cycle 1 contains only a broad hypothesis; no user or field artifact. | Blocks architecture selection. | Conduct 5–8 problem interviews and document one current workflow. | Problem, Scope |
| RQ-eCDF-002 | Who is the first user/actor? | Needs, trust and custody differ radically by actor. | **UNKNOWN** | No verified user or partner. | Blocks UX, identity, custody and requirements. | Select one segment and reject all others for v0.1. | Problem, Actors |
| RQ-eCDF-003 | What friction is observable and measurable? | Prevents vague “financial inclusion” claims. | **UNKNOWN** | No time, cost, failure-rate or access evidence. | Blocks success criteria. | Baseline current time/cost/steps/errors using field or authoritative data. | Problem, Risks |
| RQ-eCDF-004 | What is the technology-testable core? | Separates a prototype from policy or adoption problems. | **PROPOSED**: intent → authorization → valid state change → verifiable result. | Internal Cycle 1 specification; not tested. | Defines a narrow experiment, not a product. | Implement the same flow in two architectures. | Prototype |
| RQ-eCDF-005 | Is blockchain necessary? | A ledger adds keys, public data, fees and operational dependencies. | **ASSUMPTION / EXPERIMENT REQUIRED** | No comparative prototype exists. | Blocks final ledger decision. | Run EXP-eCDF-001 and score trust/auditability/settlement/cost/failure modes. | Architecture, Risks |
| RQ-eCDF-006 | Which parties cannot rely on one operator? | Distributed consensus matters only if independent verification/shared state is required. | **UNKNOWN** | No actor or governance evidence. | Determines whether central or shared ledger is warranted. | Map actors and dispute/failure scenarios. | Architecture, Trust |
| RQ-eCDF-007 | Is independent public auditability required? | Public auditability may justify a ledger but creates privacy exposure. | **UNKNOWN** | Stellar is public; transactions are observable. | Determines data placement. | Define who must verify what, and whether a signed receipt suffices. | Security, Architecture |
| RQ-eCDF-008 | Is irreversible/shared settlement required? | Settlement semantics drive the architecture. | **UNKNOWN** | The term “settlement” is not defined for eCDF. | Blocks state and asset model. | Define finality, correction, reversal and dispute requirements. | Architecture, Asset Model |
| RQ-eCDF-009 | If a ledger is justified, why Stellar? | Avoids ecosystem-first selection. | **PROPOSED / NOT DECIDED** | Stellar officially supports asset issuance/transfer, application SDKs, contracts and ecosystem protocols. | Stellar remains a candidate. | Compare only against required capabilities after RQ-001–008. | Stellar Integration |
| RQ-eCDF-010 | Can Stellar Classic primitives implement the test flow without a custom contract? | Avoids unnecessary Soroban complexity and contract risk. | **PROBABLE / EXPERIMENT REQUIRED** | Official docs describe accounts, assets, payments and transaction authorization. | May eliminate custom contract. | Execute a two-account Testnet payment and capture receipt/error cases. | Stellar Integration, Prototype |
| RQ-eCDF-011 | Is Soroban/custom contract logic necessary? | Contracts add code, authorization, storage, metering and audit burden. | **UNDECIDED** | No rule exists beyond ordinary transfer yet. | Default must be “not needed until proven.” | Specify one rule impossible or unsafe with Classic operations; otherwise reject. | Architecture, Security |
| RQ-eCDF-012 | Is a Stellar Asset Contract needed? | SAC is relevant only when contracts must interact with a Stellar asset. | **NOT NEEDED for baseline / RESEARCH REQUIRED later** | Official SAC docs: SAC exposes Stellar assets to contracts and shares the same underlying asset. | Excluded from minimal Classic prototype. | Revisit only if a Soroban contract is justified. | Stellar Integration |
| RQ-eCDF-013 | RPC, Horizon or local index? | Determines data access, history and operational dependency. | **PROPOSED**: use RPC for current network access; no historical index initially. | Official docs: RPC has a bounded recent history and is not a primary backend; Horizon provides indexed HTTP data. | Avoids premature ingestion infrastructure. | Validate exact calls needed by the prototype. | Architecture, Stellar Integration |
| RQ-eCDF-014 | What network constraints and fees apply? | Costs and limits can invalidate workflows. | **VERIFIED DYNAMIC / EXPERIMENT REQUIRED** | Official docs direct builders to real-time Network Limits or `stellar network settings`. | No fixed fee/limit claims in Whitepaper. | Record settings and actual fee/resource use in each test run. | Risks, Prototype, References |
| RQ-eCDF-015 | What wallet/custody pattern is appropriate? | Key control defines ownership, recovery and liability. | **DECIDED for v0.1:** test-only non-custodial local signer; **UNKNOWN** for production. | Official docs enumerate non-custodial, custodial, mixed/multisig and third-party patterns. | Removes custody service from prototype. | Test local key loss and signer separation; never store real value. | Security, Prototype |
| RQ-eCDF-016 | Does the prototype require an issued asset? | Asset issuance creates issuer, supply, permissions and legal questions. | **UNDECIDED** | A payment flow can use XLM Testnet or a test asset; neither establishes a real claim. | Prefer test token only if issuance semantics are being tested. | Compare XLM Testnet vs clearly named nonredeemable test asset. | Asset Model, Compliance Questions |
| RQ-eCDF-017 | What must be on-chain? | Minimizes privacy, cost and irreversible exposure. | **DECIDED principle:** only authorization result and minimum settlement facts if ledger option is tested. | Stellar is public; privacy features do not make ordinary ledger data private. | PII and business documents stay off-chain. | Perform data-classification review before coding. | Security, Architecture |
| RQ-eCDF-018 | What is the minimum state machine? | Prevents ambiguous success and replay. | **PROPOSED**: DRAFT → AUTHORIZED → SUBMITTED → SETTLED or FAILED. | Internal design; not tested. | Defines idempotency and receipts. | Test success, rejection, duplicate submission and timeout. | Architecture, Prototype |
| RQ-eCDF-019 | Are Stellar ecosystem protocols (SEPs) needed? | SEPs can support wallet/anchor interoperability but add actors and compliance flows. | **NOT NEEDED for baseline / RESEARCH REQUIRED for ramps** | Official docs identify SEP-10/12/24/31/38 for wallet–anchor flows. | Excludes anchors and fiat ramps from v0.1. | Revisit only after a real fiat on/off-ramp use case exists. | Stellar Integration, Compliance Questions |
| RQ-eCDF-020 | What legal regimes apply in the DRC and elsewhere? | Technical capability does not establish legal permissibility. | **UNKNOWN / RESEARCH REQUIRED** | No current primary-source legal opinion or verified perimeter in P03. | Blocks real issuance, custody, redemption and public deployment. | Engage qualified DRC counsel and obtain current official texts/authority guidance. | Compliance Questions |

## Why blockchain? Comparative matrix

| Criterion | Option A — Centralized | Option B — Distributed ledger | Option C — Hybrid |
|---|---|---|---|
| Trust | Operator controls canonical state. | Network consensus controls ledger validity; issuer/admin may still be trusted. | Operator controls private/business state; ledger anchors minimal shared settlement. |
| Auditability | Logs/receipts can be audited if operator evidence is trusted. | Shared public record enables independent verification of on-chain facts. | Public verification only for anchored facts; off-chain claims still require trust. |
| Settlement | Database commit; external money movement remains separate. | Native ledger settlement for on-chain assets only. | Ledger settlement plus off-chain workflow/reconciliation. |
| Interoperability | API-specific. | Protocol/SDK/account/asset interoperability, subject to counterparties. | APIs internally; ledger at the boundary. |
| Complexity | Lowest for prototype. | Keys, fees, account reserves, providers, public data and failure handling. | Highest integration complexity, but can minimize data exposure. |
| Operational cost | Hosting, database, security and audit. | Network fees plus RPC/provider/indexing and key operations. | Both sets of costs. |
| Custody | Conventional account/auth model; no blockchain key required. | Non-custodial or custodial key model required. | Can isolate keys to settlement component. |
| Failure modes | Operator outage/compromise, database tampering, vendor lock-in. | Key loss, bad signatures, network/provider outage, irreversible error, protocol change. | Reconciliation divergence, dual-system partial failure, plus both categories. |
| Current verdict | **VALID CANDIDATE** | **EXPERIMENT REQUIRED** | **VALID CANDIDATE, likely premature for baseline** |

No option is selected. A ledger becomes justified only if independent verification/shared settlement across parties materially outweighs added complexity.

---

# 2. STELLAR CAPABILITY MATRIX

| Capability | Needed? | Native / contract / off-chain | Evidence | Decision |
|---|---|---|---|---|
| Accounts | **NEEDED** only for Stellar experiment | Native | Official application docs | Use two test accounts. |
| Payments / transactions | **NEEDED** | Native | Official docs support signed asset transfer. | Baseline ledger operation. |
| Issued assets | **UNDECIDED** | Native | Stellar accounts can issue assets. | Do not issue a real or fiat-linked asset. |
| Trust relationships / trustlines | **UNDECIDED** | Native | Issued-asset balances use trustlines; XLM does not. | Needed only if a classic test asset is used. |
| Signatures | **NEEDED** | Native/wallet | Custody and transaction signing are core wallet functions. | Explicit user authorization required. |
| Multi-signature | **NOT NEEDED** baseline | Native | Stellar supports multisig/recovery patterns. | Defer until a multi-role rule exists. |
| Sponsorship | **NOT NEEDED** baseline | Native | Sponsored reserves can shift reserve burden. | Revisit only for onboarding UX tests. |
| Smart contracts / Soroban | **NOT NEEDED** baseline; **RESEARCH REQUIRED** later | Contract | No custom rule yet. | Avoid contract deployment in first experiment. |
| Stellar Asset Contract | **NOT NEEDED** baseline | Built-in contract | SAC lets contracts use Stellar assets. | Relevant only with Soroban logic. |
| Contract events | **NOT NEEDED** baseline | Contract | Relevant to contract observability. | Defer with Soroban. |
| RPC | **NEEDED** for Stellar experiment | Infrastructure/API | Official RPC is preferred starting point for new builders; bounded history. | Use hosted Testnet endpoint initially; treat provider as dependency. |
| Horizon | **UNDECIDED / probably NOT NEEDED** | Infrastructure/API | Horizon supplies indexed HTTP resources/history. | Use only if a required query is absent/awkward in RPC. |
| Local index/database | **NOT NEEDED** baseline | Off-chain | RPC docs recommend ingesting only needed data. | Add only if history/analytics require it. |
| Testnet | **NEEDED** | Network | Official network environment. | No Mainnet/funds. |
| Wallet UI | **UNDECIDED** | Client/off-chain | Wallet SDK and Freighter patterns exist. | CLI/local signer is enough for first technical experiment. |
| Custody service | **NOT NEEDED / REJECTED for v0.1** | Off-chain service | Custody creates key and liability burden. | No server-side user keys. |
| Anchor / ramps / SEP flows | **NOT NEEDED** baseline | Off-chain + protocol | SEPs support anchor/wallet interoperability. | Defer until fiat conversion is a validated need. |

**Source/date/limitation note:** Sources were accessed **2026-09-16**. Official documentation confirms capabilities, not suitability, availability from the DRC, legal permission, costs at a future date, or production security.

---

# 3. MINIMAL ON-CHAIN ANALYSIS

| Item | On-chain? | Rationale | Privacy impact | Cost impact | Trust impact | Status |
|---|---|---|---|---|---|---|
| Test transfer amount/asset | **MAYBE** | Required only to test ledger settlement. | Public/linkable. | Fee/reserve may apply. | Independently verifiable. | **EXPERIMENT REQUIRED** |
| Sender/recipient ledger addresses | **MAYBE** | Native transaction identifiers. | Public and linkable. | Low direct storage; account reserves may apply. | Reduces reliance on backend receipt. | **EXPERIMENT REQUIRED** |
| Transaction hash/status | **YES** if Stellar option | Minimum verifiable receipt. | Public reference. | Included in transaction lifecycle. | Strong evidence of ledger inclusion, not real-world meaning. | **PROPOSED** |
| Internal operation ID | **MAYBE** | Correlation may aid reconciliation. | Can enable cross-dataset linking. | Memo/storage overhead. | Helps auditability. | **RESEARCH REQUIRED**; use random non-PII value only. |
| User name, phone, email, national ID | **NO** | Not required for settlement. | Severe irreversible exposure/linkability. | Unnecessary. | Ledger cannot validate identity truth. | **DECIDED OFF-CHAIN** |
| KYC documents/results | **NO** | Sensitive and mutable. | Severe. | High storage/privacy burden. | Must remain with authorized processor. | **DECIDED OFF-CHAIN** |
| Authentication secrets/private keys | **NO** | Secrets must never be public. | Catastrophic. | N/A. | Exposure destroys authorization model. | **DECIDED NEVER ON-CHAIN** |
| Business documents/invoices | **NO** | Not needed for base transfer. | Commercial/personal leakage. | Unnecessary. | Off-chain signature/hash may suffice. | **DECIDED OFF-CHAIN** |
| Document hash | **MAYBE** | Useful only if later integrity verification is required. | Can leak existence/timing; weak entropy documents may be guessable. | Extra transaction/storage. | Proves commitment, not truth or ownership. | **RESEARCH REQUIRED** |
| UI logs, IP/device data, error traces | **NO** | Operational data. | Sensitive/linkable. | Unnecessary. | Central logging control required. | **DECIDED OFF-CHAIN** |
| Legal/compliance decision | **NO** baseline | Contextual and correctable. | Sensitive. | Unnecessary. | Must be auditable off-chain. | **DECIDED OFF-CHAIN** |

**Minimum absolute footprint:** for a Stellar experiment, one test transaction containing only protocol-required addresses, test amount/asset and resulting transaction identifier. Everything else remains off-chain unless a separately documented reason survives privacy and cost review.

## Data classification

- **PUBLIC DATA:** test account addresses, transaction hash, ledger status, test amount/asset when placed on Testnet.
- **PRIVATE DATA:** user profile, contact data, internal operation mapping, support records.
- **SENSITIVE DATA:** private keys, authentication/recovery material, identity/KYC documents, risk flags, precise personal financial history.
- **OFF-CHAIN DATA:** all private/sensitive data, application logs, consents, legal records, workflow details.
- **ON-CHAIN REFERENCES:** only randomized operation identifiers or hashes whose necessity and linkage risk have been reviewed.

---

# 4. ASSET MODEL STATUS

**STATUS: RESEARCH REQUIRED — no asset model selected.**

| Dimension | Current statement | Status |
|---|---|---|
| Purpose | Provide test value for a transfer/settlement experiment. | **PROPOSED** |
| Representation | Either Testnet XLM or an explicitly nonredeemable test asset. | **EXPERIMENT REQUIRED** |
| Issuance | If a test asset is used, a dedicated test issuer account. | **PROPOSED** |
| Redemption | None. No claim on CDF, fiat, deposit, commodity or institution. | **DECIDED for v0.1** |
| Supply | Arbitrary test supply with documented mint amount; no economic meaning. | **PROPOSED** |
| Transfer | Between two controlled test participants only. | **PROPOSED** |
| Control | Test issuer keys can issue/configure; exact flags remain part of experiment design. | **RESEARCH REQUIRED** |
| Backing | None. Experimental only. | **DECIDED for v0.1** |

**Naming constraint:** do not label the prototype token “digital Congolese franc,” “CDF-backed,” “stablecoin,” “deposit” or “official currency.” A safe provisional name is `eCDF-TEST`, accompanied by a nonredeemable/no-value notice; even that name should be reviewed for confusion risk.

## State model v0.1

`DRAFT → AUTHORIZED → SUBMITTED → SETTLED`  
Alternative terminal states: `REJECTED` before submission; `FAILED` after submission.

| From | To | Trigger | Actor | Validation | Failure | Record |
|---|---|---|---|---|---|---|
| DRAFT | AUTHORIZED | Explicit signature/approval | Sender/test signer | Payload, recipient, amount, network and expiry shown | User rejects/invalid key | Off-chain intent + signature metadata |
| AUTHORIZED | SUBMITTED | Broadcast | Client/backend adapter | Signature, sequence/idempotency, network | RPC unavailable/rejected transaction | Off-chain attempt ID |
| SUBMITTED | SETTLED | Ledger confirms success | Stellar network + observer | Transaction result/hash and expected balance/state | Timeout or failed result | On-chain transaction + local receipt |
| DRAFT | REJECTED | User declines or validation fails | User/application | No submission occurred | N/A | Minimal off-chain audit event |
| SUBMITTED | FAILED | Definitive network failure | Network/adapter | Error classified; no false settlement | Ambiguous timeout needs reconciliation | Off-chain error + queried network status |

No `REVERSED` state is defined: correction semantics depend on the future use case and cannot be assumed.

---

# 5. TRUST MODEL v0.1

| Actor / component | Trusted for | Must not be trusted for | Failure impact | Mitigation |
|---|---|---|---|---|
| User | Approving an accurately displayed test intent | Protecting system-wide integrity or validating legal status | Wrong recipient/amount; key loss | Clear signing screen, test-only values, confirmation, recovery research |
| Application UI | Rendering intent and result | Holding secrets or declaring settlement without verification | Deceptive signing/data leakage | No secret logging; verify network result independently |
| Backend/adapter | Submission, correlation and controlled logging | Unilateral creation of user authorization | Censorship, tampering, outage | Signed payloads, least privilege, idempotency, audit logs |
| Wallet/local signer | Protecting key and producing signature | Determining business/legal validity | Unauthorized transfer or permanent loss | Test keys only, isolated storage, explicit transaction display |
| Issuer account (if used) | Test issuance/configuration | Claiming real backing/value | Invalid supply/permissions | Dedicated test issuer, no real backing claims, documented flags |
| RPC provider | Relaying/querying recent network data | Being the sole source of historical truth | False/stale response or outage | Query transaction hash; optional second endpoint in test |
| Horizon/indexer | Indexed history if adopted | Consensus validity | Missing/truncated history | Treat as derived data; verify ledger result when critical |
| Stellar validators/network | Protocol consensus and transaction result | Real-world identity, asset backing or legal compliance | Settlement unavailable/reorg-like assumption failure/protocol issue | Testnet, timeout/reconciliation, documented network assumptions |
| Administrator | Test configuration | Signing user transfers or reading secrets | Privilege abuse | Separate roles, least privilege, no admin custody |
| Smart contract | Enforcing coded rules if later used | Correctness beyond tested code | Systemic repeated bug | Avoid in baseline; tests, review, upgrade/admin analysis later |
| External API/oracle | Supplying defined external data | Truth beyond source/availability | Manipulated decisions | No oracle in baseline; signed provenance and fallback if added |

## Key-management position

- **DECIDED for v0.1:** two dedicated Testnet keys; signing occurs locally/client-side; backend never receives a secret key.
- **DECIDED:** no real funds and no production custody.
- **RESEARCH REQUIRED:** wallet choice, secure storage UX, recovery, rotation and compromised-key response.
- **NOT NEEDED now:** institutional custody, MPC, HSM and multisig operations.
- **Actions requiring signature:** account creation funding authorization where applicable, trustline creation if a test asset is used, and transfer submission.
- **Loss/compromise outcome in prototype:** abandon and recreate the test account; document the scenario. This is not an acceptable production recovery design.

---

# 6. TOP THREATS — THREAT MATRIX v0.1

Likelihood is intentionally qualitative and unknown without implementation and operational data.

| Threat | Asset affected | Likelihood knowledge | Impact | Mitigation hypothesis | Test required |
|---|---|---|---|---|---|
| Key theft | Signing authority/test balances | **UNKNOWN** | High; unauthorized transfer | Local-only keys, no logs, test funds | Secret scanning; attempt unauthorized signing |
| Unauthorized signing / misleading UI | User authorization | **UNKNOWN** | High | Human-readable intent, network/amount/recipient confirmation | Tampered payload/signature mismatch test |
| Replay / duplicate submission | Balance and state consistency | **UNKNOWN** | Medium–High | Sequence handling, idempotency key, transaction-status reconciliation | Submit identical intent twice |
| Privilege escalation | Issuer/admin/backend control | **UNKNOWN** | High | Role separation, least privilege | Negative permission tests |
| Contract bug | Contract state/assets | **N/A baseline** | Potentially high | Do not use Soroban without necessity; unit/property tests later | Only if contract option advances |
| Invalid asset issuance/configuration | Supply/transferability | **UNKNOWN** | High for a real asset; medium test-only | Dedicated test issuer; assert flags/supply | Mint/authorization/clawback configuration tests |
| Backend compromise | Submission, metadata, availability | **UNKNOWN** | High | No custody, signed intents, minimal data, hardened secrets | Modify recipient/amount server-side |
| RPC/API manipulation or outage | Status, submission, user confidence | **UNKNOWN** | Medium–High | Timeouts, transaction-hash verification, optional second provider | Stale response/outage/contradictory endpoint tests |
| Data leakage | Identity, metadata, financial graph | **UNKNOWN** | High | No PII on-chain; data minimization and redaction | Log review and privacy test |
| Dependency/protocol change | Build/runtime/network behavior | **UNKNOWN** | Medium | Pin versions, record network/protocol settings, CI | Rebuild and rerun from clean environment |

---

# 7. ARCHITECTURE OPTIONS

## OPTION A — Centralized evidence prototype

**DESCRIPTION:** Web/CLI client signs in conventionally; backend validates an intent and commits a double-entry-like test ledger in a database; receipt is signed by the service.  
**ON-CHAIN COMPONENTS:** None.  
**OFF-CHAIN COMPONENTS:** UI/CLI, authentication, API, deterministic transaction service, database, audit log.  
**TRUST MODEL:** Operator is canonical state authority; users trust the operator’s integrity and availability.  
**ADVANTAGES:** Lowest complexity; private-by-default; easiest to change; clean baseline for comparison.  
**LIMITATIONS:** No independent public settlement; operator can censor/alter state unless externally audited.  
**OPEN QUESTIONS:** Is a signed/audited receipt sufficient for the validated user problem?  
**PROTOTYPE COMPLEXITY:** LOW.

## OPTION B — Stellar Classic minimal prototype

**DESCRIPTION:** Two Testnet accounts perform a test-value payment using native Stellar transaction primitives; local signer authorizes; RPC submits/queries; application stores only correlation and test results.  
**ON-CHAIN COMPONENTS:** Test accounts, one payment transaction, optional classic test asset/trustlines.  
**OFF-CHAIN COMPONENTS:** CLI/minimal UI, local signer, RPC adapter, minimal receipt store.  
**TRUST MODEL:** Network validates ledger state; user controls test key; RPC is a data/submission dependency but not settlement authority.  
**ADVANTAGES:** Tests shared verifiable settlement with minimal custom code; no smart contract.  
**LIMITATIONS:** Public metadata, key UX, reserves/fees, provider/network dependencies; does not validate real backing or compliance.  
**OPEN QUESTIONS:** Does independent settlement produce value unavailable from a signed centralized receipt? Is an issued asset needed?  
**PROTOTYPE COMPLEXITY:** MEDIUM.

## OPTION C — Hybrid anchored workflow

**DESCRIPTION:** Private application state and identity remain off-chain; only a minimal settlement transaction or randomized integrity commitment is anchored on Stellar.  
**ON-CHAIN COMPONENTS:** Minimal test settlement/hash reference.  
**OFF-CHAIN COMPONENTS:** Identity, business workflow, database, policy engine, reconciliation, monitoring.  
**TRUST MODEL:** Operator trusted for private/off-chain facts; Stellar trusted for anchored timestamp/state; linkage must be controlled.  
**ADVANTAGES:** Minimizes public data while retaining independently verifiable facts.  
**LIMITATIONS:** Dual-state reconciliation, more failure modes, hash does not prove real-world truth.  
**OPEN QUESTIONS:** Which fact requires public verification? How are partial failures repaired?  
**PROTOTYPE COMPLEXITY:** MEDIUM–HIGH.

**Selection status:** **DEFERRED.** Option A and B must be compared experimentally; Option C should not be built until a private workflow plus public verification need is demonstrated.

---

# 8. ADR REGISTER v0.1

## ADR-eCDF-001

**QUESTION:** Is production financial operation in scope for prototype v0.1?  
**STATUS:** **DECIDED**  
**OPTIONS:** Real-value production; test-only prototype.  
**DECISION:** Test-only prototype; no real funds, backing, redemption or production claims.  
**RATIONALE:** User problem, legal perimeter, asset model and security are unverified.  
**EVIDENCE:** P03 Cycle 1 scope; current research gaps.  
**CONSEQUENCES:** Findings cannot be presented as production readiness or legal compliance.  
**REVERSIBILITY:** MEDIUM.  
**REVIEW TRIGGER:** Verified problem evidence, legal review and security gates.  
**WHITEPAPER:** Scope, Compliance Questions, Risks.

## ADR-eCDF-002

**QUESTION:** Must eCDF use blockchain/Stellar?  
**STATUS:** **DEFERRED / EXPERIMENT REQUIRED**  
**OPTIONS:** Centralized; Stellar ledger; hybrid.  
**DECISION:** None. Compare Options A and B first.  
**RATIONALE:** No independently verified trust/settlement requirement exists.  
**EVIDENCE:** RQ-eCDF-001–009.  
**CONSEQUENCES:** Whitepaper must describe Stellar as candidate infrastructure, not a settled necessity.  
**REVERSIBILITY:** HIGH.  
**REVIEW TRIGGER:** EXP-eCDF-001 results and validated actor trust map.  
**WHITEPAPER:** Architecture, Stellar Integration.

## ADR-eCDF-003

**QUESTION:** Use Soroban/custom smart contracts in the baseline?  
**STATUS:** **REJECTED for baseline / DEFERRED generally**  
**OPTIONS:** Classic operations; custom contract; SAC plus contract.  
**DECISION:** Use no custom contract in the first Stellar experiment.  
**RATIONALE:** The current flow is an ordinary test transfer; no custom invariant is specified.  
**EVIDENCE:** Official Stellar capabilities and SAC scope.  
**CONSEQUENCES:** Lower code and audit surface; complex policy cannot be tested yet.  
**REVERSIBILITY:** HIGH.  
**REVIEW TRIGGER:** A validated rule cannot be implemented safely with Classic operations/off-chain checks.  
**WHITEPAPER:** Architecture, Stellar Integration, Security.

## ADR-eCDF-004

**QUESTION:** What data may go on-chain?  
**STATUS:** **DECIDED principle; item-level review remains**  
**OPTIONS:** Full workflow; hashes/references; minimum settlement facts.  
**DECISION:** Minimum settlement facts only; no PII, KYC, secrets or documents on-chain.  
**RATIONALE:** Stellar transaction data is public; permanence/linkability create privacy risk.  
**EVIDENCE:** Official Stellar privacy documentation; data classification.  
**CONSEQUENCES:** Off-chain data protection and reconciliation remain necessary.  
**REVERSIBILITY:** LOW for published data; therefore conservative by default.  
**REVIEW TRIGGER:** Completed privacy/data protection assessment for a specific field.  
**WHITEPAPER:** Security, Architecture, Compliance Questions.

## ADR-eCDF-005

**QUESTION:** What custody model applies to v0.1?  
**STATUS:** **DECIDED for prototype / DEFERRED for production**  
**OPTIONS:** Custodial backend; local non-custodial signer; multisig; third party.  
**DECISION:** Local non-custodial signing with disposable Testnet keys.  
**RATIONALE:** Avoids building a custody service before it is needed.  
**EVIDENCE:** Official Stellar custody model documentation.  
**CONSEQUENCES:** Recovery is intentionally limited; not representative of production UX.  
**REVERSIBILITY:** HIGH.  
**REVIEW TRIGGER:** Field requirements for assisted recovery or organizational control.  
**WHITEPAPER:** Security, Prototype.

## ADR-eCDF-006

**QUESTION:** Which Stellar data API is the baseline?  
**STATUS:** **PROPOSED**  
**OPTIONS:** RPC; Horizon; self-hosted indexer.  
**DECISION:** Start with RPC for current state/submission; add Horizon/indexing only for a demonstrated query/history requirement.  
**RATIONALE:** Official docs position RPC as the starting point for new builders but explicitly state it is not a historical indexer or primary backend.  
**EVIDENCE:** Stellar RPC and Horizon official documentation.  
**CONSEQUENCES:** Prototype cannot assume long history from RPC.  
**REVERSIBILITY:** HIGH.  
**REVIEW TRIGGER:** Required data cannot be obtained reliably through RPC or local receipts.  
**WHITEPAPER:** Architecture, Stellar Integration.

## ADR-eCDF-007

**QUESTION:** Is an eCDF asset already defined?  
**STATUS:** **DEFERRED**  
**OPTIONS:** No asset; Testnet XLM; nonredeemable test asset; future real-world claim.  
**DECISION:** No real asset. EXP-eCDF-003 will determine whether a test asset adds learning beyond Testnet XLM.  
**RATIONALE:** Purpose, issuer, redemption, supply, permissions and backing are unknown.  
**EVIDENCE:** Asset Model Status.  
**CONSEQUENCES:** No fiat equivalence or official-currency language.  
**REVERSIBILITY:** HIGH now; LOW after external issuance, hence deferral.  
**REVIEW TRIGGER:** Validated use case and legal review.  
**WHITEPAPER:** Asset Model, Compliance Questions.

---

# 9. EXPERIMENTS REQUIRED

## EXP-eCDF-001 — Centralized vs Stellar evidence test

**HYPOTHESIS:** Stellar provides materially better independent verification/shared settlement for the same test-value flow than a centralized signed receipt.  
**SETUP:** Implement one canonical intent schema; adapter A writes a centralized test ledger; adapter B submits a Stellar Testnet payment.  
**ACTION:** Execute success, rejection, duplicate, timeout and tampered-recipient cases.  
**OBSERVATION:** Steps, trust assumptions, latency, fees/resources, failure handling, privacy exposure and verification independence.  
**SUCCESS CRITERIA:** A named actor can verify a required fact without trusting the operator, and this benefit is relevant to the validated problem.  
**FAILURE CRITERIA:** The centralized receipt meets all validated requirements with lower risk/complexity, or the ledger benefit has no user value.  
**ARTIFACT PRODUCED:** Reproducible comparison report, source, test log, transaction hashes and decision scorecard.

## EXP-eCDF-002 — Minimal Stellar Classic transfer

**HYPOTHESIS:** The proposed state machine can be mapped reliably to a native Testnet transaction without Soroban.  
**SETUP:** Two disposable Testnet accounts, pinned SDK/CLI, local signer, recorded network settings.  
**ACTION:** Build/sign/submit/query one transfer; exercise invalid signature, insufficient balance, duplicate and provider outage.  
**OBSERVATION:** Protocol result codes, final state mapping, actual fee/limits and recovery behavior.  
**SUCCESS CRITERIA:** Every attempted transition ends as SETTLED, REJECTED, FAILED or explicitly unresolved and reconcilable; no secret reaches logs/backend.  
**FAILURE CRITERIA:** Ambiguous state cannot be reconciled or ordinary transfer cannot express the required rule.  
**ARTIFACT PRODUCED:** Script, README, version lock, redacted logs, network-settings snapshot and test report.

## EXP-eCDF-003 — Asset necessity test

**HYPOTHESIS:** A dedicated nonredeemable test asset teaches necessary issuance/permission behavior not provided by Testnet XLM.  
**SETUP:** Compare Testnet XLM flow against a clearly labeled test asset with documented issuer/trustline flags.  
**ACTION:** Issue, establish trust, transfer, attempt unauthorized/invalid operations, inspect balances.  
**OBSERVATION:** Added requirements, UX friction, control powers, reserve/fee effects and confusion risk.  
**SUCCESS CRITERIA:** A validated requirement specifically depends on issuer-controlled asset semantics.  
**FAILURE CRITERIA:** Testnet XLM adequately tests the core hypothesis or the test asset only adds narrative value.  
**ARTIFACT PRODUCED:** Asset configuration manifest, test transactions and go/no-go note.

## EXP-eCDF-004 — Privacy and metadata inspection

**HYPOTHESIS:** The minimum on-chain transaction exposes no direct personal data and acceptable metadata for a test-only flow.  
**SETUP:** Synthetic identities only; ledger explorer/API review plus application logs.  
**ACTION:** Trace every stored field from UI to ledger/log/database; attempt cross-linking via operation IDs.  
**OBSERVATION:** Public, private and sensitive fields; linkage paths; retention.  
**SUCCESS CRITERIA:** No PII/secret enters ledger or logs, and every public field has a documented necessity.  
**FAILURE CRITERIA:** Direct/indirect personal data or secret material leaks, or a public field lacks justification.  
**ARTIFACT PRODUCED:** Data-flow map, classification table and leakage test report.

---

# 10. REGULATORY QUESTIONS — NOT LEGAL CONCLUSIONS

Technical architecture and legal permissibility are separate. The following are questions for qualified counsel and current primary sources.

| ID | Question | Why it matters | Jurisdiction | Source required | Current status |
|---|---|---|---|---|---|
| REG-eCDF-001 | Would any proposed token/claim qualify as currency, electronic money, deposit, payment instrument, security or another regulated asset? | Determines authorization and prohibited representations. | DRC; others if cross-border | Current DRC statutes, regulations, BCC guidance, legal opinion | **UNKNOWN / RESEARCH REQUIRED** |
| REG-eCDF-002 | Who may issue, distribute, redeem or guarantee such value? | Defines issuer eligibility/liability. | DRC | BCC/competent authority texts + counsel | **UNKNOWN / RESEARCH REQUIRED** |
| REG-eCDF-003 | Do wallet, custody or key-recovery services require licensing/approval? | Custody changes obligations and liability. | DRC; provider jurisdictions | Official licensing rules + counsel | **UNKNOWN / RESEARCH REQUIRED** |
| REG-eCDF-004 | Which AML/CFT, customer identification, sanctions and recordkeeping duties attach to the chosen actors/flows? | Affects onboarding and monitoring. | DRC; cross-border counterparties | Current competent-authority/FATF materials + counsel | **UNKNOWN / RESEARCH REQUIRED** |
| REG-eCDF-005 | What rules govern fiat conversion, redemption and reserves? | Critical for any backing claim. | DRC | BCC and applicable banking/payment rules | **UNKNOWN / RESEARCH REQUIRED** |
| REG-eCDF-006 | What consumer disclosures, error resolution and complaint rules apply? | Irreversible transfers can harm users. | DRC | Consumer/payment law and regulator guidance | **UNKNOWN / RESEARCH REQUIRED** |
| REG-eCDF-007 | Which personal-data and cybersecurity requirements apply, including cross-border hosting? | Architecture processes identity and financial metadata. | DRC; hosting jurisdictions | Current DRC digital/data law and authority guidance | **UNKNOWN / RESEARCH REQUIRED** |
| REG-eCDF-008 | Are public-ledger addresses/transaction metadata personal data in the intended context? | Determines lawful basis, minimization and rights handling. | DRC; possibly other jurisdictions | Data-protection authority/counsel | **UNKNOWN / RESEARCH REQUIRED** |
| REG-eCDF-009 | What reporting, audit, tax and accounting treatment applies? | Impacts operator/issuer obligations. | DRC | Tax/accounting authorities + counsel | **UNKNOWN / RESEARCH REQUIRED** |
| REG-eCDF-010 | Do cross-border transfers trigger exchange-control, remittance or foreign-payment rules? | May prohibit or license the core flow. | DRC + corridor countries | Central banks/remittance rules + counsel | **UNKNOWN / RESEARCH REQUIRED** |
| REG-eCDF-011 | Can the name “eCDF” or product language imply official status or fiat equivalence? | Misrepresentation/confusion risk. | DRC | Currency/trademark/consumer rules + counsel | **UNKNOWN / RESEARCH REQUIRED** |

**Boundary:** No legal conclusion is made. Prototype testing with valueless Testnet artifacts does not itself prove exemption or future permissibility.

---

# 11. RESEARCH GAPS

1. **Problem evidence gap — CRITICAL:** no verified user, workflow, friction, baseline metric or alternative analysis.
2. **Actor/trust gap — CRITICAL:** no identified parties that require shared settlement or independent verification.
3. **Legal-source gap — CRITICAL:** no current primary DRC legal corpus or qualified legal review has been incorporated.
4. **Asset-purpose gap — CRITICAL:** no justified reason for an issued asset, issuer, redemption or backing.
5. **Field accessibility gap:** availability/usability of wallets, RPC providers, connectivity and devices in the target context is untested.
6. **Cost/limits gap:** live network settings and actual transaction resource use have not been measured; they are dynamic.
7. **Security implementation gap:** no code, threat validation, dependency manifest, key-handling test or review exists.
8. **Privacy gap:** no formal data-flow diagram or applicable data-protection analysis exists.
9. **Operations gap:** provider outage, reconciliation, monitoring, recovery and incident handling remain untested.
10. **SCF-fit gap:** technical ecosystem fit cannot substitute for problem evidence, prototype evidence or beneficiary validation.

---

# 12. ONE NEXT ACTION

## NEXT → P03-M01-A01 — Problem Evidence Sprint

Before implementing the Stellar experiment, choose **one** candidate Congolese workflow and produce:

1. one exact user segment;
2. one current end-to-end workflow;
3. 5–8 documented problem interviews or equivalent authoritative evidence;
4. baseline time, cost, steps, failures and trust dependencies;
5. existing alternatives;
6. one falsifiable problem statement v0.2;
7. one explicit answer to: **which fact must be independently verified or settled across parties?**

**Go condition for EXP-eCDF-001:** the evidence identifies a specific trust/auditability/settlement requirement that a centralized signed receipt may not satisfy.  
**No-go condition:** evidence does not establish a material problem or a shared-verification need; in that case, keep eCDF centralized or redefine the problem rather than forcing Stellar.

---

# Source Register

All sources accessed **2026-09-16**.

| Source | Claim supported | Limitation |
|---|---|---|
| [Stellar Developer Docs — Application Overview](https://developers.stellar.org/docs/build/apps/overview) | Stellar provides application primitives; assets and anchor-related SEPs exist. | Capability documentation, not product fit or legal approval. |
| [Stellar Developer Docs — Application Design Considerations](https://developers.stellar.org/docs/build/apps/application-design-considerations) | Custody options, key control, multisig/recovery and account creation considerations. | General guidance; prototype must test selected SDK/wallet behavior. |
| [Stellar Developer Docs — Stellar Asset Contract](https://developers.stellar.org/docs/tokens/stellar-asset-contract) | SAC is a built-in interface enabling contracts to interact with Stellar assets; same underlying asset; trustline/contract balances. | Protocol behavior can evolve; record network/protocol version during experiments. |
| [Stellar Developer Docs — RPC](https://developers.stellar.org/docs/data/apis/rpc) | RPC is the starting point for new builders, has bounded recent history and is not a primary backend/indexer. | Provider retention/availability varies. |
| [Stellar Developer Docs — Horizon](https://developers.stellar.org/docs/data/apis/horizon) | Horizon exposes indexed HTTP data and submission/query functions; hosted history can be truncated. | Provider-specific retention and availability. |
| [Stellar Developer Docs — Resource Limits & Fees](https://developers.stellar.org/docs/networks/resource-limits-fees) | Current limits/fees must be queried in Stellar Lab or CLI. | Deliberately does not establish a permanent numeric cost. |
| [Stellar Developer Docs — Privacy on Stellar](https://developers.stellar.org/docs/build/apps/privacy) | Ordinary ledger activity is public; privacy features/previews have explicit limitations. | Preview features are not a baseline production control. |
| [Stellar Developer Docs — Security Best Practices](https://developers.stellar.org/docs/build/security-docs) | Threat modeling and web security are required; checklists do not guarantee security. | Not an audit or implementation-specific assurance. |

## Evidence policy

This document is a real candidate artifact only after it is saved/versioned. It is **not** automatically an Evidence Record. Maximum current semantic level: **L1 — ARTIFACT** after registration. No claim of **L2 — TESTED** is permitted until the experiments produce reproducible test artifacts.
