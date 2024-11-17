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
  loading: boolean;
  bestCollection: TypeProduct[];
  ratingProduct: { total: number; range: string }[];
  userGrowth: {
    date: string;
    count: number;
  }[];
  notif: {
    _id: string;
    dataId: string;
    title: string;
    description: string;
    createdAt: Date;
    read?: boolean;
  }[];
  setNotif: React.Dispatch<
    React.SetStateAction<
      {
        _id: string;
        dataId: string;
        title: string;
        description: string;
        createdAt: Date;
        read?: boolean | undefined;
      }[]
    >
  >;
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
  const [bestCollection, setBestCollection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingProduct, setRatingProduct] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [notif, setNotif] = useState<
    {
      _id: string;
      dataId: string;
      title: string;
      description: string;
      createdAt: Date;
      read?: boolean | undefined;
    }[]
  >([]);

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

      if (session.data?.user?.role === "admin") {
        socket?.current?.on("statistik", (data) => {
          setLoading(false);
          setStatistik({
            totalUser: data?.totalUser,
            totalIncome: data?.totalIncome,
            totalProduct: data?.totalProduct,
            totalTransaction: data?.totalTransaction,
          });

          setReveneuData(data?.revenueData || []);
          setBestSeller(data?.bestSaller || []);
          setBestCollection(data?.bestCollection || []);
          setRatingProduct(data?.ratingProduct || []);
          setUserGrowth(data?.userGrowth || []);
        });

        socket?.current?.on("notification", (data) => {
          if (data.statistic) {
            setStatistik({
              totalUser: data?.statistic?.totalUser,
              totalIncome: data?.statistic?.totalIncome,
              totalProduct: data?.statistic?.totalProduct,
              totalTransaction: data.statistic?.totalTransaction,
            });

            setReveneuData(data?.statistic?.revenueData || []);
            setBestSeller(data?.statistic?.bestSaller || []);
            setBestCollection(data?.statistic?.bestCollection || []);
            setUserGrowth(data?.statistic?.userGrowth || []);
          }

          if (data.message) {
            setNotif(data.message);
          }
        });
      }

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
        loading,
        bestCollection,
        ratingProduct,
        userGrowth,
        notif,
        setNotif,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
