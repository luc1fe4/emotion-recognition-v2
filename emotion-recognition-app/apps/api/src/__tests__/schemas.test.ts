import { describe, expect, it } from "vitest";

import { EMOTION_METADATA, analyzeTextRequestSchema, languageSchema } from "@emotion-recognition/shared";
import { parseCsvTextRows } from "../services/csv.service.js";

describe("shared request schemas", () => {
  it("trims valid Vietnamese text and defaults to Vietnamese", () => {
    const parsed = analyzeTextRequestSchema.parse({ text: "  h\u00f4m nay t\u00f4i r\u1ea5t vui  " });
    expect(parsed.text).toBe("h\u00f4m nay t\u00f4i r\u1ea5t vui");
    expect(parsed.language).toBe("vi");
    expect(parsed.source).toBeUndefined();
  });

  it("accepts English language selection", () => {
    const parsed = analyzeTextRequestSchema.parse({ text: "I am so happy today", language: "en" });
    expect(parsed.language).toBe("en");
  });

  it("rejects unsupported languages", () => {
    expect(() => languageSchema.parse("fr")).toThrow();
  });

  it("contains bilingual emotion metadata", () => {
    expect(EMOTION_METADATA.Enjoyment.displayLabelVi).toBe("Vui v\u1ebb");
    expect(EMOTION_METADATA.joy.displayLabel).toBe("Joy");
    expect(EMOTION_METADATA.Anger.emoji).toBe("\ud83d\ude21");
  });
});

describe("CSV parsing", () => {
  it("parses rows from a text column with default language", () => {
    const rows = parseCsvTextRows(Buffer.from("text\nh\u00f4m nay t\u00f4i r\u1ea5t vui\nt\u00f4i bu\u1ed3n qu\u00e1\n", "utf8"));
    expect(rows).toEqual([
      { rowIndex: 0, text: "h\u00f4m nay t\u00f4i r\u1ea5t vui", language: "vi", errorMessage: undefined },
      { rowIndex: 1, text: "t\u00f4i bu\u1ed3n qu\u00e1", language: "vi", errorMessage: undefined },
    ]);
  });

  it("supports per-row English language", () => {
    const rows = parseCsvTextRows(Buffer.from("text,language\nI am so happy today,en\n", "utf8"));
    expect(rows[0]).toEqual({
      rowIndex: 0,
      text: "I am so happy today",
      language: "en",
      errorMessage: undefined,
    });
  });

  it("marks unsupported row languages as row errors", () => {
    const rows = parseCsvTextRows(Buffer.from("text,language\nbonjour,fr\n", "utf8"));
    expect(rows[0]?.language).toBe("vi");
    expect(rows[0]?.errorMessage).toBe("Unsupported language. Use 'vi' or 'en'.");
  });

  it("rejects CSV files without a text column", () => {
    expect(() => parseCsvTextRows(Buffer.from("comment\nxin ch\u00e0o\n", "utf8"))).toThrow(
      "The CSV file must include a text column.",
    );
  });
});
