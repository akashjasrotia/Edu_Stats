import { Outlet } from "react-router-dom";
import Sidebar from "./Navbar";

export default function MainLayout() {
  return (
    <div className="relative w-full min-h-screen flex bg-transparent">
      <Sidebar />

      <div className="flex-1 min-h-screen pl-24 md:pl-20 transition-all duration-300">
        <main className="h-full w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
