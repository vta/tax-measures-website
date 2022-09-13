const costFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function formatCurrency(number) {
  return costFormatter.format(number);
}

export function formatCurrencyMillions(number) {
  return `$${Math.round(number / 100000) / 10}`;
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

export function formatCategory(item) {
  if (
    !item.fields['Parent Category'].id ||
    item.fields.Category.id === item.fields['Parent Category'].id
  ) {
    return item.fields.Category.fields.Name;
  }

  return item.fields['Parent Category'].fields.Name;
}

export function formatPercent(percent) {
  return `${Math.round(percent * 10) / 10}%`;
}

export function formatProjectUrl(project, grantee) {
  if (project.fields.URL) {
    return project.fields.URL;
  }

  if (grantee.fields.URL) {
    return grantee.fields.URL;
  }

  return null;
}
