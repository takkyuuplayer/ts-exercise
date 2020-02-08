describe("decorator", () => {
  describe("composition", () => {
    it("runs function(s)", () => {});
    let arr: Array<string> = [];
    function f() {
      arr.push("f evaluated");
      return function(
        _target: any,
        _propertyKey: string,
        _descriptor: PropertyDescriptor
      ) {
        arr.push("f called");
      };
    }
    function g() {
      arr.push("g evaluated");
      return function(
        _target: any,
        _propertyKey: string,
        _descriptor: PropertyDescriptor
      ) {
        arr.push("g called");
      };
    }
    class C {
      @f()
      @g()
      method() {}
    }
    const c = new C();
    c.method();

    expect(arr).toStrictEqual([
      "f evaluated",
      "g evaluated",
      "g called",
      "f called"
    ]);
  });
  describe("class Decorators", () => {
    it("is called with constructor", () => {
      @sealed
      class Greeter {
        greeting: string;
        constructor(message: string) {
          this.greeting = message;
        }
        greet() {
          return `Hello, ${this.greeting}`;
        }
      }

      function sealed(constructor: Function) {
        Object.seal(constructor);
        Object.seal(constructor.prototype);
      }
      expect(Object.isSealed(Greeter)).toStrictEqual(true);
      expect(Object.isSealed(Greeter.prototype)).toStrictEqual(true);
    });

    it("can overwrite constructor", () => {
      function classDecorator<T extends { new (...args: any[]): {} }>(
        constructor: T
      ) {
        return class extends constructor {
          newProperty = "new property";
          hello = "override";
        };
      }

      @classDecorator
      class Greeter {
        property = "property";
        hello: string;
        constructor(m: string) {
          this.hello = m;
        }
      }

      const c = new Greeter("world");

      expect(c.hello).toStrictEqual("override");
    });
  });
});
