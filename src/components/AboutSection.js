import Image from "next/image";
import Button from "@/components/Button";
import { ARTIST_INFO } from "@/constants";

export default function AboutSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left - Image */}
          <div className="relative h-[500px] md:h-[600px]">
            <Image
              src="/anissa.webp"
              alt="Anissa Aouar"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Right - Info */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-black font-playfair">
              About Anissa
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {ARTIST_INFO.bio}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              {ARTIST_INFO.philosophy}
            </p>
            <div className="pt-4">
              <Button
                href="/about"
                variant="primary"
                className="!border-[3px] !rounded-none !shadow-none hover:!shadow-none"
                showArrow={false}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
