import "./css/pages.css";
import Sidebar from "../components/sidebar/Sidebar.jsx";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.body.style.overflow = "auto";
  }, [])
  return (

    <div className="page-wrapper">
      <Sidebar current={"Home"}/>
    </div>
  );
}
