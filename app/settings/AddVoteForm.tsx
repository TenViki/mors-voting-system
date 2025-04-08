import Button from "&/shared/Button";
import { addVote } from "@/actions/vote";
import { Form, useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Box, Group, TextInput } from "@mantine/core";

const AddVoteForm = () => {
  const qc = useQueryClient();

  const voteMutation = useMutation({
    mutationFn: (name: string) => addVote(name),
    onSuccess: (data) => {
      qc.invalidateQueries({
        queryKey: ["votes"],
      });
      voteForm.reset();
    },
  });

  const voteForm = useForm({
    initialValues: {
      name: "",
    },
    validate: {
      name: (value) => (value.length > 0 ? null : "Name is required"),
    },
  });

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Form form={voteForm} onSubmit={(v) => voteMutation.mutate(v.name)}>
        <Group>
          <TextInput
            placeholder="Hodnota možnosti..."
            required
            {...voteForm.getInputProps("name")}
          />

          <Button type="submit" loading={voteMutation.isPending}>
            Přidat možnost
          </Button>
        </Group>
      </Form>
    </Box>
  );
};

export default AddVoteForm;
