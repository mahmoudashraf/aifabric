import { Menu, PanelLeftClose } from "lucide-react";
import { useState, type ReactNode } from "react";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import { CourseAuthButton } from "./CourseAuthButton";
import { CourseSidebar } from "./CourseSidebar";

export const CourseLayout = ({ children }: { children: ReactNode }) => {
  const [navigationOpen, setNavigationOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <aside className="fixed inset-y-0 left-0 top-16 z-30 hidden w-72 border-r border-border bg-white md:block">
        <CourseSidebar />
      </aside>

      <div className="pt-16 md:pl-72">
        <div className="sticky top-16 z-20 flex h-14 items-center justify-between border-b border-border bg-white/95 px-4 backdrop-blur md:justify-end md:px-8">
          <Sheet open={navigationOpen} onOpenChange={setNavigationOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="md:hidden">
                <Menu className="h-4 w-4" />
                Lessons
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[min(90vw,320px)] p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Course navigation</SheetTitle>
              </SheetHeader>
              <CourseSidebar onNavigate={() => setNavigationOpen(false)} />
            </SheetContent>
          </Sheet>
          <div className="hidden items-center gap-2 text-xs text-muted-foreground md:flex">
            <PanelLeftClose className="h-4 w-4" />
            Course workspace
          </div>
          <CourseAuthButton compact />
        </div>
        <main>{children}</main>
      </div>
    </div>
  );
};
