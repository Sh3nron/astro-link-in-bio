import { test, describe } from "node:test";
import assert from "node:assert";
import { sanitizeSvg } from "./security.ts";

describe("sanitizeSvg", () => {
  test("should preserve safe SVG content", () => {
    const input = '<path d="M10 10 L20 20" />';
    const result = sanitizeSvg(input);
    assert.strictEqual(result, input);
  });

  test("should remove script tags", () => {
    const input = '<path d="M10 10" /><script>alert("XSS")</script>';
    const expected = '<path d="M10 10" />';
    const result = sanitizeSvg(input);
    assert.strictEqual(result, expected);
  });

  test("should remove script tags with / separator", () => {
    const input = '<script/src="evil.js"></script>';
    const expected = '';
    const result = sanitizeSvg(input);
    assert.strictEqual(result, expected);
  });

  test("should remove event handlers with whitespace", () => {
    const input = '<circle cx="5" cy="5" r="5" onclick="alert(1)" />';
    const expected = '<circle cx="5" cy="5" r="5" />';
    const result = sanitizeSvg(input);
    assert.strictEqual(result, expected);
  });

  test("should remove event handlers with / separator", () => {
    const input = '<svg/onload=alert(1)>';
    const expected = '<svg>';
    const result = sanitizeSvg(input);
    assert.strictEqual(result, expected);
  });

  test("should remove javascript: URIs", () => {
    const input = '<a href="javascript:alert(1)"><rect width="10" height="10" /></a>';
    const expected = '<a><rect width="10" height="10" /></a>';
    const result = sanitizeSvg(input);
    assert.strictEqual(result, expected);
  });

  test("should remove javascript: URIs with HTML entities", () => {
    const input = '<a href="&#106;avascript:alert(1)"></a>';
    const expected = '<a></a>';
    const result = sanitizeSvg(input);
    assert.strictEqual(result, expected);
  });

  test("should remove animate and set tags", () => {
    const input = '<rect><animate onbegin="alert(1)" attributeName="x" from="0" to="10" dur="1s" /></rect>';
    const expected = '<rect></rect>';
    const result = sanitizeSvg(input);
    assert.strictEqual(result, expected);
  });

  test("should handle empty input", () => {
    assert.strictEqual(sanitizeSvg(""), "");
    // @ts-ignore
    assert.strictEqual(sanitizeSvg(null), "");
  });
});
