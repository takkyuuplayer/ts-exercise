import path from "node:path";
import { describe, expect, it } from "vite-plus/test";

describe("path", () => {
  describe("resolve", () => {
    it("returns current working directory", () => {
      expect(path.resolve()).toBe(process.cwd());
      expect(path.resolve().endsWith("ts-exercise")).toBeTruthy();
    });
  });
});
