import { ReactNode } from "react";
import DocsSidebar from "./DocsSidebar";

interface DocsLayoutProps {
  children: ReactNode;
}

export const DocsLayout = ({ children }: DocsLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <DocsSidebar />
      <main className="md:pl-72">
        {children}
      </main>
    </div>
  );
};

export default DocsLayout;
