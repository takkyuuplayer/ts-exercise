describe("type inference", () => {
  it("infere type of variable", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const x = 3;
    expect(typeof x).toBe("number");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const y = "string";
    expect(typeof y).toBe("string");
  });
  it("uses union type", () => {
    const x = [0, 1, null];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const y: typeof x = [null];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const z: typeof x = [0];
    // const w: typeof x = ["string"]; // forbidden
  });
});
