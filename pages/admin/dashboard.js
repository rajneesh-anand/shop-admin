import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Admin from "layouts/Admin.js";
import { CURRENCY } from "constant/currency";
import Link from "next/link";
import { getSession } from "next-auth/client";

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

function Dashboard({ data }) {
  const classes = useStyles();
  const [status, setStatus] = useState();
  const [message, setMessage] = useState();

  const orderDate = (order_date) => {
    let date = new Date(order_date);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  const handleChange = (event) => {
    const name = event.target.value;
    setStatus(name);
  };

  const updateOrderStatus = async (id) => {
    console.log(status);
    try {
      const result = await fetch(`/api/orders/${id}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderStatus: status }),
      });
      const resultJson = await result.json();

      if (resultJson.msg === "success") {
        setMessage("Order Status Updated !");
      }
    } catch (error) {
      console.log(error);
      setMessage("Order Status not update");
    }
  };

  return (
    <>
      <div className={classes.title}>Orders Records</div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Order Date</TableCell>
              <TableCell align="left">Product Image</TableCell>
              <TableCell align="left">Product Name</TableCell>
              <TableCell align="left">Quantity</TableCell>
              <TableCell align="left">Amount</TableCell>
              <TableCell align="left">Order Number</TableCell>
              <TableCell align="left">Order Status</TableCell>
              <TableCell align="left">Payment Status</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell align="left">{orderDate(item.createdAt)}</TableCell>
                {item.ProductDetails.map((product, index) => (
                  <React.Fragment key={index}>
                    <TableCell component="th" scope="row">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        height="80"
                        width="80"
                      />
                    </TableCell>
                    <TableCell align="left">{product.name}</TableCell>
                    <TableCell align="left">{product.quantity}</TableCell>
                  </React.Fragment>
                ))}
                <TableCell align="left">
                  {CURRENCY.INR}
                  {item.TotalAmount}
                </TableCell>
                <TableCell align="left">{item.OrderNumber}</TableCell>

                <TableCell
                  align="left"
                  style={{
                    color: item.OrderStatus === "Delivered" ? "green" : "red",
                  }}
                >
                  <FormControl>
                    <Select
                      native
                      defaultValue={item.OrderStatus}
                      // value={status}
                      onChange={handleChange}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Delivered">Delivered</option>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell
                  align="left"
                  style={{
                    color:
                      item.PaymentStatus === "TXN_SUCCESS" ? "green" : "red",
                  }}
                >
                  {item.PaymentStatus}
                </TableCell>

                <TableCell align="center" style={{ width: 96 }}>
                  <Link href={`/order/view/${item.id}`}>
                    <a>View Details</a>
                  </Link>
                  <button
                    onClick={() => updateOrderStatus(item.OrderNumber)}
                    style={{ cursor: "pointer", marginTop: 4 }}
                  >
                    Update Status
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
Dashboard.layout = Admin;

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
      `${process.env.NEXTAUTH_URL}/api/orders?page=${page}`
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

export default Dashboard;
