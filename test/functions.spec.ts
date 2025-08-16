import { describe, it, expect } from "vitest";

describe("test/functions", () => {
  describe("function type", () => {
    it("can do contextual typing", () => {
      const add: (a: number, b: number) => number = (
        x: number,
        y: number,
      ): number => x + y;

      const sub = (x: number, y: number): number => x - y;

      expect(add(1, 2)).toBe(3);
      expect(sub(1, 2)).toBe(-1);
    });
    it("defines optional parameter by ?", () => {
      function buildName(first: string, last?: string): string {
        if (last) {
          return first + " " + last;
        }
        return first;
      }
      expect(buildName("Alice")).toBe("Alice");
      expect(buildName("Alice", "Ben")).toBe("Alice Ben");
    });
    it("defines default parameter by =", () => {
      function buildName(first: string, last = "last"): string {
        if (last) {
          return first + " " + last;
        }
        return first;
      }
      expect(buildName("Alice")).toBe("Alice last");
      expect(buildName("Alice", "Ben")).toBe("Alice Ben");
    });
    describe("default parameter", () => {
      it("can be placed anywhere", () => {
        function buildName(first = "first", last: string): string {
          return first + " " + last;
        }
        expect(buildName(undefined, "last")).toBe("first last");
      });
    });
  });
});
