import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { getSession } from "next-auth/client";
import Admin from "layouts/Admin.js";
import { CURRENCY } from "constant/currency";
import Link from "next/link";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    "& .MuiTableCell-root": {
      padding: 4,
    },
  },
  title: {
    textAlign: "center",
    // width: "100%",
    margin: "8px 0px",
    backgroundColor: "purple",
    color: "white",
    padding: "8px ",
  },
});

function ProductListPage({ data }) {
  const classes = useStyles();
  const [status, setStatus] = useState();
  const [message, setMessage] = useState();

  const orderDate = (order_date) => {
    let date = new Date(order_date);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  return (
    <>
      <div className={classes.title}>Products Records</div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left"> Date</TableCell>
              <TableCell align="left">Product Image</TableCell>
              <TableCell align="left">Product Name</TableCell>
              <TableCell align="left">Category</TableCell>
              <TableCell align="left">GST Rate</TableCell>
              <TableCell align="left">Sale Price</TableCell>
              <TableCell align="left">Stock Status</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell align="left">{orderDate(item.createdAt)}</TableCell>

                <TableCell align="left">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    height="80"
                    width="80"
                  />
                </TableCell>
                <TableCell align="left">{item.name}</TableCell>
                <TableCell align="left">{item.category}</TableCell>

                <TableCell align="left">{item.gst}</TableCell>
                <TableCell align="left">{item.sellingPrice}</TableCell>

                <TableCell
                  align="left"
                  style={{
                    color: item.inStock ? "green" : "red",
                  }}
                >
                  {item.inStock ? "Yes" : "Out of Stock"}
                </TableCell>

                <TableCell align="center" style={{ width: 96 }}>
                  <Link href={`/product/edit/${item.id}`}>
                    <a>Edit</a>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
ProductListPage.layout = Admin;

export const getServerSideProps = async (context) => {
  const page = context.query.page || 1;
  let orderData = null;

  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/products?page=${page}`
    );
    if (res.status !== 200) {
      throw new Error("Failed to fetch");
    }
    orderData = await res.json();
  } catch (err) {
    orderData = { error: err.message };
  }

  return { props: { data: orderData.data } };
};

export default ProductListPage;
