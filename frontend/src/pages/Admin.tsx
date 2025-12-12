import { useContext, useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function Admin() {
  const { token } = useContext(AuthContext);

  const [sweets, setSweets] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
  });

  async function loadSweets() {
    const res = await apiRequest("/api/sweets");
    setSweets(res);
  }

  async function createSweet() {
    const res = await apiRequest(
      "/api/sweets",
      "POST",
      {
        name: form.name,
        category: form.category,
        price: Number(form.price),
        quantity: Number(form.quantity),
      },
      token
    );

    if (res.id) {
      alert("Sweet added!");
      setForm({ name: "", category: "", price: "", quantity: "" });
      loadSweets();
    } else {
      alert("Error adding sweet");
    }
  }

  async function deleteSweet(id: number) {
    const ok = window.confirm("Are you sure you want to delete this sweet?");
    if (!ok) return;

    const res = await apiRequest(`/api/sweets/${id}`, "DELETE", null, token);
    if (res.message) {
      alert("Sweet deleted");
      loadSweets();
    }
  }

  async function restockSweet(id: number) {
    const qty = Number(prompt("Enter restock quantity:"));
    if (!qty || qty <= 0) return;

    const res = await apiRequest(
      `/api/sweets/${id}/restock?qty=${qty}`,
      "POST",
      null,
      token
    );
    if (res.quantity !== undefined) {
      alert("Restocked!");
      loadSweets();
    }
  }

  useEffect(() => {
    loadSweets();
  }, []);

  return (
    <div>
      <Navbar />

      <div className="p-10">
        <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

        {/* Add Sweet */}
        <div className="mb-10 p-6 border rounded-lg bg-gray-100">
          <h2 className="text-xl font-bold mb-4">Add Sweet</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              className="border p-2 rounded"
              placeholder="Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              className="border p-2 rounded"
              placeholder="Category"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
            />

            <input
              className="border p-2 rounded"
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
            />

            <input
              className="border p-2 rounded"
              type="number"
              placeholder="Quantity"
              value={form.quantity}
              onChange={(e) =>
                setForm({ ...form, quantity: e.target.value })
              }
            />
          </div>

          <button
            onClick={createSweet}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded"
          >
            Add Sweet
          </button>
        </div>

        {/* Manage sweets */}
        <h2 className="text-2xl font-bold mb-4">Manage Sweets</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sweets.map((s: any) => (
            <div
              key={s.id}
              className="p-5 border rounded-lg shadow-sm hover:shadow-md transition"
            >
              <h3 className="font-bold text-lg mb-1">{s.name}</h3>

              <p className="text-sm text-gray-600">
                Category: {s.category}
              </p>

              <p className="font-semibold mt-1">₹{s.price}</p>

              <p className="text-sm mt-1">
                Quantity:{" "}
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

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => deleteSweet(s.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>

                <button
                  onClick={() => restockSweet(s.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                >
                  Restock
                </button>
              </div>
            </div>
          ))}
        </div>

        {sweets.length === 0 && (
          <p className="text-gray-500 mt-10 text-center">
            No sweets available. Add some using the form above.
          </p>
        )}
      </div>
    </div>
  );
}
