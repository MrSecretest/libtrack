import "./Buttons.css"

export default function Buttonlanding({Text, onClick})
{
    return(
        <>
            <div className="landing-button-container" onClick={onClick != null ? onClick : null}>
                <p>{Text}</p>
            </div>
        </>
    );
}