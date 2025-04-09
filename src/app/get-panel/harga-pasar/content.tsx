"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircleIcon,
  CheckSquare2Icon,
  FileIcon,
  PlusCircle,
  PrinterIcon,
  SaveAllIcon,
  SaveIcon,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { revalidatePath } from "next/cache";
import {
  ActionIcon,
  Alert,
  Button,
  ButtonGroup,
  FileButton,
  Input,
  Modal,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconFile,
  IconFileExcel,
  IconFilter,
  IconInfoCircle,
  IconPencil,
  IconSend,
  IconTrashFilled,
} from "@tabler/icons-react";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import slugify from "slugify";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { DatePicker, DatePickerInput } from "@mantine/dates";
import {
  formatPrice,
  getFormattedDate,
  getFormattedDateOnly,
  getFormattedDateShort,
  getFormattedDateTime,
} from "@/lib/utils";
import { updateHarga } from "@/services/harga-pasar";
import "../../../styles/globals.css";
import "../../../styles/index.css";
import "@mantine/dates/styles.css";
import { getExcel } from "@/services/excel";

const HargaPasar = ({
  data,
  pangan,
  pasar,
  awal,
  akhir,
}: {
  data: any[];
  pangan: any[];
  pasar: any[];
  awal: any;
  akhir: any;
}) => {
  const [value, setValue] = useState<[Date | null, Date | null]>([awal, akhir]);

  const [inputValues, setInputValues] = useState({});

  const [bulan, setBulan] = useState("");
  const [tahun, setTahun] = useState("");

  const [id, setId] = useState("1");
  const [panganList, setPanganList] = useState([]);

  const [opened, setOpened] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);

  useEffect(() => {
    const getPangan = async () => {
      try {
        const res = await fetch(`/api/pangan/d8i4tnoagtk`);
        const data = await res.json();
        setPanganList(data);
      } catch (error) {
        setPanganList([]);
      }
    };

    getPangan();
  }, []);

  const handleInputChange = (panganId, pasarId, dateKey, value) => {
    setInputValues((prevInputs) => ({
      ...prevInputs,
      [`${panganId}-${pasarId}-${dateKey}`]: value,
    }));
  };

  const router = useRouter();

  const hargaMap = new Map();
  data.forEach(({ pasarId, panganId, tanggal, harga, tipe }) => {
    const dateKey = getFormattedDateShort(new Date(tanggal).toISOString()); // Format tanggal YYYY-MM-DD
    if (!hargaMap.has(panganId)) {
      hargaMap.set(panganId, new Map());
    }
    if (!hargaMap.get(panganId).has(pasarId)) {
      hargaMap.get(panganId).set(pasarId, {});
    }
    hargaMap.get(panganId).get(pasarId)[dateKey] = { harga, tipe }; // Simpan harga dan tipe
  });

  const generateDateArray = (startDate: Date, endDate: Date) => {
    const dates: any[] = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const dateArray = generateDateArray(awal, akhir);

  const handleFilter = () => {
    if (value[0] && value[1]) {
      const diffDays = Math.ceil(
        (value[1].getTime() - value[0].getTime()) / (1000 * 60 * 60 * 24),
      );
      if (diffDays > 7) {
        notifications.show({
          title: "Peringatan",
          message: "Range tanggal tidak boleh lebih dari 7 hari.",
          color: "red",
        });
        return;
      }

      const params = new URLSearchParams();
      params.set("awal", value[0].toISOString());
      params.set("akhir", value[1].toISOString());

      if (id) {
        params.set("id", id);
      }
      router.push(`/get-panel/harga-pasar?${params.toString()}`);
    }
  };

  const SetInfoTipe = (tipe: string) => {
    switch (tipe) {
      case "STABIL":
        return (
          <div className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
            {tipe}
          </div>
        );
      case "TURUN":
        return (
          <div className="rounded bg-red-100 px-2 py-1 text-xs text-red-800">
            {tipe}
          </div>
        );
      default:
        return "-";
    }
  };

  const handleUpdateHarga = async () => {
    try {
      const response = await updateHarga({
        inputValues: inputValues,
      });

      if (response.status) {
        notifications.show({
          title: "Berhasil",
          message: "Harga berhasil diupdate.",
          color: "green",
        });
      } else {
        notifications.show({
          title: "Gagal",
          message: "Gagal mengupdate harga.",
          color: "red",
        });
      }
    } catch (error) {
      notifications.show({
        title: "Gagal",
        message: "Gagal mengupdate harga.",
        color: "red",
      });
    }
  };

  const exportExcel = async () => {
    setLoadingExport(true);

    try {
      if (!bulan || !tahun) {
        notifications.show({
          title: "Gagal",
          message: "Silahkan pilih bulan dan tahun terlebih dahulu.",
          color: "red",
        });
        return;
      }

      const response = await fetch("/api/download-excel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`, // Sertakan API key di header
        },
        body: JSON.stringify({ bulan: bulan, tahun: tahun }),
      });

      if (!response.ok) {
        throw new Error("Terjadi kesalahan saat mengunduh file.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `harga-pasar-${tahun}-${bulan}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoadingExport(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          <div className="flex flex-row justify-between">
            <h1>Form Harga Pasar</h1>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex w-full flex-row items-center justify-between gap-2">
          <div className="flex w-full flex-row items-center gap-2">
            <DatePickerInput
              className="hover:text-black focus:bg-blue-400"
              type="range"
              placeholder="Pilih Range Tanggal"
              value={value}
              onChange={setValue}
            />
            <select
              id="id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="rounded border bg-white p-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {panganList.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.namaPangan}
                </option>
              ))}
            </select>
            <ActionIcon
              variant="default"
              aria-label="show"
              onClick={handleFilter}
              size={"lg"}
            >
              <IconFilter
                style={{ width: "70%", height: "70%" }}
                stroke={1.5}
                color="red"
              />
            </ActionIcon>
          </div>
          <div className="flex w-full flex-row items-end justify-end">
            <Button
              leftSection={<PrinterIcon />}
              variant="filled"
              className="bg-blue-500"
              onClick={() => setOpened(true)}
            >
              Cetak Laporan
            </Button>
          </div>
        </div>

        <Modal
          opened={opened}
          onClose={() => setOpened(false)}
          title="Form Export Excel"
        >
          <div className="flex flex-col gap-3">
            <select
              id="bulan"
              value={bulan}
              onChange={(e) => setBulan(e.target.value)}
              className="rounded border bg-white p-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih Bulan</option>
              <option value="01">Januari</option>
              <option value="02">Februari</option>
              <option value="03">Maret</option>
              <option value="04">April</option>
              <option value="05">Mei</option>
              <option value="06">Juni</option>
              <option value="07">Juli</option>
              <option value="08">Agustus</option>
              <option value="09">September</option>
              <option value="10">Oktober</option>
              <option value="11">November</option>
              <option value="12">Desember</option>
            </select>
            <select
              id="tahun"
              value={tahun}
              onChange={(e) => setTahun(e.target.value)}
              className="rounded border bg-white p-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih Tahun</option>
              {Array.from({ length: 10 }, (v, k) => k + 2023).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <Button
              loading={loadingExport}
              leftSection={<IconFileExcel />}
              variant="filled"
              className="bg-blue-500"
              onClick={() => exportExcel()}
            >
              Export
            </Button>
          </div>
        </Modal>

        <section className={`mt-10`}>
          <div className="mb-5 flex flex-row justify-between">
            <h1 className="mb-4 font-bold text-slate-600">
              Data Harga Pangan Pasar
            </h1>
          </div>
          <Table className="rounded border-2 border-black">
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Pangan</TableHead>
                <TableHead>Pasar</TableHead>
                {dateArray.map((date, index) => (
                  <TableHead key={index} className="text-center">
                    {getFormattedDateShort(date.toISOString())}
                  </TableHead>
                ))}
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="border-2 border-black">
              {pangan.map((panganItem, panganIndex) =>
                pasar.map((pasarItem, pasarIndex) => (
                  <TableRow
                    key={`${panganIndex}-${pasarIndex}`}
                    className="border-b-2 border-black"
                  >
                    {pasarIndex === 0 && (
                      <>
                        <TableCell
                          rowSpan={pasar.length}
                          className="w-[100px] text-start"
                        >
                          {panganIndex + 1}
                        </TableCell>
                        <TableCell rowSpan={pasar.length}>
                          {panganItem.namaPangan}
                        </TableCell>
                      </>
                    )}
                    <TableCell>{pasarItem.nama}</TableCell>
                    {dateArray.map((date, dateIndex) => {
                      const dateKey = getFormattedDateShort(date.toISOString());
                      const todayDate = getFormattedDateShort(
                        new Date().toISOString(),
                      );
                      const { harga, tipe } = hargaMap
                        .get(panganItem.id)
                        ?.get(pasarItem.id)?.[dateKey] || {
                        harga: "0",
                        tipe: "-",
                      };
                      return (
                        <TableCell key={dateIndex}>
                          <div className="flex flex-col items-center gap-1">
                            {/* {(todayDate == dateKey) &&  */}
                            <TextInput
                              placeholder="Input Harga"
                              onChange={(e) =>
                                handleInputChange(
                                  panganItem.id,
                                  pasarItem.id,
                                  dateKey,
                                  e.target.value,
                                )
                              }
                            />
                            {/* } */}
                            <h1 className="text-md font-bold">
                              {formatPrice(harga.toString())}
                            </h1>
                            {SetInfoTipe(tipe)}
                          </div>
                        </TableCell>
                      );
                    })}
                    {pasarIndex === 0 && (
                      <TableCell rowSpan={pasar.length} className="text-right">
                        <Button
                          leftSection={<IconSend />}
                          size="sm"
                          variant="filled"
                          className="bg-blue-500"
                          onClick={() => {
                            handleUpdateHarga();
                          }}
                        >
                          Update Harga
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                )),
              )}
            </TableBody>
          </Table>
        </section>
      </CardContent>
    </Card>
  );
};

export default HargaPasar;
