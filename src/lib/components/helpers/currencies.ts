
export const currency = '€';

export function formatCurrency(amount: number, decimals: number = 2): string {
  if (isNaN(amount)) return '0.00 €';
  return `${amount.toFixed(decimals)} ${currency}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
