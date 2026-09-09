"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import type { Book } from "@/types/book";
import AppLayout from "../../components/AppLayout";
import { FiPause, FiPlay, FiRotateCcw, FiRotateCw } from "react-icons/fi";

export default function PlayerPage() {
  const params = useParams();
  const id = params.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  const togglePlay = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      await audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const skipBackward = () => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.currentTime = Math.max(0, audio.currentTime - 10);
  };

  const skipForward = () => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10);
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    const newTime = Number(event.target.value);

    if (!audio) return;

    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    if (!Number.isFinite(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="player__loading">Loading player...</div>
      </AppLayout>
    );
  }

  if (!book) {
    return (
      <AppLayout>
        <div className="player__loading">Book not found.</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <main className="player">
        <div className="player__content">
          <h1 className="player__title">{book.title}</h1>

          <p className="player__author">{book.author}</p>

          <div className="player__summary">{book.summary}</div>
        </div>

        <div className="player__bar">
          <div className="player__book">
            <img
              src={book.imageLink}
              alt={book.title}
              className="player__image"
            />

            <div>
              <p className="player__book-title">{book.title}</p>
              <p className="player__book-author">{book.author}</p>
            </div>
          </div>

          <div className="player__controls">
            <button
              className="player__control-button"
              onClick={skipBackward}
              aria-label="Skip backward 10 seconds"
            >
              <FiRotateCcw />
            </button>

            <button
              className="player__play-button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <FiPause /> : <FiPlay />}
            </button>

            <button
              className="player__control-button"
              onClick={skipForward}
              aria-label="Skip forward 10 seconds"
            >
              <FiRotateCw />
            </button>
          </div>

          <div className="player__progress">
            <span>{formatTime(currentTime)}</span>

            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="player__range"
            />

            <span>{formatTime(duration)}</span>
          </div>

          <audio
            ref={audioRef}
            src={book.audioLink}
            onTimeUpdate={(event) =>
              setCurrentTime(event.currentTarget.currentTime)
            }
            onLoadedMetadata={(event) =>
              setDuration(event.currentTarget.duration)
            }
            onEnded={() => setIsPlaying(false)}
          />
        </div>
      </main>
    </AppLayout>
  );
}
