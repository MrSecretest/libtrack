import CloseButton from "../../media/icons/CloseButton.png"
import "./Button-cancel-round.css"

export default function ButtonCancelRound({closeFunction})
{
    return(
        <div className="cancel-round" onClick={closeFunction}>
            <img src={CloseButton} width="8px"></img>
        </div>
    )
}