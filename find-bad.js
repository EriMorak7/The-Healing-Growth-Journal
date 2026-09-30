const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  for (const f of Object.keys(Prisma.ArticleScalarFieldEnum)) {
    try {
      await prisma.article.findMany({ select: { [f]: true } });
      console.log('ok  ', f);
    } catch (e) {
      console.log('BAD ', f, e.code);
    }
  }
  await prisma.$disconnect();
})();