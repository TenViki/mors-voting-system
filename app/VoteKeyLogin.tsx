"use client";

import { Box, PinInput, Text, Title } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { loginVoteKey } from "./actions/votekey";

const VoteKeyLogin = () => {
  const loginMutation = useMutation({
    mutationFn: loginVoteKey,
  });

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Title mb={16}>Zadejte hlasovací klíč</Title>
      <Text c="dimmed">Pro hlasování je potřeba zadat hlasovací klíč.</Text>

      <PinInput
        length={6}
        autoFocus
        size="xl"
        type="number"
        mt={16}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
        }}
        onComplete={(value) => {
          loginMutation.mutate(value);
          // Handle the vote key submission here
        }}
        error={loginMutation.isError}
      />
    </Box>
  );
};

export default VoteKeyLogin;
