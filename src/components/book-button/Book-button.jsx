import "../button-landing/Buttons.css";

export default function BookButton({ Text, onClick }) {
  return (
    <>
      {Text && onClick != null ? (
        <div
          className="book-button-container"
          onClick={onClick != null ? onClick : null}
        >
          <p>{Text}</p>
        </div>
      ) : null}
    </>
  );
}
