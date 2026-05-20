import { describe, expect, it } from "vitest";

import { analyzeTextRequestSchema, EMOTION_METADATA } from "@emotion-recognition/shared";
import { parseCsvTextRows } from "../services/csv.service.js";

describe("shared request schemas", () => {
  it("trims valid Vietnamese text", () => {
    const parsed = analyzeTextRequestSchema.parse({ text: "  hôm nay tôi rất vui  " });
    expect(parsed.text).toBe("hôm nay tôi rất vui");
    expect(parsed.source).toBeUndefined();
  });

  it("contains the Vietnamese emotion metadata", () => {
    expect(EMOTION_METADATA.Enjoyment.displayLabelVi).toBe("Vui vẻ");
    expect(EMOTION_METADATA.Anger.emoji).toBe("😡");
  });
});

describe("CSV parsing", () => {
  it("parses rows from a text column", () => {
    const rows = parseCsvTextRows(Buffer.from("text\nhôm nay tôi rất vui\ntôi buồn quá\n", "utf8"));
    expect(rows).toEqual([
      { rowIndex: 0, text: "hôm nay tôi rất vui" },
      { rowIndex: 1, text: "tôi buồn quá" },
    ]);
  });

  it("rejects CSV files without a text column", () => {
    expect(() => parseCsvTextRows(Buffer.from("comment\nxin chào\n", "utf8"))).toThrow(
      "The CSV file must include a text column.",
    );
  });
});
