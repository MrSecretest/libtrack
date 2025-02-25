import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

export default function SidebarRoundButton({image, redirect, active})
{
    const navigate = useNavigate();

    const handleRedirect = () => {
        if (redirect) navigate(redirect);
    };

    return(
        <>
            <div onClick={handleRedirect} className={`sidebar-round-button  ${active ? `selected` : ``}`}>
                <img src={image} width={"24px"}></img>
            </div>
        </>
    );
}