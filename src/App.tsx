import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Error from "./components/error";
import RootLayout from "./components/root-layout";
import Home from "./routes/home";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
