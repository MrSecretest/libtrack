import "./Button-landing.css"

export default function Buttonlanding({Text, OnPress})
{
    return(
        <>
            <div className="button-container">
                <p>{Text}</p>
            </div>
        </>
    );
}