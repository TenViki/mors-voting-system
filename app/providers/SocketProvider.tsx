"use client";

import { io, Socket } from "socket.io-client";

import React, { FC, useEffect } from "react";

interface SocketProviderProps {
  children: React.ReactNode;
}

const SocketContext = React.createContext<Socket | null>(null);

export const useSocket = () => {
  const context = React.useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

const SocketProvider: FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = React.useState<Socket | null>(null);

  useEffect(() => {
    let socketInstance = io();

    socketInstance.on("connect", () => {
      console.log("Connected to server");
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
