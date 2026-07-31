/**
 * Turns rows of plain values into a CSV string. Deliberately minimal --
 * no external dependency for something this small. Handles the
 * standard cases that actually come up in this app's data (commas and
 * quotes in food/exercise names, occasional newlines from notes).
 */
export function rowsToCsv(headers: string[], rows: (string | number | null)[][]): string {
  const escapeCell = (value: string | number | null): string => {
    if (value === null || value === undefined) return "";
    const str = String(value);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const lines = [headers.map(escapeCell).join(","), ...rows.map((row) => row.map(escapeCell).join(","))];
  return lines.join("\n");
}
