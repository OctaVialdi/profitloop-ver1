
/**
 * Format a number as Indonesian currency (Rupiah)
 */
export const formatCurrency = (value: number): string => {
  return `Rp ${value.toLocaleString('id-ID')}`;
};
