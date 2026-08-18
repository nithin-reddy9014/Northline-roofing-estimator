import { BrowserRouter, Routes, Route } from "react-router-dom";

import Estimator from "./pages/Estimator";
import OwnerLogin from "./pages/OwnerLogin";
import OwnerDashboard from "./pages/OwnerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Estimator />} />

        <Route path="/admin/login" element={<OwnerLogin />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
