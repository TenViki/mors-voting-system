"use client";

import { Tabs, TabsList, TabsPanel, Title } from "@mantine/core";
import UsersAdmin from "./users/UsersAdmin";
import VoteSettings from "./votes/VoteSettings";

const SettingsPage = () => {
  return (
    <>
      <Title mb={16}>Nastavení</Title>
      <Tabs
        defaultValue={"users"}
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <TabsList mb={16}>
          <Tabs.Tab value="users">Hlasování</Tabs.Tab>
          <Tabs.Tab value="votes">Uživatelé</Tabs.Tab>
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
      </Tabs>
    </>
  );
};

export default SettingsPage;
