import { useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import "./css/pages.css";
import Book from "../components/book/SingleBook";

export default function SearchPage() {
  const buttons = [
    { label: "Add to Library", onClick: () => console.log("Added") },
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

        {loading && <p>Loading...</p>}
        <div className="search-results">
          {results.map((book) => (
            <div className="book-search-result" key={book.id}>
              <Book
                buttons={buttons}
                id={book.id}
                title={book.volumeInfo.title}
                img={
                  book.volumeInfo.imageLinks?.thumbnail || "default-image.jpg"
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
                    {book.volumeInfo.description || "No description available"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
