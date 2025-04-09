"use client";

import { Tabs, TabsList, TabsPanel, Title } from "@mantine/core";
import UsersAdmin from "./users/UsersAdmin";
import VoteSettings from "./votes/VoteSettings";
import { LucideKey, LucideList, LucideUsers } from "lucide-react";
import VoteKey from "./votekey/VoteKey";

const SettingsPage = () => {
  return (
    <>
      <Title mb={16}>Nastavení</Title>
      <Tabs
        defaultValue={"users"}
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <TabsList mb={16}>
          <Tabs.Tab value="users" leftSection={<LucideList size={16} />}>
            Hlasování
          </Tabs.Tab>
          <Tabs.Tab value="votes" leftSection={<LucideUsers size={16} />}>
            Uživatelé
          </Tabs.Tab>
          <Tabs.Tab value="votekey" leftSection={<LucideKey size={16} />}>
            Hlasovací klíč
          </Tabs.Tab>
        </TabsList>

        <TabsPanel value="users">
          <VoteSettings />
        </TabsPanel>

        <TabsPanel
          value="votes"
          sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
        >
          {/* <VoteSettings /> */}
          <UsersAdmin />
        </TabsPanel>

        <TabsPanel value="votekey">
          <VoteKey />
        </TabsPanel>
      </Tabs>
    </>
  );
};

export default SettingsPage;
