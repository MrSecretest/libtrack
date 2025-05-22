import Buttonlanding from "../button-landing/Button-landing";
import "./Pricings.css";

export default function Pricing({ Text, Redirect }) {
  return (
    <div className="pricing-container">
      <div className="top-part-pricing">
        <div className="price-container">
          <h1 className={Text === "Pro" ? "pro-heading" : "free-heading"}>{Text}</h1>
          <p className="price-value">
            {Text === "Free" ? "$0.00" : "$3.00"}
            <span className="price-period">/month</span>
          </p>
        </div>
      </div>
      <div className="bottom-part-pricing">
        {Text === "Free" ? (
          <ul>
            <li>40+ million books available</li>
            <li>Make notes for favorite books</li>
            <li>Get recommendations for similar books you like</li>
            <li>Track books reading progress</li>
            <li>Maximum of 15 books in a library</li>
          </ul>
        ) : (
          <ul>
            <li>Everything in Free</li>
            <li>Infinite amount of books in library</li>
            <li>Customizable Reading Goals</li>
            <li>Detailed Analytics and Insights</li>
            <li>Ad-Free Experience</li>
          </ul>
        )}
        <div className="get-started-button">
          <Buttonlanding Text={"Get Started"} onClick={Redirect} />
        </div>
      </div>
    </div>
  );
}
