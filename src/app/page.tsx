"use client";
import { useSession } from "next-auth/react";
import React from "react";

const HomePage = () => {
  const data = useSession();
  console.log(data);

  return <div>HomePage</div>;
};

export default HomePage;
