import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import axios, { HttpStatusCode } from "axios";
import { useState } from "react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [roles, setRoles] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const newUser = {
        username: username,
        fullName: fullName,
        email: email,
        mobile: mobile,
        roles: roles,
      };

      console.log("Submitting new user:", newUser);
      const response = await axios.post(
        `http://localhost:3001/auth/signup`,
        newUser
      );

      if (response.status === HttpStatusCode.Ok) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem("token", data.token);
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Try again.");
    }

    setEmail("");
    setUsername("");
    setFullName("");
    setMobile("");
    setRoles("");
  };

  return (
    <>
      <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gray-900 text-white">
        <div className="sm:mx-auto sm:w-screen sm:max-w-sm">
          <img alt="Your Company" src={logo} className="mx-auto h-10 w-auto" />
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-white">
            Create your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-screen sm:max-w-sm">
          <form onSubmit={submitHandler} className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="full-name"
                  className="block text-sm font-medium text-gray-300"
                >
                  Full Name
                </label>
              </div>

              <div className="mt-2">
                <input
                  id="full-name"
                  name="full-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full rounded-md bg-gray-800 px-3 py-1.5 text-base text-white border border-gray-600 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-300"
                >
                  Username
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full rounded-md bg-gray-800 px-3 py-1.5 text-base text-white border border-gray-600 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300"
                >
                  Email address
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md bg-gray-800 px-3 py-1.5 text-base text-white border border-gray-600 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="mobile"
                  className="block text-sm font-medium text-gray-300"
                >
                  Mobile Number
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  pattern="[0-9]{10}"
                  title="Please enter a 10-digit mobile number"
                  required
                  autoComplete="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="block w-full rounded-md bg-gray-800 px-3 py-1.5 text-base text-white border border-gray-600 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="roles"
                  className="block text-sm font-medium text-gray-300"
                >
                  Role
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="roles"
                  name="roles"
                  type="text"
                  required
                  autoComplete="off"
                  onChange={(e) => setRoles(e.target.value)}
                  placeholder="customer or serviceProvider"
                  className="block w-full rounded-md bg-gray-800 px-3 py-1.5 text-base text-white border border-gray-600 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-500"
              >
                Sign up
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-500 hover:text-indigo-400"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
