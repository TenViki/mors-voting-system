"use client";

import { userLogout } from "@/actions/auth";
import { getVotes } from "@/actions/vote";
import { useSocket } from "@/providers/SocketProvider";
import { Anchor, Box, Group, Text } from "@mantine/core";
import { Vote } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";

const VotePage = () => {
  const socket = useSocket();
  const [votes, setVotes] = React.useState<Vote[] | null>(null);
  const [voteOpened, setVoteOpened] = React.useState(false);

  const votesQuery = useQuery({
    queryKey: ["votes"],
    queryFn: () => getVotes(),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (!socket) return;
    socket.on("votes:add", (vote) => {
      setVotes((prevVotes) => (prevVotes ? [...prevVotes, vote] : [vote]));
    });

    socket.on("votes:clear", () => {
      setVotes(null);
      setVoteOpened(false);
      votesQuery.refetch();
    });

    socket.on("voting:state", (state) => {
      setVoteOpened(state);
    });

    return () => {
      socket.off("votes:add");
      socket.off("votes:clear");
      socket.off("voting:state");
    };
  }, [socket]);

  useEffect(() => {
    if (votesQuery.data) {
      setVotes(votesQuery.data.votes);
      setVoteOpened(votesQuery.data.open);
    }
  }, [votesQuery.data]);

  return (
    <>
      <Group justify="space-between" px={16} py={8}>
        <Text>Hlasování</Text>

        <Anchor onClick={() => userLogout()}>Odhlásit se</Anchor>
      </Group>
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {voteOpened ? (
          <div>
            {votes ? (
              votes.map((vote) => (
                <div key={vote.id}>
                  <p>{vote.name}</p>
                </div>
              ))
            ) : (
              <p>No votes available.</p>
            )}
          </div>
        ) : (
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            Hlasování je momentálně uzavřeno. Počkejte na otevření hlasování.
          </Box>
        )}
      </Box>
    </>
  );
};

export default VotePage;
