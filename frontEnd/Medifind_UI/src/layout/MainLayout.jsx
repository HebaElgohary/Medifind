import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

import { Login } from "../pages/Login";
import { SignUp } from "../pages/signup/SignUp";
import { ProtectedRoute } from "../pages/ProtectedRoute";
import SharedLayout from "../layout/SharedLayout";
import { Loader } from "../components/customComponents/Loader/Loader";
import { useDecoded } from "../customHooks/useDecode";

import UpdateMedicine from "../pages/UpdateMedicine/UpdateMedicine";
import { UpdateRequest } from "../pages/UpdateRequest/UpdateRequest";

import { CardPage } from "../pages/CardPage";
import { CompleteProfile } from "../pages/Home/CompleteProfile";
import { DonorPage } from "../pages/DonerPage";

const Home = lazy(async () => {
  const module = await import("../pages/Home/Home");
  return { default: module.Home };
});

const OffersReview = lazy(async () => {
  const module = await import("../pages/OffersReview");
  return { default: module.OffersReview };
});

const AddMedicine = lazy(async () => {
  const module = await import("../pages/AddMedicine");
  return { default: module.AddMedicine };
});

const RequestMedicine = lazy(async () => {
  const module = await import("../pages/RequestMedicine");
  return { default: module.RequestMedicine };
});

const RequestsReview = lazy(async () => {
  const module = await import("../pages/RequestsReview");
  return { default: module.RequestsReview };
});

const roleAccess = {
  doctor: [
    "/home",
    "/RequestsReview",
    "/offersReview",
  ],

  user: [
    "/home",
    "/AddMedicine",
    "/RequestMedicine",
    "/need",
    "/donate",
    "/profile",
    "/UpdateMedicine",
    "/UpdateRequest",
  ],

  guest: [
    "/",
    "/login",
    "/signup",
  ],
};

const isAllowedRoute = (path, role) => {
  if (!role || !roleAccess[role]) {
    return false;
  }

  const basePath = `/${path.split("/")[1]}`;

  return roleAccess[role].includes(basePath);
};

export function MainLayout() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

function AppRoutes() {
  const token = localStorage.getItem("token");
  const isAuthenticated = Boolean(token);

  const {
    decodedToken,
    isDecoding,
  } = useDecoded();

  // مهم جدًا
  // نستنى لحد ما الـ token يتفك
  if (isDecoding) {
    return <Loader />;
  }

  const userRole =
    decodedToken?.role?.toLowerCase() ?? null;

  return (
    <Suspense fallback={<Loader />}>
      <Routes>

        <Route
          path="/"
          element={<SignUp />}
        />

        <Route
          path="/signup"
          element={<SignUp />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route element={<SharedLayout />}>

          <Route
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                isAllowed={isAllowedRoute}
                userRole={userRole}
              />
            }
          >

            <Route
              path="/home"
              element={<Home />}
            />

            <Route
              path="/AddMedicine"
              element={<AddMedicine />}
            />

            <Route
              path="/UpdateMedicine/:id"
              element={<UpdateMedicine />}
            />

            <Route
              path="/RequestMedicine"
              element={<RequestMedicine />}
            />

            <Route
              path="/RequestMedicine/:id"
              element={<RequestMedicine />}
            />

            <Route
              path="/UpdateRequest/:request_id"
              element={<UpdateRequest />}
            />

            <Route
              path="/need"
              element={<CardPage />}
            />

            <Route
              path="/profile"
              element={<CompleteProfile />}
            />

            <Route
              path="/donate"
              element={<DonorPage />}
            />

            <Route
              path="/RequestsReview"
              element={<RequestsReview />}
            />

            <Route
              path="/offersReview"
              element={<OffersReview />}
            />

          </Route>

        </Route>

      </Routes>
    </Suspense>
  );
}