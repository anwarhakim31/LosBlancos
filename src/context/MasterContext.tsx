"use client";
import { TypeMaster } from "@/services/type.module";
import React from "react";
import { createContext, ReactNode } from "react";

interface MasterContextProps {
  data: TypeMaster;
}

const MasterContext = createContext<MasterContextProps | undefined>(undefined);

export const useMasterContext = () => {
  return React.useContext(MasterContext);
};

const MasterProvider = ({
  children,
  data,
}: {
  children: ReactNode;
  data: TypeMaster;
}) => {
  return (
    <MasterContext.Provider value={{ data }}>{children}</MasterContext.Provider>
  );
};

export default MasterProvider;
