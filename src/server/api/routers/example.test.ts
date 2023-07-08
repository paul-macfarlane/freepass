import mockEnv from "~/__mocks__/env";
jest.mock('~/env.mjs', () => mockEnv);

import { PrismaClient } from "@prisma/client";
import { exampleRouter } from "./example";
import { TRPCError } from "@trpc/server";

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    example: {
      findMany: jest.fn(),
    },
  })),
}));


describe("exampleRouter", () => {
  let prisma: PrismaClient;

  beforeEach(() => {
    prisma = new PrismaClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("hello procedure success", async () => {
    const response = await exampleRouter
      .createCaller({
        session: null,
        prisma,
      })
      .hello({ text: "World" });

    expect(response).toEqual({ greeting: "Hello World" });
  });

  test("hello procedure bad input error", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const badInput: any = { text: 1 };
    await expect(
      exampleRouter
        .createCaller({
          session: null,
          prisma,
        }) // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        .hello(badInput)
    ).rejects.toThrow(TRPCError);
  });

  test("getAll procedure", async () => {
    (prisma.example.findMany as jest.Mock).mockResolvedValue([
      { id: 1, name: "Example" },
    ]);

    const response = await exampleRouter
      .createCaller({
        prisma,
        session: null,
      })
      .getAll();

    expect(response).toEqual([{ id: 1, name: "Example" }]);
  });

  test("getSecretMessage procedure", async () => {
    const response = await exampleRouter
      .createCaller({
        session: { expires: "never", user: { id: "1" } },
        prisma,
      })
      .getSecretMessage();

    expect(response).toEqual("you can now see this secret message!");
  });
});
