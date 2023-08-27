import "./register.css";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../../redux/authApiSlice";
import { setState, setCredentials } from "../../redux/authSlice";
import { toast } from "react-toastify";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.info("All fields are required", { autoClose: 1000 });
      return;
    }
    try {
      const res = await register({ name, email, password }).unwrap();
      if (checked) {
        dispatch(setCredentials({ ...res }));
      } else {
        dispatch(setState({ ...res }));
      }
      toast.success("Register Successful", { autoClose: 1000 });
      setName("");
      setEmail("");
      setPassword("");
      setChecked(false);
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || err.error, { autoClose: 1000 });
    }
  };
  return (
    <div className="register">
      <main>
        <h3>Create Account</h3>
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              placeholder="Enter Name ..."
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              placeholder="Enter Email ..."
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="Enter Password ..."
            />
          </div>
          <div className="checkbox">
            <input
              type="checkbox"
              value={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
            <span>Remember Me</span>
          </div>
          <div className="form-group">
            <button disabled={isLoading} type="submit">
              {isLoading ? "Loading..." : "Sign Up"}
            </button>
          </div>
          <div className="footer-text">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Register;
