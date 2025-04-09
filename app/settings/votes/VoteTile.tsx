import { Paper } from "@mantine/core";
import { Vote } from "@prisma/client";
import React, { FC } from "react";

interface VoteTileProps {
  vote: Vote;
}

const VoteTile: FC<VoteTileProps> = ({ vote }) => {
  return (
    <Paper withBorder p={4}>
      {vote.name}
    </Paper>
  );
};

export default VoteTile;
