import { SPECIAL_VOTES } from "@/vote/VotePage";
import { Box, Flex, Title, useMantineTheme } from "@mantine/core";
import { Vote } from "@prisma/client";
import { FC } from "react";

interface DisplayVotesTileProps {
  vote: Vote;
  maxVotes: number;
  isCompact?: boolean;
}

const DisplayVotesTile: FC<DisplayVotesTileProps> = ({
  vote,
  maxVotes,
  isCompact,
}) => {
  const color = SPECIAL_VOTES[vote.name]?.color;
  const icon = SPECIAL_VOTES[vote.name]?.icon;

  const theme = useMantineTheme();

  const resolvedColor = theme.colors[color]?.[6] || theme.colors.blue[6];

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Flex
        mr={32}
        sx={{
          gap: isCompact ? 16 : 4,
          "&:not(:last-child)": {
            marginBottom: isCompact ? 16 : 4,
          },

          ...(isCompact
            ? {
                flexDirection: "row",
                alignItems: "center",
              }
            : {
                flexDirection: "column",
                alignItems: "stretch",
                justifyContent: "center",
              }),
        }}
      >
        <Box
          sx={{
            flexBasis: isCompact ? "10rem" : undefined,
          }}
        >
          <Title ta={isCompact ? "center" : "left"} order={isCompact ? 1 : 2}>
            {vote.name}
          </Title>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
          }}
        >
          <Flex
            justify="space-between"
            pl={isCompact ? 16 : 8}
            py={isCompact ? 16 : 8}
            pr={isCompact ? 24 : 16}
            sx={{
              backgroundColor:
                vote.votes == 0 ? resolvedColor + "33" : resolvedColor,
              flexWrap: "nowrap",
              transition: "width 0.5s, background-color 0.5s",
              borderRadius: 8,
              width: maxVotes == 0 ? "0%" : `${(vote.votes / maxVotes) * 100}%`,
              minWidth: icon ? 150 : 68,
              alignItems: "center",
            }}
          >
            {icon ? (
              <Box
                sx={{
                  fontSize: isCompact ? 48 : 32,
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
              order={isCompact ? 1 : 2}
            >
              {vote.votes}
            </Title>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default DisplayVotesTile;
