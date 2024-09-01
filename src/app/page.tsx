"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

const HomePage = () => {
  const { data } = useSession();
  console.log(data);

  return (
    <div>
      <button onClick={() => (data ? signOut() : signIn())}>
        {data ? "Sign Out" : "Sign In"}
      </button>
    </div>
  );
};

export default HomePage;
