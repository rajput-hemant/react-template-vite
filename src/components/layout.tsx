import React from "react";

import "@/styles/layout.css";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="layout min-h-screen bg-black/90 p-8 text-white antialiased lg:p-16">
      {children}
    </div>
  );
};

export default RootLayout;
