"use client";

import AppLayout from "../components/AppLayout";

export default function LibraryPage() {
  return (
    <AppLayout>
      <main className="library">
        <h1 className="library__title">My Library</h1>

        <div className="library__empty">
          <h2>Your library is empty</h2>
          <p>Saved and finished books will appear here.</p>
        </div>
      </main>
    </AppLayout>
  );
}
