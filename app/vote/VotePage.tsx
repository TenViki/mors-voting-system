"use client";

import { userLogout } from "@/actions/auth";
import { toggleQueue } from "@/actions/queue";
import { didVote, getVotes } from "@/actions/vote";
import { registerVote } from "@/actions/voting";
import { useQueue } from "@/lib/queue";
import { useSocket } from "@/providers/SocketProvider";
import { Anchor, Box, Button, Group, Stack, Text } from "@mantine/core";
import { Vote } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { LucideCheck, LucideCircle, LucideLock, LucideX } from "lucide-react";
import React, { useEffect } from "react";
import VoteButton from "./VoteButton";

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
  const { queue, state } = useQueue();

  const [votes, setVotes] = React.useState<Vote[] | null>(null);
  const [voteOpened, setVoteOpened] = React.useState(false);
  const [userVoted, setUserVoted] = React.useState(false);
  const [queueStatus, setQueueStatus] = React.useState<
    "active" | "inactive" | "disabled" | null
  >(null);
  const [currentQueueId, setCurrentQueueId] = React.useState<string | null>(
    null
  );

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

    setUserVoted(userVotedQuery.data.vote);
    state && setQueueStatus(userVotedQuery.data.queue ? "active" : "inactive");
    userVotedQuery.data.queue && setCurrentQueueId(userVotedQuery.data.queue);
  }, [userVotedQuery.data, state]);

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

    socket.on("queue:join", (id: string) => {
      setQueueStatus("active");
      setCurrentQueueId(id);
    });
    socket.on("queue:leave", () => {
      queueStatus !== "disabled" && setQueueStatus("inactive");
      setCurrentQueueId(null);
    });
    socket.on("queue:disabled", () => setQueueStatus("disabled"));
    socket.on("queue:enabled", () => {
      const hasVoted = queue.find((pos) => pos.id === currentQueueId);
      setQueueStatus(hasVoted ? "active" : "inactive");
    });

    return () => {
      socket.off("votes:add");
      socket.off("votes:clear");
      socket.off("voting:state");
      socket.off("votes:template");
      socket.off("user:vote", handleUserVoted);
      socket.off("connect", handleConnect);

      socket.off("queue:join");
      socket.off("queue:leave");
      socket.off("queue:disabled");
      socket.off("queue:enabled");
    };
  }, [socket, currentQueueId, queue, queueStatus]);

  useEffect(() => {
    if (votesQuery.data) {
      setVotes(votesQuery.data.votes);
      setVoteOpened(votesQuery.data.open);
    }
  }, [votesQuery.data]);

  useEffect(() => {
    console.log("State", state);
    if (!state) {
      console.log("Setting disabled");
      setQueueStatus("disabled");
    }
  }, [state]);

  const handleRequestQueue = async () => {
    await toggleQueue();
  };

  const position = queue.findIndex((pos) => pos.id === currentQueueId);

  return (
    <>
      <Group justify="space-between" px={8} py={8}>
        <Button
          color={queueStatus === "inactive" ? "#5c0087" : "red"}
          onClick={handleRequestQueue}
          disabled={queueStatus === "disabled"}
        >
          {queueStatus === "inactive" ? (
            "Požádat o slovo"
          ) : queueStatus === "active" ? (
            "Zrušit žádost"
          ) : (
            <LucideLock size={"1rem"} />
          )}
        </Button>

        {position === 0 && <Text>Máte slovo!</Text>}
        {position > 0 && <Text c="dimmed">Jste {position + 1}. ve frontě</Text>}

        <Anchor c="#5c0087" onClick={() => userLogout()}>
          Odhlásit se
        </Anchor>
      </Group>
      <Box
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
        mb={16}
      >
        {!userVoted && voteOpened ? (
          <Stack sx={{ flexGrow: 1 }} px={8} gap={8}>
            {votes && votes.length ? (
              votes.map((vote) => (
                <VoteButton
                  key={vote.id}
                  onClick={() => {
                    registerVote(vote.id);
                  }}
                  size="xl"
                  color={SPECIAL_VOTES[vote.name]?.color}
                  sx={{ flexGrow: 1 }}
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
              <Text
                c="dimmed"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexGrow: 1,
                }}
              >
                Nebyly nastaveny žádné možnosti.
              </Text>
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
