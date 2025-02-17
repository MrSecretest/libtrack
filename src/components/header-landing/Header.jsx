import "./Header.css";

export default function Header() {
  return (
    <>
      <div className="header-container">
        <p className="product-name">LitTrack</p>
        <div className="sections">
          <p>Main</p>
          <p>Features</p>
          <p>Pricing</p>
          <p>Contact</p>
        </div>
        <div className="sign">
          <div className="text-button">
            <p>Sign In</p>
          </div>
          <div className="fancy-button">
            <p>Sign Up</p>
          </div>
        </div>
      </div>
    </>
  );
}
