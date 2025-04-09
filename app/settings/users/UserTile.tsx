import { SPECIAL_VOTES } from "@/vote/VotePage";
import { Box, ColorSwatch, Group, Paper, Text, ThemeIcon } from "@mantine/core";
import { User, Vote } from "@prisma/client";
import { LucideCheck } from "lucide-react";
import { FC } from "react";

interface UserTileProps {
  user: User & { currentVote?: Vote | null };
}

const UserTile: FC<UserTileProps> = ({ user }) => {
  const getIcon = (vote: Vote | null | undefined) => {
    if (!vote) return null;

    const v = SPECIAL_VOTES[vote.name];
    if (!v) return <LucideCheck size={16} />;

    return (
      <Text c={v.color} sx={{ fontSize: "1.5rem" }}>
        {v.icon}
      </Text>
    );
  };

  return (
    <Paper py={4} px={12} withBorder>
      <Group mih={40}>
        <Box sx={{ flexGrow: 1 }}>{user.name}</Box>

        <Box>{getIcon(user.currentVote)}</Box>

        <Box>
          {user.socketId ? (
            <ColorSwatch color="green" size={12} />
          ) : (
            <ColorSwatch color="grey" size={12} />
          )}
        </Box>
      </Group>
    </Paper>
  );
};

export default UserTile;
