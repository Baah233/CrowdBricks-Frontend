import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { PanelLeft } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

const SidebarContext = React.createContext(null);


const SidebarProvider = React.forwardRef(
  ({ defaultOpen = true, open: openProp, onOpenChange, className, style = {}, children, ...props }, ref) => {
    const isMobile = useIsMobile();
    const [openMobile, setOpenMobile] = React.useState(false);

    const [_open, _setOpen] = React.useState(defaultOpen);
    const open = openProp ?? _open;

    const setOpen = React.useCallback(
      (value) => {
        const openState = typeof value === "function" ? value(open) : value;
        if (onOpenChange) {
          onOpenChange(openState);
        } else {
          _setOpen(openState);
        }
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
      },
      [open, onOpenChange]
    );

    const toggleSidebar = React.useCallback(() => {
      return isMobile ? setOpenMobile((o) => !o) : setOpen((o) => !o);
    }, [isMobile, setOpen, setOpenMobile]);

    React.useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
          event.preventDefault();
          toggleSidebar();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleSidebar]);

    const state = open ? "expanded" : "collapsed";

    const contextValue = React.useMemo(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    );

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={{
              "--sidebar-width": "16rem",
              "--sidebar-width-icon": "3rem",
              ...style,
            }}
            className={cn("group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar", className)}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    );
  }
);
SidebarProvider.displayName = "SidebarProvider";

// --- Sidebar base, triggers, and content components ---

// Example placeholder implementations for missing components
const Sidebar = React.forwardRef(({ children, ...props }, ref) => (
  <nav ref={ref} {...props}>
    {children}
  </nav>
));
Sidebar.displayName = "Sidebar";

const SidebarContent = ({ children, ...props }) => <div {...props}>{children}</div>;
const SidebarFooter = ({ children, ...props }) => <footer {...props}>{children}</footer>;
const SidebarGroup = ({ children, ...props }) => <div {...props}>{children}</div>;
const SidebarGroupAction = ({ children, ...props }) => <div {...props}>{children}</div>;
const SidebarGroupContent = ({ children, ...props }) => <div {...props}>{children}</div>;
const SidebarGroupLabel = ({ children, ...props }) => <div {...props}>{children}</div>;
const SidebarHeader = ({ children, ...props }) => <header {...props}>{children}</header>;
const SidebarInput = (props) => <Input {...props} />;
const SidebarInset = ({ children, ...props }) => <div {...props}>{children}</div>;
const SidebarMenu = ({ children, ...props }) => <ul {...props}>{children}</ul>;
const SidebarMenuAction = ({ children, ...props }) => <li {...props}>{children}</li>;
const SidebarMenuBadge = ({ children, ...props }) => <span {...props}>{children}</span>;
const SidebarMenuButton = ({ children, ...props }) => <Button {...props}>{children}</Button>;
const SidebarMenuItem = ({ children, ...props }) => <li {...props}>{children}</li>;
const SidebarMenuSkeleton = (props) => <Skeleton {...props} />;
const SidebarMenuSub = ({ children, ...props }) => <ul {...props}>{children}</ul>;
const SidebarMenuSubButton = ({ children, ...props }) => <Button {...props}>{children}</Button>;
const SidebarMenuSubItem = ({ children, ...props }) => <li {...props}>{children}</li>;
const SidebarRail = ({ children, ...props }) => <div {...props}>{children}</div>;
const SidebarSeparator = (props) => <Separator {...props} />;
const SidebarTrigger = ({ children, ...props }) => <Button {...props}>{children}</Button>;

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
};
