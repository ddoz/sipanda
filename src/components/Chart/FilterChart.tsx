"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const FilterChart = () => {
  const router = useRouter();
  const [id, setId] = useState("1"); // Nilai default untuk id
  const [tanggal, setTanggal] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Format yyyy-MM-dd
  });
  const [pangan, setPangan] = useState<any[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Perbarui URL dengan query params
    router.push(`?id=${id}&tanggal=${tanggal}`);
  };


  useEffect(() => {
    const getPangan = async() => {
      try {
        const res = await fetch(`/api/pangan/d8i4tnoagtk`);
        const data = await res.json();
        setPangan(data);
      } catch (error) {
        setPangan([]);
      }
    }

    getPangan();
  },[])

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full gap-4 p-4 bg-white md:flex-row md:items-center">
      {/* Filter ID */}
      <div className="flex flex-col">
        <select
          id="id"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="p-3 bg-white border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {
            pangan.map((item) => (
              <option key={item.id} value={item.id}>
                {item.namaPangan}
              </option>
            ))
          }
        </select>
      </div>

      {/* Filter Tanggal */}
      <div className="flex flex-col">
        <input
          type="date"
          id="tanggal"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
          className="p-2 bg-white border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tombol Submit */}
      <div>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Filter
        </button>
      </div>
    </form>
  );
};

export default FilterChart;
