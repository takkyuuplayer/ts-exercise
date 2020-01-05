describe("||", () => {
  it("returns first value that is true", () => {
    const zero = 0;
    const one = 1;
    const two = 2;

    expect(zero || one).toEqual(one);
    expect(zero || one || two).toEqual(one);
    expect(true || one || two).toEqual(true);
  });
});
