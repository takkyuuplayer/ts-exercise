import Benchmark from "benchmark";

const suite = new Benchmark.Suite();
suite
  .add("RegExp#test", () => {
    /o/.test("Hello World!");
  })
  .add("String#indexOf", () => {
    "Hello World!".indexOf("o") > -1;
  })
  // add listeners
  .on("cycle", (event: Benchmark.Event) => {
    console.log(String(event.target));
  })
  .on("complete", function (this: Benchmark.Suite) {
    console.log(`Fastest is ${this.filter("fastest").map("name")}`);
  })
  // run async
  .run({ async: true });
