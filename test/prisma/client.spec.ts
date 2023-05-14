import { PrismaClient } from "@prisma/client";

describe("@prisma/client", () => {
  it("should work", async () => {
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: "file:./dev.db",
        },
      },
    });
    const usersWithPosts = await prisma.user.findMany({
      include: {
        posts: true,
      },
    });
    expect(usersWithPosts).toHaveLength(0);
    console.dir(usersWithPosts, { depth: null });
    await prisma.$disconnect();
  });
});
