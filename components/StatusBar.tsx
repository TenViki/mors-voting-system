"use client";

import { useSocket } from "@/providers/SocketProvider";
import { Box, ColorSwatch, Flex, Group, Text } from "@mantine/core";
import { useEffect, useState } from "react";

const StatusBar = () => {
  const [active, setActive] = useState(0);
  const [connected, setConnected] = useState(false);
  const socket = useSocket();

  const handleChange = () => setConnected(socket?.connected || false);
  const handleActive = (active: number) => setActive(active);

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", handleChange);
    socket.on("disconnect", handleChange);
    socket.on("clients:count", handleActive);

    return () => {
      socket.off("connect", handleChange);
      socket.off("disconnect", handleChange);
      socket.off("clients:count", handleActive);
    };
  }, [socket, socket?.connected]);

  return (
    <Flex justify="space-between" pb={8} px={16}>
      <Box>
        {socket && socket.connected ? (
          <Group gap={4}>
            <ColorSwatch size={12} color="green" />
            <Box>Připojeno</Box>
          </Group>
        ) : (
          <Group gap={4}>
            <ColorSwatch size={12} color="red" />
            <Box>Odpojeno</Box>
          </Group>
        )}
      </Box>

      <Text c="dimmed">{active} připojených klientů</Text>
    </Flex>
  );
};

export default StatusBar;
