import React, { useState } from "react";
import { signIn, getCsrfToken, useSession } from "next-auth/client";

export default function SignIn({ csrfToken }) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    signIn("email", { email: email });
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-6">
          <div className="signBlock">
            <div className="commonStyle">
              <p>SignIn KokeLiko</p>
            </div>

            <div className="commonStyle">
              <button
                className="google"
                onClick={() =>
                  signIn("google", {
                    callbackUrl: "http://localhost:3000",
                  })
                }
              >
                Login with Google
              </button>
            </div>

            <div className="commonStyle">
              <button
                className="facebook"
                onClick={() =>
                  signIn("facebook", {
                    callbackUrl: "https://kokeliko.vercel.app",
                  })
                }
              >
                Login with Facebook
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
              <div className="commonStyle">
                <input
                  type="email"
                  name="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email !"
                  value={email}
                />
              </div>
              <div className="commonStyle">
                <button className="email" type="submit">
                  Login With Email
                </button>
              </div>
            </form>
            <div className="text-center">
              <p>
                By Login, you agree to KokeLiko
                <a
                  href={process.env.PUBLIC_URL + "/termsofuse"}
                  target="_blank"
                >
                  {" "}
                  Terms of Service{" "}
                </a>
                and
                <a
                  href={process.env.PUBLIC_URL + "/privacypolicy"}
                  target="_blank"
                >
                  {" "}
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const csrfToken = await getCsrfToken(context);

  return {
    props: { csrfToken },
  };
}
