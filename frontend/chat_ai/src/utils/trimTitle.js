export const trimTitle = (title) => {
  if (!title) return "Hi I am AI...";
  const maxLength = 10;
  return title.length > maxLength ? title.slice(0, maxLength) + "..." : title;
};