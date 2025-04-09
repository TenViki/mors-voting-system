import Button from "&/shared/Button";
import { addUsers, getUsers, resetUsers } from "@/actions/users";
import { useSocket } from "@/providers/SocketProvider";
import { Box, Flex, Textarea } from "@mantine/core";
import { Form, useForm } from "@mantine/form";
import { User, Vote } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import UserTile from "./UserTile";

const UsersAdmin = () => {
  const [users, setUsers] = useState<(User & { currentVote?: Vote | null })[]>(
    []
  );

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });

  useEffect(() => {
    if (!usersQuery.data) return;

    setUsers(usersQuery.data);
  }, [usersQuery.data]);

  const addUsersMutation = useMutation({
    mutationFn: addUsers,
    onSuccess: () => {
      usersQuery.refetch();
      mutationForm.reset();
    },
  });

  const mutationForm = useForm({
    initialValues: {
      users: "",
    },
    transformValues: (values) => ({
      users: values.users.split("\n").map((user) => user.trim()),
    }),
  });

  const socket = useSocket();

  const handleUserLogon = (user: User) => {
    setUsers((prev) => {
      // add socketId to user
      const updatedUser = { ...user, socketId: user.socketId };
      const existingUserIndex = prev.findIndex((u) => u.id === user.id);
      if (existingUserIndex !== -1) {
        const updatedUsers = [...prev];
        updatedUsers[existingUserIndex] = updatedUser;
        return updatedUsers;
      }
      return [...prev, updatedUser];
    });
  };

  const handleUserLogoff = (user: User) => {
    setUsers((prev) => {
      // remove socketId from user
      const updatedUser = { ...user, socketId: null };
      const existingUserIndex = prev.findIndex((u) => u.id === user.id);
      if (existingUserIndex !== -1) {
        const updatedUsers = [...prev];
        updatedUsers[existingUserIndex] = updatedUser;
        return updatedUsers;
      }

      return prev;
    });
  };

  const handleuserVoteSelect = (data: {
    userId: string;
    currentVote: Vote;
  }) => {
    console.log("user:vote_select", data);

    const { userId, currentVote } = data;
    setUsers((prev) => {
      const existingUserIndex = prev.findIndex((u) => u.id === userId);
      if (existingUserIndex !== -1) {
        const updatedUser = { ...prev[existingUserIndex], currentVote };
        const updatedUsers = [...prev];
        updatedUsers[existingUserIndex] = updatedUser;
        return updatedUsers;
      }
      return prev;
    });
  };

  const resetUserVotes = () => {
    setUsers((prev) => {
      const updatedUsers = prev.map((user) => ({
        ...user,
        currentVote: null,
      }));
      return updatedUsers;
    });
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("user:logon", handleUserLogon);
    socket.on("user:logoff", handleUserLogoff);
    socket.on("user:vote_select", handleuserVoteSelect);
    socket.on("votes:clear", resetUserVotes);

    return () => {
      socket.off("user:logon", handleUserLogon);
      socket.off("user:logoff", handleUserLogoff);
      socket.off("user:vote_select", handleuserVoteSelect);
      socket.off("votes:clear", resetUserVotes);
    };
  }, [socket]);

  const reset = () => {
    setUsers([]);
    usersQuery.refetch();
    resetUsers();
  };

  return (
    <Flex sx={{ flexGrow: 1 }} gap={16}>
      <Form
        form={mutationForm}
        onSubmit={(v) => addUsersMutation.mutate(v.users)}
      >
        <Textarea
          placeholder="Jména uživatelů/škol..."
          miw={350}
          minRows={6}
          mb={16}
          autosize
          {...mutationForm.getInputProps("users")}
        />

        <Button type="submit" fullWidth loading={addUsersMutation.isPending}>
          Přidat uživatele
        </Button>

        <Button color="red" fullWidth onClick={() => reset()} mt={16}>
          Vymazat uživatele
        </Button>
      </Form>

      <Box sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          {users.map((user) => (
            <UserTile key={user.id} user={user} />
          ))}
        </Box>
      </Box>
    </Flex>
  );
};

export default UsersAdmin;
