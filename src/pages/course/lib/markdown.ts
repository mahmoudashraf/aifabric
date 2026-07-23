export const prepareLessonMarkdown = (markdown: string) =>
  markdown
    .replace(/^#\s+[^\n]+\n+/, "")
    .replace(/## NotebookLM Pre-Lesson Theory[\s\S]*?(?=\n## )/, "")
    .trim();

export const resolveMarkdownHref = (href?: string, sourceUrl?: string) => {
  if (
    !href ||
    !sourceUrl ||
    href.startsWith("/") ||
    href.startsWith("#") ||
    /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href)
  ) {
    return href;
  }

  try {
    return new URL(href, sourceUrl).toString();
  } catch {
    return href;
  }
};
