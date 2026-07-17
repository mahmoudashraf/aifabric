import { LucideIcon } from "lucide-react";

import { reviewedStories, StoryCollection } from "./reviewedStoryCatalog";

export interface Story {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color: string;
  category: string;
  collection: StoryCollection;
}

export const allStories: Story[] = reviewedStories.map((story) => ({
  id: story.id,
  title: story.title,
  description: story.description,
  href: story.href,
  icon: story.icon,
  color: story.color,
  category: story.category,
  collection: story.collection,
}));

export function getStoryByHref(href: string): Story | undefined {
  return allStories.find((story) => story.href === href);
}

export function getStoryNavigation(currentHref: string): {
  previous: Story | null;
  next: Story | null;
  currentIndex: number;
  totalStories: number;
} {
  const currentIndex = allStories.findIndex((story) => story.href === currentHref);

  if (currentIndex === -1) {
    return { previous: null, next: null, currentIndex: -1, totalStories: allStories.length };
  }

  return {
    previous: currentIndex > 0 ? allStories[currentIndex - 1] : null,
    next: currentIndex < allStories.length - 1 ? allStories[currentIndex + 1] : null,
    currentIndex,
    totalStories: allStories.length,
  };
}

export function getStoriesByCollection(collection: StoryCollection): Story[] {
  return allStories.filter((story) => story.collection === collection);
}

export function getRandomStories(currentHref: string, count: number = 3): Story[] {
  const otherStories = allStories.filter((story) => story.href !== currentHref);
  const shuffled = [...otherStories].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
