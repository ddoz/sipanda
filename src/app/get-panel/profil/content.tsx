"use client";
import { Button } from "@/components/ui/button";
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
  PlusCircle,
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
  ButtonGroup,
  FileButton,
  Input,
  PasswordInput,
  Select,
  TextInput,
} from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconInfoCircle,
  IconPencil,
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
import { deleteUser, saveUser, updateUser } from "@/services/user";
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
import { getFormattedDateTime } from "@/lib/utils";
import { useSession } from "next-auth/react";

const Content = () => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordKonf, setPasswordKonf] = useState("");
  const { data: session } = useSession();

  const router = useRouter();

  const save = async () => {
    if (password == "") {
      notifications.show({
        title: "Informasi",
        message: "Harap isi password terlebih dahulu",
        color: "red",
        position: "top-center",
      });
      return;
    }

    if (passwordKonf == "") {
      notifications.show({
        title: "Informasi",
        message: "Harap isi password ulang terlebih dahulu",
        color: "red",
        position: "top-center",
      });
      return;
    }

    if (passwordKonf != password) {
      notifications.show({
        title: "Informasi",
        message: "Password dan Password ulang harus sama",
        color: "red",
        position: "top-center",
      });
      return;
    }

    setLoading(true);

    const saveing = await updateUser({
      id: session?.user.id,
      password,
    });
    if (saveing) {
      notifications.show({
        title: "Informasi",
        message: "Berhasil menyimpan data",
        color: "green",
        position: "top-center",
      });
      resetForm();
      setLoading(false);
    } else {
      notifications.show({
        title: "Informasi",
        message: "Gagal menyimpan data",
        color: "red",
        position: "top-center",
      });
      setLoading(false);
    }

    return;
  };

  const resetForm = () => {
    setPassword("");
    setPasswordKonf("");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          <div className="flex flex-row justify-between">
            <h1>Profil User</h1>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex max-w-[400px] flex-col rounded bg-teal-100 p-4">
            <small>Identitas Login</small>
            <span>Nama: {session?.user.name}</span>
            <span>Email: {session?.user.email} </span>
          </div>

          {session && (
            <div className="flex w-[400px] flex-col gap-2 border p-4">
              <PasswordInput
                label="Password"
                placeholder="Masukkan Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <PasswordInput
                label="Password"
                placeholder="Masukkan Ulang Password"
                value={passwordKonf}
                onChange={(e) => setPasswordKonf(e.target.value)}
              />

              <Button onClick={save} variant={"default"} disabled={loading}>
                {loading ? "Sedang menyimpan..." : "Simpan"}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Content;
