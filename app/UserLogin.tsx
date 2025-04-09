"use client";

import { Box, Select, Title } from "@mantine/core";
import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { userLogin } from "./actions/auth";
import { getUsers } from "./actions/users";
import { useSocket } from "./providers/SocketProvider";

const UserLogin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const socket = useSocket();
  const router = useRouter();

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });

  useEffect(() => {
    if (!usersQuery.data) return;

    setUsers(usersQuery.data);
  }, [usersQuery.data]);

  const handleUserLogon = (data: User) => {
    console.log("User logon", data);
    setUsers((prev) => {
      const index = prev.findIndex((u) => u.id === data.id);
      if (index === -1) return [...prev, data];
      const newUsers = [...prev];
      newUsers[index] = { ...data, socketId: data.socketId };

      console.log("New users", newUsers);
      return newUsers;
    });
  };

  const handleUserLogoff = (user: User) => {
    console.log("User logoff", user);
    setUsers((prev) => {
      const index = prev.findIndex((u) => u.id === user.id);
      if (index === -1) return prev;
      const newUsers = [...prev];
      newUsers[index] = { ...user, socketId: null };
      return newUsers;
    });
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("user:logon", handleUserLogon);
    socket.on("user:logoff", handleUserLogoff);

    return () => {
      socket.off("user:logon", handleUserLogon);
      socket.off("user:logoff", handleUserLogoff);
    };
  }, [socket]);

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
      <Title mb={16}>Přihlašte se jako hlasující</Title>
      <Box
        sx={{
          display: "flex",
        }}
      >
        <Select
          size="md"
          searchable
          w={600}
          maw={"calc(100vw - 2rem)"}
          sx={{
            flexGrow: 1,
          }}
          placeholder="Vyberte vaše jméno/školu..."
          data={users.map((user) => ({
            label: user.name,
            value: user.id,
            disabled: !!user.socketId,
          }))}
          onChange={async (value) => {
            if (!value) return;

            const user = users.find((u) => u.id === value);
            if (!user) return;

            await userLogin(user.id, socket?.id as string);
          }}
        />
      </Box>
    </Box>
  );
};

export default UserLogin;
