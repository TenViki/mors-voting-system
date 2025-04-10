import { useEffect, useState } from "react";

export const useClient = () => {
  const [client, setClient] = useState(false);

  useEffect(() => {
    setClient(true);
  }, []);

  return client;
};
