"use client";

import { getVotes } from "@/actions/vote";
import { useSocket } from "@/providers/SocketProvider";
import {
  ActionIcon,
  Box,
  Button,
  Group,
  Modal,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Vote } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { LucideKey } from "lucide-react";
import React, { FC } from "react";
import CurrentQueue from "./CurrentQueue";
import FullscreenButton from "./Fullscreen";

interface DisplayVotesProps {
  voteKey: string;
}

const DisplayVotes: FC<DisplayVotesProps> = ({ voteKey }) => {
  const socket = useSocket();
  const [votes, setVotes] = React.useState<Vote[]>([]);
  const [keyOpened, setKeyOpened] = React.useState(false);

  const votesQuery = useQuery({
    queryKey: ["votes"],
    queryFn: () => getVotes(),
  });

  React.useEffect(() => {
    if (!votesQuery.data) return;

    setVotes(votesQuery.data.votes);
  }, [votesQuery.data]);

  React.useEffect(() => {
    if (!socket) return;

    socket.on("votes:update", setVotes);

    return () => {
      socket.off("votes:update", setVotes);
    };
  }, [socket]);

  const votesTotal = votes.reduce((acc, vote) => {
    return acc + vote.votes;
  }, 0);

  const votesMax = votes.reduce((acc, vote) => {
    return Math.max(acc, vote.votes);
  }, 0);

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        padding: 16,
      }}
    >
      <Group justify="flex-end">
        <Text
          c="dimmed"
          sx={{
            flexGrow: 1,
          }}
        >
          Hlasovací systém MoRS
        </Text>

        <ActionIcon
          onClick={() => setKeyOpened(true)}
          color="#5c0087"
          size="lg"
          p={6}
        >
          <LucideKey size={"1em"} />
        </ActionIcon>
        <FullscreenButton />
      </Group>

      <Modal
        opened={keyOpened}
        onClose={() => setKeyOpened(false)}
        title="Hlasovací klíč"
      >
        <Title
          ta="center"
          sx={{
            fontSize: 48,
            letterSpacing: 12,
          }}
        >
          {voteKey}
        </Title>

        <Button
          color="#5c0087"
          mt={16}
          onClick={() => {
            setKeyOpened(false);
          }}
          fullWidth
        >
          Zavřít
        </Button>
      </Modal>

      <Stack sx={{ flexGrow: 1 }} justify="space-evenly">
        {votes.map((vote) => (
          <Group key={vote.id}>
            <Box
              sx={{
                flexBasis: "10%",
              }}
            >
              <Title order={2}>{vote.name}</Title>
              <Text c="dimmed">{vote.votes} hlasů</Text>
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                backgroundColor: "#ffffff10",
                borderRadius: 8,
                height: 16,
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#8700c6",
                  height: 16,
                  transition: "width 0.5s",
                  width:
                    votesMax == 0 ? "0%" : `${(vote.votes / votesMax) * 100}%`,
                  borderRadius: 8,
                }}
              ></Box>
            </Box>
          </Group>
        ))}
      </Stack>

      <CurrentQueue />
    </Box>
  );
};

export default DisplayVotes;
