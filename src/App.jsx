import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LogIn from "./Components/LogIn";
import Home from "./Components/Home";
import Services from "./Components/Services";
import MoreDetails from "./Components/MoreDetails";
import Register from "./Components/Register";
import AddService from "./Components/addServices";
import CartPage from "./Components/cart";
import Dashboard from "./Components/Dashboard";
import Profile from "./Components/profile";
import ProctedRoutes from "./context/ProctedRoutes";
import FeedbackPage from "./Components/FeedBack";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/profile"
          element={
            <ProctedRoutes>
              <Profile />
            </ProctedRoutes>
          }
        />
        <Route path="/services" element={<Services />} />
        <Route
          path="/addservices"
          element={
            <ProctedRoutes>
              <AddService />
            </ProctedRoutes>
          }
        />
        <Route path="/moredetails/:serviceId" element={<MoreDetails />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/cart" element={<ProctedRoutes><CartPage /></ProctedRoutes>} />
        <Route path="/login/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProctedRoutes>
              <Dashboard />
            </ProctedRoutes>
          }
        />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/*" element={<h1>404 Error</h1>} />
      </Routes>
    </div>
  );
};

export default App;
