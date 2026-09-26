import Image from "next/image";
import { INSTAGRAM_PROFILE, EMAIL_ADDRESS } from "@/constants";

export const metadata = {
  title: "Under Construction | Anissa Aouar",
  robots: { index: false, follow: false },
};

export default function UnderConstructionPage() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black text-white px-6 text-center">
      <style>{`nav, header, footer { display: none !important; }`}</style>
      <Image
        src="/logo.jpg"
        alt="Anissa Aouar"
        width={120}
        height={120}
        className="rounded-full mb-8"
        priority
      />
      <h1 className="font-playfair text-4xl md:text-5xl mb-4">
        Under Construction
      </h1>
      <p className="font-figtree text-gray-300 max-w-md mb-8">
        The site is getting a refresh. Please check back soon.
      </p>
      <div className="flex gap-6 font-figtree text-sm">
        <a
          href={INSTAGRAM_PROFILE}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          Instagram
        </a>
        <a
          href={`mailto:${EMAIL_ADDRESS}`}
          className="hover:text-primary transition-colors"
        >
          Email
        </a>
      </div>
    </div>
  );
}
