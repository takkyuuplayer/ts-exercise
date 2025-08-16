import { describe, expect, it } from "vitest";
describe("test/type-compatibility", () => {
  describe("comparing 2 functions", () => {
    it("checks first part of argument", () => {
      const forEach1 = (item: number) => item * 2;
      const forEach2 = (item: number, index: number) => item * index;
      const forEach3 = (item: number, index: number, array: number[]) =>
        item * index + array.length;

      expect([1, 2, 3].map(forEach1)).toStrictEqual([2, 4, 6]);
      expect([1, 2, 3].map(forEach2)).toStrictEqual([0, 2, 6]);
      expect([1, 2, 3].map(forEach3)).toStrictEqual([3, 5, 9]);
    });
  });
  describe("Enum", () => {
    it("is compatible with numbers", () => {
      enum Status {
        Ready,
        Waiting,
      }
      let status = Status.Ready;
      status = 1;
      expect(status).toBe(Status.Waiting);
    });
    it("is not compatible with other Enum", () => {
      enum Status {
        Ready,
        Waiting,
      }
      enum Color {
        Red,
        Blue,
        Green,
      }

      const status = Status.Ready;
      // status = Color.Green;  // Error
    });
  });
});
