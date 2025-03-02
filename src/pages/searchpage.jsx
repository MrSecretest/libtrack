import { useEffect, useState } from "react";
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
import Tag from "../components/tag/Tag";
import { OrbitProgress } from "react-loading-indicators";

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
  const [disableAnimations, setDisableAnimations] = useState(false);

  useEffect(() => {
    setDisableAnimations(isSafari());
  }, []);

  const cardVariants = disableAnimations
    ? {}
    : {
        offscreen: {
          opacity: 0.3,
        },
        onscreen: {
          opacity: 1,
          transition: {
            duration: 0.7,
          },
        },
      };
  function salesCalculator(originalPrice, retailPrice) {
    if (originalPrice > retailPrice) {
      const discount = ((originalPrice - retailPrice) / originalPrice) * 100;
      return Math.floor(discount.toFixed(2));
    } else {
      return null;
    }
  }

  function isSafari() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  }

  function currencyCoverter(book) {
    return book.saleInfo.listPrice.currencyCode == "UAH" ? "₴" : "$";
  }

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
        <AnimatePresence>
          {loading ? (
            <div className="disc-container">
              <div className="loading-disc">
                <OrbitProgress
                  variant="track-disc"
                  dense
                  color="#8115d6"
                  size="small"
                  text=""
                  textColor=""
                />
              </div>
            </div>
          ) : (
            <motion.div
              key={loading}
              className="search-results"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ y: 50 }}
              transition={{ duration: 0.2 }}
            >
              {results.map((book) => (
                <motion.div
                  className="book-search-result"
                  key={book.id}
                  variants={cardVariants}
                  initial="offscreen"
                  whileInView="onscreen"
                  exit="offscreen"
                  viewport={{ amount: 0.01 }}
                >
                  <Book
                    buttons={[
                      {
                        label: "Add to Library",
                        onClick: () => saveBookToUserLibrary(book.id),
                      },
                      book.saleInfo?.saleability == "FOR_SALE"
                        ? {
                            label: "Buy this book",
                            onClick: () =>
                              window.open(book.saleInfo.buyLink, "_blank"),
                          }
                        : {
                            label: null,
                            onClick: null,
                          },
                    ]}
                    id={book.id}
                    title={book.volumeInfo.title}
                    img={
                      book.volumeInfo.imageLinks?.thumbnail ||
                      "default-image.jpg"
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
                        <p>
                          {book.volumeInfo.authors?.join(", ") || "No author"}
                        </p>
                      </div>
                      <div className="book-additional-container">
                        <div className="book-additional">
                          <h1>Language</h1>
                          <p>{book.volumeInfo.language}</p>
                        </div>
                        <div className="book-additional">
                          <h1>Pages</h1>
                          <p>{book.volumeInfo.pageCount}</p>
                        </div>
                      </div>
                    </div>

                    <div className="book-description">
                      <p>
                        {book.volumeInfo.description ||
                          "No description available."}
                      </p>
                    </div>
                    <Tag Text={book.volumeInfo.categories}></Tag>
                    {book.saleInfo?.saleability == "FOR_SALE" ? (
                      <div className="book-price-container">
                        <div className="book-price">
                          {salesCalculator(
                            book.saleInfo.listPrice.amount,
                            book.saleInfo.retailPrice.amount
                          ) > 0 ? (
                            <div className="discount">
                              <p>
                                -
                                {salesCalculator(
                                  book.saleInfo.listPrice.amount,
                                  book.saleInfo.retailPrice.amount
                                )}
                                %
                              </p>
                            </div> //FREE BOOKS 0 == "FREE"
                          ) : null}
                          {Math.floor(book.saleInfo.listPrice.amount) !=
                            Math.floor(book.saleInfo.retailPrice.amount) && (
                            <p
                              style={{
                                fontWeight: "300",
                                textDecoration: "line-through",
                              }}
                            >
                              {Math.floor(book.saleInfo.listPrice.amount)}{" "}
                              {currencyCoverter(book)}
                            </p>
                          )}
                          <p style={{ fontWeight: "500" }}>
                            {Math.floor(book.saleInfo.retailPrice.amount)}{" "}
                            {currencyCoverter(book)}
                          </p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
