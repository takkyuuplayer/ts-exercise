describe("test/generics", () => {
  it("defines generic function with proper type information", () => {
    function badIdentity(arg: any) {
      return arg;
    }
    function identity<T>(arg: T): T {
      return arg;
    }

    expect(badIdentity(1)).toBe(1); // No information about returned value
    expect(identity(1)).toBe(1);
    expect(identity<string>("1")).toBe("1");
  });
  it("allows to define function accepting array of any", () => {
    function loggingIdentity<T>(arg: T[]): T[] {
      expect(arg.length).toStrictEqual(3);
      return arg;
    }
    expect(loggingIdentity([1, 2, 3])).toStrictEqual([1, 2, 3]);
  });
  describe("generic types", () => {
    function identity<T>(arg: T): T {
      return arg;
    }

    it("has object literal syntax", () => {
      const myIdentity: <T>(arg: T) => T = identity;
      expect(myIdentity).toBe(identity);
    });

    it("has interface syntax", () => {
      type GenericIdentityFn = <T>(arg: T) => T;
      const myIdentity: GenericIdentityFn = identity;
      expect(myIdentity).toBe(identity);
    });
  });
  describe("generic constraints", () => {
    it("restricts structure of generic type", () => {
      interface ILengthwise {
        length: number;
      }
      function loggingIdentity<T extends ILengthwise>(arg: T): T {
        expect(arg.length).toStrictEqual(3);
        return arg;
      }
      expect(loggingIdentity([1, 2, 3])).toStrictEqual([1, 2, 3]);
      expect(loggingIdentity({ a: 1, length: 3 })).toStrictEqual({
        a: 1,
        length: 3
      });
    });
  });
  describe("Using Type Parameters in Generic Constraints", () => {
    it("restricts arguments by using type of others", () => {
      function getProperty<T, K extends keyof T>(obj: T, key: K) {
        return obj[key];
      }
      const x = { a: 1, b: 2, c: 3, d: 4 };
      expect(getProperty(x, "a")).toBe(1);
    });
  });
  describe("Using Class Types in Generics", () => {
    it("restricts constructor", () => {
      function createInstance<T>(c: new () => T): T {
        return new c();
      }
      class Animal {}

      expect(createInstance(Animal)).toBeInstanceOf(Animal);
    });
  });
});
