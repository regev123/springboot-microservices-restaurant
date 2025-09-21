import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link,useNavigate } from "react-router-dom";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import FormWrapper from "../components/common/FormWrapper";
import Message from "../components/common/Message";
import { loginUser } from "../store/thunks/authThunks";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      navigate("/home", { replace: true });
    }
  }, [token, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <FormWrapper title="Login">
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
      />
      <Button
        text={loading ? "Logging in..." : "Login"}
        type="submit"
        onClick={handleLogin}
        disabled={loading}
      />

      {error && <Message type="error">{error}</Message>}

      <div style={{ textAlign: "center", marginTop: "15px" }}>
        <Link to="/change-password">Change Password</Link>
      </div>
    </FormWrapper>
  );
};

export default LoginPage;
