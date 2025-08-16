import { describe, expect, it } from "vitest";

describe("test/interfaces", () => {
  it("can have required parameters", () => {
    interface ILabelled {
      label: string;
    }
    function label(labelledObj: ILabelled) {
      expect(labelledObj.label).toStrictEqual("foo");
    }
    label({ label: "foo" });
  });
  it("can have optional parameters", () => {
    interface ISquare {
      color?: string;
      width?: number;
    }
    function createSquare(config: ISquare): { color: string; area: number } {
      const newSquare = { color: "white", area: 100 };
      if (config.color) {
        newSquare.color = config.color;
      }
      if (config.width) {
        newSquare.area = config.width * config.width;
      }
      return newSquare;
    }
    const mySquare = createSquare({ color: "black" });

    expect(mySquare).toStrictEqual({ color: "black", area: 100 });
  });
  describe("readonly", () => {
    it("can be used for properties", () => {
      interface IPoint {
        readonly x: number;
        readonly y: number;
      }
      const p1: IPoint = { x: 10, y: 20 };
      expect(p1).toStrictEqual({ x: 10, y: 20 });
    });
    it("can be used for array", () => {
      const a: ReadonlyArray<number> = [1, 2, 3, 4];
      expect(a).toStrictEqual([1, 2, 3, 4]);
    });
  });
  describe("Excess Property", () => {
    it("can be passed by type assertion", () => {
      interface ISquare {
        color?: string;
        width?: number;
      }
      function createSquare(config: ISquare) {
        expect(config).toStrictEqual({ width: 100, opacity: 0.5 });
      }
      createSquare({ width: 100, opacity: 0.5 } as ISquare);
    });
    it("can be allowed by index signature", () => {
      interface ISquare {
        color?: string;
        width?: number;
        [propName: string]: number | string | undefined;
      }
      function createSquare(config: ISquare) {
        expect(config).toStrictEqual({ width: 100, opacity: 0.5 });
      }
      createSquare({ width: 100, opacity: 0.5 });
    });
    it("can be allowed by passing object", () => {
      interface ISquare {
        color?: string;
        width?: number;
      }
      function createSquare(config: ISquare) {
        expect(config).toStrictEqual({ colour: "red", width: 100 });
      }
      const squareOptions = { colour: "red", width: 100 };
      createSquare(squareOptions);
    });
  });
  describe("Function Types", () => {
    it("forces function's signature", () => {
      type ISearch = (source: string, subString: string) => boolean;
      const mySearch: ISearch = (source: string, subString: string) => {
        return source.search(subString) > -1;
      };
      expect(mySearch("This is foo bar", "foo")).toBeTruthy();
    });
  });
  describe("Indexable Types", () => {
    it('forces types that we can "index into"', () => {
      interface IStringArray {
        [index: number]: string;
      }
      const myArray: IStringArray = ["Bob", "Fred"];
      expect(myArray).toStrictEqual(["Bob", "Fred"]);
    });
    describe("number index", () => {
      it("should return a subtype of returned type of string index", () => {
        class Animal {
          public name = "";
        }
        class Dog extends Animal {
          public breed = "";
        }
        const obj = {
          0: new Dog(),
          1: new Animal(),
          bar: new Animal(),
          foo: new Dog(),
        };
        expect(obj[0]).toBeInstanceOf(Dog);
        expect(obj[1]).toBeInstanceOf(Animal);
        expect(obj.bar).toBeInstanceOf(Animal);
        expect(obj.foo).toBeInstanceOf(Dog);
      });
    });
    it("can be used with readonly", () => {
      interface IReadonlyStringArray {
        readonly [index: number]: string;
      }
      const myArray: IReadonlyStringArray = ["Alice", "Bob"];
      expect(myArray).toStrictEqual(["Alice", "Bob"]);
    });
  });
  describe("class types", () => {
    it("defines PUBLIC properties/methods", () => {
      interface IClock {
        currentTime: Date;
        setTime(d: Date): void;
      }
      class Clock implements IClock {
        public currentTime: Date;
        constructor(h: number, m: number) {
          const now = new Date();

          this.currentTime = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            h,
            m,
          );
        }
        public setTime(d: Date) {
          this.currentTime = d;
        }
      }

      const clock = new Clock(12, 0);
      expect(clock.currentTime.getHours()).toStrictEqual(12);
      expect(clock.currentTime.getMinutes()).toStrictEqual(0);
    });
    it("can define constructor signature", () => {
      interface IClock {
        currentTime: Date;
        tick(): string;
      }
      type IClockConstructor = new (hour: number, minute: number) => IClock;
      class DigitalClock implements IClock {
        public currentTime: Date;
        constructor(h: number, m: number) {
          const now = new Date();

          this.currentTime = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            h,
            m,
          );
        }
        public tick() {
          return "beep beep";
        }
      }
      class AnalogClock implements IClock {
        public currentTime: Date;
        constructor(h: number, m: number) {
          const now = new Date();

          this.currentTime = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            h,
            m,
          );
        }
        public tick() {
          return "tick tock";
        }
      }
      function createClock(
        ctor: IClockConstructor,
        hour: number,
        minute: number,
      ): IClock {
        return new ctor(hour, minute);
      }

      const digital = createClock(DigitalClock, 12, 17);
      const analog = createClock(AnalogClock, 12, 17);

      expect(digital.tick()).toStrictEqual("beep beep");
      expect(analog.tick()).toStrictEqual("tick tock");
    });
  });
  describe("Extends", () => {
    it("can extends multipe interface", () => {
      interface IShape {
        color: string;
      }
      interface IPenStroke {
        penWidth: number;
      }
      interface ISquare extends IShape, IPenStroke {
        sideLength: number;
      }

      const square = {} as ISquare;
      square.color = "blue";
      square.sideLength = 10;
      square.penWidth = 5.0;

      expect(square).toStrictEqual({
        color: "blue",
        penWidth: 5.0,
        sideLength: 10,
      });
    });
  });
});
