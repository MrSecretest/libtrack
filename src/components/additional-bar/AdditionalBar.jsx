import "../books-slider/BooksSlider.css";

const AdditionalBar = ({ type, progress, maxProgress, rating }) => {
  return (
    <>
      {
        type == "progress" ?
        <div className="additional-container">
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
        :
        <></>
      }
    </>
  );
};

export default AdditionalBar;
