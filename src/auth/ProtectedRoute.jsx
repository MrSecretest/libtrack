import { useUserAuth } from "./UserAuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user } = useUserAuth();

  console.log("Check user in ProtectedRoute: ", user);
  
  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
}
