export function formatCurrency(number) {
  return `$${Number(number).toLocaleString()}`
}

export function formatCurrencyMillions(number) {
  return `$${Math.round(number / 1000000)}`
}

export function formatCurrencyWithUnit(number) {
  if (number === 0) {
    return '$0'
  } else if (Math.round(number / 1000) < 1000) {
    return `$${Math.round(number / 1000)}k`
  } else {
    return `$${Math.round(number / 1000000)}m`
  }
}

export function formatCategory(item) {
  if (!item.fields['Parent Category'].id || item.fields.Category.id === item.fields['Parent Category'].id) {
    return item.fields.Category.fields.Name
  } else {
    return item.fields['Parent Category'].fields.Name
  }
}
