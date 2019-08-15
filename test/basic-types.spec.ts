import { EPERM } from "constants";

describe("test/basic-types", () => {
  describe("Number", () => {
    it("can define decimal", () => {
      const decimal = 6;
      expect(decimal).toStrictEqual(6);
    });
    it("can define hex", () => {
      const hex = 0x0a;
      expect(hex).toStrictEqual(10);
    });
    it("can define binary", () => {
      const binary = 0b1010;
      expect(binary).toStrictEqual(10);
    });
    it("can define octal", () => {
      const octal = 0o774;
      expect(octal).toStrictEqual(508);
    });
  });
  describe("Tuple", () => {
    it("can define an array where the type of a fixed number of elements is known", () => {
      let x: [string, number];

      x = ["hello", 10];

      expect(x).toEqual(["hello", 10]);
    });
  });
  describe("Enum", () => {
    it("Gives friendly names to set of numeric values", () => {
      enum Color {
        Red,
        Green,
        Blue,
      }
      expect(Color).toEqual({
        Red: 0,
        Green: 1,
        Blue: 2,
        0: "Red",
        1: "Green",
        2: "Blue",
      });
    });
    it("can set inital value", () => {
      enum Color {
        Red = 1,
        Green,
        Blue,
      }
      expect(Color).toEqual({
        Red: 1,
        Green: 2,
        Blue: 3,
        1: "Red",
        2: "Green",
        3: "Blue",
      });
    });
    it("can set all values", () => {
      enum Color {
        Red = 1,
        Green = 2,
        Blue = 4,
      }
      expect(Color).toEqual({
        Red: 1,
        Green: 2,
        Blue: 4,
        1: "Red",
        2: "Green",
        4: "Blue",
      });
    });
    it("can set partial values", () => {
      enum Color {
        Red = 1,
        Green,
        Blue = 5,
      }
      expect(Color).toEqual({
        Red: 1,
        Green: 2,
        Blue: 5,
        1: "Red",
        2: "Green",
        5: "Blue",
      });
    });
  });
  describe("Never", () => {
    it("can define a function that never return any value", () => {
      function error(message: string): never {
        throw new Error(message);
      }
      expect(() => {
        error("test");
      }).toThrowError();
    });
  });
  describe("Type assertions", () => {
    const someValue: any = "this is a string";
    it("let compiler treat a variable as specified type", () => {
      expect((someValue as string).length).toStrictEqual(16);
    });
  });
});
