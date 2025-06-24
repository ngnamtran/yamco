import React, { useState } from "react";
import { auth,db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {  doc, setDoc } from "firebase/firestore";
//import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/style.css";

function SignUp() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [error, setError] = useState("");
  //const navigate = useNavigate();
  //const db = getFirestore();

  // useEffect(() => {
  //   console.log("Firebase auth:", auth);
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //setError("");

    if (password !== rePassword) {
      setError("Passwords do not match");
      return;
    }

    if (!userName || !email || !password || !rePassword) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log(user);
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          displayName: userName,
          photo: "",
        });
      }
       console.log("User Registered Successfully!!");
       toast.success("User Registered Successfully!!", {
        position: "top-center",
        });

    } catch (error) {
      console.log(error.message);
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };

  return (
    <div className="container mt-5">
      <form id="formSignup" onSubmit={handleSubmit}>
        <h3 className="text-center mb-4">Sign Up</h3>

        <div className="mb-3">
          <label htmlFor="userName" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="userName"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="rePassword" className="form-label">Re-enter Password</label>
          <input
            type="password"
            className="form-control"
            id="rePassword"
            placeholder="Re-enter password"
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
            required
          />
          {error && <div className="text-danger mt-1">{error}</div>}
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary">Sign Up</button>
        </div>
        <p className="text-center mt-3">Already registered? <a href="/Login">Login</a></p>
      </form>
    </div>
  );
}

export default SignUp;
