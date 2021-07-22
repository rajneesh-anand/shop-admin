import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  console.log(req.query.page);
  const curPage = req.query.page || 1;
  const perPage = 50;

  try {
    const orders = await prisma.orders.findMany({
      take: perPage * curPage,
    });

    const totalOrders = orders.length;

    res.status(200).json({
      msg: "success",
      data: orders,
      curPage: curPage,
      maxPage: Math.ceil(totalOrders / perPage),
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  } finally {
    async () => {
      await prisma.$disconnect();
    };
  }
}
