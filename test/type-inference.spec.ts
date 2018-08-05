describe("test/type-inference", () => {
    describe("Best common type", () => {
        const x = [0, 1, null]; // Defined as x: number | null
        it("defines union of types as variable's type", () => {
            // x[1] = {}; compile error
            x[3] = 1.5;
            x[4] = null;
            expect(x).toStrictEqual([0, 1, null, 1.5, null]);
        });
    });
});
