import { useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import "./css/pages.css";
import Book from "../components/book/SingleBook";
import { motion, AnimatePresence } from "motion/react";
import { auth, db } from "../firebase";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

export default function SearchPage() {
  const buttons = [
    { label: "Add to Library", onClick: () => console.log("Library") },
    { label: "View Details", onClick: () => console.log("Details") },
    { label: "Rate", onClick: () => console.log("Rated") },
    { label: "Mark as Read", onClick: () => console.log("Marked") },
  ];

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchBooks = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=10&langRestrict=en`
      );
      const data = await response.json();

      const sortedBooks = data.items.sort((a, b) => {
        const ratingsCountA = a.volumeInfo.ratingsCount || 0;
        const ratingsCountB = b.volumeInfo.ratingsCount || 0;
        return ratingsCountB - ratingsCountA;
      });
      const filteredBooks = sortedBooks.filter(
        (book) => book.volumeInfo.language !== "ru"
      );

      setResults(filteredBooks);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };
  const saveBookToUserLibrary = async (bookId) => {
    const user = auth.currentUser;
    if (!user) {
      alert("user error");
      Navigate("/");
      return;
    }
    const userId = auth.currentUser.uid;
    const userBookRef = doc(db, "users", userId, "library", bookId);

    try {
      await setDoc(userBookRef, { bookId });
      alert("bookID saved");
    } catch {
      console.error("error(");
    }
  };

  return (
    <div className="page-wrapper">
      <Sidebar current={"Search"} />

      <div className="search-view">
        <form onSubmit={searchBooks}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          ></input>
        </form>

        {/*loading && <p>Loading...</p>*/}
        <AnimatePresence>
          <div className="search-results">
            {results.map((book) => (
              <motion.div
                className="book-search-result"
                key={book.id}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.2 }}
              >
                <Book
                  buttons={[
                    {
                      label: "Add to Library",
                      onClick: () => saveBookToUserLibrary(book.id),
                    },
                  ]}
                  id={book.id}
                  title={book.volumeInfo.title}
                  img={
                    book.volumeInfo.imageLinks?.thumbnail || "default-image.jpg"
                  }
                  lowResImg={
                    book.volumeInfo.imageLinks?.smallThumbnail ||
                    "default-image.jpg"
                  }
                />
                <div className="book-details">
                  <div className="book-headers">
                    <div className="book-title-author">
                      <h1>{book.volumeInfo.title}</h1>
                      <p>{book.volumeInfo.authors?.join(", ")}</p>
                    </div>
                    <div className="book-additional-container">
                      <div className="book-additional">
                        <h1>Language</h1>
                        <p>English</p>
                      </div>
                      <div className="book-additional">
                        <h1>Language</h1>
                        <p>English</p>
                      </div>
                    </div>
                  </div>

                  <div className="book-description">
                    <p>
                      {book.volumeInfo.description ||
                        "No description available"}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
}
