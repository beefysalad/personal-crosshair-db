import { QueryProvider } from "@/app/providers/query-provider";
import React from "react";

interface ProviderProps {
  children: React.ReactNode;
}
const Providers = ({ children }: ProviderProps) => {
  return <QueryProvider>{children}</QueryProvider>;
};

export default Providers;
