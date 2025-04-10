"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

function useSearchParamsState<T>(
  name: string,
  defaultValue: T
): [T, (value: T) => void] {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [value, setValue] = useState<T>(() => {
    const paramValue = searchParams.get(name);
    if (paramValue === null) {
      return defaultValue;
    }
    return JSON.parse(paramValue) as T;
  });

  useEffect(() => {
    const paramValue = searchParams.get(name);
    if (paramValue === null) {
      setValue(defaultValue);
    } else {
      setValue(JSON.parse(paramValue) as T);
    }
  }, [searchParams, name, JSON.stringify(defaultValue)]);

  const setValueAndUpdateURL = useCallback(
    (newValue: T) => {
      setValue(newValue);
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set(name, JSON.stringify(newValue));
      router.push(`?${newParams.toString()}`, { scroll: false });
    },
    [router, searchParams, name]
  );

  return [value, setValueAndUpdateURL];
}

export default useSearchParamsState;
