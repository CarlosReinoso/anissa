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
    title: "Embody Perthshire | Specialist Neurological Physiotherapy & Pilates",
    description:
      "Specialist neurological physiotherapy, Pilates, yoga and exercise therapy in Perthshire. Helping you move with confidence and live more actively with personalised care from Carol Doherty.",
    keywords:
      "neurological physiotherapy, physiotherapy Perthshire, Pilates Perthshire, yoga therapy, exercise specialist, neurological rehabilitation, movement therapy, Carol Doherty physiotherapist, Perthshire physiotherapy, neurological conditions, stroke rehabilitation, MS physiotherapy, Parkinson's physiotherapy",
    authors: [{ name: "Carol Doherty" }],
    creator: "Carol Doherty",
    publisher: "Embody Perthshire",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL("https://embodyperthshire.co.uk"), // Replace with your actual domain
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title:
        "Embody Perthshire | Specialist Neurological Physiotherapy & Pilates",
      description:
        "Specialist neurological physiotherapy, Pilates, yoga and exercise therapy in Perthshire. Helping you move with confidence and live more actively.",
      url: "https://embodyperthshire.co.uk", // Replace with your actual domain
      siteName: "Embody Perthshire",
      images: [
        {
          url: "/hero-desktop.jpg", // Your hero image
          width: 1200,
          height: 630,
          alt: "Carol Doherty - Specialist Neurological Physiotherapist at Embody Perthshire",
        },
      ],
      locale: "en_GB",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title:
        "Embody Perthshire | Specialist Neurological Physiotherapy & Pilates",
      description:
        "Specialist neurological physiotherapy, Pilates, yoga and exercise therapy in Perthshire. Helping you move with confidence.",
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
    category: "healthcare",
    classification: "medical",
    other: {
      "application/ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Physician",
        name: "Carol Doherty",
        jobTitle: "Specialist Neurological Physiotherapist",
        worksFor: {
          "@type": "Organization",
          name: "Embody Perthshire",
        },
        description:
          "Specialist Neurological Physiotherapist and Pilates, Yoga & Exercise Specialist",
        address: {
          "@type": "PostalAddress",
          addressRegion: "Perthshire",
          addressCountry: "GB",
        },
        specialty: [
          "Neurological Physiotherapy",
          "Pilates",
          "Yoga Therapy",
          "Exercise Specialist",
        ],
        url: "https://embodyperthshire.co.uk",
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
