import path from "path";
import { describe, expect, it } from "vitest";

describe("path", () => {
  describe("resolve", () => {
    it("returns current working directory", () => {
      expect(path.resolve()).toBe(process.cwd());
      expect(path.resolve().endsWith("ts-exercise")).toBeTruthy();
    });
  });
});
