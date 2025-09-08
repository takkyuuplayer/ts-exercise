import { createClient, defineScript } from "redis";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("defineScript", async () => {
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
        parseCommand(parser, key1, key2, increment) {
          parser.pushKey(key1);
          parser.pushKey(key2);
          parser.push(increment.toString());
        },
        transformReply(reply: [number, number]) {
          return reply;
        },
      }),
    },
  });

  beforeAll(async () => {
    await client.connect();
    await client.flushAll();
  });
  afterAll(() => {
    client.close();
  });

  it("should work", async () => {
    await client.set("mykey", "5");
    const [mykey, myotherkey] = await client.mincr("mykey", "myotherkey", 10);

    expect(mykey).toBe(15);
    expect(myotherkey).toBe(10);
  });
});
