import { it } from "mocha";
import assert = require("power-assert");

describe("test/basic-types", () => {
    describe("Number", () => {
        it("can define decimal", () => {
            const decimal = 6;
            assert.strictEqual(decimal, 6);
        });
        it("can define hex", () => {
            const hex = 0x0a;
            assert.strictEqual(hex, 10);
        });
        it("can define binary", () => {
            const binary = 0b1010;
            assert.strictEqual(binary, 10);
        });
        it("can define octal", () => {
            const octal = 0o774;
            assert.strictEqual(octal, 508);
        });
    });
    describe("Tuple", () => {
        it("can define an array where the type of a fixed number of elements is known", () => {
            let x: [string, number];

            x = ["hello", 10];

            assert.deepStrictEqual(x, ["hello", 10]);
        });
        it("can assign a union type to outside element", () => {
            let x: [string, number];
            x = ["hello", 10];
            x[2] = "world";
            x[3] = 20;
            x[4] = 30;
            x[5] = "foo";

            assert.deepStrictEqual(x, ["hello", 10, "world", 20, 30, "foo"]);
        });
    });
    describe("Enum", () => {
        it("Gives friendly names to set of numeric values", () => {
            enum Color {Red, Green, Blue}
            assert.deepStrictEqual(
                Color,
                {Red: 0, Green: 1, Blue: 2, 0: "Red", 1: "Green", 2: "Blue"},
            );
        });
        it("can set inital value", () => {
            enum Color {Red = 1, Green, Blue}
            assert.deepStrictEqual(
                Color,
                {Red: 1, Green: 2, Blue: 3, 1: "Red", 2: "Green", 3: "Blue"},
            );
        });
        it("can set all values", () => {
            enum Color {Red = 1, Green = 2, Blue = 4}
            assert.deepStrictEqual(
                Color,
                {Red: 1, Green: 2, Blue: 4, 1: "Red", 2: "Green", 4: "Blue"},
            );
        });
        it("can set partial values", () => {
            enum Color {Red = 1, Green, Blue = 5}
            assert.deepStrictEqual(
                Color,
                {Red: 1, Green: 2, Blue: 5, 1: "Red", 2: "Green", 5: "Blue"},
            );
        });
    });
    describe("Never", () => {
        it("can define a function that never return any value", () => {
            function error(message: string): never {
                throw new Error(message);
            }
            assert.throws(() => { error("test"); });
        });
    });
    describe("Type assertions", () => {
        const someValue: any = "this is a string";
        it("let compiler treat a variable as specified type", () => {
            assert.strictEqual((someValue as string).length, 16);
        });
    });
});
