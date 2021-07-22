import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  try {
    const orderNumber = req.query.id;
    const { orderStatus } = req.body;

    console.log(orderNumber);
    console.log(orderStatus);

    await prisma.orders.update({
      where: { OrderNumber: orderNumber },
      data: { OrderStatus: orderStatus },
    });
    return res.status(200).json({ msg: "success" });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  } finally {
    async () => {
      await prisma.$disconnect();
    };
  }
}
