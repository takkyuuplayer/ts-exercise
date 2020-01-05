describe("symbol", () => {
  it("is immutable and unique", () => {
    expect(Symbol("key")).not.toEqual(Symbol("key"));
  });
  it("can be used as keys for object properties", () => {
    const sym = Symbol();
    const obj = {
      [sym]: "value"
    };
    expect(obj[sym]).toBe("value");
  });
});
