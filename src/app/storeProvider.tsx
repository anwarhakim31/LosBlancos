"use client";
import { useRef } from "react";
import { Provider } from "react-redux";

import { AppStore, makeStore } from "@/store/store"; // Update with the correct path

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | undefined>(undefined);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
