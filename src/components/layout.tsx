import React from "react";

import "@/styles/layout.css";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="layout min-h-screen bg-black/90 px-8 pt-4 text-white antialiased lg:px-16">
      {children}
    </div>
  );
};

export default RootLayout;
