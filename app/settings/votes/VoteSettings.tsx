"use client";

import { setVoteOpen } from "@/actions/settings";
import { applyTemplate, clearVotes, getVotes } from "@/actions/vote";
import { voteTemplates } from "@/types/templates";
import { Button, Group, Select, Stack, Text } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import AddVoteForm from "./AddVoteForm";
import VoteTile from "./VoteTile";

const VoteSettings = () => {
  const voteQuery = useQuery({
    queryKey: ["votes"],
    queryFn: () => getVotes(),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const changeStateMutation = useMutation({
    mutationFn: setVoteOpen,
    onSuccess: () => {
      voteQuery.refetch();
    },
  });

  const clear = async () => {
    await clearVotes();
    voteQuery.refetch();
  };

  const applyTemplateAction = async (name: string) => {
    await applyTemplate(name);
    voteQuery.refetch();
  };

  return (
    <div>
      <Group mb={16}>
        <Select
          value={null}
          placeholder="Použít šablonu"
          data={voteTemplates.map((template) => ({
            value: template.name,
            label: template.name,
          }))}
          disabled={
            voteQuery.data?.open || (voteQuery.data?.votes.length || 0) > 0
          }
          onChange={(value) => {
            if (value) {
              applyTemplateAction(value);
            }
          }}
        />

        <AddVoteForm />

        <Text c="dimmed">
          {voteQuery.data?.open ? "Hlasování otevřeno" : "Hlasování uzavřeno"}
        </Text>
      </Group>

      {voteQuery.data && voteQuery.data.votes.length > 0 ? (
        <Stack>
          {voteQuery.data.votes.map((vote) => (
            <VoteTile key={vote.id} vote={vote} />
          ))}
        </Stack>
      ) : (
        <Text c="dimmed">Nejsou nastaveny žádné hlasy</Text>
      )}

      <Group mt={16}>
        <Button color="gray" onClick={() => clear()}>
          Resetovat hlasování
        </Button>

        {voteQuery.data?.open ? (
          <Button color="red" onClick={() => changeStateMutation.mutate(false)}>
            Zavřít hlasování
          </Button>
        ) : (
          <Button
            color="green"
            onClick={() => changeStateMutation.mutate(true)}
          >
            Otevřít hlasování
          </Button>
        )}
      </Group>
    </div>
  );
};

export default VoteSettings;
