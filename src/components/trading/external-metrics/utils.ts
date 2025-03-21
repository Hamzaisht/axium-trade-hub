
// Format large numbers
export const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toFixed(0);
};

// Format currency
export const formatCurrency = (num: number) => {
  if (num >= 1000000) {
    return '$' + (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return '$' + (num / 1000).toFixed(1) + 'K';
  }
  return '$' + num.toFixed(0);
};

// Format percentage
export const formatPercentage = (num: number) => {
  return num.toFixed(1) + '%';
};

// Format date
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};
