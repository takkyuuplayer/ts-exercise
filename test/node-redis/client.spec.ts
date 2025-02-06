import { createClient, defineScript } from "redis";
import { describe, it } from "vitest";

describe("defineScript", async () => {
  it("should work", async () => {
    const client = createClient({
      url: "redis://localhost:56379",
      scripts: {
        mincr: defineScript({
          NUMBER_OF_KEYS: 2,
          SCRIPT:
            "return {" +
            'redis.pcall("INCRBY", KEYS[1], ARGV[1]),' +
            'redis.pcall("INCRBY", KEYS[2], ARGV[1])' +
            "}",
          transformArguments(key1, key2, increment) {
            return [key1, key2, increment.toString()];
          },
        }),
      },
    });

    await client.connect();

    await client.set("mykey", "5");
    console.log(await client.mincr("mykey", "myotherkey", 10));
  });
});
