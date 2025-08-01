import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DataProvider } from "./Context/DataContext";
import ErrorBoundary from "./components/ErrorBoundary";

const Painel = lazy(() => import("./pages/painelInicial"));
const Alimentador = lazy(() => import("./pages/alimentadorPage"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Painel />,
  },
  {
    path: "/alimentador/:id",
    element: <Alimentador />,
  },
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