import { useState } from "react";
import "./App.css";
import ProductImage from "../media/landing/ProductShowcase.webp";
import Buttonlanding from "../components/button-landing/Button-landing";
import Features from "../components/features-landing/Features";
import Pricing from "../components/pricing-landing/Pricing";

function App() {
  return (
    <div className="everything">
      <div className="waves-container">
        <div className="cta-box">
          <h1>Discover, Track and Enjoy Your Books again</h1>

          <div className="bottom-header">
            <h2>
              Find your next favorite read, stay organized, and share your
              journey with others
            </h2>
            <Buttonlanding Text={"Sign Up"}></Buttonlanding>
          </div>
        </div>
        <svg
          className="first-wave"
          height="100%"
          viewBox="0 0 1452 2068"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 988.248C44.3667 945.546 173.433 807.679 266.2 732.035C358.967 656.392 459.8 580.748 556.6 534.386C653.4 488.024 750.2 519.745 847 453.862C943.8 387.979 1036.57 214.73 1137.4 139.087C1238.23 63.4431 1399.57 23.1811 1452 0V2068H0V988.248Z"
            fill="url(#paint0_linear_129_198)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_129_198"
              x1="726"
              y1="0"
              x2="726"
              y2="2068"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#6E38AE" />
              <stop offset="1" stopColor="#180D26" />
            </linearGradient>
          </defs>
        </svg>

        <div className="second-wave">
          <img src={ProductImage}></img>
          <h1>Features</h1>
          <svg
            height="100%"
            viewBox="0 0 1452 2068"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M0 227.67C36.3 211.125 141.167 151.269 217.8 128.4C294.433 105.531 379.133 103.103 459.8 90.4549C540.467 77.8066 613.067 44.7164 701.8 52.5098C790.533 60.3033 903.467 129.422 992.2 137.216C1080.93 145.009 1157.57 122.14 1234.2 99.2704C1310.83 76.4012 1415.7 16.5451 1452 0V1284H0V227.67Z"
              fill="url(#paint0_linear_129_199)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_129_199"
                x1="726"
                y1="0"
                x2="726"
                y2="1284"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#61319B" />
                <stop offset="1" stop-color="#180D26" />
              </linearGradient>
            </defs>
          </svg>
          <Features></Features>
        </div>
        <svg
          className="third-wave"
          viewBox="0 0 1452 2068"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 0C44.7395 9.10155 174.891 5.72678 268.437 54.6093C361.983 103.492 463.664 234.186 561.277 293.295C658.891 352.404 748.37 391.06 854.118 409.263C959.866 427.466 1094.08 374.084 1195.76 402.514C1297.45 430.943 1419.46 550.286 1464.2 579.841V1366H0V0Z"
            fill="url(#paint0_linear_135_1139)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_135_1139"
              x1="732.101"
              y1="0"
              x2="732.101"
              y2="1366"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#3F1177" />
              <stop offset="1" stop-color="#45236F" />
            </linearGradient>
          </defs>
        </svg>
        <div className="features-box"></div>

        <div className="pricing-box">
          <svg
            height="100%"
            viewBox="0 0 1452 2068"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M0 294.163C36.55 272.786 142.139 195.448 219.3 165.9C296.461 136.352 381.744 133.215 462.967 116.873C544.189 100.53 617.289 57.7761 706.633 67.8457C795.978 77.9152 909.689 167.221 999.033 177.29C1088.38 187.36 1165.54 157.811 1242.7 128.263C1319.86 98.7146 1425.45 21.3772 1462 0V1659H0V294.163Z"
              fill="url(#paint0_linear_129_201)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_129_201"
                x1="731"
                y1="0"
                x2="731"
                y2="1659"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#61319B" />
                <stop offset="1" stop-color="#180D26" />
              </linearGradient>
            </defs>
          </svg>
          <h1>Pricing</h1>
          <div className="pricings-container">
              <Pricing Text="Free"></Pricing>
              <Pricing Text="Pro"></Pricing>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
