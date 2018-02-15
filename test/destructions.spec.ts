import "mocha";
import * as assert from "power-assert";

describe("Object destruction", () => {
    context("Property Naming", () => {
        it("can give different names to properties", () => {
            const { a: varA, b: varB } = { a: 1, b: 2 };

            assert.strictEqual(varA, 1);
            assert.strictEqual(varB, 2);

            const ary = [1, 2, 3];
            assert(ary.indexOf(0) === 2);
        });
    });
    context("Default Values", () => {
        function foo(wholeObject: { a: string, b?: number }): void {
            const { a, b = 1000 } = wholeObject;

            assert.strictEqual(a, "str");
            assert.strictEqual(b, 1000);
        }
        context("function arguments", () => {
            it("can be optional with ?: <type>", () => {
                const obj = { a: "str" };
                assert.doesNotThrow(() => foo(obj));
            });
        });
    });
});
