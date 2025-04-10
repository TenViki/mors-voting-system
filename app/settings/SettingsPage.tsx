"use client";

import useSearchParamsState from "@/lib/useSearchParamState";
import { Button, Group, Tabs, TabsList, TabsPanel, Title } from "@mantine/core";
import {
  LucideEye,
  LucideKey,
  LucideList,
  LucideListStart,
  LucidePresentation,
  LucideUsers,
} from "lucide-react";
import QueuePage from "./queue/QueuePage";
import UsersAdmin from "./users/UsersAdmin";
import VoteKey from "./votekey/VoteKey";
import VoteSettings from "./votes/VoteSettings";

const SettingsPage = () => {
  const [tab, setTab] = useSearchParamsState("tab", "votes");

  return (
    <>
      <Group justify="space-between" align="center" mb={16}>
        <Title>Nastavení</Title>

        <Button
          leftSection={<LucideEye size={16} />}
          rightSection={<LucidePresentation size={16} />}
          // href={"/display"}
          // component={Link}
          // target="_blank"
          onClick={() => {
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            window.open(
              "/display",
              "myWindow",
              `width=${screenWidth - 100},height=${
                screenHeight - 100
              },top=50,left=50`
            );
          }}
          variant="light"
          color="gray"
        >
          Prezentační zobrazení
        </Button>
      </Group>
      <Tabs
        value={tab}
        onChange={(value) => {
          setTab(value || "votes");
        }}
        color="#5c0087"
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <TabsList mb={16}>
          <Tabs.Tab value="votes" leftSection={<LucideList size={16} />}>
            Hlasování
          </Tabs.Tab>
          <Tabs.Tab value="users" leftSection={<LucideUsers size={16} />}>
            Hlasující
          </Tabs.Tab>
          <Tabs.Tab value="queue" leftSection={<LucideListStart size={16} />}>
            Fronta
          </Tabs.Tab>
          <Tabs.Tab value="votekey" leftSection={<LucideKey size={16} />}>
            Hlasovací klíč
          </Tabs.Tab>
        </TabsList>

        <TabsPanel value="votes">
          <VoteSettings />
        </TabsPanel>

        <TabsPanel
          value="users"
          sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
        >
          {/* <VoteSettings /> */}
          <UsersAdmin />
        </TabsPanel>

        <TabsPanel value="votekey">
          <VoteKey />
        </TabsPanel>

        <TabsPanel value="queue">
          <QueuePage />
        </TabsPanel>
      </Tabs>
    </>
  );
};

export default SettingsPage;
