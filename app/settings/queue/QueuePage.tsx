"use client";

import {
  clearQueue,
  getQueue,
  moveQueue,
  toggleQueueState,
} from "@/actions/queue";
import { useSocket } from "@/providers/SocketProvider";
import { Box, Button, Flex, Group, Paper, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { QueuePosition, User } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { LucideArrowUp, LucideTrash } from "lucide-react";
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

  const clearMutation = useMutation({
    mutationFn: () => clearQueue(),
  });

  const toggleMutation = useMutation({
    mutationFn: () => toggleQueueState(),
  });

  const openClearPage = () => {
    modals.openConfirmModal({
      title: "Vymazat frontu",
      children: (
        <Text size="sm">
          Oprvdu chcete vymazat frontu? Tato akce je nevratná.
        </Text>
      ),
      confirmProps: { color: "red" },
      onConfirm: () => {
        clearMutation.mutate();
      },
    });
  };

  return (
    <Flex gap={16} sx={{ flexGrow: 1 }}>
      <Stack miw={300}>
        <Button
          fullWidth
          loading={moveMutation.isPending}
          leftSection={<LucideArrowUp size="1rem" />}
          variant="light"
          onClick={() => {
            moveMutation.mutate();
          }}
        >
          Posunout frontu
        </Button>

        <Button
          fullWidth
          color="red"
          variant="light"
          loading={clearMutation.isPending}
          leftSection={<LucideTrash size="1rem" />}
          onClick={openClearPage}
        >
          Vymazat frontu
        </Button>

        <Button
          fullWidth
          loading={toggleMutation.isPending}
          onClick={() => toggleMutation.mutate()}
        >
          Zamknout/odemknout frontu
        </Button>
      </Stack>
      <Box
        sx={{
          flexGrow: 1,
          display: "grid",
          // repeat minmax
          gridAutoRows: "max-content",
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
            radius={8}
            sx={{
              backgroundColor: "white",
              background: i == 0 ? "#5c0087" : undefined,
              color: i == 0 ? "white" : undefined,
              // height: "fit-content",
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
