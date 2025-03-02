import "../button-landing/Buttons.css"
export default function Tag({ Text }) {
  return (
    <>
      {Text ? (
        <div className="tag-container">
          <p>{Text}</p>
        </div>
      ) : null}
    </>
  );
}
