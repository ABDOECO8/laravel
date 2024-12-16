import { RouterProvider } from "react-router-dom";
import { router } from "../src/index/index";  // Vérifie que le chemin est correct
import "./App.css";

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
