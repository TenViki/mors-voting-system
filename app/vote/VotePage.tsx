"use client";

import { userLogout } from "@/actions/auth";
import { didVote, getVotes } from "@/actions/vote";
import { useSocket } from "@/providers/SocketProvider";
import { Anchor, Box, Group, Stack, Text } from "@mantine/core";
import { Vote } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { LucideCheck, LucideCircle, LucideX } from "lucide-react";
import React, { useEffect } from "react";
import VoteButton from "./VoteButton";
import { registerVote } from "@/actions/voting";

export const SPECIAL_VOTES: Record<
  string,
  { color: string; icon: React.ReactNode }
> = {
  Ano: {
    color: "green",
    icon: <LucideCheck size={"1em"} />,
  },
  Ne: {
    color: "red",
    icon: <LucideX size={"1em"} />,
  },
  "Zdržel se": {
    color: "yellow",
    icon: <LucideCircle size={"1em"} />,
  },
};

const VotePage = () => {
  const socket = useSocket();
  const [votes, setVotes] = React.useState<Vote[] | null>(null);
  const [voteOpened, setVoteOpened] = React.useState(false);
  const [userVoted, setUserVoted] = React.useState(false);

  const votesQuery = useQuery({
    queryKey: ["votes"],
    queryFn: () => getVotes(),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const userVotedQuery = useQuery({
    queryKey: ["userVoted"],
    queryFn: () => didVote(),
  });

  const handleUserVoted = (voted: boolean) => {
    setUserVoted(voted);
  };

  const handleConnect = () => {
    votesQuery.refetch();
    userVotedQuery.refetch();
  };

  useEffect(() => {
    if (userVotedQuery.data == undefined) return;

    setUserVoted(userVotedQuery.data);
  }, [userVotedQuery.data]);

  useEffect(() => {
    if (!socket) return;
    socket.on("votes:add", (vote) => {
      setVotes((prevVotes) => (prevVotes ? [...prevVotes, vote] : [vote]));
    });

    socket.on("votes:clear", () => {
      setVotes(null);
      setVoteOpened(false);
      votesQuery.refetch();
      setUserVoted(false);
    });

    socket.on("voting:state", (state) => {
      setVoteOpened(state);
    });

    socket.on("votes:template", (votes) => {
      console.log("Votes template", votes);
      setVotes(votes);
    });

    socket.on("user:vote", handleUserVoted);

    socket.on("connect", handleConnect);

    return () => {
      socket.off("votes:add");
      socket.off("votes:clear");
      socket.off("voting:state");
      socket.off("votes:template");
      socket.off("user:vote", handleUserVoted);
      socket.off("connect", handleConnect);
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
        {!userVoted && voteOpened ? (
          <Stack sx={{ flexGrow: 1 }} px={16}>
            {votes ? (
              votes.map((vote) => (
                <VoteButton
                  key={vote.id}
                  onClick={() => {
                    registerVote(vote.id);
                  }}
                  size="xl"
                  color={SPECIAL_VOTES[vote.name]?.color}
                  sx={{ marginBottom: 8, flexGrow: 1 }}
                >
                  <Box>
                    {SPECIAL_VOTES[vote.name]?.icon && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          fontSize: "3rem",
                        }}
                        mb={16}
                      >
                        {SPECIAL_VOTES[vote.name]?.icon}
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
        ) : userVoted ? (
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
            c="dimmed"
          >
            Děkujeme za váš hlas!
          </Box>
        ) : (
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
            px={64}
            ta="center"
            c="dimmed"
          >
            Hlasování je momentálně uzavřeno. Počkejte na otevření hlasování.
          </Box>
        )}
      </Box>
    </>
  );
};

export default VotePage;
