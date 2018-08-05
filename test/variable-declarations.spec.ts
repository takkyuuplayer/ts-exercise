import assert = require("power-assert");

describe("test/variable-declarations", () => {
    describe("Array destruction", () => {
        it("assign variables by destruction", () => {
            const input = [1, 2];
            const [first, second] = input;

            assert.strictEqual(first, 1);
            assert.strictEqual(second, 2);
        });
        it("can swap values", () => {
            const input = [1, 2];
            let [first, second] = input;
            [second, first] = [first, second];

            assert.strictEqual(first, 2);
            assert.strictEqual(second, 1);
        });
        it("can be in function", () => {
            function f([first, second]: [number, number]) {
                assert.strictEqual(first, 1);
                assert.strictEqual(second, 2);
            }
            f([1, 2]);
        });
    });
    describe("Spread operator", () => {
        context("object", () => {
            it("overwrite earlier defined keys", () => {
               const defaults = { food: "spicy", price: "$$", ambiance: "noisy" };
               const search = ({ ...defaults, food: "rich" } as object);

               assert.deepStrictEqual(
                   search,
                   { food: "rich", price: "$$", ambiance: "noisy" },
               );
            });
        });
    });
});
