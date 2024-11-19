"use client";

import React from "react";
import style from "./root.module.scss";

const ErrorPage = ({ reset }: { reset: () => void }) => {
  return (
    <main className={style.container}>
      <div className={style.content}>
        <h1>500</h1>
        <p>Terjadi kesalahan sistem</p>
        <button onClick={() => reset()}>Coba lagi</button>
      </div>
    </main>
  );
};

export default ErrorPage;
