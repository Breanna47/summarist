"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Book } from "@/types/book";
import AppLayout from "../components/AppLayout";

export default function ForYouPage() {
  const [selectedBooks, setSelectedBooks] = useState<Book[]>([]);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [suggestedBooks, setSuggestedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const [selectedResponse, recommendedResponse, suggestedResponse] =
          await Promise.all([
            fetch(
              "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected",
            ),
            fetch(
              "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended",
            ),
            fetch(
              "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested",
            ),
          ]);

        const selectedData = await selectedResponse.json();
        const recommendedData = await recommendedResponse.json();
        const suggestedData = await suggestedResponse.json();

        setSelectedBooks(selectedData);
        setRecommendedBooks(recommendedData);
        setSuggestedBooks(suggestedData);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <main className="for-you">
          <div className="skeleton skeleton__title" />

          <section className="books__section">
            <div className="skeleton skeleton__section-title" />

            <div className="selected__list">
              {[1, 2].map((item) => (
                <div className="selected__book" key={item}>
                  <div className="skeleton skeleton__selected-image" />

                  <div className="selected__info">
                    <div className="skeleton skeleton__text skeleton__text--large" />
                    <div className="skeleton skeleton__text skeleton__text--medium" />
                    <div className="skeleton skeleton__text skeleton__text--small" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="books__section">
            <div className="skeleton skeleton__section-title" />
            <div className="skeleton skeleton__section-subtitle" />

            <div className="books__row">
              {[1, 2, 3, 4, 5].map((item) => (
                <div className="book__card" key={item}>
                  <div className="skeleton skeleton__book-image" />
                  <div className="skeleton skeleton__text skeleton__text--large" />
                  <div className="skeleton skeleton__text skeleton__text--medium" />
                  <div className="skeleton skeleton__text skeleton__text--small" />
                </div>
              ))}
            </div>
          </section>
        </main>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <main className="for-you">
        <h1 className="for-you__title">For You</h1>

        <section className="books__section">
          <h2 className="books__section-title">Selected just for you</h2>

          <div className="selected__list">
            {selectedBooks.map((book) => (
              <Link
                href={`/book/${book.id}`}
                className="selected__book"
                key={book.id}
              >
                <img
                  className="selected__image"
                  src={book.imageLink}
                  alt={book.title}
                />

                <div className="selected__info">
                  <h3>{book.title}</h3>
                  <p className="book__author">{book.author}</p>
                  <p className="selected__subtitle">{book.subTitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="books__section">
          <h2 className="books__section-title">Recommended for you</h2>
          <p className="books__section-subtitle">We think you'll like these</p>

          <div className="books__row">
            {recommendedBooks.map((book) => (
              <Link
                href={`/book/${book.id}`}
                className="book__card"
                key={book.id}
              >
                <div className="book__image-wrapper">
                  <img
                    className="book__image"
                    src={book.imageLink}
                    alt={book.title}
                  />

                  {book.subscriptionRequired && (
                    <span className="book__premium">Premium</span>
                  )}
                </div>

                <h3 className="book__title">{book.title}</h3>
                <p className="book__author">{book.author}</p>
                <p className="book__subtitle">{book.subTitle}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="books__section">
          <h2 className="books__section-title">Suggested books</h2>
          <p className="books__section-subtitle">Browse through these books</p>

          <div className="books__row">
            {suggestedBooks.map((book) => (
              <Link
                href={`/book/${book.id}`}
                className="book__card"
                key={book.id}
              >
                <div className="book__image-wrapper">
                  <img
                    className="book__image"
                    src={book.imageLink}
                    alt={book.title}
                  />

                  {book.subscriptionRequired && (
                    <span className="book__premium">Premium</span>
                  )}
                </div>

                <h3 className="book__title">{book.title}</h3>
                <p className="book__author">{book.author}</p>
                <p className="book__subtitle">{book.subTitle}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </AppLayout>
  );
}
