import { describe, expect, it } from "vitest";

describe("type inference", () => {
  it("infere type of variable", () => {
    const x = 3;
    expect(typeof x).toBe("number");

    const y = "string";
    expect(typeof y).toBe("string");
  });
  it("uses union type", () => {
    const x = [0, 1, null];
    const _y: typeof x = [null];
    const _z: typeof x = [0];
    // const w: typeof x = ["string"]; // forbidden
  });
});
