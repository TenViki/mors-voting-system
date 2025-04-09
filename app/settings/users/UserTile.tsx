import { Box, ColorSwatch, Group, Paper } from "@mantine/core";
import { User } from "@prisma/client";
import { LucideCheck } from "lucide-react";
import { FC } from "react";

interface UserTileProps {
  user: User;
}

const UserTile: FC<UserTileProps> = ({ user }) => {
  return (
    <Paper p={4} px={8} withBorder>
      <Group>
        <Box sx={{ flexGrow: 1 }}>{user.name}</Box>

        <Box>{user.currentVoteId && <LucideCheck />}</Box>

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
