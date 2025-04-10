import { SPECIAL_VOTES } from "@/vote/VotePage";
import { Box, Flex, Group, Title, useMantineTheme } from "@mantine/core";
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
      <Group mr={32}>
        <Box
          sx={{
            flexBasis: "10rem",
          }}
        >
          <Title ta="center">{vote.name}</Title>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
          }}
        >
          <Flex
            justify="space-between"
            p={16}
            pr={24}
            sx={{
              backgroundColor:
                vote.votes == 0 ? resolvedColor + "33" : resolvedColor,
              flexWrap: "nowrap",
              transition: "width 0.5s, background-color 0.5s",
              borderRadius: 8,
              width: maxVotes == 0 ? "0%" : `${(vote.votes / maxVotes) * 100}%`,
              minWidth: icon ? 150 : 68,
            }}
          >
            {icon ? (
              <Box
                sx={{
                  fontSize: 48,
                  color: vote.votes == 0 ? resolvedColor : "white",
                  transition: "color 0.5s",
                }}
              >
                {icon}
              </Box>
            ) : (
              <div></div>
            )}

            <Title
              sx={{
                transition: "color 0.5s",
                color: vote.votes == 0 ? resolvedColor : "white",
              }}
            >
              {vote.votes}
            </Title>
          </Flex>
        </Box>
      </Group>
    </Box>
  );
};

export default DisplayVotesTile;
