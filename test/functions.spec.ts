describe("test/functions", () => {
    describe("function type", () => {
        it("can do contextual typing", () => {
            const add: (a: number, b: number) => number =
                (x: number, y: number): number => x + y;

            const sub = (x: number, y: number): number => x - y;

            expect(add(1, 2)).toBe(3);
            expect(sub(1, 2)).toBe(-1);
        });
        it("defines optional parameter by ?", () => {
            function buildName(first: string, last?: string): string {
                if (last) {
                    return first + " " + last;
                }
                return first;
            }
            expect(buildName("Alice")).toBe("Alice");
            expect(buildName("Alice", "Ben")).toBe("Alice Ben");
        });
        it("defines default parameter by =", () => {
            function buildName(first: string, last = "last"): string {
                if (last) {
                    return first + " " + last;
                }
                return first;
            }
            expect(buildName("Alice")).toBe("Alice last");
            expect(buildName("Alice", "Ben")).toBe("Alice Ben");
        });
        describe("default parameter", () => {
            it("can be placed anywhere", () => {
                function buildName(first = "first", last: string): string {
                    return first + " " + last;
                }
                expect(buildName(undefined, "last")).toBe("first last");
            });
        });
    });
    describe("arrow function", () => {
        class Sample {
            public func() {
                return function(this: any): any {
                    return this;
                };
            }
            public funcCallInside() {
                return this.func()();
            }
            public arrow() {
                return () => this;
            }
        }
        const sample = new Sample();
        it("binds this object", () => {
            expect(sample.func()()).toBeUndefined();
            expect(sample.funcCallInside()).toBeUndefined();
            expect(sample.arrow()()).toStrictEqual(sample);
        });
    });
    describe("overload", () => {
        it("allows us to define multiple signature function", () => {
            const suits = ["hearts", "spades", "clubs", "diamonds"];

            function pickCard(x: Array<{ suit: string; card: number; }>): number;
            function pickCard(x: number): { suit: string; card: number; };
            function pickCard(x: any): any {
                // Check to see if we're working with an object/array
                // if so, they gave us the deck and we'll pick the card
                if (typeof x === "object") {
                    const pickedCard = Math.floor(Math.random() * x.length);
                    return pickedCard;
                } else if (typeof x === "number") {
                    const pickedSuit = Math.floor(x / 13);
                    return { suit: suits[pickedSuit], card: x % 13 };
                }
            }

            const myDeck = [{ suit: "diamonds", card: 2 }, { suit: "spades", card: 10 }, { suit: "hearts", card: 4 }];

            expect(pickCard(myDeck)).toBeLessThan(myDeck.length);

            const pickedCard2 = pickCard(15);

            expect(pickedCard2).toStrictEqual({ card: 2, suit: "spades" });
        });
    });
});
