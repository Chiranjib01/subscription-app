import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import { ToastContainer } from "react-toastify";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";

function App() {
  return (
    <>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/login" element={<Login />} index={true} />
          <Route path="/register" element={<Register />} index={true} />
          <Route path="" element={<PrivateRoute />}>
            <Route path="/" element={<Home />} index={true} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
