"use client";

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import {
  FiBookOpen,
  FiSearch,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiHome,
} from "react-icons/fi";

import { auth } from "@/lib/firebase";
import type { Book } from "@/types/book";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      setSearching(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setSearching(true);

        const response = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${encodeURIComponent(
            search,
          )}`,
        );

        const data = await response.json();

        setResults(data);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  const handleLogout = async () => {
    try {
      await signOut(auth);

      localStorage.removeItem("summarist-premium");

      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="app__layout">
      <aside className="sidebar">
        <div className="sidebar__logo">
          <img src="/assets/logo.png" alt="Summarist logo" />
        </div>

        <nav className="sidebar__nav">
          <Link href="/for-you" className="sidebar__link">
            <FiHome />
            <span>For You</span>
          </Link>

          <Link href="/library" className="sidebar__link">
            <FiBookOpen />
            <span>Library</span>
          </Link>

          <div className="sidebar__link sidebar__link--disabled">
            <FiSearch />
            <span>Highlights</span>
          </div>

          <div className="sidebar__link sidebar__link--disabled">
            <FiSearch />
            <span>Search</span>
          </div>
        </nav>

        <div className="sidebar__bottom">
          <Link href="/settings" className="sidebar__link">
            <FiSettings />
            <span>Settings</span>
          </Link>

          <div className="sidebar__link sidebar__link--disabled">
            <FiHelpCircle />
            <span>Help &amp; Support</span>
          </div>

          <button
            className="sidebar__link sidebar__logout"
            onClick={handleLogout}
          >
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="app__main">
        <header className="app__header">
          <div className="search__wrapper">
            <input
              className="search__input"
              type="text"
              placeholder="Search for books"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <FiSearch className="search__icon" />

            {search.trim() && (
              <div className="search__results">
                {searching ? (
                  <div className="search__message">Searching...</div>
                ) : results.length > 0 ? (
                  results.map((book) => (
                    <button
                      key={book.id}
                      className="search__result"
                      onClick={() => {
                        setSearch("");
                        setResults([]);
                        router.push(`/book/${book.id}`);
                      }}
                    >
                      <img src={book.imageLink} alt={book.title} />

                      <div>
                        <p className="search__result-title">{book.title}</p>
                        <p className="search__result-author">{book.author}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="search__message">No books found.</div>
                )}
              </div>
            )}
          </div>
        </header>

        <div className="app__content">{children}</div>
      </div>
    </div>
  );
}
