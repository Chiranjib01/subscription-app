import "./Login.css";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../../redux/authApiSlice";
import { setState, setCredentials } from "../../redux/authSlice";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.info("All fields are required", { autoClose: 1000 });
      return;
    }
    try {
      const res = await login({ email, password }).unwrap();
      if (checked) {
        dispatch(setCredentials({ ...res }));
      } else {
        dispatch(setState({ ...res }));
      }
      toast.success("Login Successful", { autoClose: 1000 });
      setEmail("");
      setPassword("");
      setChecked(false);
      if (res.subscription) {
        navigate("/");
      } else {
        navigate("/choose-plan");
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error, { autoClose: 1000 });
    }
  };
  return (
    <div className="login">
      <main>
        <h3>Login to your account</h3>
        <form onSubmit={handleLogin}>
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
              {isLoading ? "Loading..." : "Login"}
            </button>
          </div>
          <div className="footer-text">
            New to MyApp? <Link to="/register">Sign Up</Link>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Login;
