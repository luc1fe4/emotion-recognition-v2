import { parse } from "csv-parse/sync";

import { AppError } from "../utils/app-error.js";

export interface CsvTextRow {
  rowIndex: number;
  text: string;
}

export function parseCsvTextRows(buffer: Buffer): CsvTextRow[] {
  if (buffer.length === 0) {
    throw new AppError(400, "The CSV file is empty.");
  }

  let records: Record<string, string>[];

  try {
    records = parse(buffer.toString("utf8"), {
      bom: true,
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Record<string, string>[];
  } catch (error) {
    throw new AppError(400, "Unable to read the CSV file. Please check its format.", String(error));
  }

  if (records.length === 0) {
    throw new AppError(400, "The CSV file does not contain any rows.");
  }

  const firstRecord = records[0];
  if (!firstRecord || !Object.prototype.hasOwnProperty.call(firstRecord, "text")) {
    throw new AppError(400, "The CSV file must include a text column.");
  }

  return records.map((record, index) => {
    const text = String(record.text ?? "").trim();
    return {
      rowIndex: index,
      text,
    };
  });
}
