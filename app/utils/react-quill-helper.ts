export const isQuillEmpty = (html: string) => {
  // Hilangkan semua tag HTML
  const text = html.replace(/<(.|\n)*?>/g, "").trim();
  return text.length === 0;
};

export const stripHtmlAndTruncate = (html: string, maxLength: number = 30) => {
  // Hilangkan semua tag HTML
  const text = html.replace(/<(.|\n)*?>/g, "").trim();
  // Batasi panjang dan tambahkan ellipsis jika perlu
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};
