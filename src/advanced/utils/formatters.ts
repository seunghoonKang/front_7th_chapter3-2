export const formatPriceWon = (price: number): string => {
  return `${price.toLocaleString()}원`;
};

export const formatProductPrice = (price: number): string => {
  return `₩${price.toLocaleString()}`;
};
