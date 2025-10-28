import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

import logo from "../assets/logo/leadway-logo.png";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignUpPage = () => {
  //Initialize Firebase authentication and navigation
  const auth = getAuth();
  const navigate = useNavigate();

  //State variables for managing authentication state, email, password, and error messages
  const [authing, setAuthing] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  //Function to handle sign-up with Google
  const signUpWithGoogle = async () => {
    setAuthing(true);

    //Use Firebase to sign up with Google
    signInWithPopup(auth, new GoogleAuthProvider())
      .then((response) => {
        console.log(response.user.uid);
        toast.success("Signed Up successfully!");
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        setAuthing(false);
      });
  };

  //Function to handle sign-in with email and password
  const signUpWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    //check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setAuthing(true);
    setError("");

    // Use Firebase to create a new user with email and password
    createUserWithEmailAndPassword(auth, email, password)
      .then((response) => {
        console.log(response.user.uid);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);
        setAuthing(false);
      });
  };

  return (
    <section className="">
      <div className="grid grid-cols-1 sm:grid-cols-2 h-screen">
        {/* image container */}
        <div className="flex-1  sm:flex hidden">
          <div className="relative flex w-full h-full flex-col p-10 min-h-screen bg-[url('/src/assets/images/telemedicine.webp')] bg-cover bg-center">
            {/* White → Deep Red Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-red-700/70"></div>

            {/* Content */}
            <div className="relative z-10 w-full h-full flex flex-col justify-between">
              {/* Logo */}
              <img alt="logo" className="w-52" src={logo} />

              {/* Text */}
              <div className="text-white">
                <h2 className="text-3xl font-bold">TelemedRx</h2>
                <h2 className="text-2xl">The Smarter Choice is Here...</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Login container */}
        <div className="flex flex-col px-10 md:px-20 justify-center min-h-screen">
          <div className="items-start mb-6">
            <h2 className="text-2xl font-bold mb-3">Sign Up</h2>
            <h5 className="text-md font-semibold">
              Welcome! Please enter your details to begin.
            </h5>
          </div>

          <div className="items-center justify-center ">
            <form className="space-y-4">
              <div>
                <label className="block text-gray-600 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full border-none rounded-lg px-3 py-2 focus:outline-none  bg-gray-100  focus:bg-gray-200 text-sm placeholder:text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your Password"
                    className="w-full border-none rounded-lg px-3 py-2 focus:outline-none bg-gray-100  focus:bg-gray-200 text-sm placeholder:text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 text-sm  placeholder:text-sm"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-600 mb-2">
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Re-Enter your Password"
                    className="w-full border-none rounded-lg px-3 py-2 focus:outline-none bg-gray-100  focus:bg-gray-200 placeholder:text-sm"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Display error message */}
              {error && <div className="text-red-500 mb-4">{error}</div>}

              {/* Button to sign up with email and password */}
              <button
                type="submit"
                className="w-full bg-red-400 hover:bg-red-500 text-white font-semibold py-2 rounded-lg cursor-pointer transition-all"
                onClick={signUpWithEmail}
                disabled={authing}
              >
                Sign Up With Email and Password
              </button>

              {/* Divider with 'or' text */}
              <div className="relative flex items-center justify-center w-full py-4">
                <div className="w-full h-px bg-gray-300"></div>
                <p className="absolute bg-white text-gray-500 px-2">OR</p>
              </div>

              {/* Button to sign up with google */}
              <button
                type="submit"
                className="w-full bg-white text-black/50 hover:text-black font-semibold py-2 border rounded-lg cursor-pointer transition-all"
                onClick={signUpWithGoogle}
                disabled={authing}
              >
                Sign Up With Google
              </button>

              {/* Link to login page */}
              <div className="w-full flex items-center justify-center mt-10">
                <p className="text-sm font-normal text-gray-700">
                  Already have an account?{" "}
                  <span className="font-semibold cursor-pointer underline">
                    <a href="/login">Log In</a>
                  </span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUpPage;
