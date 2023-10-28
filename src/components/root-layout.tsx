import { Outlet } from "react-router-dom";

import { TailwindIndicator } from "./tailwind-indicator";

import "@/styles/layout.css";

const RootLayout = () => {
  return (
    <div className="layout scroll-smooth bg-[#141414] antialiased selection:bg-zinc-300 selection:text-black dark:text-white">
      <Outlet />

      <TailwindIndicator />
    </div>
  );
};

export default RootLayout;
