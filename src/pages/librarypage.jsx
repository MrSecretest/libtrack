import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import { auth, db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import BooksSlider from "../components/books-slider/BooksSlider";
import { onAuthStateChanged } from "firebase/auth";
import { OrbitProgress } from "react-loading-indicators";
import { AnimatePresence, motion } from "motion/react";

export default function LibraryPage() {
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUserBooks = async () => {
      const user = auth.currentUser;
      if (user) {
        setLoading(true);
        const userId = user.uid;
        const booksRef = collection(db, "users", userId, "library");
        try {
          const snapshot = await getDocs(booksRef);
          const bookIds = snapshot.docs.map((doc) => doc.id);

          const bookDetails = [];
          for (let i = 0; i < bookIds.length; i++) {
            const bookId = bookIds[i];
            const cachedBook = localStorage.getItem(`book_${bookId}`);
            if (cachedBook) {
              bookDetails.push(JSON.parse(cachedBook));
            } else {
              await new Promise((resolve) => setTimeout(resolve, i * 300));

              const response = await fetch(
                `https://www.googleapis.com/books/v1/volumes/${bookIds[i]}`
              );

              if (response.ok) {
                const data = await response.json();
                bookDetails.push(data);
                localStorage.setItem(`book_${bookId}`, JSON.stringify(data));
              }
            }
          }
          setLoading(false);
          setBooks(bookDetails);
        } catch (error) {
          console.error("Error fetching books:", error);
        }
      }
    };
    fetchUserBooks();
  }, [user]);

  return (
    <div className="page-wrapper">
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
          ) : ( null)}
      <Sidebar current={"Library"} />
      <div className="library-view">
        <AnimatePresence>
          
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ y: 50 }}
              transition={{ duration: 0.2 }}
            >
              <BooksSlider
                booksList={books} setBooks={setBooks}
                books={books !== 0 ? books : null}
                expanded={true}
                sliderName={`Your library (${books.length})`}
              ></BooksSlider>
            </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
