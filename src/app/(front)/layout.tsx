"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { Inter } from "next/font/google";
import { ColorSchemeScript } from '@mantine/core';
import { Notifications } from "@mantine/notifications";
import NextTopLoader from 'nextjs-toploader';

import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import "node_modules/react-modal-video/css/modal-video.css";
import "../../styles/index.css";
import '@mantine/core/styles.css';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />

      <body className={`bg-[#FCFCFC] dark:bg-black ${inter.className}`}>
      <NextTopLoader color="red" />
        <MantineProvider>
          <Providers>
            <Header />
            {children}
            <Footer />
            <ScrollToTop />
          </Providers>
        </MantineProvider>
      </body>
    </html>
  );
}

import { Providers } from "./providers";import { MantineProvider } from "@mantine/core";

