import { SPECIAL_VOTES } from "@/vote/VotePage";
import { Box, Group, Title, useMantineTheme } from "@mantine/core";
import { Vote } from "@prisma/client";
import { FC } from "react";

interface DisplayVotesTileProps {
  vote: Vote;
  maxVotes: number;
}

const DisplayVotesTile: FC<DisplayVotesTileProps> = ({ vote, maxVotes }) => {
  const color = SPECIAL_VOTES[vote.name]?.color;
  const icon = SPECIAL_VOTES[vote.name]?.icon;

  const theme = useMantineTheme();

  const resolvedColor = theme.colors[color]?.[6] || theme.colors.blue[6];

  return (
    <Box>
      <Group>
        <Box
          sx={{
            flexBasis: "10rem",
          }}
        >
          <Title ta="right">{vote.name}</Title>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
          }}
        >
          <Group
            justify="space-between"
            p={16}
            pr={24}
            sx={{
              backgroundColor: resolvedColor,
              flexWrap: "nowrap",
              transition: "width 0.5s",
              borderRadius: 8,
              width: maxVotes == 0 ? "0%" : `${(vote.votes / maxVotes) * 100}%`,
              minWidth: 150,
            }}
          >
            {icon ? (
              <Box
                sx={{
                  color: "white",
                  fontSize: 48,
                }}
              >
                {icon}
              </Box>
            ) : (
              <div></div>
            )}

            <Title c="white">{vote.votes}</Title>
          </Group>
        </Box>
      </Group>
    </Box>
  );
};

export default DisplayVotesTile;
