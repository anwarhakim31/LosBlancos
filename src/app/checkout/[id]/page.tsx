"use client";

import { transactionService } from "@/services/transaction/method";
import { ResponseError } from "@/utils/axios/response-error";
import React, { useEffect, useState } from "react";

const Checkout = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [data, setData] = useState([]);

  useEffect(() => {
    const getTransaction = async () => {
      try {
        const res = await transactionService.get(id);

        if (res.status === 200) {
          setData(res.data.transaction);
        }
      } catch (error) {
        ResponseError(error);
      }
    };

    if (id) {
      getTransaction();
    }
  }, [id]);

  console.log(data);

  return <div>Checkout</div>;
};

export default Checkout;
