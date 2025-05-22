import "../books-slider/BooksSlider.css";
import BookRoundButton from "../book-round-button/BookRound";
const AdditionalBar = ({
  type,
  buttonFunc,
  progress,
  maxProgress,
  rating,
  comment,
}) => {
  return (
    <>
      {type == "progress" ? (
        <div className="additional-container">
          <BookRoundButton size="small" type="plus" onClick={buttonFunc} />
          <div className="progress">
            <div
              className={`progress-bar progress-bar-striped ${
                progress == maxProgress ? "" : "progress-bar-animated"
              }`}
              style={{
                width: `${(progress / maxProgress) * 100}%`,
                backgroundColor:
                  progress == maxProgress
                    ? "rgb(71, 41, 104)"
                    : "rgb(73, 128, 189)",
              }}
            ></div>
          </div>
        </div>
      ) : type == "rated" ? (
        <div className="additional-container">
          {comment ? (
            <div className="comment-button">
              {" "}
              <BookRoundButton
                size="small"
                type="comment"
                onClick={buttonFunc}
              />
            </div>
          ) : (
            <div></div>
          )}
          <div className="stars">
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                className="star"
                data-value={i}
                style={{
                  transition: "color 0.2s ease-in-out",
                  cursor: "pointer",
                  color: i > rating ? "#808080" : "#ffc107",
                }}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      ) : type == "notes" ? (
        <div className="additional-container">
          {comment ? (
            <div className="comment-button">
              <BookRoundButton
                size="small"
                type="comment"
                onClick={buttonFunc}
              />
            </div>
          ) : (
            <div></div>
          )}
          <div className="notes">
            <div className="additional-container">
              <BookRoundButton size="small" type="notes" onClick={buttonFunc} />
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default AdditionalBar;
