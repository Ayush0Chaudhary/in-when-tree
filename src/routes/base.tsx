import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "@/components/layouts/Base";
import Orders from "@/pages/Orders";
import Home from "@/pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        Component: Home,
        path: "/",
      },
    ],
  },
]);

export const CustomRouter = () => {
  return <RouterProvider router={router} />;
};
