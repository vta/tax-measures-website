export function formatCurrency(number) {
  if (
    number === '' ||
    number === null ||
    number === undefined ||
    isNaN(number)
  ) {
    return '∅';
  }

  if (number === 0) {
    return '∅';
  }

  return `$${Math.round(number).toLocaleString('en-US')}`;
}

export function formatCurrencyMillions(number) {
  return `$${(Math.round(number / 100_000) / 10).toFixed(1)}`;
}

export function formatCurrencyBillions(number) {
  return `$${(Math.round(number / 100_000_000) / 10).toFixed(1)}`;
}

export function formatCurrencyWithUnit(number) {
  if (number === 0) {
    return '∅';
  }

  if (Math.round(number / 1000) < 1000) {
    return `$${Math.round(number / 1000)}k`;
  }

  return `$${Math.round(number / 100000) / 10}m`;
}

export function formatPercent(percent) {
  return `${Math.round(percent * 10) / 10}%`;
}
