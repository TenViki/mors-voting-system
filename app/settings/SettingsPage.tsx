"use client";

import useSearchParamsState from "@/lib/useSearchParamState";
import { Tabs, TabsList, TabsPanel, Title } from "@mantine/core";
import {
  LucideKey,
  LucideList,
  LucideListStart,
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
      <Title mb={16}>Nastavení</Title>
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
