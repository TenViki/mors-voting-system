import { formatDuration } from "@/lib/text";
import {
  Box,
  Group,
  lighten,
  Paper,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { QueuePos } from "./CurrentQueue";

interface QueueTileProps {
  pos: QueuePos;
  index: number;
}

const QueueTile: FC<QueueTileProps> = ({ pos, index }) => {
  const theme = useMantineColorScheme();

  const textColor =
    theme.colorScheme === "dark" ? lighten("#5c0087", 0.6) : "#5c0087";

  const [timeSpeaking, setTimeSpeaking] = useState<number | null>(null);

  useEffect(() => {
    if (index !== 0) return;

    const interval = setInterval(() => {
      setTimeSpeaking((prev) => (prev !== null ? prev + 1 : null));
    }, 1000);

    setTimeSpeaking(0);

    return () => {
      clearInterval(interval);
    };
  }, [index]);

  return (
    <Paper
      py={16}
      px={32}
      key={pos.id}
      sx={{
        backgroundColor: index == 0 ? "#5c0087" : "#5c008722",
        color: index == 0 ? "white" : undefined,
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
        {pos.user.name}
      </Box>

      <Group justify="space-between">
        {index == 0 && pos.isActive ? (
          <Text>Aktuální řečník</Text>
        ) : (
          <Text c={textColor}>Ve frontě</Text>
        )}

        <Text>
          {timeSpeaking !== null
            ? formatDuration(timeSpeaking)
            : new Date(pos.createdAt).toLocaleTimeString("cs-CZ")}
        </Text>
      </Group>
    </Paper>
  );
};

export default QueueTile;
