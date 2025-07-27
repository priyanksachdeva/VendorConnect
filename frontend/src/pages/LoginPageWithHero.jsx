import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { AnimatedHero } from "../components/ui/AnimatedHero";
import { Waves } from "../components/ui/waves-background";
import { auth, db } from "../firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";

const LoginPageWithHero = () => {
  const { loginWithGoogle } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState("vendor");
  const [showUserTypeModal, setShowUserTypeModal] = useState(false);
  const [pendingGoogleUser, setPendingGoogleUser] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    contactNumber: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const authSectionRef = useRef(null);

  const handleScrollToAuth = () => {
    if (authSectionRef.current) {
      authSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const provider = new GoogleAuthProvider();

      // Add additional scopes if needed
      provider.addScope("email");
      provider.addScope("profile");

      // Try popup first, fallback to redirect if it fails
      let result;
      try {
        result = await signInWithPopup(auth, provider);
      } catch (popupError) {
        // If popup is blocked or fails, show user-friendly error
        if (
          popupError.code === "auth/popup-blocked" ||
          popupError.code === "auth/popup-closed-by-user" ||
          popupError.message.includes("sessionStorage")
        ) {
          setError(
            "Popup was blocked. Please allow popups for this site and try again, or use email login instead."
          );
          setLoading(false);
          return;
        }
        throw popupError;
      }

      const user = result.user;
      console.log("Google auth result:", user);

      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        // New user - show user type selection modal
        setPendingGoogleUser(user);
        setShowUserTypeModal(true);
        setLoading(false);
        return;
      }

      // Existing user - login successful, AuthContext will handle the rest
      console.log("✅ Google login successful - existing user");
      setLoading(false);
    } catch (error) {
      console.error("❌ Google login error:", error);

      // Handle specific Firebase auth errors
      let errorMessage = "Google login failed. ";
      if (error.code === "auth/popup-blocked") {
        errorMessage = "Popup was blocked. Please allow popups and try again.";
      } else if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Login was cancelled. Please try again.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage =
          "Network error. Please check your connection and try again.";
      } else if (
        error.message.includes("sessionStorage") ||
        error.message.includes("initial state")
      ) {
        errorMessage =
          "Browser storage issue. Please try refreshing the page or use email login instead.";
      } else {
        errorMessage += error.message;
      }

      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleCompleteGoogleSignup = async () => {
    if (!pendingGoogleUser) return;

    try {
      setLoading(true);
      await setDoc(doc(db, "users", pendingGoogleUser.uid), {
        uid: pendingGoogleUser.uid,
        email: pendingGoogleUser.email,
        displayName: pendingGoogleUser.displayName,
        userType: userType,
        businessName: pendingGoogleUser.displayName || "",
        contactNumber: "",
        address: "",
        createdAt: new Date().toISOString(),
        loginMethod: "google",
      });

      setShowUserTypeModal(false);
      setPendingGoogleUser(null);
      console.log("✅ Google signup completed");

      // Refresh the page to ensure AuthContext picks up the new user profile
      window.location.reload();
    } catch (error) {
      console.error("❌ Error completing Google signup:", error);
      setError(`Signup completion failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!isLogin && formData.password !== formData.confirmPassword) {
        throw new Error("Passwords don't match");
      }

      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
      } else {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        await updateProfile(userCredential.user, {
          displayName: formData.businessName,
        });

        await setDoc(doc(db, "users", userCredential.user.uid), {
          uid: userCredential.user.uid,
          email: formData.email,
          displayName: formData.businessName,
          userType: userType,
          businessName: formData.businessName,
          contactNumber: formData.contactNumber,
          address: formData.address,
          createdAt: new Date().toISOString(),
          loginMethod: "email",
        });
      }

      console.log("✅ Email authentication successful");
    } catch (error) {
      console.error("❌ Email authentication error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const useTestCredentials = (type) => {
    const testCreds = {
      vendor: { email: "vendor@test.com", password: "test123" },
      supplier: { email: "supplier@test.com", password: "test123" },
    };

    setFormData((prev) => ({
      ...prev,
      email: testCreds[type].email,
      password: testCreds[type].password,
    }));
    setUserType(type);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <AnimatedHero onSignUpClick={handleScrollToAuth} />

      {/* Auth Section */}
      <section
        id="auth-section"
        ref={authSectionRef}
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden"
      >
        <Waves />

        <motion.div
          className="relative z-10 max-w-md w-full mx-4"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {isLogin ? "Welcome Back" : "Join VendorConnect"}
              </h2>
              <p className="text-gray-600">
                {isLogin
                  ? "Sign in to your account to continue"
                  : "Create your account to get started"}
              </p>
            </div>

            {/* User Type Selection - Only show during signup */}
            {!isLogin && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  I am a:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUserType("vendor")}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      userType === "vendor"
                        ? "bg-blue-50 border-blue-200 text-blue-700"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    🛒 Street Vendor
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType("supplier")}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      userType === "supplier"
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    🏭 Supplier
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  required
                />
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  required
                />
              </div>

              {!isLogin && (
                <>
                  <div>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="businessName"
                      placeholder="Business name"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      required
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Please wait..."
                  : isLogin
                  ? "Sign In"
                  : "Create Account"}
              </button>
            </form>

            {/* Google Login */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="mt-4 w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>

              {/* Google Login Help Note */}
              <p className="text-xs text-gray-500 text-center mt-2">
                Note: Please allow popups and ensure cookies are enabled for
                Google login to work properly.
              </p>
            </div>

            {/* Test Credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Quick test access:</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => useTestCredentials("vendor")}
                  className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200 transition-colors"
                >
                  Demo Vendor
                </button>
                <button
                  type="button"
                  onClick={() => useTestCredentials("supplier")}
                  className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200 transition-colors"
                >
                  Demo Supplier
                </button>
              </div>
            </div>

            {/* Toggle Auth Mode */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {isLogin
                  ? "Need an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* User Type Selection Modal */}
      {showUserTypeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Complete Your Profile
              </h3>
              <p className="text-gray-600">
                Please let us know what type of account you need
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I am a:
              </label>
              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType("vendor")}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    userType === "vendor"
                      ? "bg-blue-50 border-blue-200 text-blue-700"
                      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🛒</span>
                    <div>
                      <div className="font-medium">Street Vendor</div>
                      <div className="text-sm text-gray-500">
                        I sell products directly to customers
                      </div>
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setUserType("supplier")}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    userType === "supplier"
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🏭</span>
                    <div>
                      <div className="font-medium">Supplier</div>
                      <div className="text-sm text-gray-500">
                        I supply products to vendors
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowUserTypeModal(false);
                  setPendingGoogleUser(null);
                  setError("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCompleteGoogleSignup}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Complete Signup"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default LoginPageWithHero;
