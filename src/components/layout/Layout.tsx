
import { ReactNode } from "react";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { Outlet } from "react-router-dom";

interface LayoutProps {
  children?: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <LayoutShell>
      {children || <Outlet />}
    </LayoutShell>
  );
};

export default Layout;
