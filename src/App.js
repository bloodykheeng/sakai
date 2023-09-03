import React, { Suspense } from "react";

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";

const NewLoginPage = React.lazy(() => import("./components/auth/NewLoginPage"));

function App() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path="/*" element={<AdminLayout />} />
                <Route path="/" element={<NewLoginPage />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Suspense>
    );
}

export default App;
