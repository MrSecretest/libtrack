import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth-box.css";
import { useUserAuth } from "../../auth/UserAuthContext";
import { auth } from "../../firebase";
import ButtonCancelRound from "../button-cancel-round/Button-cancel-round";
import { motion } from "motion/react";
import { AnimatePresence } from "motion/react";

function AuthForm({ Close }) {
  const [authMode, setAuthMode] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { signUp, logIn } = useUserAuth();

  const handleSubmitSignUp = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signUp(email, password);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmitLogIn = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await logIn(email, password);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, setError]);


  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}

        className="authBg"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.2 }}
          className="authbox-container"
        >
          <ButtonCancelRound closeFunction={() => Close()}></ButtonCancelRound>
          <div className="authbox-top">
            <AnimatePresence mode="wait">
              <motion.h1
                key={authMode}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1], y: [-10, 0] }}
                transition={{ duration: 0.1 }}
              >
                {authMode == "Sign Up"
                  ? "Sign Up for Free"
                  : "Log In to Continue"}
              </motion.h1>
            </AnimatePresence>
            <motion.p
              key={authMode}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1], y: [-10, 0] }}
              transition={{ duration: 0.2 }}
            >
              Or{" "}
              <span>
                <a
                  href="#"
                  onClick={() =>
                    setAuthMode(authMode == "Log In" ? "Sign Up" : "Log In")
                  }
                >
                  {authMode == "Log In" ? "Sign Up" : "Log In"}
                </a>
              </span>{" "}
              if {authMode == "Log In" ? "you have" : "you don't have"} an
              account {authMode == "Log In" ? "already" : ""}
            </motion.p>
            <AnimatePresence mode="wait">
              {error && (
                <motion.p
                  className="auth-error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1], y: [-10, 0] }}
                  transition={{ duration: 0.2 }}
                  exit={{opacity: [1, 0], y: [0, 10] }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="authbox-bottom">
            {authMode == "Sign Up" ? (
              <form onSubmit={handleSubmitSignUp}>
                <div className="field">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button className="landing-button-container" type="submit">
                  {authMode}
                </button>
              </form>
            ) : (
              //
              //
              //
              //
              <form onSubmit={handleSubmitLogIn}>
                <div className="field">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button className="landing-button-container" type="submit">
                  {authMode}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

export default AuthForm;
