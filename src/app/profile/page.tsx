"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import React from "react";

const ProfilPage = () => {
  const { push } = useRouter();

  return (
    <div style={{ height: "100vh" }}>
      <button
        style={{ marginTop: "10rem" }}
        onClick={() => {
          signOut({ callbackUrl: "/login" });
          push("/login");
        }}
      >
        Keluar
      </button>
    </div>
  );
};

export default ProfilPage;
