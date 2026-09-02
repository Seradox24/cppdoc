'use client';

import { useSyncExternalStore } from 'react';
import { publishedLessons, type LessonId } from './lessons';

const key = 'cpp-visual.progress.v1';
const changeEvent = 'cpp-visual:progress';
type Snapshot = { completed: LessonId[]; storageAvailable: boolean };
const emptySnapshot: Snapshot = { completed: [], storageAvailable: true };
let snapshot = emptySnapshot;
let lastRaw: string | null | undefined;

function readSnapshot(): Snapshot {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw !== lastRaw) {
      let saved: unknown;
      try {
        saved = JSON.parse(raw ?? '[]');
      } catch {
        saved = [];
      }
      const completed = Array.isArray(saved)
        ? publishedLessons
            .filter((item) => saved.includes(item.id))
            .map((item) => item.id)
        : [];
      snapshot = { completed, storageAvailable: true };
      lastRaw = raw;
    }
  } catch {
    if (snapshot.storageAvailable)
      snapshot = { ...snapshot, storageAvailable: false };
  }
  return snapshot;
}

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(changeEvent, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(changeEvent, callback);
  };
}

function toggle(id: LessonId) {
  if (!publishedLessons.some((item) => item.id === id)) return;
  const current = readSnapshot();
  const completed = current.completed.includes(id)
    ? current.completed.filter((item) => item !== id)
    : [...current.completed, id];
  snapshot = { ...current, completed };
  try {
    const raw = JSON.stringify(completed);
    window.localStorage.setItem(key, raw);
    lastRaw = raw;
    snapshot = { ...snapshot, storageAvailable: true };
  } catch {
    snapshot = { ...snapshot, storageAvailable: false };
  }
  window.dispatchEvent(new Event(changeEvent));
}

export function useLearningProgress() {
  const state = useSyncExternalStore(
    subscribe,
    readSnapshot,
    () => emptySnapshot,
  );
  return { ...state, toggle };
}
