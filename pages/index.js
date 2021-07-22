import React from "react";
import Router from "next/router";
import { useSession, getSession } from "next-auth/client";

import CircularProgress from "@material-ui/core/CircularProgress";

export default function Index() {
  return <CircularProgress />;
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  } else {
    return {
      redirect: {
        destination: "/admin/dashboard",
        permanent: false,
      },
    };
  }
}
