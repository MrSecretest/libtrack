import "./Sidebar.css";
import SidebarRoundButton from "./SidebarRoundButton.jsx";

import Profile from "../../media/sidebar/Profile.png"
import Home from "../../media/sidebar/Home.png"
import Search from "../../media/sidebar/Search.png"
import Library from "../../media/sidebar/Library.png"
import Progress from "../../media/sidebar/Progress.png"
import Rated from "../../media/sidebar/Rated.png"
import Notes from "../../media/sidebar/Notes.png"
import SignOut from "../../media/sidebar/SignOut.png"


export default function Sidebar() {
  return (
    <>
      <div className="sidebar">
        <div className="buttons-group">
          <SidebarRoundButton image={Profile}></SidebarRoundButton>
          <div className="function-buttons-group">
            <SidebarRoundButton image={Home}></SidebarRoundButton>
            <SidebarRoundButton image={Search}></SidebarRoundButton>
            <SidebarRoundButton image={Library}></SidebarRoundButton>
            <SidebarRoundButton image={Progress}></SidebarRoundButton>
            <SidebarRoundButton image={Rated}></SidebarRoundButton>
            <SidebarRoundButton image={Notes}></SidebarRoundButton>
          </div>
          <SidebarRoundButton image={SignOut}></SidebarRoundButton>
        </div>
      </div>
    </>
  );
}
