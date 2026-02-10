import type { Dispatch, SetStateAction } from "react";
import type { ProductFiltersState } from "../../types/filters";

type ProductFiltersProps = {
  filters: ProductFiltersState;
  setFilters: Dispatch<SetStateAction<ProductFiltersState>>;
};

export default function ProductFilters({ filters, setFilters }: ProductFiltersProps) {
  return (
    <form className="form-grid" onSubmit={(e) => e.preventDefault()}>
      {/* Row 1 */}
      <label>
        Ref
        <input
          value={filters.referencia}
          onChange={(e) =>
            setFilters((f) => ({ ...f, referencia: e.target.value }))
          }
        />
      </label>

      <label>
        Color
        <input
          value={filters.cor}
          onChange={(e) => setFilters((f) => ({ ...f, cor: e.target.value }))}
        />
      </label>

      {/* Row 2 */}
      <label>
        Rack
        <input
          value={filters.rack}
          onChange={(e) => setFilters((f) => ({ ...f, rack: e.target.value }))}
        />
      </label>

      <label>
        Acab
        <input
          value={filters.acab}
          onChange={(e) => setFilters((f) => ({ ...f, acab: e.target.value }))}
        />
      </label>

      {/* Row 3 (numeric filters) */}
      <label>
        X ≥
        <input
          value={filters.x}
          onChange={(e) => setFilters((f) => ({ ...f, x: e.target.value }))}
          inputMode="numeric"
        />
      </label>

      <label>
        Y ≥
        <input
          value={filters.y}
          onChange={(e) => setFilters((f) => ({ ...f, y: e.target.value }))}
          inputMode="numeric"
        />
      </label>

      {/* Footer row: checkbox + clear button */}
      <div className="form-footer">
        <label className="checkbox-inline">
          <input
            className="checkbox-input"
            type="checkbox"
            checked={filters.onlyMarked}
            onChange={(e) =>
              setFilters((f) => ({ ...f, onlyMarked: e.target.checked }))
            }
          />
          <span className="checkbox-text">Marked only</span>
        </label>

        <button
          type="button"
          className="primary-action"
          onClick={() =>
            setFilters({
              referencia: "",
              cor: "",
              rack: "",
              acab: "",
              x: "",
              y: "",
              onlyMarked: false
            })
          }
        >
          Clear
        </button>
      </div>
    </form>
  );
}
