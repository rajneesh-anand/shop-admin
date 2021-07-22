import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Admin from "layouts/Admin.js";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { CURRENCY } from "constant/currency";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  shipping: {
    fontWeight: 500,
  },
  title: {
    fontWeight: 500,
  },
}));

export default function OrderViewPage({ order }) {
  const result = JSON.parse(order);
  console.log(result);
  const classes = useStyles();

  const orderDate = (order_date) => {
    let date = new Date(order_date);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Typography>Order Date # {orderDate(result.createdAt)}</Typography>
          <Typography>Order Number # {result.OrderNumber}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>Name # {result.Name}</Typography>
          <Typography>Email # {result.Email}</Typography>
          <Typography>Contact # {result.Contact}</Typography>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Typography className={classes.shipping} gutterBottom>
            Shipping Address
          </Typography>
          <Typography>Address : {result.Address.line1}</Typography>
          <Typography>City : {result.Address.city}</Typography>
          <Typography>
            State : {result.Address.state} - {result.Address.postal_code}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12}>
          <TableContainer>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Product Image</TableCell>
                  <TableCell align="right">Product Name</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {result.ProductDetails.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        height="80"
                        width="80"
                      />
                    </TableCell>
                    <TableCell align="right">{product.name}</TableCell>
                    <TableCell align="right">{product.quantity}</TableCell>
                    <TableCell align="right">{product.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          style={{ textAlign: "end", paddingRight: 32 }}
        >
          <Typography className={classes.title} gutterBottom>
            Amount : {CURRENCY.INR} {result.Amount}
          </Typography>
          <Typography className={classes.title} gutterBottom>
            GST Tax : {CURRENCY.INR} {result.Tax}
          </Typography>
          <Typography className={classes.title} gutterBottom>
            Shipping Charge : {CURRENCY.INR} {result.ShippingCharge}
          </Typography>
          <Typography className={classes.title} gutterBottom>
            Total Amount : {CURRENCY.INR} {result.TotalAmount}
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
}

OrderViewPage.layout = Admin;

export async function getServerSideProps({ params, req, res }) {
  try {
    const { id } = params;
    const order = await prisma.orders.findFirst({
      where: {
        id: Number(id),
      },
    });
    return {
      props: { order: JSON.stringify(order) },
    };
  } catch (err) {
    return {
      props: { order: JSON.stringify(err.message) },
    };
  } finally {
    async () => {
      await prisma.$disconnect();
    };
  }
}
