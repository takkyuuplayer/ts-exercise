import path from "path";
describe("path", () => {
  describe("resolve", () => {
    it("returns current working directory", () => {
      expect(path.resolve()).toBe(process.cwd());
      expect(path.resolve().endsWith("ts-exercise")).toBeTruthy();
    });
  });
});
