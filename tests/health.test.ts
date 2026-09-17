import { describe, expect, it } from "vitest";
import { ROLES, TRANSFER_STATES, TransferOperation } from "../src/index.js";

describe("repository health", () => {
  it("exports TransferOperation", () => {
    expect(typeof TransferOperation.create).toBe("function");
  });

  it("exports the role contract", () => {
    expect(Object.keys(ROLES)).toEqual(["INITIATOR", "AUTHORIZER", "SETTLER"]);
  });

  it("exports the state contract", () => {
    expect(Object.values(TRANSFER_STATES)).toEqual(["CREATED", "AUTHORIZED", "SETTLED"]);
  });
});
