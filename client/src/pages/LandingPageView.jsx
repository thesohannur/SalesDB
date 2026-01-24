import React from "react";
import { useNavigate } from "react-router-dom";
import LandingPage from "../components/Landing/LandingPage";

export default function LandingPageView() {
    const navigate = useNavigate();

    return <LandingPage onEnterDashboard={() => navigate('/dashboard')} />;
}
