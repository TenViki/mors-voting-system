import { useClient } from "@/lib/useClient";
import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { LucideMoon, LucideSun } from "lucide-react";

const ColorSchemeSwitch = () => {
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const client = useClient();

  return (
    <ActionIcon
      onClick={() => setColorScheme(colorScheme === "light" ? "dark" : "light")}
      variant="light"
      size="lg"
      p={6}
      aria-label="Toggle color scheme"
    >
      <LucideSun
        style={{
          display: client && colorScheme === "light" ? "none" : undefined,
        }}
      />
      <LucideMoon
        style={{
          display: client && colorScheme === "dark" ? "none" : undefined,
        }}
      />
    </ActionIcon>
  );
};

export default ColorSchemeSwitch;
