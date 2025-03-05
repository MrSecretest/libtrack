import "./BooksSlider.css";
import Book from "../book/SingleBook";
import Buttonlanding from "../button-landing/Button-landing";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import ToasterNotification from "../toaster/ToasterNotif";
import { Toaster, toast } from 'sonner';

export default function BooksSlider({type ,setBooks, books, sliderName, expanded }) {
  const [displayedBooks, setDisplayedBooks] = useState([]);
  const [numberBefore, setNumberBefore] = useState(0);

  const libraryButtons = (book) => {
    return [
      book.saleInfo?.saleability === "FOR_SALE"
        ? {
            btn_type: "buy",
            onClick: () => window.open(book.saleInfo.buyLink, "_blank"),
          }
        : { btn_type: null, onClick: null },
      {
        btn_type: "delete",
        onClick: () => deleteBookFromUser(book),
      },
    ];
  };

  const deleteBookFromUser = async (book) => {
    const user = auth.currentUser;
    const userId = user.uid;
    const bookRef = doc(db, "users", userId, "library", book.id);
    if (user) {
      try {
        await deleteDoc(bookRef);
        setBooks((prevBooks) => prevBooks.filter((b) => b.id !== book.id));
      } catch (error) {
        console.error("Error deleting book:", error);
      }
      const stringNotif = `"${book.volumeInfo.title.length > 15 
        ? book.volumeInfo.title.slice(0, 15) + "..." 
        : book.volumeInfo.title
      }" was removed from your library.`;      
      toast.success(stringNotif);
      updateDisplayedBooks();
    }
  };

  const cutSize = () => {
    const windowWidth = window.innerWidth;
    const useableWidth = 0.9 * windowWidth;
    const numberOfBooks = Math.floor(useableWidth / 170);
    return numberOfBooks;
  };

  const updateDisplayedBooks = () => {
    if (expanded) {
      setDisplayedBooks(books);
      setNumberBefore(0);
    } else {
      const numberOfBooks = cutSize();
      setDisplayedBooks(books.slice(0, numberOfBooks));
      setNumberBefore(books.length - numberOfBooks);
    }
  };

  useEffect(() => {
    updateDisplayedBooks();
    window.addEventListener("resize", updateDisplayedBooks);
    return () => {
      window.removeEventListener("resize", updateDisplayedBooks);
    };
  }, [books]);

  return (
    <>
    <ToasterNotification></ToasterNotification>
      <div className="books-slider-container">
        <h1>{sliderName ? sliderName : "Template"}</h1>
        <div className="books-slider">
          {displayedBooks.map((book) => {
            const volumeInfo = book.volumeInfo || {};
            const imageLinks = volumeInfo.imageLinks || {};
            return (
              <div key={book.id} className="book-with-title">
                <Book
                  key={book.id}
                  buttons={libraryButtons(book)}
                  id={book.id}
                  title={volumeInfo.title || "No title available"}
                  img={imageLinks.thumbnail || "default-image.jpg"}
                  lowResImg={imageLinks.smallThumbnail || "default-image.jpg"}
                />
                <p>{book.volumeInfo?.title}</p>
              </div>
            );
          })}
          {numberBefore > 0 && (
            <Buttonlanding Text={`Click to see ${numberBefore} more`} />
          )}
        </div>
      </div>
    </>
  );
}
