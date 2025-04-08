"use client";

import { clearVotes, getVotes } from "@/actions/vote";
import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import AddVoteForm from "./AddVoteForm";
import { Box, Button, Group, Stack, Text, Title } from "@mantine/core";
import VoteTile from "./VoteTile";
import { setVoteOpen } from "@/actions/settings";

const VoteSettings = () => {
  const voteQuery = useQuery({
    queryKey: ["votes"],
    queryFn: () => getVotes(),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const changeStateMutation = useMutation({
    mutationFn: setVoteOpen,
    onSuccess: () => {
      voteQuery.refetch();
    },
  });

  const clear = async () => {
    await clearVotes();
    voteQuery.refetch();
  };

  return (
    <div>
      <Title mb={16}>Vote settings</Title>

      <Group mb={16}>
        <AddVoteForm />

        <Text c="dimmed">
          {voteQuery.data?.open ? "Voting is open" : "Voting is closed"}
        </Text>
      </Group>

      {voteQuery.data && voteQuery.data.votes.length > 0 ? (
        <Stack>
          {voteQuery.data.votes.map((vote) => (
            <VoteTile key={vote.id} vote={vote} />
          ))}
        </Stack>
      ) : (
        <p>No votes available.</p>
      )}

      <Group mt={16}>
        <Button color="gray" onClick={() => clear()}>
          Resetovat hlasování
        </Button>

        {voteQuery.data?.open ? (
          <Button color="red" onClick={() => changeStateMutation.mutate(false)}>
            Close voting
          </Button>
        ) : (
          <Button
            color="green"
            onClick={() => changeStateMutation.mutate(true)}
          >
            Open voting
          </Button>
        )}
      </Group>
    </div>
  );
};

export default VoteSettings;
