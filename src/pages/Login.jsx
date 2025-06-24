import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/style.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // Adjust the path if needed
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

//import SignInwithGoogle from "./signInWIthGoogle";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add login logic here
    // console.log('Email:', email);
    //console.log('Password:', password);
    //
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful!");
      // Show success message
      toast.success("Login successful!");
      // Redirect to chat page or perform any other action after successful login
      // window.location.href = '/Chat';
      navigate("/Chat"); // Use navigate to redirect
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto"
      style={{ maxWidth: "400px" }}>
      <div className="container mt-5">
        <h1 className="text-center mb-4">Log In</h1>
        <div className="form-group mb-3">
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            required
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            required
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="form-group mb-3 text-center">
          <button type="submit" className="btn btn-primary">
            Sign In
          </button>
        </div>

        <p className="text-center mt-2">
          Don't have an account yet? <a href="./SignUp">Sign Up</a>
        </p>
        {/* //  <SignInwithGoogle/> */}
      </div>
    </form>
  );
}

export default Login;
