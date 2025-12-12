import { useContext, useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { token } = useContext(AuthContext);

  const [sweets, setSweets] = useState<any[]>([]);
  const [search, setSearch] = useState({
    name: "",
    category: "",
    min_price: "",
    max_price: "",
  });

  // ✅ Pagination state
  const [page, setPage] = useState(0);
  const ITEMS_PER_PAGE = 6;

  async function loadSweets() {
    const res = await apiRequest("/api/sweets");
    setSweets(res);
    setPage(0); // reset page on reload
  }

  async function buySweet(id: number) {
    const res = await apiRequest(
      `/api/sweets/${id}/purchase?qty=1`,
      "POST",
      null,
      token
    );

    if (res.quantity !== undefined) {
      alert("Purchased!");
      loadSweets();
    } else {
      alert("Purchase failed");
    }
  }

  async function searchSweets() {
    const params = new URLSearchParams();

    if (search.name) params.append("name", search.name);
    if (search.category) params.append("category", search.category);
    if (search.min_price) params.append("min_price", search.min_price);
    if (search.max_price) params.append("max_price", search.max_price);

    const endpoint = "/api/sweets/search?" + params.toString();
    const res = await apiRequest(endpoint);
    setSweets(res);
    setPage(0);
  }

  useEffect(() => {
    loadSweets();
  }, []);

  // ✅ Paginated data
  const paginatedSweets = sweets.slice(
    page * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  return (
    <div>
      <Navbar />

      <div className="p-10">
        <h1 className="text-3xl font-bold mb-6">Sweets Inventory</h1>

        {/* Search Bar */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search name"
            className="border p-2 rounded"
            onChange={(e) => setSearch({ ...search, name: e.target.value })}
          />

          <input
            type="text"
            placeholder="Category"
            className="border p-2 rounded"
            onChange={(e) =>
              setSearch({ ...search, category: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Min price"
            className="border p-2 rounded"
            onChange={(e) =>
              setSearch({ ...search, min_price: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Max price"
            className="border p-2 rounded"
            onChange={(e) =>
              setSearch({ ...search, max_price: e.target.value })
            }
          />
        </div>

        <button
          onClick={searchSweets}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-8"
        >
          Search
        </button>

        {/* Sweets List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {paginatedSweets.map((s: any) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-5 border rounded-lg shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-xl font-bold mb-1">{s.name}</h2>

              <p className="text-sm text-gray-600">
                Category: {s.category}
              </p>

              <p className="font-semibold mt-1">₹{s.price}</p>

              <p className="text-sm mt-1">
                Available:{" "}
                <span
                  className={
                    s.quantity === 0
                      ? "text-red-600"
                      : "text-green-600"
                  }
                >
                  {s.quantity}
                </span>
              </p>

              <button
                disabled={s.quantity === 0}
                onClick={() => buySweet(s.id)}
                className={`mt-4 px-3 py-1 rounded text-white ${
                  s.quantity === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {s.quantity === 0 ? "Out of Stock" : "Buy 1"}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Pagination Controls */}
        {sweets.length > ITEMS_PER_PAGE && (
          <div className="flex justify-center gap-4 mt-10">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <button
              disabled={(page + 1) * ITEMS_PER_PAGE >= sweets.length}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {sweets.length === 0 && (
          <p className="text-gray-500 mt-10 text-center">
            No sweets available. Please add sweets from Admin panel.
          </p>
        )}
      </div>
    </div>
  );
}
