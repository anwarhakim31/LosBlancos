"use client";

import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextProps {
  socket: Socket | null;
  userOnline: string[];
}

const SocketContext = createContext<SocketContextProps | null>(null);

export const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socket = useRef<Socket | null>(null);
  const [userOnline, setUserOnline] = useState<string[]>([]);
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

      socket.current.on("onlineUsers", (data) => {
        console.log(data);
        setUserOnline(data);
      });

      return () => {
        socket.current?.disconnect();
      };
    }
  }, [session]);

  return (
    <SocketContext.Provider value={{ socket: socket.current, userOnline }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
