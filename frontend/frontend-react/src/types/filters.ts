/**
 * Filters are kept as strings because they come from <input> elements.
 * - For numeric filters (x/y) we keep strings like "" or "12"
 * - ProductTable converts these to numbers when filtering.
 */
export type ProductFiltersState = {
  referencia: string;
  cor: string;
  rack: string;
  acab: string;
  x: string;
  y: string;
  onlyMarked: boolean;
};
