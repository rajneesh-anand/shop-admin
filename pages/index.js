import React from "react";
import Router from "next/router";
import { useSession } from "next-auth/client";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function Index() {
  const [session, loading] = useSession();
  React.useEffect(() => {
    if (!loading) {
      if (!session) {
        Router.push("/auth/signin");
      } else {
        Router.push("/admin/dashboard");
      }
    }
  }, [session, loading]);

  return loading && <CircularProgress />;
}
