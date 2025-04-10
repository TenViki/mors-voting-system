"use client";

import { clearQueue, moveQueue, toggleQueueState } from "@/actions/queue";
import { useQueue } from "@/lib/queue";
import { useSocket } from "@/providers/SocketProvider";
import { Box, Button, Flex, Group, Paper, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { QueuePosition, User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import {
  LucideArrowUp,
  LucideLock,
  LucideTrash,
  LucideUnlock,
} from "lucide-react";
import { useEffect, useState } from "react";

type QueuePos = QueuePosition & {
  user: User;
};

const QueuePage = () => {
  const socket = useSocket();
  const { queue, state } = useQueue();
  const [queueLocked, setQueueLocked] = useState(true);

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

  useEffect(() => {
    if (!socket) return;

    socket.on("queue:enabled", () => {
      setQueueLocked(false);
    });
    socket.on("queue:disabled", () => {
      setQueueLocked(true);
    });

    return () => {
      socket.off("queue:enabled");
      socket.off("queue:disabled");
    };
  }, [socket]);

  useEffect(() => {
    setQueueLocked(!state);
  }, [state]);

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
          color="green"
          variant="light"
          leftSection={
            queueLocked ? (
              <LucideUnlock size="1rem" />
            ) : (
              <LucideLock size="1rem" />
            )
          }
        >
          {queueLocked ? "Odemknout frontu" : "Zamknout frontu"}
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
        {queue.map((qp, i) => (
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
