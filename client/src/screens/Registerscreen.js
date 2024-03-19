import React, { useState, useEffect } from "react";
import axios from "axios";

import Loader from "../components/Loader";
import Error from "../components/Error";
import Success from "../components/Success";

function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phonenumber, setphonenumber] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function register() {
    if (!name || !email || !password || !cpassword || !phonenumber) {
      setError("Please fill in all fields");
      return;
    }

    if (password === cpassword) {
      const user = {
        name,
        email,
        phonenumber,
        password,
        cpassword,
      };
      setLoading(true);
      setError("");
      setSuccess("");
      try {
        const result = (await axios.post("/api/users/register", user)).data;
        console.log(result);
        setSuccess(result);
        setName("");
        setEmail("");
        setphonenumber("");
        setPassword("");
        setCpassword("");
        setLoading(false);
      } catch (error) {
        console.log(error);
        setError("Invalid Credentials");
        setLoading(false);
      }
    } else {
      setError("Password not matched");
    }
  }

  return (
    <div className="container mt-5" style={{ padding: "70px" }}>
      <div className="row justify-content-center">
        <div className="col-md-7">
          <div className="card bs">
            <div className="card-body">
              <h2 className="text-center mb-3">Register</h2>
              {loading && <Loader />}
              {error && <Error message={error} />}
              {success && <Success message={success} />}
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="row mb-3">
                  <div className="col-4">
                    <label htmlFor="name" className="form-label">
                      Name <span style={{ color: "red" }}>*</span>
                    </label>
                  </div>
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-4">
                    <label htmlFor="email" className="form-label">
                      Email <span style={{ color: "red" }}>*</span>
                    </label>
                  </div>
                  <div className="col">
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-4">
                    <label htmlFor="phonenumber" className="form-label">
                      Phone No <span style={{ color: "red" }}>*</span>
                    </label>
                  </div>
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
                      id="phonenumber"
                      placeholder="Enter your phoneno"
                      value={phonenumber}
                      onChange={(e) => setphonenumber(e.target.value)}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-4">
                    <label htmlFor="password" className="form-label">
                      Password <span style={{ color: "red" }}>*</span>
                    </label>
                  </div>
                  <div className="col">
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-4">
                    <label htmlFor="cpassword" className="form-label">
                      Confirm Password <span style={{ color: "red" }}>*</span>
                    </label>
                  </div>
                  <div className="col">
                    <input
                      type="password"
                      className="form-control"
                      id="cpassword"
                      placeholder="Confirm your password"
                      value={cpassword}
                      onChange={(e) => setCpassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="text-center mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={register}
                  >
                    Register
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterScreen;
