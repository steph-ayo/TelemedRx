import { useState } from "react";
import {
  getAuth,
  // GoogleAuthProvider,
  // signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo/leadway-logo.png";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const LoginPage = () => {
  //Initialize Firebase authentication and navigation
  const auth = getAuth();
  const navigate = useNavigate();

  //State variables for managing authentication state, email, password, and error messages
  const [authing, setAuthing] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Email validation function
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle email change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // Validate email while typing
    if (value.length > 0 && !validateEmail(value)) {
      setEmailError("Please enter a valid email");
    } else {
      setEmailError("");
    }
  };

  // Check if form is valid
  const isFormValid = email.length > 0 && password.length > 0 && !emailError;

  //Function to handle sign-in with Google
  // const signInWithGoogle = async () => {
  //   setAuthing(true);

  //   //Use Firebase to sign in with Google
  //   signInWithPopup(auth, new GoogleAuthProvider())
  //     .then((response) => {
  //       console.log(response.user.uid);
  //       navigate("/main");
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       setAuthing(false);
  //     });
  // };

  //Function to handle sign-in with email and password
  const signInWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthing(true);
    setError("");

    // Add a 2 seconds delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    //Use Firebase to sign in email and password
    signInWithEmailAndPassword(auth, email, password)
      .then((response) => {
        console.log(response.user.uid);
        toast.success("Signed in successfully!");
        navigate("/main");
      })
      .catch((error) => {
        console.log(error);
        let message = "";

        switch (error.code) {
          case "auth/invalid-email":
            message =
              "The email address is not valid. Please check and try again.";
            break;
          case "auth/user-not-found":
            message = "No account found with this email. Please sign up first.";
            break;
          case "auth/wrong-password":
          case "auth/invalid-credential":
            message = "Incorrect password. Please try again.";
            break;
          case "auth/network-request-failed":
            message = "Network error. Please check your internet connection.";
            break;
          default:
            message = "Something went wrong. Please try again later.";
        }

        setError(message);
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
            <div className="absolute inset-0 bg-linear-to-b from-white/30 to-red-700/70"></div>

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
            <h2 className="text-3xl font-bold mb-5">TelemedRx</h2>
            <h5 className="text-lg font-semibold">
              Unifying telemedicine & acute requests, pharmacy operations, and
              billing in <span className="text-orange-700">real time.</span>
            </h5>
          </div>

          <div className="items-center justify-center ">
            <form onSubmit={signInWithEmail} className="space-y-4">
              {/* Email field */}
              <div>
                <label className="block text-gray-600 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`w-full border-none rounded-lg px-3 py-2 focus:outline-none text-sm placeholder:text-sm ${
                    emailError
                      ? "bg-red-50 focus:bg-red-100 ring-2 ring-red-400"
                      : "bg-gray-100 focus:bg-gray-200"
                  }`}
                  value={email}
                  onChange={handleEmailChange}
                />
                {emailError && (
                  <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}
              </div>

              {/* Password field */}
              <div>
                <label className="block text-gray-600 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full border-none rounded-lg px-3 py-2 focus:outline-none bg-gray-100  focus:bg-gray-200 text-sm placeholder:text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              {error && (
                <div className="text-red-500 text-sm mb-4">{error}</div>
              )}

              <p className="text-sm text-gray-700 font-semibold text-right cursor-pointer hover:underline">
                <a href="">Forgot Password?</a>
              </p>

              {/* Button to login */}
              <button
                type="submit"
                className={`w-full font-semibold py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
                  isFormValid && !authing
                    ? "bg-red-500 text-white cursor-pointer"
                    : "bg-red-400 text-white cursor-not-allowed"
                }`}
                onClick={signInWithEmail}
                disabled={!isFormValid || authing}
              >
                {authing ? (
                  <>
                    <AiOutlineLoading3Quarters className="animate-spin text-xl" />
                    <span>Loading...</span>
                  </>
                ) : (
                  "Login"
                )}
              </button>
              <>
                {/* Divider with 'or' text */}
                {/* <div className="relative flex items-center justify-center w-full py-4">
                  <div className="w-full h-px bg-gray-300"></div>
                  <p className="absolute bg-white text-gray-500 px-2">OR</p>
                </div> */}

                {/* Button to login with google */}
                {/* <button
                  type="submit"
                  className="w-full bg-white text-black/50 hover:text-black font-semibold py-2 border rounded-lg cursor-pointer transition-all"
                  onClick={signInWithGoogle}
                  disabled={authing}
                >
                  Login with Google
                </button> */}

                {/* Link to sign up page */}
                {/* <div className="w-full flex items-center justify-center mt-10">
                  <p className="text-sm font-normal text-gray-700">
                    Don't have an account?{" "}
                    <span className="font-semibold cursor-pointer underline">
                      <a href="/signup">Sign Up</a>
                    </span>
                  </p>
                </div> */}
              </>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
