"use client";

import Button from "&/shared/Button";
import { adminLogin } from "@/actions/admin";
import { Box, Group, Text, TextInput, Title } from "@mantine/core";
import { Form, useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const AdminLogin = () => {
  const router = useRouter();

  const adminForm = useForm({
    initialValues: {
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: adminLogin,
    onError: (error: Error) => {
      adminForm.setFieldError("password", error.message);
    },
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Title order={2} mb="md">
        Nastavení hlasování
      </Title>
      <Box>
        <Text c="dimmed" mb={8}>
          Pro přístup k nastavení se přihlašte pomocí hesla.
        </Text>

        <Form
          form={adminForm}
          onSubmit={(v) => loginMutation.mutate(v.password)}
        >
          <Group align="flex-start">
            <TextInput
              sx={{ flexGrow: 1 }}
              placeholder="Enter admin password"
              type="password"
              required
              {...adminForm.getInputProps("password")}
            />

            <Button
              type="submit"
              loading={loginMutation.isPending}
              disabled={!adminForm.isValid()}
            >
              Přihlásit se
            </Button>
          </Group>
        </Form>
      </Box>
    </Box>
  );
};

export default AdminLogin;
