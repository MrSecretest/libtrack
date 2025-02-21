import "./Button-landing.css"

export default function Buttonlanding({Text, onClick})
{
    return(
        <>
            <div className="button-container" onClick={onClick != null ? onClick : null}>
                <p>{Text}</p>
            </div>
        </>
    );
}