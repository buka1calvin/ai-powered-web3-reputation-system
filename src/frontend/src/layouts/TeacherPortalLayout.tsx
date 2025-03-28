import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { 
  Menu, 
} from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "../components/ui/sheet";

import { Button } from "../components/ui/button";
import { TeacherPortalSidebar } from "../appUi/components/TeacherNavLinks";
import { TopBar } from "../appUi/components/PortalNav";





const TeacherPortalLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <TeacherPortalSidebar isMobile={true} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <TeacherPortalSidebar isMobile={false} />
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="block md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 left-4 z-50"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu />
          </Button>
        </div>

        <TopBar />

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TeacherPortalLayout;
