import { DesktopSidebar } from "./DesktopSidebar";
import { MobileTabBar } from "./MobileTabBar";
import { PageTransition } from "./PageTransition";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-6 p-4 md:mx-auto md:max-w-[1600px] md:gap-8 md:p-6">
      <DesktopSidebar />
      <div className="min-w-0 flex-1">
        <PageTransition>{children}</PageTransition>
      </div>
      <MobileTabBar />
    </div>
  );
}
