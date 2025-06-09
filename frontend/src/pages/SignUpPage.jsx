import React, {useState} from "react";
import {BotMessageSquare} from "lucide-react";
import {Link, useNavigate} from "react-router"; // or "react-router-dom" if using v6
import {signup} from "../lib/api";

const SignupPage = () => {
  const navigate = useNavigate();

  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    try {
      const data = await signup(signupData);
      console.log("Signup response:", data);

      // Backend sets the cookie; just check success flag
      if (data?.success) {
        navigate("/"); // ✅ Redirect to home/dashboard
      } else {
        setError({response: {data: {message: "Signup failed"}}});
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="forest"
    >
      <div
        className="border flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden"
        style={{borderColor: "#4F7FFF", opacity: 0.9}}
      >
        {/* Sign up form left side */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/* LOGO */}
          <div className="mb-4 flex items-center justify-start gap-2">
            <BotMessageSquare className="size-9 text-[#4F7FFF]" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-[#37506b] via-[#4F7FFF] to-[#4583c1] tracking-wider">
              FaceRipple
            </span>
          </div>

          {/* Error message if any */}
          {error && (
            <div className="alert alert-error mb-4">
              <span>
                {error?.response?.data?.message || "Something went wrong"}
              </span>
            </div>
          )}

          <div className="w-full">
            <form onSubmit={handleSignup}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Create an Account</h2>
                  <p className="text-sm opacity-70">
                    Join FaceRipple and Start your language learning journey!
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      className="input input-bordered w-full"
                      value={signupData.fullName}
                      onChange={(e) =>
                        setSignupData({...signupData, fullName: e.target.value})
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="input input-bordered w-full"
                      value={signupData.email}
                      onChange={(e) =>
                        setSignupData({...signupData, email: e.target.value})
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      className="input input-bordered w-full"
                      value={signupData.password}
                      onChange={(e) =>
                        setSignupData({...signupData, password: e.target.value})
                      }
                      required
                    />
                    <p className="text-xs opacity-70 mt-1">
                      Password must be at least 6 characters long
                    </p>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        required
                      />
                      <span className="text-xs leading-tight">
                        I agree to the{" "}
                        <a
                          href="/terms"
                          className="text-[#4F7FFF] hover:underline"
                        >
                          Terms of services
                        </a>{" "}
                        and{" "}
                        <span className="text-[#4F7FFF] hover:underline">
                          privacy policy
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
                <button
                  className="btn bg-gradient-to-r from-[#436b96] via-[#4F7FFF] to-[#348ee8] rounded-lg w-full"
                  type="submit"
                >
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      loading...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
                <div className="text-center mt-4">
                  <p className="text-sm">
                    Already have an Account?{" "}
                    <Link
                      to="/login"
                      className="text-[#4F7FFF] hover:underline"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* SIGNUP FORM - RIGHT SIDE */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-[#4F7FFF]/80 items-center justify-center">
          <div className="max-w-md p-8">
            <div className="relative aspect-square max-w-sm mx-auto">
              <img
                src="/s-i-1.png"
                alt="Language connection illustration"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">
                Connect with language partners worldwide
              </h2>
              <p className="opacity-90">
                Practice conversations, make friends, and improve your language
                skills together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
