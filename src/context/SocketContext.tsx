"use client";

import { TypeProduct } from "@/services/type.module";
import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextProps {
  socket: Socket | null;
  userOnline: string[];
  statistik: {
    totalUser: number;
    totalIncome: number;
    totalProduct: number;
    totalTransaction: number;
  };
  reveneuData: {
    month: string;
    income: number;
    transaction: number;
    product: number;
  }[];
  bestSeller: TypeProduct[];
}

const SocketContext = createContext<SocketContextProps | null>(null);

export const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socket = useRef<Socket | null>(null);
  const [userOnline, setUserOnline] = useState<string[]>([]);
  const [statistik, setStatistik] = useState({
    totalUser: 0,
    totalIncome: 0,
    totalProduct: 0,
    totalTransaction: 0,
  });
  const [reveneuData, setReveneuData] = useState([]);
  const [bestSeller, setBestSeller] = useState([]);

  const session = useSession();

  useEffect(() => {
    if (session.data?.user) {
      socket.current = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
        withCredentials: true,
        query: {
          userId: session.data?.user?.id,
          role: session.data?.user?.role,
        },
      });
      socket.current.on("onlineUsers", (data) => setUserOnline(data));

      if (session.data?.user?.role === "admin")
        socket?.current?.on("statistik", (data) => {
          setStatistik({
            totalUser: data.totalUser,
            totalIncome: data.totalIncome,
            totalProduct: data.totalProduct,
            totalTransaction: data.totalTransaction,
          });

          setReveneuData(data.revenueData);
          setBestSeller(data.bestSaller);
        });

      return () => {
        socket.current?.disconnect();
      };
    }
  }, [session]);

  return (
    <SocketContext.Provider
      value={{
        socket: socket.current,
        userOnline,
        statistik,
        reveneuData,
        bestSeller,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
