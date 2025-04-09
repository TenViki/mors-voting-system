"use client";

import { getVotes } from "@/actions/vote";
import { useSocket } from "@/providers/SocketProvider";
import { Box, Title } from "@mantine/core";
import { Vote } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const DisplayVotes = () => {
  const socket = useSocket();
  const [votes, setVotes] = React.useState<Vote[]>([]);

  const votesQuery = useQuery({
    queryKey: ["votes"],
    queryFn: () => getVotes(),
  });

  React.useEffect(() => {
    if (!votesQuery.data) return;

    setVotes(votesQuery.data.votes);
  }, [votesQuery.data]);

  const handleUserVoted = (voted: Vote[]) => {
    setVotes(voted);
  };

  React.useEffect(() => {
    if (!socket) return;

    socket.on("votes:update", setVotes);

    return () => {
      socket.off("votes:update", setVotes);
    };
  }, [socket]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        padding: 16,
      }}
    >
      <h1>Votes</h1>
      {votes.map((vote) => (
        <div key={vote.id}>
          <Title order={2}>{vote.name}</Title>
          <p>{vote.votes} votes</p>
        </div>
      ))}
    </Box>
  );
};

export default DisplayVotes;
