import "./BooksSlider.css";
import Book from "../book/SingleBook";
import Buttonlanding from "../button-landing/Button-landing";
import { useEffect, useState } from "react";
import { auth, db, addDoc } from "../../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import ToasterNotification from "../toaster/ToasterNotif";
import { toast } from "sonner";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import AdditionalBar from "../additional-bar/AdditionalBar";

export default function BooksSlider({
  type,
  setBooks,
  books,
  sliderName,
  expanded,
}) {
  const [displayedBooks, setDisplayedBooks] = useState([]);
  const [numberBefore, setNumberBefore] = useState(0);
  const [bookProgressMap, setBookProgressMap] = useState({});
  const MySwal = withReactContent(Swal);
  const [bookMetaMap, setBookMetaMap] = useState({});

  const fetchAllBookMeta = async () => {
    const meta = {};

    for (const book of displayedBooks) {
      const { rating, comment } = await getRating(book);
      meta[book.id] = { rating, comment };
    }

    setBookMetaMap(meta);
  };

  useEffect(() => {
    fetchAllBookMeta();
  }, [displayedBooks]);

  const fetchUserBooks = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const userId = user.uid;
    const libraryRef = collection(db, "users", userId, "library");

    try {
      const snapshot = await getDocs(libraryRef);
      const progressMap = {};

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        progressMap[doc.id] = {
          progress: data.progress || 0,
          maxProgress: data.maxProgress || 1,
        };
      });

      setBookProgressMap(progressMap);
    } catch (error) {
      console.error("Error fetching book progress:", error);
    }
  };

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

  const notesButtons = (book) => {
    return [
      {
        btn_type: "editNotes",
        onClick: () => addNote(book),
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
      const stringNotif = `"${
        book.volumeInfo.title.length > 15
          ? book.volumeInfo.title.slice(0, 15) + "..."
          : book.volumeInfo.title
      }" was removed from your library.`;
      toast.success(stringNotif);
      updateDisplayedBooks();
    }
  };

  const showNotes = async (book) => {
    try {
      const user = auth.currentUser;
      const userId = user.uid;

      const notesRef = collection(
        db,
        "users",
        userId,
        "library",
        book.id,
        "notes"
      );
      const querySnapshot = await getDocs(notesRef);
      const notes = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        notes.push({
          id: doc.id,
          page: data.page || 0,
          note: data.note || "",
        });
      });

      const notesHtml =
        notes.length > 0
          ? notes
              .map(
                (note, index) => `
                <div style="
        margin-bottom: 0.75rem;
        padding: 0.75rem;
        background-color: #211c26; /* lighter dark gray */
        border-radius: 0.5rem;
        color: #fff;
      ">
            <strong>Note ${index + 1}:</strong><br/>
            <em>Page:</em> ${note.page}<br/>
            <em>Text:</em> ${note.note}
          </div>`
              )
              .join("")
          : `<p>No notes found.</p>`;

      await MySwal.fire({
        title: "Your notes:",
        html: `
        <div style="
          font-size: 0.8rem; 
          color: #fff;
          padding: 1rem; 
          text-align: left;
          max-height: 300px;
          overflow-y: auto;
        ">
          ${notesHtml}
        </div>
      `,
        confirmButtonText: "Close",
        draggable: true,
        customClass: {
          popup: "my-swal-popup",
          content: "my-swal-content",
          confirmButton: "my-swal-confirm",
        },
      });
    } catch (error) {
      console.error("Error fetching notes:", error);
      await MySwal.fire("Error", "Failed to load notes.", "error");
    }
  };

  const addNote = async (book) => {
    const { value: formValues } = await MySwal.fire({
      title: "Enter your note",
      html:
        `<input id="swal-input-page" class="swal2-input" placeholder="Page number">` +
        `<input id="swal-input-note" class="swal2-input" placeholder="Note">`,
      focusConfirm: false,
      draggable: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const page = document.getElementById("swal-input-page").value;
        const note = document.getElementById("swal-input-note").value;
        if (!page || !note) {
          MySwal.showValidationMessage("Both fields are required");
          return false;
        }
        return { page, note };
      },
      allowOutsideClick: () => !Swal.isLoading(),
      customClass: {
        popup: "my-swal-popup",
        content: "my-swal-content",
        confirmButton: "my-swal-confirm",
        cancelButton: "my-swal-cancel",
      },
    });

    if (formValues) {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");
        await addDoc(
          collection(db, "users", user.uid, "library", book.id, "notes"),
          {
            page: Number(formValues.page),
            note: formValues.note,
            createdAt: new Date(),
          }
        );
        MySwal.fire("Saved!", "Your note has been saved.", "success");
      } catch (error) {
        console.error("Error saving note:", error);
        MySwal.fire("Error", "Failed to save the note.", "error");
      }
    }
  };

  const showComment = async (comment) => {
    await MySwal.fire({
      title: "Your comment:",
      html: `
      <div style="
        font-size: 0.8rem; 
        color: #333; 
        padding: 1rem; 
        color: #fff;
        text-align: left;
        max-height: 300px;
        overflow-y: auto;
      ">
        ${comment}
      </div>
    `,
      confirmButtonText: "Close",
      draggable: true,
      customClass: {
        popup: "my-swal-popup",
        content: "my-swal-content",
        confirmButton: "my-swal-confirm",
      },
    });
  };

  const progressButtons = (book, maxProgress) => {
    return [
      {
        btn_type: "edit",
        onClick: () => editProgress(book, maxProgress),
      },
    ];
  };

  const ratedButtons = (book) => {
    return [
      {
        btn_type: "rate",
        onClick: () => rateBook(book),
      },
    ];
  };

  const rateBook = async (book) => {
    let selectedRating = null;

    await MySwal.fire({
      title: "Rate this book",
      html: `
      <div id="star-rating" style="font-size: 2rem; color: gray; margin-bottom: 10px;">
        ${[1, 2, 3, 4, 5]
          .map(
            (i) =>
              `<span class="star" data-value="${i}" style="transition: color 0.2s ease-in-out; cursor: pointer; font-size: larger">&#9733;</span>`
          )
          .join("")}
      </div>
    `,
      input: "text",
      draggable: true,
      inputPlaceholder: "Leave a comment...",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Rate",
      showLoaderOnConfirm: true,
      preConfirm: async (comment) => {
        if (!selectedRating) {
          MySwal.showValidationMessage("Please select a star rating.");
          return false;
        }

        try {
          await setRating(book, selectedRating, comment);
        } catch (error) {
          MySwal.showValidationMessage(
            `Failed to save rating: ${error.message}`
          );
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
      customClass: {
        popup: "my-swal-popup",
        content: "my-swal-content",
        confirmButton: "my-swal-confirm",
        cancelButton: "my-swal-cancel",
      },
      didOpen: () => {
        const stars = Swal.getHtmlContainer().querySelectorAll(".star");
        stars.forEach((star) => {
          star.addEventListener("click", () => {
            const value = parseInt(star.getAttribute("data-value"));
            selectedRating = value;
            stars.forEach((s) => {
              const sVal = parseInt(s.getAttribute("data-value"));
              s.style.color = sVal <= value ? "#ffc107" : "gray";
            });
          });
        });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        MySwal.fire({
          icon: "success",
          title: "Book rated!",
          text: `You rated this book ${selectedRating} star${
            selectedRating > 1 ? "s" : ""
          }.`,
          customClass: {
            popup: "my-swal-popup",
            content: "my-swal-content",
            confirmButton: "my-swal-confirm",
          },
        });
      }
    });
  };

  const editProgress = async (book, maxProgress) => {
    MySwal.fire({
      title: "Select page number",
      input: "range",
      draggable: true,
      inputAttributes: {
        min: 0,
        max: maxProgress,
        step: 1,
      },
      inputValue: Math.floor(maxProgress / 2),
      showCancelButton: true,
      confirmButtonText: "Edit",
      customClass: {
        popup: "my-swal-popup",
        content: "my-swal-content",
        input: "my-swal-input",
        confirmButton: "my-swal-confirm",
        cancelButton: "my-swal-cancel",
      },
      didOpen: () => {
        const range = Swal.getInput();
        const label = document.createElement("span");
        label.style.display = "block";
        label.style.textAlign = "center";
        label.style.marginTop = "10px";
        label.style.color = "#fff";
        label.innerText = `Pages: ${maxProgress}`;
        range.parentNode.appendChild(label);

        range.addEventListener("input", () => {
          label.innerText = `Pages: ${maxProgress}`;
        });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setPages(book, result.value);
        MySwal.fire({
          icon: "success",
          title: "Progress edited!",
          text: "Your reading progress was successfully updated.",
          customClass: {
            popup: "my-swal-popup",
            content: "my-swal-content",
            confirmButton: "my-swal-confirm",
          },
        });
      }
    });
  };

  const handlePlusClick = (book) => {
    MySwal.fire({
      title: "How many pages did you read today?",
      input: "number",
      draggable: true,
      inputAttributes: {
        min: 1,
        step: 1,
      },
      inputValidator: (value) => {
        if (!value || isNaN(value) || Number(value) <= 0) {
          return "Please enter a valid number of pages";
        }
      },
      showCancelButton: true,
      confirmButtonText: "Submit",
      showLoaderOnConfirm: true,
      preConfirm: async (pagesToAdd) => {
        try {
          await addPages(book, Number(pagesToAdd));
        } catch (error) {
          MySwal.showValidationMessage(`Request failed: ${error.message}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
      customClass: {
        popup: "my-swal-popup",
        content: "my-swal-content",
        confirmButton: "my-swal-confirm",
        cancelButton: "my-swal-cancel",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        MySwal.fire({
          icon: "success",
          title: "Progress updated!",
          text: "Your reading progress was successfully updated.",
          customClass: {
            popup: "my-swal-popup",
            content: "my-swal-content",
            confirmButton: "my-swal-confirm",
          },
        });
      }
    });
  };

  const addPages = async (book, pagesToAdd) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const userId = user.uid;
    const bookRef = doc(db, "users", userId, "library", book.id);

    try {
      const docSnap = await getDoc(bookRef);

      if (docSnap.exists()) {
        const currentProgress = docSnap.data().progress || 0;
        const maxProgress = docSnap.data().maxProgress || Infinity;
        const newProgress = Number(currentProgress) + pagesToAdd;

        if (newProgress <= maxProgress) {
          await updateDoc(bookRef, {
            progress: newProgress,
          });
          console.log(`Progress updated to ${newProgress}`);
          fetchUserBooks();
        } else {
          throw new Error("New progress exceeds maximum allowed progress.");
        }
      } else {
        throw new Error("Book document does not exist.");
      }
    } catch (error) {
      console.error("Failed to update progress:", error);
      throw error;
    }
  };

  const setPages = async (book, pageNumber) => {
    const user = auth.currentUser;
    if (!user) return;

    const userId = user.uid;
    const bookRef = doc(db, "users", userId, "library", book.id);

    try {
      await updateDoc(bookRef, {
        progress: pageNumber,
      });
      console.log("Page progress updated successfully.");
      fetchUserBooks();
    } catch (error) {
      console.error("Failed to update progress:", error);
    }
  };

  const setRating = async (book, rating, comment) => {
    const user = auth.currentUser;
    if (!user) return;

    const userId = user.uid;
    const bookRef = doc(db, "users", userId, "library", book.id);

    try {
      await updateDoc(bookRef, {
        bookRating: rating,
        bookComment: comment,
      });
      fetchAllBookMeta();
      console.log("Rating Set!");
    } catch (error) {
      console.error("Failed to rate the book");
    }
  };

  const cutSize = () => {
    const windowWidth = window.innerWidth;
    const useableWidth = 0.95 * windowWidth;
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
  const getRating = async (book) => {
    const user = auth.currentUser;
    if (!user) return null;

    const userId = user.uid;
    const bookRef = doc(db, "users", userId, "library", book.id);

    try {
      const docSnap = await getDoc(bookRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const rating = data.bookRating || null;
        const comment = data.bookComment || null;

        return { rating, comment };
      } else {
        return { rating: null, comment: null };
      }
    } catch (error) {
      console.error(error);
      return { rating: null, comment: null };
    }
  };

  useEffect(() => {
    updateDisplayedBooks();

    window.addEventListener("resize", updateDisplayedBooks);
    fetchUserBooks();
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
            const meta = bookMetaMap[book.id] || {};
            const bookRating = meta.rating;
            const bookComment = meta.comment;

            const progressData = bookProgressMap[book.id];
            const progress = progressData?.progress || 0;
            const maxProgress = progressData?.maxProgress || 1;
            const volumeInfo = book.volumeInfo || {};
            const imageLinks = volumeInfo.imageLinks || {};
            const typeMap = {
              library: libraryButtons(book),
              progress: progressButtons(book, maxProgress),
              rated: ratedButtons(book),
              notes: notesButtons(book),
            };
            const buttons = typeMap[type];

            return (
              <div className="centered-book">
                <div key={book.id} className="book-with-title">
                  <Book
                    key={book.id}
                    buttons={buttons}
                    id={book.id}
                    title={volumeInfo.title || "No title available"}
                    img={imageLinks.thumbnail || "default-image.jpg"}
                    lowResImg={imageLinks.smallThumbnail || "default-image.jpg"}
                  />

                  <p>{book.volumeInfo?.title}</p>
                </div>
                {type == "progress" ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <AdditionalBar
                      type={type}
                      buttonFunc={() => handlePlusClick(book)}
                      progress={progress}
                      maxProgress={maxProgress}
                    />
                  </div>
                ) : type == "rated" ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <AdditionalBar
                      type={type}
                      buttonFunc={() => showComment(bookComment)}
                      progress={progress}
                      maxProgress={maxProgress}
                      rating={bookRating}
                      comment={bookComment}
                    />
                  </div>
                ) : type == "notes" ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <AdditionalBar
                      type={type}
                      buttonFunc={() => showNotes(book)}
                    />
                  </div>
                ) : (
                  <></>
                )}
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
