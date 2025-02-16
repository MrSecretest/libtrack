import "./Features.css";

export default function Feature({Image, Text}) {
  return (
    <>
      <div className="feature-box">
        <div className="top-part">
            <img src={Image}></img>
        </div>
        <div className="bottom-part">
          <p>{Text}</p>
        </div>
      </div>
    </>
  );
}
