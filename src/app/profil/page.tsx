"use client";

import { signOut } from "next-auth/react";

import React from "react";

const ProfilPage = () => {
  return (
    <div style={{ height: "100vh" }}>
      <button
        style={{ marginTop: "10rem" }}
        onClick={() => {
          signOut({ callbackUrl: "/" });
        }}
      >
        Keluar
      </button>
    </div>
  );
};

export default ProfilPage;
