import { DeleteForeverRounded } from "@mui/icons-material";
import { ShoppingCart } from "@mui/icons-material";
import { Bookmark } from "@mui/icons-material";
import "../button-landing/Buttons.css";
import { useEffect, useState } from "react";


const iconMap = {
  add: <Bookmark />,
  delete: <DeleteForeverRounded />,
  buy: <ShoppingCart />,
};

const tooltipMap = {
    add: "Add this book to library",
    delete: "Remove this book from library",
    buy: "Buy this book"
};

export default function BookRoundButton({ type, onClick }) {
  return (
    <>
      {iconMap[type] ? (
        <div
          className="book-round-button"
          onClick={onClick != null ? onClick : null}
          title={tooltipMap[type]}

        >
          {iconMap[type] || null}
        </div>
      ) : null}
    </>
  );
}
