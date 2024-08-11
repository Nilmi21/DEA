import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import CustomerInvoices, {
  loader as CustomerInvoicesLoader,
  action as CustomerInvoicesAction,
} from "./pages/CustomerInvoices";
import Administration, {
  loader as AdministrationLoader,
  action as AdministrationAction,
} from "./pages/Administration";
import Customers, {
  loader as CustomersLoader,
  action as CustomersAction,
} from "./pages/Customers";
import Suppliers, {
  loader as SuppliersLoader,
  action as SuppliersAction,
} from "./pages/Suppliers";
import Login, {
  loader as LoginLoader,
  action as LoginAction,
} from "./pages/Login";
import Products, {
  loader as ProductsLoader,
  action as ProductsAction,
} from "./pages/Products";
import SupplierInvoices, {
  loader as SupplierInvoicesLoader,
  action as SupplierInvoicesAction,
} from "./pages/SupplierInvoices";
import Error from "./pages/Error";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" errorElement={<Error />}>
      <Route
        index
        element={<CustomerInvoices />}
        loader={CustomerInvoicesLoader}
        action={CustomerInvoicesAction}
      />
      <Route
        path="/supplier-invoices"
        element={<SupplierInvoices />}
        loader={SupplierInvoicesLoader}
        action={SupplierInvoicesAction}
      />
      <Route
        path="/products"
        element={<Products />}
        loader={ProductsLoader}
        action={ProductsAction}
      />
      <Route
        path="/suppliers"
        element={<Suppliers />}
        loader={SuppliersLoader}
        action={SuppliersAction}
      />
      <Route
        path="/customers"
        element={<Customers />}
        loader={CustomersLoader}
        action={CustomersAction}
      />
      <Route
        path="/administration"
        element={<Administration />}
        loader={AdministrationLoader}
        action={AdministrationAction}
      />
      <Route
        path="/login"
        element={<Login />}
        loader={LoginLoader}
        action={LoginAction}
      />
    </Route>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}
