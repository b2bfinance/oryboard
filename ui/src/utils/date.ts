export function isDateEmpty(value: string): boolean {
  return value === "" || value === "0001-01-01T00:00:00Z";
}
