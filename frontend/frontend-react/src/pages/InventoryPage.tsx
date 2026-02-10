import { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import TopBar from "../components/layout/TopBar";

import ProductForm from "../components/inventory/ProductForm";
import ProductFilters from "../components/inventory/ProductFilters";
import ProductTable from "../components/inventory/ProductTable";

import AuditLogPanel from "../components/admin/AuditLogPanel";
import AdminUsersPanel from "../components/admin/UsersPanel";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "../api/products";

import { useAuth } from "../context/AuthContext";

import type { Product, ProductPatch } from "../types/product";

/**
 * This describes exactly what your InventoryPage stores in `filters`.
 * We keep x/y as strings because your inputs store them as strings ("", "12", etc.)
 * and ProductTable converts them to numbers when filtering.
 */
type ProductFiltersState = {
  referencia: string;
  cor: string;
  rack: string;
  acab: string;
  x: string;
  y: string;
  onlyMarked: boolean;
};


/*
  INVENTORY PAGE
  --------------
  - Owns products data
  - Owns filters
  - Owns modals
  - NO styling logic
  - NO table logic
*/

export default function InventoryPage() {
  const { user, logout } = useAuth();

  const isAdmin = user.role === "admin";
  const canEdit = user.role === "admin" || user.role === "editor";

  /* =========================
     DATA
     ========================= */
const [products, setProducts] = useState<Product[]>([]);
  /* =========================
     UI STATE
     ========================= */
 const [showAdd, setShowAdd] = useState<boolean>(false);
const [showFilters, setShowFilters] = useState<boolean>(false);
const [showUsers, setShowUsers] = useState<boolean>(false);
const [showAuditLog, setShowAuditLog] = useState<boolean>(false);

  /* =========================
     FILTERS
     ========================= */
  const [filters, setFilters] = useState<ProductFiltersState>({
  referencia: "",
  cor: "",
  rack: "",
  acab: "",
  x: "",
  y: "",
  onlyMarked: false
});

  /* =========================
     LOAD PRODUCTS
     ========================= */
  useEffect(() => {
    loadProducts();
  }, []);

async function loadProducts(): Promise<void> {
  const data = await getProducts();
  setProducts(data);
}

  /* =========================
     CRUD
     ========================= */
async function handleAdd(product: ProductPatch): Promise<void> {
  await createProduct(product);
  await loadProducts();
}

async function handleUpdate(id: string, product: ProductPatch): Promise<void> {
  await updateProduct(id, product);
  await loadProducts();
}

async function handleDelete(id: string): Promise<void> {
  await deleteProduct(id);
  await loadProducts();
}

  /* =========================
     EXPORT CSV (VISIBLE BUTTON)
     ========================= */
  function handleExport() {
    if (!products.length) return;

const headers = [
  "referencia",
  "cor",
  "x",
  "y",
  "rack",
  "acab",
  "obs",
  "marked"
] as const;

type ExportHeader = (typeof headers)[number];

    const csv = [
      headers.join(","),
      ...products.map(p =>
        headers
          .map((h: ExportHeader) => `"${String(p[h] ?? "").replace(/"/g, '""')}"`)
    .join(",")
      )
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `SOBRAS_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();

    URL.revokeObjectURL(url);
  }

  /* =========================
     IMPORT CSV (ROBUST)
     ========================= */
async function handleImport(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
  const file = e.target.files?.[0];
  if (!file) return;

  const text = await file.text();

  try {
    const res = await fetch("/products/import", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`
      },
      body: JSON.stringify({ csv: text })
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(err);
      alert("Import failed");
      return;
    }

    const result: unknown = await res.json();
    await loadProducts();

    // If you want, later we can type result properly.
    // For now we safely handle it as "any-like" without lying:
    const rows = (result as { rows?: number }).rows ?? 0;
    alert(`Imported ${rows} products`);
  } catch (err) {
    console.error(err);
    alert("Import failed");
  }

  e.target.value = "";
}


  /* =========================
     RENDER
     ========================= */
  return (
    <PageLayout
      title="Inventory Manager"
      actions={<TopBar user={user} onLogout={logout} />}
    >
      {/* =========================
         TOP CONTROLS
         ========================= */}
      <div className="panel-toggles">
        {/* ===== LEFT SIDE ===== */}
        <div className="left">
          {canEdit && (
            <button
              className={showAdd ? "active" : ""}
              onClick={() => setShowAdd(v => !v)}
            >
              Add Product
            </button>
          )}

          <button
            className={showFilters ? "active" : ""}
            onClick={() => setShowFilters(v => !v)}
          >
            Filters
          </button>

          <button
            className={filters.onlyMarked ? "active" : ""}
            onClick={() =>
              setFilters(f => ({
                ...f,
                onlyMarked: !f.onlyMarked
              }))
            }
          >
            Marked
          </button>

          {filters.onlyMarked && (
            <button onClick={() => window.print()}>
              Print
            </button>
          )}
        </div>

        {/* ===== RIGHT SIDE ===== */}
        <div className="right">
          <button onClick={handleExport}>
            Export
          </button>

          <button
            onClick={() =>
              document.getElementById("import-file").click()
            }
          >
            Import
          </button>

          <input
            id="import-file"
            type="file"
            accept=".csv"
            style={{ display: "none" }}
            onChange={handleImport}
          />

          {isAdmin && (
            <>
              <button onClick={() => setShowUsers(true)}>
                Users
              </button>

              <button onClick={() => setShowAuditLog(true)}>
                Audit Log
              </button>
            </>
          )}
        </div>
      </div>

      {/* =========================
         ADD PRODUCT
         ========================= */}
      {showAdd && canEdit && (
        <section className="panel add-product">
          <h3 className="panel-title">Add Product</h3>
          <ProductForm
            onAdd={handleAdd}
            canEdit={canEdit}
          />
        </section>
      )}

      {/* =========================
         FILTERS
         ========================= */}
      {showFilters && (
        <section className="panel filters">
          <h3 className="panel-title">Filters</h3>
          <ProductFilters
            filters={filters}
            setFilters={setFilters}
          />
        </section>
      )}

      {/* =========================
         TABLE
         ========================= */}
      <section className="panel">
        <ProductTable
          products={products}
          filters={filters}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          canEdit={canEdit}
          canDelete={canEdit}
        />
      </section>

      {/* =========================
         MODALS
         ========================= */}
      {showUsers && (
        <AdminUsersPanel
          onClose={() => setShowUsers(false)}
        />
      )}

      {showAuditLog && (
        <AuditLogPanel
          onClose={() => setShowAuditLog(false)}
        />
      )}
    </PageLayout>
  );
}

