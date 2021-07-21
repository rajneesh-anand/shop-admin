import React, { useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// layout for this page
import Admin from "layouts/Admin.js";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
// import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import avatar from "assets/img/faces/marc.jpg";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useForm, Controller } from "react-hook-form";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(2),

    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "300px",
    },
    "& .MuiButtonBase-root": {
      margin: theme.spacing(2),
    },
  },
}));

// const styles = {
//   cardCategoryWhite: {
//     color: "rgba(255,255,255,.62)",
//     margin: "0",
//     fontSize: "14px",
//     marginTop: "0",
//     marginBottom: "0",
//   },
//   cardTitleWhite: {
//     color: "#FFFFFF",
//     marginTop: "0px",
//     minHeight: "auto",
//     fontWeight: "300",
//     fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
//     marginBottom: "3px",
//     textDecoration: "none",
//   },
// };

function UserProfile() {
  const [isProcessing, setProcessingTo] = useState(false);
  // const useStyles = makeStyles(styles);
  const classes = useStyles();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    mode: "onBlur",
  });

  const onSubmit = async (data, e) => {
    console.log(data);
    setProcessingTo(true);
  };

  return (
    <form className={classes.root} onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="firstName"
        control={control}
        defaultValue=""
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextField
            label="First Name"
            variant="filled"
            value={value}
            onChange={onChange}
            error={!!error}
            helperText={error ? error.message : null}
          />
        )}
        rules={{ required: "First name required" }}
      />

      <Controller
        name="lastName"
        control={control}
        defaultValue=""
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextField
            label="Last Name"
            variant="filled"
            value={value}
            onChange={onChange}
            error={!!error}
            helperText={error ? error.message : null}
          />
        )}
        rules={{ required: "Last name required" }}
      />
      <Controller
        name="email"
        control={control}
        defaultValue=""
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextField
            label="Email"
            variant="filled"
            value={value}
            onChange={onChange}
            error={!!error}
            helperText={error ? error.message : null}
            type="email"
          />
        )}
        rules={{ required: "Email required" }}
      />
      <Controller
        name="password"
        control={control}
        defaultValue=""
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextField
            label="Password"
            variant="filled"
            value={value}
            onChange={onChange}
            error={!!error}
            helperText={error ? error.message : null}
            type="password"
          />
        )}
        rules={{
          required: "Password required",
          pattern: {
            value: /^([\d]{0,6})(\.[\d]{1,2})?$/,
            message: "Accept only decimal numbers",
          },
        }}
      />
      <div>
        {/* <Button variant="contained" onClick={handleClose}>
          Cancel
        </Button> */}
        <Button type="submit" variant="contained" color="primary">
          Signup
        </Button>
      </div>
    </form>

    // <form method="POST" onSubmit={handleSubmit(onSubmit)}>
    //   <GridContainer>
    //     <GridItem xs={12} sm={12} md={8}>
    //       <CustomInput
    //         error
    //         labelText="Product Name"
    //         id="product-name"
    //         formControlProps={{
    //           fullWidth: true,
    //         }}
    //         type="text"
    //         placeholder="Product Name"
    //         {...register("product", {
    //           required: "Product Name is required",
    //         })}
    //       />
    //       {errors.product && <p>{errors.product.message}</p>}
    //     </GridItem>
    //     <GridItem xs={12} sm={12} md={8}>
    //       <CustomInput
    //         labelText="Product Name"
    //         formControlProps={{
    //           fullWidth: true,
    //         }}
    //         type="text"
    //         placeholder="Product Description"
    //         {...register("productdesc", {
    //           required: "Product Description is required",
    //         })}
    //       />
    //       {errors.productdesc && <p>{errors.productdesc.message}</p>}
    //     </GridItem>
    //     <GridItem>
    //       <button type="submit">
    //         {isProcessing ? "Uploading..." : `Upload`}
    //       </button>
    //     </GridItem>
    //   </GridContainer>
    // </form>
  );
}

UserProfile.layout = Admin;

export default UserProfile;
