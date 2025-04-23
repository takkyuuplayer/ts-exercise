import express from "express";
import { createServer } from "node:http";
import { AddressInfo } from "node:net";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Server } from "socket.io";
import { io } from "socket.io-client";
import { add } from "winston";

const newServer = () => {
  const app = express();
  const server = createServer(app);
  const io = new Server(server);

  app.get("/", (_, res) => {
    res.send("<h1>Hello world</h1>");
  });

  io.on("connection", (socket) => {
    console.log("server: connected to default namespace");
    console.log(socket.handshake.query);
  });

  io.of("/my-namespace").on("connection", (socket) => {
    console.log("server: connected to my-namespace");
    console.log(socket.handshake.query);
  });

  return server;
};

describe("socket.io", () => {
  const server = newServer();
  let address: AddressInfo;

  beforeAll(async () => {
    address = await new Promise<AddressInfo>((resolve) => {
      server.listen(0, () => {
        const addr = server.address() as AddressInfo;
        console.log(addr);
        resolve(addr);
      });
    });
  });
  afterAll(() => {
    server.close();
  });

  it("should create a server", async () => {
    const socket = io(`http://localhost:${address.port}`, {
      query: {
        token: "123",
      },
    });

    await new Promise((resolve) => {
      socket.on("connect", () => {
        console.log("client: connected to default namespace");
        expect(socket.connected).toBe(true);
        socket.disconnect();
        resolve(true);
      });
    });

    const socket2 = io(`http://localhost:${address.port}/my-namespace`, {
      query: {
        token: "456",
      },
    });

    await new Promise((resolve) => {
      socket2.on("connect", () => {
        console.log("client: connected to my-namespace");
        expect(socket2.connected).toBe(true);
        socket2.disconnect();
        resolve(true);
      });
    });
  });
});
