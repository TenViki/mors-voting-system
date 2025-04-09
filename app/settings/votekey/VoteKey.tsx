import Button from "&/shared/Button";
import { adminGetVoteKey, getVoteKey, setVoteKey } from "@/actions/votekey";
import { Group, TextInput } from "@mantine/core";
import { Form, useForm } from "@mantine/form";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";

interface VoteKeyProps {}

const VoteKey = () => {
  const voteKeyQuery = useQuery({
    queryKey: ["voteKey"],
    queryFn: () => adminGetVoteKey(),
  });

  const keyForm = useForm({
    initialValues: {
      voteKey: "",
    },
    validate: {
      voteKey: (value) =>
        value.length !== 6 || !/^\d+$/.test(value)
          ? "Hlasovací klíč musí mít 6 čísel"
          : null,
    },
  });

  const updateKeyMutation = useMutation({
    mutationFn: setVoteKey,
  });

  useEffect(() => {
    if (voteKeyQuery.data) {
      keyForm.setFieldValue("voteKey", voteKeyQuery.data);
    }
  }, [voteKeyQuery.data]);

  return (
    <Form form={keyForm} onSubmit={(v) => updateKeyMutation.mutate(v.voteKey)}>
      <Group align="flex-start">
        <TextInput
          placeholder="Hlasovací klíč"
          {...keyForm.getInputProps("voteKey")}
        />

        <Button type="submit" loading={updateKeyMutation.isPending}>
          Uložit
        </Button>
      </Group>
    </Form>
  );
};

export default VoteKey;
