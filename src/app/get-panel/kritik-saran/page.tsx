"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ActionIcon, ButtonGroup } from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconPencil,
  IconTrashFilled,
} from "@tabler/icons-react";
import { PlusCircleIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  deleteKategoriPangan,
  saveKategoriPangan,
  updateKategoriPangan,
} from "@/services/master-data";
import { getPaginatedKritikSaran } from "@/services/kritik-saran";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getFormattedDateTime } from "@/lib/utils";

const KritikSaran = () => {
  const [showForm, setShowForm] = useState(false);
  const [judul, setJudul] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [id, setId] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const getData = async () => {
      const { data, total } = await getPaginatedKritikSaran(
        currentPage,
        itemsPerPage,
      );
      if (data) {
        setData(data);
        setTotalPages(Math.ceil(total / itemsPerPage));
      } else {
        setData([]);
        setTotalPages(1);
      }
    };
    getData();
  }, [currentPage]);

  const deleteData = (id: any) => {
    setOpenDialog(!openDialog);
    setId(id);
  };

  const confirmDelete = async () => {
    const del = await deleteKategoriPangan({
      id: parseInt(id),
    });
    if (del.status) {
      notifications.show({
        title: "Informasi",
        message: "Berhasil menghapus data",
        color: "green",
        position: "top-center",
      });
      setOpenDialog(false);
    } else {
      notifications.show({
        title: "Informasi",
        message: "Gagal menghapus data",
        color: "red",
        position: "top-center",
      });
      setOpenDialog(false);
    }
  };

  const create = () => {
    setShowForm(true);
    setJudul("");
    setId("");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex flex-row justify-between">
            <h1>Data Kritik Saran</h1>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data && (
          <section className="mt-5">
            <div className="flex flex-row flex-wrap gap-2">
              <Table className="rounded-md border">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">No</TableHead>
                    <TableHead>Nilai</TableHead>
                    <TableHead>Saran</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item: any, index: number) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell>{item.nilai}</TableCell>
                      <TableCell>{item.saran}</TableCell>
                      <TableCell>
                        {getFormattedDateTime(item.createdAt.toISOString())}
                      </TableCell>
                      <TableCell className="text-right">
                        <ActionIcon
                          variant="transparent"
                          aria-label="delete"
                          onClick={() => deleteData(item.id)}
                        >
                          <IconTrashFilled
                            style={{ width: "70%", height: "70%" }}
                            stroke={1.5}
                            color="red"
                          />
                        </ActionIcon>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 flex items-center justify-between">
                <ButtonGroup>
                  <Button
                    size={"icon"}
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <IconChevronLeft />
                  </Button>
                  {[...Array(totalPages)].map((_, index) => (
                    <Button
                      key={index}
                      variant={
                        currentPage === index + 1 ? "secondary" : "outline"
                      }
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                  <Button
                    size={"icon"}
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    <IconChevronRight />
                  </Button>
                </ButtonGroup>
              </div>
            </div>
          </section>
        )}

        <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Data ini?</AlertDialogTitle>
              <AlertDialogDescription>
                Data akan dihapus data sistem, dan tidak dapat dikembalikan
                lagi.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>Ya</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default KritikSaran;
