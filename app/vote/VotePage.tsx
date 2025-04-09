"use client";

import { userLogout } from "@/actions/auth";
import { getVotes } from "@/actions/vote";
import { useSocket } from "@/providers/SocketProvider";
import { Anchor, Box, Group, Stack, Text } from "@mantine/core";
import { Vote } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { LucideCheck, LucideCircle, LucideX } from "lucide-react";
import React, { useEffect } from "react";
import VoteButton from "./VoteButton";

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

    socket.on("votes:template", (votes) => {
      console.log("Votes template", votes);
      setVotes(votes);
    });

    return () => {
      socket.off("votes:add");
      socket.off("votes:clear");
      socket.off("voting:state");
      socket.off("votes:template");
    };
  }, [socket]);

  useEffect(() => {
    if (votesQuery.data) {
      setVotes(votesQuery.data.votes);
      setVoteOpened(votesQuery.data.open);
    }
  }, [votesQuery.data]);

  const specialVotes: Record<string, { color: string; icon: React.ReactNode }> =
    {
      Ano: {
        color: "green",
        icon: <LucideCheck size={48} />,
      },
      Ne: {
        color: "red",
        icon: <LucideX size={48} />,
      },
      "Zdržel se": {
        color: "yellow",
        icon: <LucideCircle size={48} />,
      },
    };

  return (
    <>
      <Group justify="space-between" px={16} py={8}>
        <Text>Hlasování</Text>

        <Anchor onClick={() => userLogout()}>Odhlásit se</Anchor>
      </Group>
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {voteOpened ? (
          <Stack sx={{ flexGrow: 1 }} px={16}>
            {votes ? (
              votes.map((vote) => (
                <VoteButton
                  key={vote.id}
                  onClick={() => {
                    // server action for votings
                  }}
                  size="xl"
                  color={specialVotes[vote.name]?.color}
                  sx={{ marginBottom: 8, flexGrow: 1 }}
                >
                  <Box>
                    {specialVotes[vote.name]?.icon && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        mb={16}
                      >
                        {specialVotes[vote.name]?.icon}
                      </Box>
                    )}
                    {vote.name}
                  </Box>
                </VoteButton>
              ))
            ) : (
              <p>No votes available.</p>
            )}
          </Stack>
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
