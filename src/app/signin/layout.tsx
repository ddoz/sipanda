
import { Inter } from "next/font/google";
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import "node_modules/react-modal-video/css/modal-video.css";
import "../../styles/index.css";
import '@mantine/core/styles.css';
import { MantineProvider } from "@mantine/core";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'Sipanda - Dinas Pangan Bandar Lampung',
  description: 'Sipanda - Dinas Pangan Bandar Lampung',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <MantineProvider>
          {children}
        </MantineProvider>
      </body>
    </html>
  )
}
