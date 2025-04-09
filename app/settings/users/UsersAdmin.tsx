import Button from "&/shared/Button";
import { addUsers, getUsers, resetUsers } from "@/actions/users";
import { useSocket } from "@/providers/SocketProvider";
import { Box, Flex, Textarea } from "@mantine/core";
import { Form, useForm } from "@mantine/form";
import { User } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import UserTile from "./UserTile";

const UsersAdmin = () => {
  const [users, setUsers] = useState<User[]>([]);

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

  useEffect(() => {
    if (!socket) return;

    socket.on("user:logon", (user) => {});
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
          mb={16}
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
