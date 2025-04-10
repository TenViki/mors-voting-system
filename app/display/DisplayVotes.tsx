"use client";

import ColorSchemeSwitch from "&/shared/ColorSchemeSwitch";
import { getVotes } from "@/actions/vote";
import { useSocket } from "@/providers/SocketProvider";
import { voteTemplates } from "@/types/templates";
import { ActionIcon, Box, Flex, Group, Text } from "@mantine/core";
import { Vote } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { LucideKey } from "lucide-react";
import React, { FC, useMemo } from "react";
import CurrentQueue from "./CurrentQueue";
import DisplayVotesTile from "./DisplayVotesTile";
import FullscreenButton from "./Fullscreen";
import KeyModal from "./KeyModal";

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
    socket.on("votes:add", (vote) => setVotes((prev) => [...prev, vote]));

    return () => {
      socket.off("votes:update", setVotes);
      socket.off("votes:add");
    };
  }, [socket]);

  const votesTotal = votes.reduce((acc, vote) => {
    return acc + vote.votes;
  }, 0);

  const votesMax = votes.reduce((acc, vote) => {
    return Math.max(acc, vote.votes);
  }, 0);

  const isTemplate = useMemo(
    () =>
      voteTemplates.some(
        (template) =>
          template.values.length === votes.length &&
          template.values.every((value, index) => value === votes[index].name)
      ),
    [votes]
  );

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

        <ColorSchemeSwitch />
        <FullscreenButton />
      </Group>

      <KeyModal
        voteKey={voteKey}
        opened={keyOpened}
        onClose={() => setKeyOpened(false)}
      />

      <Flex sx={{ flexGrow: 1, flexDirection: "column" }} mb={16}>
        {votes.map((vote) => (
          <DisplayVotesTile
            vote={vote}
            maxVotes={votesMax}
            key={vote.id}
            isCompact={isTemplate}
          />
        ))}
      </Flex>

      <CurrentQueue />
    </Box>
  );
};

export default DisplayVotes;
