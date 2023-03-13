/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
/* eslint-disable no-unused-vars */
describe("decorator", () => {
  describe("Class decorator", () => {
    it("should execture composite functions", () => {
      let counter = 0;
      function f() {
        expect(++counter).toBe(1);
        return function (constructor: Function) {
          expect(++counter).toBe(4);
        };
      }
      function g() {
        expect(++counter).toBe(2);
        return function (constructor: Function) {
          expect(++counter).toBe(3);
        };
      }
      @f()
      @g()
      class C {}
    });
    it("can overwrite constructor", () => {
      interface IConstructor {
        new (...args: any[]): {};
      }

      function classDecorator<T extends IConstructor>(constructor: T) {
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

      expect(new Greeter("world").hello).toBe("override");
    });
  });
  describe("Method Decorators", () => {
    describe("instance method", () => {
      it("has 3 arguments and the first arugment is the prototype of the target class", () => {
        function f(
          target: any,
          propertyKey: string,
          descriptor: PropertyDescriptor
        ) {
          expect(target).toBe(Greeter.prototype);
          expect(propertyKey).toBe("greet");
          expect(typeof descriptor).toBe("object");
        }
        class Greeter {
          greeting: string;
          constructor(message: string) {
            this.greeting = message;
          }

          @f
          greet() {
            return "Hello, " + this.greeting;
          }
        }
      });
    });
    describe("static method", () => {
      it("has 3 arguments and the first arugment is class's constructor", () => {
        function f(
          target: any,
          propertyKey: string,
          descriptor: PropertyDescriptor
        ) {
          expect(target).toBe(Greeter);
          expect(propertyKey).toBe("greet");
          expect(typeof descriptor).toBe("object");
        }
        class Greeter {
          greeting: string;
          constructor(message: string) {
            this.greeting = message;
          }

          @f
          static greet() {}
        }
      });
    });
  });
  describe("Accessor Decorators", () => {
    it("has 3 arguments and the first arugment is the prototype of the target class", () => {
      function f(
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
      ) {
        expect(target).toBe(Point.prototype);
        expect(propertyKey === "x" || propertyKey === "y").toBeTruthy();
        expect(typeof descriptor).toBe("object");
      }
      class Point {
        private _x: number;
        private _y: number;
        constructor(x: number, y: number) {
          this._x = x;
          this._y = y;
        }

        @f
        get x() {
          return this._x;
        }

        @f
        get y() {
          return this._y;
        }
      }
    });
  });
  describe("Property Decorators", () => {
    describe("instance property", () => {
      it("has 2 arguments and the first arugment is the prototype of the target class", () => {
        function f(target: any, propertyKey: string) {
          expect(target).toBe(Greeter.prototype);
          expect(propertyKey).toBe("greeting");
        }
        class Greeter {
          @f
          greeting = "Hello, ";
        }
      });
      it("records metadata about the property", () => {
        const formatMetadataKey = Symbol("format");

        class Greeter {
          @format("Hello, %s")
          greeting: string;

          constructor(message: string) {
            this.greeting = message;
          }
          greet() {
            const formatString = getFormat(this, "greeting");
            return formatString.replace("%s", this.greeting);
          }
        }

        function format(formatString: string) {
          return Reflect.metadata(formatMetadataKey, formatString);
        }

        function getFormat(target: any, propertyKey: string) {
          return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
        }

        expect(new Greeter("World").greet()).toBe("Hello, World");
      });
    });
    describe("static method", () => {
      it("has 3 arguments and the first arugment is class's constructor", () => {
        function f(target: any, propertyKey: string) {
          expect(target).toBe(Greeter);
          expect(propertyKey).toBe("greeting");
        }
        class Greeter {
          @f
          static greeting = "Hello, ";
        }
      });
    });
  });
  describe("Parameter Decorators", () => {
    describe("instance method", () => {
      it("has 3 arguments and the first arugment is the prototype of the target class", () => {
        function f(
          target: Object,
          propertyKey: string | symbol,
          parameterIndex: number
        ) {
          expect(target).toBe(Greeter.prototype);
          expect(propertyKey).toBe("greet");
          expect(parameterIndex).toBe(0);
        }
        class Greeter {
          greet(@f name: string) {
            return "Hello " + name;
          }
        }
      });
    });
    describe("static method", () => {
      it("has 3 arguments and the first arugment is the target class's constructor", () => {
        function f(
          target: any,
          propertyKey: string | symbol,
          parameterIndex: number
        ) {
          expect(target).toBe(Greeter);
          expect(propertyKey).toBe("greet");
          expect(parameterIndex).toBe(0);
        }
        class Greeter {
          static greet(@f name: string) {
            return "Hello " + name;
          }
        }
      });
    });
  });
});
