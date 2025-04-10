"use client";

import { getQueue, moveQueue } from "@/actions/queue";
import { useSocket } from "@/providers/SocketProvider";
import { Box, Button, Flex, Group, Paper, Stack, Text } from "@mantine/core";
import { QueuePosition, User } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

type QueuePos = QueuePosition & {
  user: User;
};

const QueuePage = () => {
  const socket = useSocket();
  const [queuePositions, setQueuePositions] = useState<QueuePos[]>([]);

  const handleQueueUpdate = (queuePositions: QueuePos[]) => {
    setQueuePositions(queuePositions);
  };

  const queueQuery = useQuery({
    queryKey: ["queue"],
    queryFn: () => getQueue(),
  });

  useEffect(() => {
    if (!socket) return;

    socket.on("queue:update", handleQueueUpdate);

    return () => {
      socket.off("queue:update", handleQueueUpdate);
    };
  }, [socket]);

  useEffect(() => {
    if (!queueQuery.data) return;

    setQueuePositions(queueQuery.data);
  }, [queueQuery.data]);

  const moveMutation = useMutation({
    mutationFn: () => moveQueue(),
  });

  return (
    <Flex gap={16}>
      <Stack miw={300}>
        <Button
          fullWidth
          loading={moveMutation.isPending}
          onClick={() => {
            moveMutation.mutate();
          }}
        >
          Posunout frontu
        </Button>
      </Stack>
      <Box
        sx={{
          flexGrow: 1,
          display: "grid",
          // repeat minmax
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 8,
        }}
      >
        {queuePositions.map((qp, i) => (
          <Paper
            withBorder
            key={qp.id}
            py={4}
            px={12}
            sx={{
              backgroundColor: "white",
              borderRadius: "8px",
              marginBottom: "8px",
              background: i == 0 ? "#5c0087" : undefined,
              color: i == 0 ? "white" : undefined,
            }}
          >
            <Group>
              <Text>{i + 1}</Text>

              <Text
                sx={{
                  flexGrow: 1,
                }}
              >
                {qp.user.name}
              </Text>

              <Text opacity={0.7}>
                {new Date(qp.createdAt).toLocaleTimeString("cs-CZ")}
              </Text>
            </Group>
          </Paper>
        ))}
      </Box>
    </Flex>
  );
};

export default QueuePage;
