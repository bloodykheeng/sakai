import React, { Suspense } from "react";

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";

import useAuthContext from "./context/AuthContext";

import PrivateAdmin from "./components/auth/PrivateAdmin";

// const NewLoginPage = React.lazy(() => import("./components/auth/NewLoginPage"));
import NewLoginPage from "./components/auth/NewLoginPage";

function App() {
    const { user, getUserQuery, isLoading } = useAuthContext();
    return (
        <>
            {/* <Suspense fallback={<div>Loading...</div>}> */}
            <Routes>
                <Route path="/*" element={<PrivateAdmin />} />
                <Route path="/login" element={getUserQuery?.data?.data ? <Navigate to="/dashboard" /> : <NewLoginPage />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
            {/* </Suspense> */}
        </>
    );
}

export default App;
