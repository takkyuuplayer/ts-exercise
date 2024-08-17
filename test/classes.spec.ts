import { describe, expect, it } from "vitest";

describe("test/classes", () => {
  describe("subclass", () => {
    it("must call super before accessing instance values", () => {
      class Animal {
        public name: string;
        constructor(theName: string) {
          this.name = theName;
        }
        public move(distanceInMeters = 0): number {
          return distanceInMeters;
        }
      }

      class Snake extends Animal {
        constructor(name: string) {
          // Must be called before accessing this.name
          super(name);
        }
        public move(distanceInMeters = 5) {
          return super.move(distanceInMeters);
        }
      }
      const s = new Snake("Sammy the Python");
      expect(s.move()).toStrictEqual(5);
    });
  });
  describe("parameter properties", () => {
    it("converts properties in constructor to instance properties", () => {
      class Octopus {
        constructor(
          public pub: string,
          private pri: string,
          protected pro: string,
          readonly ro: string
        ) {}
        public getRo() {
          return this.ro;
        }
        public getPri() {
          return this.pri;
        }
        public getPro() {
          return this.pro;
        }
      }
      const o = new Octopus("pub", "pri", "pro", "ro");
      expect(o.pub).toStrictEqual("pub");
      expect(o.ro).toStrictEqual("ro");
      expect(o.getPro()).toStrictEqual("pro");
      expect(o.getPri()).toStrictEqual("pri");
    });
  });
  describe("getter/setter", () => {
    it("runs implemented logic when accessing the property", () => {
      class User {
        private pPassword = "defaultPassword";
        get password() {
          return this.pPassword;
        }
        set password(newPassword: string) {
          if (newPassword.length < 7) {
            throw new Error("Password length must be more than 7");
          }
          this.pPassword = newPassword;
        }
      }
      const u = new User();
      expect(u.password).toStrictEqual("defaultPassword");
      expect(() => {
        u.password = "weak";
      }).toThrowError("Password length must be more than 7");
    });
  });
  describe("static properties", () => {
    it("can be accessed through Class.propertyName", () => {
      class Point {
        public static origin = { x: 0, y: 0 };
      }
      expect(Point.origin).toStrictEqual({ x: 0, y: 0 });
    });
  });
});
