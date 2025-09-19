import { Playfair_Display, Figtree } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const generateMetadata = async () => {
  return {
    title: "Anissa Aouar | Freelance Illustrator & Tattoo Artist",
    description:
      "French illustrator and tattoo artist based in London. Versatile style featuring conceptual and colourful artworks, minimal continuous line illustrations, and pop surrealist imagery.",
    keywords:
      "illustrator, tattoo artist, freelance illustrator, London illustrator, French artist, pop surrealist, conceptual art, continuous line art, Deutsche Bank illustrator, commercial illustration, tattoo design",
    authors: [{ name: "Anissa Aouar" }],
    creator: "Anissa Aouar",
    publisher: "Anissa Aouar",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL("https://anissaaouar.com"), // Replace with actual domain
    alternates: {
      canonical: "/",
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/logo.jpg", type: "image/jpeg" },
      ],
      shortcut: "/favicon.ico",
      apple: "/logo.jpg",
    },
    openGraph: {
      title: "Anissa Aouar | Freelance Illustrator & Tattoo Artist",
      description:
        "French illustrator and tattoo artist based in London. Versatile style featuring conceptual and colourful artworks, minimal continuous line illustrations, and pop surrealist imagery.",
      url: "https://anissaaouar.com", // Replace with actual domain
      siteName: "Anissa Aouar",
      images: [
        {
          url: "/hero-desktop.jpg", // Your hero image
          width: 1200,
          height: 630,
          alt: "Anissa Aouar - Freelance Illustrator & Tattoo Artist",
        },
      ],
      locale: "en_GB",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Anissa Aouar | Freelance Illustrator & Tattoo Artist",
      description:
        "French illustrator and tattoo artist based in London. Versatile style featuring conceptual and colourful artworks.",
      images: ["/hero-desktop.jpg"], // Your hero image
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    category: "art",
    classification: "creative",
    other: {
      "application/ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Anissa Aouar",
        jobTitle: "Freelance Illustrator & Tattoo Artist",
        description:
          "French illustrator and tattoo artist based in London. Versatile style featuring conceptual and colourful artworks, minimal continuous line illustrations, and pop surrealist imagery.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "London",
          addressCountry: "GB",
        },
        knowsAbout: [
          "Illustration",
          "Tattoo Art",
          "Pop Surrealism",
          "Commercial Art",
          "Vector Graphics",
        ],
        url: "https://anissaaouar.com",
      }),
    },
  };
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${figtree.variable} antialiased`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
