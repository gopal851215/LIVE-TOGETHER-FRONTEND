import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import PropertyList from "./pages/PropertyList";
import ComboRooms from "./pages/ComboRooms";
import PropertyDetails from "./pages/PropertyDetails";

import HostDashboard from "./pages/host/HostDashboard";
import HostAddProperty from "./pages/host/HostAddProperty";
import HostManageListings from "./pages/host/HostManageListings";
import HostBookingRequests from "./pages/host/HostBookingRequests";
import HostConfirmedBookings from "./pages/host/HostConfirmedBookings";

import MyBookings from "./pages/MyBookings";

import { ProtectedRoute, HostRoute } from "./components/ProtectedRoute";

import ComboLanding from "./pages/ComboLanding";
import ComboTypePage from "./pages/ComboTypePage";
import ComboHome from "./pages/ComboHome";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50">
          <NavBar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Property Listings */}
            <Route
              path="/rooms"
              element={<PropertyList typeLabel="Rooms" typeFilter="room" />}
            />
            <Route
              path="/flats"
              element={<PropertyList typeLabel="Flats" typeFilter="flat" />}
            />
            <Route
              path="/intern-rooms"
              element={<PropertyList typeLabel="Intern Rooms" typeFilter="intern" />}
            />
<Route path="/combo" element={<ComboHome />} />
  <Route path="/combo-rooms" element={<ComboRooms />} />
            <Route path="/properties/:id" element={<PropertyDetails />} />

            {/* Protected User Routes */}
            <Route path="/my-bookings" element={<ProtectedRoute />}>
              <Route index element={<MyBookings />} />
            </Route>

            {/* Host Dashboard Routes */}
            <Route element={<HostRoute />}>
              <Route path="/dashboard" element={<HostDashboard />}>
                {/* Dashboard index */}
                <Route index element={<HostAddProperty />} />
                {/* Property management */}
                <Route path="add" element={<HostAddProperty />} />
                <Route path="edit/:id" element={<HostAddProperty />} />
                <Route path="listings" element={<HostManageListings />} />
                {/* Booking management */}
                <Route path="requests" element={<HostBookingRequests />} />
                <Route path="confirmed" element={<HostConfirmedBookings />} />
                {/* Combo section */}
                <Route path="combo" element={<ComboLanding />} />
                <Route path="combo/:type" element={<ComboTypePage />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Home />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;