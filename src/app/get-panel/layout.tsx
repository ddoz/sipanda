import { Inter } from "next/font/google";
import { MantineColorsTuple, MantineProvider, createTheme } from "@mantine/core";
import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';
import "../../styles/globals.css";
import "../../styles/index.css";
import '@mantine/dates/styles.css';

import Link from 'next/link';
import {
  BadgePlusIcon,
  Building2Icon,
  FilesIcon,
  GalleryThumbnails,
  Globe2Icon,
  Home,
  ImageIcon,
  LineChart,
  ListCheckIcon,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Settings,
  ShoppingCart,
  Users2
} from 'lucide-react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
// import { User } from './user';
import Providers from './providers';
import { NavItem } from './nav-item';
import Image from 'next/image';
import { User } from './user';
import { IconBroadcast, IconListCheck, IconNotification } from '@tabler/icons-react';
import { Notifications } from "@mantine/notifications";
import NextTopLoader from "nextjs-toploader";
import AuthProvider from "./auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'SIPANDA SAI HAGOM',
  description: 'Aplikasi Pantau Harga Pangan',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
      <NextTopLoader color="red" />
      <AuthProvider>
        <MantineProvider>
          <Notifications position="top-right" />
          <Providers>
            <main className="flex flex-col w-full min-h-screen bg-muted/40">
              <DesktopNav />
              <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <header className="sticky top-0 z-30 flex items-center gap-4 px-4 border-b h-14 bg-background sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                  <MobileNav />
                  <DashboardBreadcrumb />
                  {/* <SearchInput /> */}
                  <User />
                </header>
                <main className="grid items-start flex-1 gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 bg-muted/40">
                  {children}
                </main>
              </div>
            </main>
          </Providers>
        </MantineProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

function DesktopNav() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 flex-col hidden border-r w-14 bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="/get-panel"
          className="flex items-center justify-center gap-2 text-lg font-semibold rounded-full group h-9 w-9 shrink-0 bg-primary text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <Image width={30} height={20} alt='logo' src={"/images/balam.png"} style={{width:'auto'}}  />
          <span className="sr-only">SIPANDA KOTA BANDAR LAMPUNG</span>
        </Link>

        <NavItem href="/get-panel" label="Dashboard">
          <Home className="w-5 h-5" />
        </NavItem>

        <NavItem href="/get-panel/harga-pasar" label="Input Harga Pasar">
          <ListCheckIcon className="w-5 h-5" />
        </NavItem>

        <NavItem href="/get-panel/pangan" label="Pangan">
          <BadgePlusIcon className="w-5 h-5" />
        </NavItem>
        
        <NavItem href="/get-panel/slider" label="Slider">
          <ImageIcon className="w-5 h-5" />
        </NavItem>

        <NavItem href="/get-panel/master-data" label="Master Data">
          <Package className="w-5 h-5" />
        </NavItem>

        <NavItem href="/get-panel/user" label="User">
          <Users2 className="w-5 h-5" />
        </NavItem>

        <NavItem href="/get-panel/profil" label="Profil">
          <Settings className="w-5 h-5" />
        </NavItem>

      </nav>
      <nav className="flex flex-col items-center gap-4 px-2 mt-auto sm:py-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/"
              className="flex items-center justify-center transition-colors rounded-lg h-9 w-9 text-muted-foreground hover:text-foreground md:h-8 md:w-8"
            >
              <Globe2Icon className="w-5 h-5" />
              <span className="sr-only">Website Utama</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Website Utama</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
}

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="w-5 h-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="#"
            className="flex items-center justify-center w-10 h-10 gap-2 text-lg font-semibold rounded-full group shrink-0 bg-primary text-primary-foreground md:text-base"
          >
            <Package2 className="w-5 h-5 transition-all group-hover:scale-110" />
            <span className="sr-only">Dinas Pangan</span>
          </Link>
          <Link
            href="/get-panel"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Home className="w-5 h-5" />
            Dashboard
          </Link>
          <Link
            href="/get-panel/harga-pasar"
            className="flex items-center gap-4 px-2.5 text-foreground"
          >
            <ListCheckIcon className="w-5 h-5" />
            Input Harga Pasar
          </Link>
          <Link
            href="/get-panel/pangan"
            className="flex items-center gap-4 px-2.5 text-foreground"
          >
            <BadgePlusIcon className="w-5 h-5" />
            Pangan
          </Link>
          <Link
            href="/get-panel/slider"
            className="flex items-center gap-4 px-2.5 text-foreground"
          >
            <ImageIcon className="w-5 h-5" />
            Slider Galeri
          </Link>
          <Link
            href="/get-panel/master-data"
            className="flex items-center gap-4 px-2.5 text-foreground"
          >
            <Package className="w-5 h-5" />
            Master Data
          </Link>
          <Link
            href="/get-panel/user"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Users2 className="w-5 h-5" />
            User
          </Link>
          <Link
            href="/get-panel/profil"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Settings className="w-5 h-5" />
            Profil
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function DashboardBreadcrumb() {
  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="#">SIPANDA SAI HAGOM</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {/* <BreadcrumbSeparator /> */}
        {/* <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="#">Products</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>All Products</BreadcrumbPage>
        </BreadcrumbItem> */}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
