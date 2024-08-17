import fs from "fs";
import path from "path";
import { describe, it , expect} from "vitest";

describe("fs", () => {
  describe("readFileSync", () => {
    it("returns string if encoding is passed", () => {
      const read = fs.readFileSync(path.resolve("./test/data/hello.txt"), {
        encoding: "utf8",
      });

      expect(typeof read).toBe("string");
      expect(read).toBe("こんにちは 世界");
    });
    it("returns buffer if encoding is NOT passed", () => {
      const read = fs.readFileSync(path.resolve("./test/data/hello.txt"));

      expect(typeof read).toBe("object");
      expect(read).toBeInstanceOf(Buffer);
      expect(read.toString()).toBe("こんにちは 世界");
    });
  });
});
