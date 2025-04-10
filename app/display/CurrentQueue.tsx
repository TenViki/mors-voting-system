import { getQueue } from "@/actions/queue";
import { useSocket } from "@/providers/SocketProvider";
import { Box, Group, Paper, Text } from "@mantine/core";
import { QueuePosition, User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import styles from "./queue.module.css";

type QueuePos = QueuePosition & {
  user: User;
};

const CurrentQueue = () => {
  const socket = useSocket();
  const [queuePositions, setQueuePositions] = React.useState<QueuePos[]>([]);

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

  const firstThree = queuePositions.slice(0, 3);

  return (
    <Box
      sx={{
        height: queuePositions.length > 0 ? "9rem" : "0",
        overflowY: "hidden",
        transition: "height 0.5s",
        gap: 16,

        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
      }}
    >
      {firstThree.map((qp, i) => (
        <Paper
          py={16}
          px={32}
          key={qp.id}
          className={styles.queueItem}
          sx={{
            backgroundColor: i == 0 ? "#5c0087" : "#5c008722",
            color: i == 0 ? "white" : "black",
            display: "flex",
            height: "9rem",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              fontSize: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexGrow: 1,
            }}
            fw={700}
          >
            {qp.user.name}
          </Box>

          <Group justify="space-between">
            {i == 0 && qp.isActive ? (
              <Text>Aktuální řečník</Text>
            ) : (
              <Text c="#5c0087">Ve frontě</Text>
            )}

            <Text>{new Date(qp.createdAt).toLocaleTimeString("cs-CZ")}</Text>
          </Group>
        </Paper>
      ))}

      {queuePositions.length > 3 && (
        <Paper
          py={16}
          px={32}
          className={styles.queueItem}
          sx={{
            backgroundColor: "#5c008722",
            color: "black",
            display: "flex",
            height: "9rem",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              fontSize: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexGrow: 1,
              color: "#5c0087",
            }}
            fw={700}
          >
            +{queuePositions.length - 3}{" "}
            {queuePositions.length - 3 == 1
              ? "další"
              : queuePositions.length - 3 < 5
              ? "další"
              : "dalších"}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default CurrentQueue;
