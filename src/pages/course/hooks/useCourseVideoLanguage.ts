import { useState } from "react";

import {
  COURSE_VIDEO_LANGUAGE_KEY,
  type CourseVideoLanguage,
} from "../lib/courseVideoCatalog";

const readStoredLanguage = (): CourseVideoLanguage => {
  if (typeof window === "undefined") return "en";

  try {
    return window.localStorage.getItem(COURSE_VIDEO_LANGUAGE_KEY) === "ar" ? "ar" : "en";
  } catch {
    return "en";
  }
};

export const useCourseVideoLanguage = () => {
  const [language, setLanguageState] = useState<CourseVideoLanguage>(readStoredLanguage);

  const setLanguage = (nextLanguage: CourseVideoLanguage) => {
    setLanguageState(nextLanguage);

    try {
      window.localStorage.setItem(COURSE_VIDEO_LANGUAGE_KEY, nextLanguage);
    } catch {
      // Video switching remains available when browser storage is unavailable.
    }
  };

  return { language, setLanguage };
};
