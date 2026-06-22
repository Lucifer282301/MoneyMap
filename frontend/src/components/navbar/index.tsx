import { useState } from "react";
import { Menu } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { cn } from "@/lib/utils";
import Logo from "../logo/logo";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { UserNav } from "./user-nav";
import LogoutDialog from "./logout-dialog";
import { useTypedSelector } from "@/app/hook";

const routes = [
  { href: PROTECTED_ROUTES.OVERVIEW, label: "Overview" },
  { href: PROTECTED_ROUTES.TRANSACTIONS, label: "Transactions" },
  { href: PROTECTED_ROUTES.REPORTS, label: "Reports" },
  { href: PROTECTED_ROUTES.SETTINGS, label: "Settings" },
];

const Navbar = () => {
  const { pathname } = useLocation();
  const { user } = useTypedSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[var(--secondary-dark-color)] text-white shadow-md">
        <div className="w-full h-14 px-4 md:px-6 lg:px-8 flex items-center">
          <div className="w-full flex items-center justify-between">
            {/* Left side - Logo */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="inline-flex md:hidden !cursor-pointer !bg-white/10 !text-white hover:!bg-white/20"
                onClick={() => setIsOpen(true)}
                aria-label="Open navigation menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
              <Logo />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-x-1 overflow-x-auto">
              {routes.map((route) => (
                <Button
                  key={route.href}
                  size="sm"
                  variant="ghost"
                  className={cn(
                    "relative font-normal px-4 py-2 border-none transition-colors !bg-transparent !text-[14.5px]",
                    "text-white/60 hover:text-white hover:!bg-white/10",
                    isActive(route.href) && "text-white",
                  )}
                  asChild
                >
                  <NavLink to={route.href}>
                    {route.label}
                    {isActive(route.href) && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4/5 rounded-full bg-green-400" />
                    )}
                  </NavLink>
                </Button>
              ))}
            </nav>

            {/* Mobile Navigation Sheet */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetContent side="left" className="bg-[var(--secondary-dark-color)] text-white w-64 border-r border-white/10">
                <SheetHeader>
                  <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                </SheetHeader>
                <div className="pt-4">
                  <Logo />
                </div>
                <nav className="flex flex-col gap-y-1 pt-6">
                  {routes.map((route) => (
                    <Button
                      key={route.href}
                      size="sm"
                      variant="ghost"
                      className={cn(
                        "w-full font-normal justify-start border-none transition-colors !bg-transparent text-white/60 hover:text-white hover:!bg-white/10",
                        isActive(route.href) && "!bg-white/15 text-white",
                      )}
                      asChild
                    >
                      <NavLink to={route.href} onClick={() => setIsOpen(false)}>
                        {route.label}
                      </NavLink>
                    </Button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            {/* Right side - User actions */}
            <div className="flex items-center space-x-4">
              <UserNav
                userName={user?.name || ""}
                profilePicture={user?.profilePicture || ""}
                onLogout={() => setIsLogoutDialogOpen(true)}
              />
            </div>
          </div>
        </div>
      </header>

      <LogoutDialog
        isOpen={isLogoutDialogOpen}
        setIsOpen={setIsLogoutDialogOpen}
      />
    </>
  );
};

export default Navbar;
