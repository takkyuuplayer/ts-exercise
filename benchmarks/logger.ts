import winston from "winston";
import tmp from "tmp";
import Benchmark from "benchmark";

const winstonLogger = winston.createLogger({
  transports: [new winston.transports.File({ filename: tmp.fileSync().name })]
});

const suite = new Benchmark.Suite();
suite
  .add("winston.info", function() {
    winstonLogger.info("Hello World");
  })
  .on("cycle", function(event: any) {
    console.log(String(event.target));
  })
  .on("complete", function(this: any) {
    console.log("Fastest is " + this.filter("fastest").map("name"));
  })
  // run async
  .run({ async: true });
