import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import "./css/pages.css";
import Book from "../components/book/SingleBook";
import { motion, AnimatePresence, progress } from "motion/react";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import Tag from "../components/tag/Tag";
import { OrbitProgress } from "react-loading-indicators";
import { toast } from "sonner";
import ToasterNotification from "../components/toaster/ToasterNotif";
import SearchIcon from "@mui/icons-material/Search";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";

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
  const [searchInitiated, setSearchInitiated] = useState(false);

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
    setSearchInitiated(true); // Mark search as started
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

  const saveBookToUserLibrary = async (bookId, maxProgress, book) => {
    const user = auth.currentUser;
    const progress = 0;
    if (!user) {
      alert("user error");
      Navigate("/");
      return;
    }
    const userId = auth.currentUser.uid;
    const userBookRef = doc(db, "users", userId, "library", bookId);

    try {
      await setDoc(
        userBookRef,
        { bookId, progress, maxProgress },
        { merge: true }
      );
      const stringNotif = `"${
        book.volumeInfo.title.length > 15
          ? book.volumeInfo.title.slice(0, 15) + "..."
          : book.volumeInfo.title
      }" was added to your library.`;
      toast.success(stringNotif);
    } catch {
      console.error("error(");
    }
  };

  return (
    <div className="page-wrapper">
      <ToasterNotification />
      <Sidebar current={"Search"} />
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
      ) : null}
      <div className="search-view">
        <form onSubmit={searchBooks}>
          <input
            name="bookSearch"
            placeholder="Enter name of a book"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autocomplete="on"
          ></input>
        </form>
        {!loading && searchInitiated && results.length === 0 && (
          <motion.div
            initial={{ opacity: "0%" }}
            animate={{ opacity: "100%" }}
            className="no-results-message"
          >
            <div>
              <SentimentVeryDissatisfiedIcon
                sx={{
                  fontSize: 128,
                  color: "#3a364a",
                }}
              />
            </div>
            <p>No results found!</p>
          </motion.div>
        )}

        {!loading && !searchInitiated && (
          <motion.div
            initial={{ opacity: "0%" }}
            animate={{ opacity: "100%" }}
            className="empty-state-message"
          >
            <SearchIcon sx={{ fontSize: 128, color: "#3a364a" }} />
            <p>Please enter a search query to begin</p>
          </motion.div>
        )}
        <AnimatePresence>
          {!loading ? (
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
                        btn_type: "add",
                        onClick: () =>
                          saveBookToUserLibrary(
                            book.id,
                            book.volumeInfo.pageCount,
                            book
                          ),
                      },
                      book.saleInfo?.saleability === "FOR_SALE"
                        ? {
                            btn_type: "buy",
                            onClick: () =>
                              window.open(book.saleInfo.buyLink, "_blank"),
                          }
                        : null,
                    ].filter(Boolean)}
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
                            </div>
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
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
