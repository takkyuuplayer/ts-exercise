import express from "express";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { Server } from "socket.io";
import { io, type Socket } from "socket.io-client";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const newServer = () => {
  const app = express();
  const server = createServer(app);
  const io = new Server(server);

  app.get("/", (_, res) => {
    res.send("<h1>Hello world</h1>");
  });

  io.on("connection", (socket) => {
    socket.emit("message", {
      namespace: socket.nsp.name,
      token: socket.handshake.query.token,
    });
  });

  io.of("/my-namespace").on("connection", (socket) => {
    socket.emit("message", {
      namespace: socket.nsp.name,
      token: socket.handshake.query.token,
    });
  });

  return server;
};

class Client {
  private socket: Socket;
  private messageQueue = new Map<string, unknown[]>();

  constructor(addr: Parameters<typeof io>[0], opts?: Parameters<typeof io>[1]) {
    this.socket = io(addr, opts);

    this.socket.onAny((event, ...args) => {
      const queue = this.messageQueue.get(event) ?? [];
      queue.push(args.length === 1 ? args[0] : args);
      this.messageQueue.set(event, queue);
    });
  }

  async waitConnect(): Promise<void> {
    if (this.socket.connected) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.socket.once("connect", () => {
        expect(this.socket.connected).toBe(true);
        resolve();
      });

      this.socket.connect();
    });
  }

  async waitEvent(eventName: string): Promise<unknown> {
    const queue = this.messageQueue.get(eventName);
    if (queue && queue.length > 0) {
      return Promise.resolve(queue.shift());
    }

    return new Promise((resolve) => {
      this.socket.once(eventName, (msg) => {
        resolve(msg);
      });
    });
  }
}

describe("socket.io", () => {
  const server = newServer();
  let address: AddressInfo;

  beforeAll(async () => {
    address = await new Promise<AddressInfo>((resolve) => {
      server.listen(0, () => {
        const addr = server.address() as AddressInfo;
        resolve(addr);
      });
    });
  });
  afterAll(() => {
    server.close();
  });

  it("connects default ns", async () => {
    const client = new Client(`http://localhost:${address.port}`, {
      query: {
        token: "123",
      },
    });
    await client.waitConnect();

    const msg = await client.waitEvent("message");
    expect(msg).toEqual({
      namespace: "/",
      token: "123",
    });
  });

  it("connects ns", async () => {
    const client = new Client(`http://localhost:${address.port}/my-namespace`, {
      query: {
        token: "123",
      },
    });
    await client.waitConnect();

    const msg = await client.waitEvent("message");
    expect(msg).toEqual({
      namespace: "/my-namespace",
      token: "123",
    });
  });
});
