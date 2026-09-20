import { pathToFileURL } from "node:url";

import {
  ActorId,
  ActorRoles,
  DomainEventTypes,
  EventId,
  OperationId,
  OperationStates,
  TestAmount,
  TransferOperation,
} from "./domain/index.js";
import type { OperationSnapshot } from "./domain/index.js";

export interface LifecycleDemoReport {
  readonly demo: "eCDF deterministic local transfer lifecycle";
  readonly boundary: "LOCAL_DOMAIN_ONLY";
  readonly networkSettlement: false;
  readonly snapshots: readonly OperationSnapshot[];
}

export function createLifecycleDemoReport(): LifecycleDemoReport {
  let operation = TransferOperation.create({
    id: OperationId.create("OP-DEMO-001"),
    sourceActorId: ActorId.create("ACTOR-SOURCE"),
    destinationActorId: ActorId.create("ACTOR-DESTINATION"),
    amount: TestAmount.create("125000"),
  });

  const snapshots: OperationSnapshot[] = [operation.toSnapshot()];

  operation = operation.apply({
    id: EventId.create("EV-DEMO-001"),
    type: DomainEventTypes.AUTHORIZE,
    actorRole: ActorRoles.INITIATOR,
  });
  snapshots.push(operation.toSnapshot());

  operation = operation.apply({
    id: EventId.create("EV-DEMO-002"),
    type: DomainEventTypes.SUBMIT,
    actorRole: ActorRoles.SYSTEM,
  });
  snapshots.push(operation.toSnapshot());

  operation = operation.apply({
    id: EventId.create("EV-DEMO-003"),
    type: DomainEventTypes.CONFIRM_SETTLED,
    actorRole: ActorRoles.RECONCILER,
  });
  snapshots.push(operation.toSnapshot());

  if (operation.state !== OperationStates.SETTLED) {
    throw new Error("Demo invariant failed: expected terminal SETTLED state.");
  }

  return Object.freeze({
    demo: "eCDF deterministic local transfer lifecycle",
    boundary: "LOCAL_DOMAIN_ONLY",
    networkSettlement: false,
    snapshots: Object.freeze([...snapshots]),
  });
}

function run(): void {
  const report = createLifecycleDemoReport();
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

const invokedPath = process.argv[1];
if (invokedPath && import.meta.url === pathToFileURL(invokedPath).href) {
  try {
    run();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown eCDF demo error";
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  }
}
