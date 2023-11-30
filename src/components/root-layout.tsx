import { Outlet } from "react-router-dom";

import { TailwindIndicator } from "./tailwind-indicator";

const RootLayout = () => {
  return (
    <div className="min-h-screen scroll-smooth antialiased">
      <Outlet />

      <TailwindIndicator />
    </div>
  );
};

export default RootLayout;
