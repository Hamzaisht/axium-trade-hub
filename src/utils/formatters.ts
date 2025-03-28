
/**
 * Utility functions for formatting data
 */

// Format a number to compact form (e.g., 1K, 1M, 1B)
export function formatCompactNumber(num: number): string {
  if (num === null || num === undefined || isNaN(num)) return '0';
  
  // Handle zero
  if (num === 0) return '0';

  // Handle negative numbers
  const isNegative = num < 0;
  const absNum = Math.abs(num);
  
  // Format based on magnitude
  let formatted: string;
  if (absNum >= 1000000000) {
    formatted = (absNum / 1000000000).toFixed(1) + 'B';
  } else if (absNum >= 1000000) {
    formatted = (absNum / 1000000).toFixed(1) + 'M';
  } else if (absNum >= 1000) {
    formatted = (absNum / 1000).toFixed(1) + 'K';
  } else {
    formatted = absNum.toFixed(0);
  }
  
  // Remove .0 if present
  formatted = formatted.replace('.0', '');
  
  // Add negative sign if needed
  return isNegative ? '-' + formatted : formatted;
}

// Format a number as USD currency
export function formatCurrency(num: number): string {
  if (num === null || num === undefined || isNaN(num)) return '$0.00';
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  return formatter.format(num);
}

// Format a percentage value
export function formatPercentage(num: number): string {
  if (num === null || num === undefined || isNaN(num)) return '0%';
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  return formatter.format(num / 100);
}

// Format a date or timestamp to a readable string
export function formatDate(date: Date | string | number): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Format a time
export function formatTime(date: Date | string | number): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
  
  return dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}
