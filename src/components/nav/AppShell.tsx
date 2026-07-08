import { DesktopSidebar } from "./DesktopSidebar";
import { MobileTabBar } from "./MobileTabBar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-6xl gap-4 p-4">
      <DesktopSidebar />
      <div className="min-w-0 flex-1">{children}</div>
      <MobileTabBar />
    </div>
  );
}
