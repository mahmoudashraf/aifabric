import { ReactNode } from "react";
import DocsSidebar from "./DocsSidebar";
import Navbar from "../Navbar";

interface DocsLayoutProps {
  children: ReactNode;
}

export const DocsLayout = ({ children }: DocsLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <DocsSidebar />
        <main className="md:pl-72">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DocsLayout;
