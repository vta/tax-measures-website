const costFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function formatCurrency(number) {
  return costFormatter.format(number);
}

export function formatCurrencyMillions(number) {
  return `$${(Math.round(number / 100_000) / 10).toFixed(1)}`;
}

export function formatCurrencyBillions(number) {
  return `$${(Math.round(number / 100_000_000) / 10).toFixed(1)}`;
}

export function formatCurrencyWithUnit(number) {
  if (number === 0) {
    return '$0';
  }

  if (Math.round(number / 1000) < 1000) {
    return `$${Math.round(number / 1000)}k`;
  }

  return `$${Math.round(number / 100000) / 10}m`;
}

export function formatPercent(percent) {
  return `${Math.round(percent * 10) / 10}%`;
}
