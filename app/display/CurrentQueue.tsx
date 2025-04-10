import { useQueue } from "@/lib/queue";
import { Box, Group, Paper, Text } from "@mantine/core";
import { QueuePosition, User } from "@prisma/client";
import styles from "./queue.module.css";

type QueuePos = QueuePosition & {
  user: User;
};

const CurrentQueue = () => {
  const { queue } = useQueue();

  const firstThree = queue.slice(0, 3);

  return (
    <Box
      sx={{
        height: queue.length > 0 ? "9rem" : "0",
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

      {queue.length > 3 && (
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
            +{queue.length - 3}{" "}
            {queue.length - 3 == 1
              ? "další"
              : queue.length - 3 < 5
              ? "další"
              : "dalších"}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default CurrentQueue;
