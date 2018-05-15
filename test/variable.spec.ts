import "mocha";
import assert from "power-assert";

describe("test/variable", () => {
    describe("boolean", () => {
        it("define for true/false", () => {
            let isDone: boolean = true;

            assert.strictEqual(isDone, true);

            isDone = false;

            assert.strictEqual(isDone, false);
        });
    });

    describe("number", () => {
        it("can define integer", () => {
            const decimal: number = 6;

            assert.strictEqual(decimal, 6);
        });
        it("can define hex", () => {
            const hex: number = 0xf00d;

            assert.strictEqual(hex, 16 * 16 * 16 * 15 + 13);
        });

        it("can define binary", () => {
            const binary: number = 0b1010;

            assert.strictEqual(binary, 2 * 2 * 2 * 1 + 2 * 1);
        });

        it("can define octal", () => {
            const octal: number = 0o774;

            assert.strictEqual(octal, 7 * 8 * 8 + 7 * 8 + 4);
        });
    });
    describe("string", () => {
        it("can be defined with string", () => {
            const color: string = "blue";

            assert.strictEqual(color, "blue");
        });
    });

    describe("array", () => {
        it("can be defined with <elemType>[]", () => {
            const list: number[] = [1, 2, 3];

            assert.deepStrictEqual(list, [1, 2, 3]);
        });
        it("can be defined with Array<elemType>", () => {
            const list: number[] = [1, 2, 3];

            assert.deepStrictEqual(list, [1, 2, 3]);
        });
    });

    describe("tuple", () => {
        let x: [string, number];
        it("can be defined [type, type]", () => {
            x = ["hello", 1];
            assert.deepStrictEqual(x, ["hello", 1]);
        });
        it("can access like array", () => {
            assert.strictEqual(x[0], "hello");
            assert.strictEqual(x[1], 1);
        });
    });

    describe("enum", () => {
        context("w/o setting numbers", () => {
            enum Color { Red, Green, Blue }
            it("should define enum with auto incremented integers starting 0", () => {
                assert.strictEqual(Color.Red, 0);
                assert.strictEqual(Color.Green, 1);
                assert.strictEqual(Color.Blue, 2);
            });
            it("can map number to name", () => {
                assert.strictEqual(Color[0], "Red");
                assert.strictEqual(Color[1], "Green");
                assert.strictEqual(Color[2], "Blue");
            });
        });
        context("w/ settingg numbers", () => {
            it("can set starting value", () => {
                enum Color { Red = 1, Green, Blue }

                assert.strictEqual(Color.Red, 1);
                assert.strictEqual(Color.Green, 2);
                assert.strictEqual(Color.Blue, 3);
            });
        });
    });

    describe("any", () => {
        it("can assign any variables", () => {
            let a: any = 1;

            assert.strictEqual(a, 1);

            a = true;

            assert.strictEqual(a, true);
        });
    });

    describe("void", () => {
        it("can be assigned undefined", () => {
            const a: void = undefined;

            assert.strictEqual(a, undefined);
        });
        it("can be assigned null", () => {
            const a: void = null;

            assert.strictEqual(a, null);
        });
    });

    describe("null", () => {
        it("can be assigned only null", () => {
            const a: null = undefined;
        });
    });

    describe("never", () => {
        it("is used when a function never return any values", () => {
            function excep(): never {
                throw new Error("Foo");
            }
            assert.throws(excep);
        });
    });
});
