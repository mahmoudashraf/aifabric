export const prepareLessonMarkdown = (markdown: string) =>
  markdown
    .replace(/^#\s+[^\n]+\n+/, "")
    .replace(/## NotebookLM Pre-Lesson Theory[\s\S]*?(?=\n## )/, "")
    .trim();
