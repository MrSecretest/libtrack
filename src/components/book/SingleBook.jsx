import "./Book.css";
import Buttonlanding from "../button-landing/Button-landing";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function Book({ img, id, buttons }) {
  const [show, setShow] = useState(false);

  const handleButtonClick = (e, buttonOnClick) => {
    e.stopPropagation();
    +buttonOnClick();
  };
  const handleContainerClick = () => {
    setShow(!show);
  };

  return (
    <>
      <div className="book-container" onClick={() => handleContainerClick()}>
        <AnimatePresence>
          <motion.div
            className="buttons-container dark-bg"
            key={show}
            initial={{ opacity: 0}}
            animate={{ opacity: 1}}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            {show && buttons != null
              ? buttons.map((button, index) => (
                  <Buttonlanding
                    Text={button.label}
                    key={index}
                    onClick={(e) => handleButtonClick(e, button.onClick)}
                  ></Buttonlanding>
                ))
              : null}
          </motion.div>
        </AnimatePresence>
        <img src={img} className="book-cover"></img>
      </div>
    </>
  );
}
