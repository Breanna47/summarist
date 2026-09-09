"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";

import { auth, db } from "@/lib/firebase";
import type { Book } from "@/types/book";

import AppLayout from "../components/AppLayout";

export default function LibraryPage() {
  const [user, setUser] = useState<User | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setBooks([]);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchLibrary = async () => {
      if (!user) return;

      try {
        setLoading(true);

        const libraryRef = collection(db, "users", user.uid, "library");

        const snapshot = await getDocs(libraryRef);

        const savedBooks = snapshot.docs.map((document) => ({
          ...document.data(),
        })) as Book[];

        setBooks(savedBooks);
      } catch (error) {
        console.error("Error loading library:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, [user]);

  return (
    <AppLayout>
      <main className="library">
        <h1 className="library__title">My Library</h1>

        {loading ? (
          <div className="library__empty">
            <p>Loading library...</p>
          </div>
        ) : !user ? (
          <div className="library__empty">
            <h2>Log in to view your library</h2>
            <p>Your saved books will appear here.</p>
          </div>
        ) : books.length === 0 ? (
          <div className="library__empty">
            <h2>Your library is empty</h2>
            <p>Saved books will appear here.</p>
          </div>
        ) : (
          <div className="library__books">
            {books.map((book) => (
              <Link
                key={book.id}
                href={`/book/${book.id}`}
                className="library__book"
              >
                <img
                  src={book.imageLink}
                  alt={book.title}
                  className="library__book-image"
                />

                <div className="library__book-info">
                  <h2>{book.title}</h2>
                  <p>{book.author}</p>

                  {book.subscriptionRequired && (
                    <span className="library__premium">Premium</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </AppLayout>
  );
}
