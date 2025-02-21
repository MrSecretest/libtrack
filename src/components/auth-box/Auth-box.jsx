import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth-box.css";
import Buttonlanding from "../button-landing/Button-landing"
import { useUserAuth } from "../../auth/UserAuthContext";

function AuthForm({ Close }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { signUp } = useUserAuth();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(""); // Clear any existing errors
    try {
      await signUp(email, password); // Attempt to sign up
      navigate("/"); // Navigate to home page on success
    } catch (err) {
      setError(err.message); // Catch and set error message
    }
  };

  return (
    <div className="authBg">
      <div className="authbox">
        <form onSubmit={handleSubmit}>
          <div className="field">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Set email state
              required
            />
          </div>
          <div className="field">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Set password state
              required
            />
          </div>
          <button type="submit">Submit</button>

          {error && <p className="error">{error}</p>}
          <Buttonlanding Text={"Close"} onClick={() => Close()}></Buttonlanding>

        </form>
      </div>
    </div>
  );
}

export default AuthForm;

