"use client";
import React, { useEffect, useState } from 'react'
import dynamic from "next/dynamic";
import "chart.js/auto";

const PanganChart = ({data, pangan, tanggal}:{data:any[], pangan:string, tanggal:string}) => {
  const [dataChart, setDataChart] = useState<any>();
  console.log(data);

  const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar), {
    ssr: false,
  });

  useEffect(() => {
    const dataTo = {
      labels: data.map((item) => item.pasar), // Directly map district names for labels
      datasets: [
        {
          label: "Harga Pangan",
          data: data.map((item) => item.harga), // Directly map count for data values
          backgroundColor: "rgba(75, 192, 192, 0.2)", // Example background color for bars
          borderColor: "rgba(75, 192, 192, 1)", // Example border color for bars
          borderWidth: 1,
        },
      ],
    }; // Here you would update your state or pass this dataTo to the Bar chart component
    setDataChart(dataTo);
  }, [data]);

  return (
    <>
      {data && (
        <div className="flex flex-col w-full mt-4 overflow-x-auto">
          <div className='p-4 bg-blue-200 rounded'>
            <h1 className='text-slate-700'>Menampilkan Data <span className='font-bold'>{pangan}</span> pada Tanggal <span className='font-bold'>{tanggal}</span></h1>
          </div>
          <div className="min-w-full p-4 bg-white rounded">
            <Bar data={dataChart} />
          </div>
        </div>
      )}
    </>
  )
}

export default PanganChart