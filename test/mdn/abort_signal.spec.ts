import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("AbortController", () => {
  describe("#abort", () => {
    it("aborts with an AbortError by default", () => {
      const controller = new AbortController();

      expect(controller.signal.aborted).toBe(false);
      expect(controller.signal.reason).toBeUndefined();

      controller.abort();

      expect(controller.signal.aborted).toBe(true);
      expect(controller.signal.reason).toBeInstanceOf(DOMException);
      expect(controller.signal.reason.name).toBe("AbortError");
    });

    it("aborts with the given reason", () => {
      const controller = new AbortController();

      controller.abort(new Error("user cancelled"));

      expect(controller.signal.reason).toEqual(new Error("user cancelled"));
    });
  });

  describe("fetch against a local server", () => {
    let server: Server;
    let origin: string;

    beforeAll(async () => {
      server = createServer((req, res) => {
        if (req.url === "/slow") {
          // レスポンスを返さずに接続を保持し続ける
          return;
        }
        res.writeHead(200, { "content-type": "text/plain" });
        res.end("hello");
      });

      await new Promise<void>((resolve) => {
        server.listen(0, "127.0.0.1", resolve);
      });
      const { port } = server.address() as AddressInfo;
      origin = `http://127.0.0.1:${port}`;
    });

    afterAll(async () => {
      server.closeAllConnections();
      await new Promise((resolve) => server.close(resolve));
    });

    it("responds when it is not aborted", async () => {
      const controller = new AbortController();
      const res = await fetch(`${origin}/`, { signal: controller.signal });

      expect(await res.text()).toBe("hello");
    });

    it("rejects with the abort reason", async () => {
      const controller = new AbortController();
      const promise = fetch(`${origin}/slow`, { signal: controller.signal });

      controller.abort(new Error("no longer needed"));

      await expect(promise).rejects.toThrow("no longer needed");
    });

    it("rejects with a TimeoutError when AbortSignal.timeout expires", async () => {
      await expect(
        fetch(`${origin}/slow`, { signal: AbortSignal.timeout(10) }),
      ).rejects.toThrowError(expect.objectContaining({ name: "TimeoutError" }));
    });
  });
});
