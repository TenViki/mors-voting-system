import { getQueue, getQueueState } from "@/actions/queue";
import { useSocket } from "@/providers/SocketProvider";
import { QueuePosition, User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";

type QueuePos = QueuePosition & {
  user: User;
};

export const useQueue = () => {
  const socket = useSocket();
  const [queuePositions, setQueuePositions] = React.useState<QueuePos[]>([]);

  const handleQueueUpdate = (queuePositions: QueuePos[]) => {
    setQueuePositions(queuePositions);
  };

  const queueQuery = useQuery({
    queryKey: ["queue"],
    queryFn: () => getQueue(),
  });

  const stateQuery = useQuery({
    queryKey: ["queueStatus"],
    queryFn: () => getQueueState(),
  });

  useEffect(() => {
    if (!socket) return;

    socket.on("queue:update", handleQueueUpdate);

    return () => {
      socket.off("queue:update", handleQueueUpdate);
    };
  }, [socket]);

  useEffect(() => {
    if (!queueQuery.data) return;

    setQueuePositions(queueQuery.data);
  }, [queueQuery.data]);

  return {
    queue: queuePositions,
    isLoading: queueQuery.isLoading,
    isError: queueQuery.isError,
    error: queueQuery.error,
    state: stateQuery.data,
  };
};
