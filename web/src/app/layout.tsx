import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { WebsiteJsonLd, OrganizationJsonLd } from "@/components/seo";

const manrope = Manrope({
  subsets: ["latin", "vietnamese"],
  variable: "--font-manrope",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#C75B4A' },
    { media: '(prefers-color-scheme: dark)', color: '#C75B4A' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://lichviet.online'),
  title: {
    default: "Lịch Việt Vạn Sự An Lành - Âm Lịch & Phong Thủy",
    template: "%s | Lịch Việt",
  },
  description:
    "Ứng dụng lịch Việt Nam với âm lịch, phong thủy, giờ hoàng đạo, và thông tin ngày tốt xấu. Xem lịch, chọn ngày tốt cho công việc quan trọng.",
  keywords: [
    "lịch việt",
    "âm lịch",
    "phong thủy",
    "giờ hoàng đạo",
    "ngày tốt",
    "can chi",
    "lịch vạn niên",
    "xem ngày",
    "ngày tốt xấu",
    "lịch âm",
    "lịch dương",
    "28 sao",
    "12 trực",
  ],
  authors: [{ name: "Lịch Việt Team", url: "https://lichviet.vn" }],
  creator: "Lịch Việt Team",
  publisher: "Lịch Việt - Vạn Sự An Lành",
  
  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Open Graph
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://lichviet.online",
    siteName: "Lịch Việt - Vạn Sự An Lành",
    title: "Lịch Việt Vạn Sự An Lành - Âm Lịch & Phong Thủy",
    description: "Xem lịch âm dương, phong thủy, giờ hoàng đạo và chọn ngày tốt cho công việc quan trọng",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Lịch Việt - Vạn Sự An Lành",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Lịch Việt Vạn Sự An Lành",
    description: "Xem lịch âm dương, phong thủy và chọn ngày tốt",
    images: ["/og-image.webp"],
  },

  // Icons
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },

  // Manifest
  manifest: "/manifest.json",

  // Alternates
  alternates: {
    canonical: "https://lichviet.online",
    languages: {
      'vi-VN': 'https://lichviet.online',
    },
  },

  // Verification (add your codes when available)
  // verification: {
  //   google: 'your-google-verification-code',
  // },

  // App Links
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Lịch Việt",
  },

  // Format Detection
  formatDetection: {
    telephone: false,
  },

  // Category
  category: "utilities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        {/* JSON-LD Structured Data */}
        <WebsiteJsonLd />
        <OrganizationJsonLd />
      </head>
      <body className={`${manrope.variable} font-[Manrope] antialiased`}>
        {children}
      </body>
    </html>
  );
}
