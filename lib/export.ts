/**
 * CSV export utility.
 * Usage: downloadCsv(rows, columns, "filename.csv")
 */

export interface CsvColumn<T> {
  header: string;
  accessor: (row: T) => string | number;
}

export function toCsvString<T>(rows: T[], columns: CsvColumn<T>[]): string {
  const header = columns.map(c => `"${c.header}"`).join(",");
  const body = rows.map(row =>
    columns.map(c => {
      const val = c.accessor(row);
      const str = String(val ?? "").replace(/"/g, '""');
      return `"${str}"`;
    }).join(",")
  );
  return [header, ...body].join("\r\n");
}

export function downloadCsv<T>(rows: T[], columns: CsvColumn<T>[], filename: string) {
  const csv = toCsvString(rows, columns);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
