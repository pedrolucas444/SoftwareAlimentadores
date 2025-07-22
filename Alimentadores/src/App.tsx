import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DataProvider } from "./Context/DataContext";
import ErrorBoundary from "./components/ErrorBoundary";

const Painel = lazy(() => import("./pages/painelInicial/index"));
const AlimentadorPage = lazy(() => import("./pages/alimentadorPage/index"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Painel />,
  },
  {
    path: "/alimentador/:id",
    element: <AlimentadorPage />,
  },
  // { path: "/gaveta/:id",
  //   element: <ValvulaGaveta />,
  // },
]);

function App() {
  return (
    <ErrorBoundary>
      <DataProvider>
        <Suspense fallback={<div>Carregando...</div>}>
          <RouterProvider router={router} />
        </Suspense>
      </DataProvider>
    </ErrorBoundary>
  );
}

export default App;