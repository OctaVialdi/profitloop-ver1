
export const truncateText = (text: string | null, maxLength: number = 25) => {
  if (!text) return "";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};
