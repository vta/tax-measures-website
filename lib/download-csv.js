function escapeCsvCell(cell) {
  if (cell == null || cell === '') {
    return '';
  }
  const str = String(cell);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function matrixToCsvString(rows) {
  return rows.map((row) => row.map(escapeCsvCell).join(',')).join('\n');
}

export function downloadCsvFromMatrix(data, filename) {
  const csv = matrixToCsvString(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
