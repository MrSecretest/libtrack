import "./Sidebar.css";

export default function SidebarRoundButton({image})
{
    return(
        <>
            <div className="sidebar-round-button">
                <img src={image} width={"24px"}></img>
            </div>
        </>
    );
}