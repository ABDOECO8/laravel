import { createBrowserRouter } from "react-router-dom";
import Categorie from "../page/Categorie";
import Home from "../page/Home";
import Product from "../page/Product";
import NotFound from "../page/NotFound";
import Layout from "../Layout/layout";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/Categorie',
        element: <Categorie />
      },
      {
        path: '/Product',
        element: <Product />
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
]);
