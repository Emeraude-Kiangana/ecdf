# BUILD LOG

## Session 2026-09-17 — INC-01

**DATE:** 2026-09-17  
**INCREMENT:** INC-01 — Repository Foundation  
**TASKS:** Created repository foundation; installed locked dependencies; ran typecheck, bootstrap tests and health command; corrected two observed bootstrap defects; created minimal CI; performed manual secret-pattern and environment checks.  
**FILES CHANGED:** `.env.example`, `.github/workflows/verify.yml`, `.gitignore`, `LICENSE`, `README.md`, `SECURITY.md`, documentation under `docs/`, `package.json`, `package-lock.json`, `src/index.ts`, `tests/bootstrap.test.ts`, `tsconfig.json`, `vitest.config.ts`.  
**TESTS RUN:** `npm ci --ignore-scripts`; `npm run verify`; dependency inventory; package-lock SHA-256; manual secret-pattern scan; `.env` absence and placeholder validation.  
**RESULT:** PASSED after fix loop. Final `npm run verify` exit status 0; 1 test file and 3 tests passed; health status `ok`.  
**FIX LOOP:** First failure—Node types not loaded; fixed with `types: ["node"]`. Second failure—health script expected `dist/index.js`; fixed to `dist/src/index.js`. A later successful run exposed duplicate compiled tests; fixed with explicit Vitest include/exclude.  
**SECURITY RESULT:** No private-key-shaped, AWS-key-shaped, bearer-token-shaped or assigned password/API-key value found by the bounded scan. `.env` absent; `.env.example` contains an invalid placeholder. This is not a full security audit.  
**DEPENDENCY RESULT:** `@stellar/stellar-sdk@17.1.0`, `@types/node@22.20.3`, `typescript@7.0.2`, `vitest@5.0.1` installed. Lockfile SHA-256: `40530bbc13ab057bda77d9033879c8b7c4e95691c1c8d773058182126f4814d6`.  
**DEPENDENCY AUDIT:** `npm audit --omit=dev --json` exited 0 and reported 0 known vulnerabilities across all severities at execution time. This is a time-bounded registry result, not a security guarantee.  
**GIT:** Local repository initialized on `main`; no remote configured. Files staged after bounded security review. Standard Markdown hard-break spaces in imported documents make a strict whole-tree `git diff --check` noisy; this is documentation formatting, not source-code whitespace.  
**BLOCKERS:** Commit identity (`user.name` and `user.email`) is not configured. Remote repository remains UNKNOWN. Cycle 1 standalone Foundation Spec remains DOCUMENT EXPORT REQUIRED. Apache-2.0 requires owner confirmation before public publication.  
**COMMIT ATTEMPT:** `git commit -m "chore(repo): bootstrap eCDF prototype foundation"` was EXECUTED and FAILED with exit status 128 because Git author identity is not configured. No commit hash exists.  
**NEXT:** Obtain/verify Git author name and email, commit the already-reviewed foundation, then record the real commit hash.

## Session 2026-09-17 — INC-02

**DATE:** 2026-09-17  
**INCREMENT:** INC-02 — Core Domain + State Machine  
**TASKS:** Implemented value objects, immutable aggregate, transition table,
role checks, explicit errors, replay-like event-ID protection, unit tests,
documentation and ADR-eCDF-008.  
**FILES CHANGED:** `src/domain/`, `tests/unit/domain/`, domain documentation,
ADR, test specifications, deviations, build log and project sync.  
**TESTS RUN:** `npm run verify`; bounded infrastructure-import scan; bounded
secret-pattern scan; Git status inspection.  
**INITIAL RESULT:** First INC-02 `npm run verify` passed without a fix loop: 2
test files, 27 tests passed, 0 failed; typecheck and health passed.  
**FINAL RESULT:** Final `npm run verify` exited 0 on 2026-09-17: typecheck
passed, 2 test files passed, 27 tests passed, 0 failed, 0 skipped, and health
status was `ok`. The isolated domain command passed 24 tests in 1 file. The
bounded domain-boundary and secret-pattern scans both passed.  
**BLOCKERS:** First Git commit remains blocked by missing author identity. Domain
roles are not production authentication. Persistent replay protection and
concurrent writes remain later infrastructure concerns.  
**NEXT:** Resolve Git author identity, commit reviewed work, then conduct the
INC-03 readiness review without starting its implementation automatically.
