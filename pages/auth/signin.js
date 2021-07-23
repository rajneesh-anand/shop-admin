import React, { useState } from "react";
import { signIn, getCsrfToken, getSession } from "next-auth/client";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Seo from "components/Seo";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
  },
}));

export default function SignInPage({ csrfToken }) {
  const classes = useStyles();
  const [email, setEmail] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    signIn("email", { email: email });
  };

  return (
    <>
      <Seo title="Sign In | Admin" />
      <Grid container className={classes.root}>
        <Grid item xs={12}>
          <div className="logo">
            <img src="/img/logo.png" alt="logo" />
          </div>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Typography variant="h6" component="h6" color="primary" gutterBottom>
            Sign In
          </Typography>
          <div>
            <button
              className="google"
              onClick={() =>
                signIn("google", {
                  callbackUrl: "http://localhost:3000",
                })
              }
            >
              <i className="fab fa-google"></i>
              <span>Login with Google</span>
            </button>
          </div>
          <div>
            <button
              className="facebook"
              onClick={() =>
                signIn("facebook", {
                  callbackUrl: "http://localhost:3000",
                })
              }
            >
              <i className="fab fa-facebook"></i>{" "}
              <span>Login with Facebook</span>
            </button>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

              <input
                type="email"
                name="email"
                required
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email !"
              />

              <div>
                <button className="email" type="submit">
                  <i className="fas fa-envelope"></i>
                  <span>Login With Email</span>
                </button>
              </div>
            </form>
          </div>
        </Grid>
      </Grid>
    </>
  );
}

export async function getServerSideProps(context) {
  const csrfToken = await getCsrfToken(context);
  const session = await getSession(context);
  if (session) {
    return {
      redirect: {
        destination: "/admin/dashboard",
        permanent: false,
      },
    };
  }
  return {
    props: { csrfToken },
  };
}
