describe("test/variable-declarations", () => {
  describe("Array destruction", () => {
    it("assign variables by destruction", () => {
      const input = [1, 2];
      const [first, second] = input;

      expect(first).toStrictEqual(1);
      expect(second).toStrictEqual(2);
    });
    it("can swap values", () => {
      const input = [1, 2];
      let [first, second] = input;
      [second, first] = [first, second];

      expect(first).toStrictEqual(2);
      expect(second).toStrictEqual(1);
    });
    it("can be in function", () => {
      function f([first, second]: [number, number]) {
        expect(first).toStrictEqual(1);
        expect(second).toStrictEqual(2);
      }
      f([1, 2]);
    });
  });
  describe("Spread operator", () => {
    it("overwrite earlier defined keys", () => {
      const defaults = { food: "spicy", price: "$$", ambiance: "noisy" };
      const search = { ...defaults, food: "rich" } as object;

      expect(search).toStrictEqual({
        food: "rich",
        price: "$$",
        ambiance: "noisy"
      });
    });
  });
});
