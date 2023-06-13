import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import RootLayout from "./components/layout";
import Center from "./components/ui/center";
import Loader from "./components/ui/loader";
import Home from "./pages/home";

const App = () => {
  return (
    <RootLayout>
      <Suspense
        fallback={
          <Center absolutely>
            <Loader iconSize={50} />
          </Center>
        }
      >
        <Routes>
          <Route index path="/" element={<Home />} />

          {/* ... */}
        </Routes>
      </Suspense>
    </RootLayout>
  );
};

export default App;
