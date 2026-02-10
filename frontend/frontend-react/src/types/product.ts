/**
 * This matches the fields your UI reads/writes.
 * (ProductTable uses these keys directly: referencia, cor, x, y, rack, acab, obs, marked)
 */
export interface Product {
  id: string;

  referencia: string;
  cor: string;

  // These might be missing or null depending on your dataset/import.
  rack?: string | null;
  acab?: string | null;
  obs?: string | null;

  // Your UI converts these using Number(), so they can be number OR string OR null.
  // We keep this flexible to avoid assumptions while you’re learning.
  x?: number | string | null;
  y?: number | string | null;

  marked: boolean;
}

/**
 * When creating/updating products, you might not send every field.
 * This type represents "a partial update payload".
 */
export type ProductPatch = Partial<Omit<Product, "id">>;
