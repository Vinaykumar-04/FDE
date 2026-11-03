'use client';

import type { Lesson } from '@/lib/content';
import { useProgressStore } from '@/lib/progress';

export function LevelProgress({ lessons, label = 'YOUR LEVEL STATUS' }: { lessons: Lesson[]; label?: string }) {
  const done = useProgressStore((state) => state.completedLessons);
  const count = lessons.filter((lesson) => done.includes(lesson.id)).length;
  return <div className="level-progress-card"><div><span className="section-kicker">{label}</span><p><b>{count} / {lessons.length}</b> lessons complete <span className="progress-spark">✦</span></p></div><div className="level-progress-rail" aria-label={`${count} of ${lessons.length} lessons complete`}>{lessons.map((lesson, index) => <i key={lesson.id} className={done.includes(lesson.id) ? 'step-done' : ''} title={`${index + 1}. ${lesson.title}`} />)}</div><span className="step-percent">{Math.round((count / lessons.length) * 100)}%</span></div>;
}
