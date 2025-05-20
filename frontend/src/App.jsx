import React from "react";
import {Route, Routes} from "react-router";
import HomePage from "./pages/HomePage.jsx";
import NotificationPage from "./pages/NotificationPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import CallPage from "./pages/CallPage.jsx";

import toast, {Toaster} from "react-hot-toast";

const App = () => {
  // axios
  // react-query tanstack-query
  return (
    <div className="h-screen text-white " data-theme="dark">
      <button onClick={() => toast.success("Toast Added")}>
        create a toast
      </button>
      <br />
      <button onClick={() => toast.error("This is an error")}> Error</button>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/call" element={<CallPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
      </Routes>
      <Toaster /> // This will render the toast notifications
    </div>
  );
};

export default App;
