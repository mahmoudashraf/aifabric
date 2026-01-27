// Format field name from camelCase to Title Case
export const formatFieldName = (key: string): string => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

// Format field values for display
export const formatFieldValue = (value: any): string => {
  if (value === null || value === undefined) return "N/A";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object" && !Array.isArray(value)) {
    return JSON.stringify(value, null, 2);
  }
  if (Array.isArray(value)) {
    return value.length > 0 ? `${value.length} item(s)` : "Empty";
  }
  if (typeof value === "string" && value.includes("T") && value.includes("Z")) {
    // Try to format ISO date strings
    try {
      const date = new Date(value);
      return date.toLocaleString();
    } catch {
      return value;
    }
  }
  return String(value);
};

// Format price with currency
export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

// Format date
export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString();
};

// Format datetime
export const formatDateTime = (date: string): string => {
  return new Date(date).toLocaleString();
};
