import { Add, DeleteForeverRounded, Edit, Star, StickyNote2, Article, EditNote } from "@mui/icons-material";
import { ShoppingCart } from "@mui/icons-material";
import { Bookmark } from "@mui/icons-material";
import "../button-landing/Buttons.css";

export default function BookRoundButton({ type, onClick, size = "medium" }) {
  const iconMap = {
    add: <Bookmark fontSize={size} />,
    delete: <DeleteForeverRounded fontSize={size} />,
    buy: <ShoppingCart fontSize={size} />,
    plus: <Add fontSize={size}/>,
    edit: <Edit fontSize={size}></Edit>,
    rate: <Star fontSize={size}></Star>,
    comment: <Article fontSize={size}/>,
    notes: <StickyNote2 fontSize={size}/>,
    editNotes: <EditNote fontSize={size}/>
  };
  const sizeStyleMap = {
    smaller: {padding: "5px"},
    small: { padding: "7px" },
    medium: { padding: "10px" },
    large: { padding: "15px" },
  };

  const tooltipMap = {
    add: "Add this book to library",
    delete: "Remove this book from library",
    buy: "Buy this book",
  };
  const buttonStyle = sizeStyleMap[size] || sizeStyleMap["medium"];
  return (
    <>
      {iconMap[type] ? (
        <div
          style={buttonStyle}
          className="book-round-button"
          onClick={onClick != null ? onClick : null}
          title={tooltipMap[type]}
        >
          {iconMap[type]}
        </div>
      ) : null}
    </>
  );
}
