"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import type { Book } from "@/types/book";
import { auth } from "@/lib/firebase";
import AppLayout from "../../components/AppLayout";
import AuthModal from "../../components/AuthModal";

export default function BookPage() {
  const params = useParams();
  const router = useRouter();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const id = params.id as string;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`,
        );

        const data = await response.json();
        setBook(data);
      } catch (error) {
        console.error("Error fetching book:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id]);

  const handleAccess = () => {
    if (!book || authLoading) return;

    if (!user) {
      setIsAuthOpen(true);
      return;
    }

    const isPremium = localStorage.getItem("summarist-premium") === "true";

    if (book.subscriptionRequired && !isPremium) {
      router.push("/choose-plan");
      return;
    }

    router.push(`/player/${book.id}`);
  };

  if (loading || authLoading) {
    return (
      <AppLayout>
        <main className="book-page">
          <div className="book-page__top">
            <div className="book-page__details">
              <div className="skeleton skeleton__book-title" />
              <div className="skeleton skeleton__book-subtitle" />
              <div className="skeleton skeleton__book-author" />

              <div className="book-page__stats">
                <div className="skeleton skeleton__stat" />
                <div className="skeleton skeleton__stat" />
                <div className="skeleton skeleton__stat" />
              </div>

              <div className="book-page__buttons">
                <div className="skeleton skeleton__button" />
                <div className="skeleton skeleton__button" />
              </div>
            </div>

            <div className="book-page__cover">
              <div className="skeleton skeleton__book-cover" />
            </div>
          </div>

          <div className="book-page__content">
            <section>
              <div className="skeleton skeleton__content-heading" />
              <div className="skeleton skeleton__content-line" />
              <div className="skeleton skeleton__content-line" />
              <div className="skeleton skeleton__content-line skeleton__content-line--short" />
            </section>

            <section>
              <div className="skeleton skeleton__content-heading" />
              <div className="skeleton skeleton__content-line" />
              <div className="skeleton skeleton__content-line" />
              <div className="skeleton skeleton__content-line skeleton__content-line--short" />
            </section>
          </div>
        </main>
      </AppLayout>
    );
  }

  if (!book) {
    return (
      <AppLayout>
        <div className="book-page__loading">Book not found.</div>
      </AppLayout>
    );
  }

  return (
    <>
      <AppLayout>
        <main className="book-page">
          <div className="book-page__top">
            <div className="book-page__details">
              <h1 className="book-page__title">{book.title}</h1>

              <p className="book-page__subtitle">{book.subTitle}</p>

              <p className="book-page__author">{book.author}</p>

              <div className="book-page__stats">
                <span>⭐ {book.averageRating}</span>
                <span>{book.totalRating} ratings</span>
                <span>{book.keyIdeas} key ideas</span>
              </div>

              <div className="book-page__buttons">
                <button className="book-page__button" onClick={handleAccess}>
                  Read
                </button>

                <button className="book-page__button" onClick={handleAccess}>
                  Listen
                </button>
              </div>

              {book.subscriptionRequired && (
                <p className="book-page__premium">Premium book</p>
              )}
            </div>

            <div className="book-page__cover">
              <img src={book.imageLink} alt={book.title} />
            </div>
          </div>

          <div className="book-page__content">
            <section>
              <h2>What&apos;s it about?</h2>
              <p>{book.bookDescription}</p>
            </section>

            <section>
              <h2>About the author</h2>
              <p>{book.authorDescription}</p>
            </section>
          </div>
        </main>
      </AppLayout>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
