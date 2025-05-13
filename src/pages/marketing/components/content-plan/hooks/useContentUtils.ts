
export function useContentUtils() {
  const extractLink = (text: string | null): string | null => {
    if (!text) return null;
    
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = text.match(urlRegex);
    
    return matches ? matches[0] : null;
  };

  return {
    extractLink
  };
}
