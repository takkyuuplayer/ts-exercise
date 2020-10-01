describe("Iterables", () => {
  it("iterates whatever implements Symbol.iterator", () => {
    const iterable = {
      *[Symbol.iterator]() {
        for (let index = 0; index < 5; index++) {
          yield index * index;
        }
      },
    };
    const iterated = [];
    for (const val of iterable) {
      iterated.push(val);
    }
    expect(iterated).toStrictEqual([0, 1, 4, 9, 16]);
  });
  describe("for ... of", () => {
    it("iterates over values", () => {
      const arr = [1, 4, 9];
      let sum = 0;
      for (const val of arr) {
        sum += val;
      }
      expect(sum).toBe(14);
    });
  });
  describe("for ... in", () => {
    it("iterates over keys", () => {
      const arr = [1, 4, 9];
      let sum = "";
      for (const key in arr) {
        // eslint-disable-next-line no-prototype-builtins
        if (arr.hasOwnProperty(key)) {
          sum += key;
        }
      }
      expect(sum).toBe("012");
    });
  });
});
