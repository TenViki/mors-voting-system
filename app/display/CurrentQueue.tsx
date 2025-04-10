import { useQueue } from "@/lib/queue";
import { Box, lighten, Paper, useMantineColorScheme } from "@mantine/core";
import { QueuePosition, User } from "@prisma/client";
import styles from "./queue.module.css";
import QueueTile from "./QueueTile";

export type QueuePos = QueuePosition & {
  user: User;
};

const CurrentQueue = () => {
  const { queue } = useQueue();

  const firstThree = queue.slice(0, 3);
  const theme = useMantineColorScheme();

  const textColor =
    theme.colorScheme === "dark" ? lighten("#5c0087", 0.6) : "#5c0087";

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
        <QueueTile key={qp.id} pos={qp} index={i} />
      ))}

      {queue.length > 3 && (
        <Paper
          py={16}
          px={32}
          className={styles.queueItem}
          sx={{
            backgroundColor: "#5c008722",
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
              color: textColor,
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
