import { describe, expect, it } from "vitest";

describe("test/enums", () => {
  describe("enum as type", () => {
    enum ShapeKind {
      Circle,
      Square,
    }
    it("can define type", () => {
      interface ICircle {
        kind: ShapeKind.Circle;
        radius: number;
      }

      const c: ICircle = {
        kind: ShapeKind.Circle,
        radius: 100,
      };

      expect(c.kind).toBe(ShapeKind.Circle);
    });
    it("can define union of type", () => {
      function f(m: ShapeKind) {
        if (m !== ShapeKind.Circle) {
          expect(m).toBe(ShapeKind.Square);
        }
        if (m !== ShapeKind.Square) {
          expect(m).toBe(ShapeKind.Circle);
        }
      }
      f(ShapeKind.Circle);
    });
  });
  describe("enum at runtime", () => {
    it("can be passed", () => {
      enum E {
        X,
        Y,
        Z,
      }
      function f(obj: { X: number }) {
        return obj.X;
      }
      expect(f(E)).toBe(E.X);
    });
  });
});
