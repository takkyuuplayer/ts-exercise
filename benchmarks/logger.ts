/* eslint-disable @typescript-eslint/no-explicit-any */

import Benchmark from "benchmark";
import bunyan from "bunyan";
import tmp from "tmp";
import winston from "winston";

const winstonLogger = winston.createLogger({
  transports: [new winston.transports.File({ filename: tmp.fileSync().name })],
});
const bunyanLogger = bunyan.createLogger({
  name: "bunyan",
  streams: [
    {
      path: tmp.fileSync().name,
    },
  ],
});

const suite = new Benchmark.Suite();
suite
  .add("winston.info", function () {
    winstonLogger.info("Hello World");
  })
  .add("bunyan.info", function () {
    bunyanLogger.info("Hello World");
  })
  .on("cycle", function (event: any) {
    console.log(String(event.target));
  })
  .on("complete", function (this: any) {
    console.log("Fastest is " + this.filter("fastest").map("name"));
  })
  // run async
  .run({ async: true });
