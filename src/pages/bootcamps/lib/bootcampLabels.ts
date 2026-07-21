import type { Bootcamp } from "../types";

export const teachingLanguageLabel = (language: Bootcamp["teachingLanguage"]) =>
  language === "ar" ? "Taught in Arabic" : "Taught in English";
