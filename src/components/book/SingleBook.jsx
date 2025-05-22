import "./Book.css";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import BookRoundButton from "../book-round-button/BookRound";

export default function Book({img, lowResImg, buttons }) {
  const [show, setShow] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleButtonClick = (e, buttonOnClick) => {
    e.stopPropagation();
    buttonOnClick();
  };
  const handleContainerClick = () => {
    setShow(!show);
  };

  return (
    <>
      <div className="book-container" onClick={() => handleContainerClick()}>
        <AnimatePresence>
          <img
            src={loaded ? img : lowResImg}
            className={`book-cover ${loaded ? "loaded" : "loading"}`}
            onLoad={() => setLoaded(true)}
          />
          <motion.div
            className={`buttons-container ${show ? `dark-bg` : ``}`}
            key={show}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            {show && buttons != null
              ? buttons.map((button, index) => (
                  <BookRoundButton
                    onClick={(e) => handleButtonClick(e, button.onClick)}
                    type= {button.btn_type}
                  ></BookRoundButton>
                ))
              : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
