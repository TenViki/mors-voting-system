"use client";

import { ActionIcon } from "@mantine/core";
import { LucideMaximize2, LucideMinimize2 } from "lucide-react";
import React from "react";

const FullscreenButton = () => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const handleFullscreen = () => {
    if (isFullscreen) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <ActionIcon
      onClick={handleFullscreen}
      color="gray"
      size="lg"
      p={6}
      variant="light"
    >
      {isFullscreen ? <LucideMinimize2 /> : <LucideMaximize2 />}
    </ActionIcon>
  );
};

export default FullscreenButton;
