import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import PublicVenue from "@/pages/PublicVenue";
import NotFound from "@/pages/NotFound";
import AuthCallback from "@/components/AuthCallback";

// One <Route> per page in src/pages; BrowserRouter already wraps this in main.tsx.
export default function App() {
  const location = useLocation();
  // Google OAuth return: process session_id before any route/auth check runs.
  if (location.hash.includes("session_id=")) {
    return <AuthCallback />;
  }
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/accedi" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registrati" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/locale/:slug" element={<PublicVenue />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster richColors />
    </>
  );
}
