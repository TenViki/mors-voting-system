"use client";

import { io, Socket } from "socket.io-client";

import { userLogout } from "@/actions/auth";
import React, { FC, useEffect } from "react";

interface SocketProviderProps {
  children: React.ReactNode;
  userToken?: string;
}

const SocketContext = React.createContext<Socket | null>(null);

export const useSocket = () => {
  const context = React.useContext(SocketContext);
  return context;
};

const SocketProvider: FC<SocketProviderProps> = ({ children, userToken }) => {
  const [socket, setSocket] = React.useState<Socket | null>(null);

  useEffect(() => {
    let socketInstance = io();

    socketInstance.on("connect", () => {
      console.log("Connected to server");

      console.log("Sending user token", userToken);
      userToken && socketInstance.emit("user:auth", userToken);
      socketInstance.on("user:auth_res", (res) => {
        if (!res) {
          console.error("Authentication failed");
          userLogout();
          return;
        }
      });
    });

    socketInstance.on("newLoad", (random) => {
      console.log("New load received:", random);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.off("connect");
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
