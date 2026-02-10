export const convertToLocalDateString = (date: Date | string) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString();
};

export const toSentenceCase = (str: string) => {
  return str.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
};
