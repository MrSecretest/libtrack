import "./Sidebar.css";
import SidebarRoundButton from "./SidebarRoundButton.jsx";

import Profile from "../../media/sidebar/Profile.png";
import Home from "../../media/sidebar/Home.png";
import Search from "../../media/sidebar/Search.png";
import Library from "../../media/sidebar/Library.png";
import Progress from "../../media/sidebar/Progress.png";
import Rated from "../../media/sidebar/Rated.png";
import Notes from "../../media/sidebar/Notes.png";
import SignOut from "../../media/sidebar/SignOut.png";

export default function Sidebar({current}) {
  return (
    <div className="sidebar">
      <div className="buttons-group">
        <SidebarRoundButton active={current == "Profile" ? true : false} image={Profile} redirect="/profile" />
        <div className="function-buttons-group">
          <SidebarRoundButton active={current == "Home" ? true : false} image={Home} redirect="/home" />
          <SidebarRoundButton active={current == "Search" ? true : false} image={Search} redirect="/search" />
          <SidebarRoundButton active={current == "Library" ? true : false} image={Library} redirect="/library" />
          <SidebarRoundButton active={current == "Progress" ? true : false} image={Progress} redirect="/progress" />
          <SidebarRoundButton active={current == "Rated" ? true : false} image={Rated} redirect="/rated" />
          <SidebarRoundButton active={current == "Notes" ? true : false} image={Notes} redirect="/notes" />
        </div>
        <SidebarRoundButton image={SignOut} redirect="/signout" />
      </div>
    </div>
  );
}
