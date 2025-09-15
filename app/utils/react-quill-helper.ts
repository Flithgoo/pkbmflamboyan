export const isQuillEmpty = (html: string) => {
  // Hilangkan semua tag HTML
  const text = html.replace(/<(.|\n)*?>/g, "").trim();
  return text.length === 0;
};
