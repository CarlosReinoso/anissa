import Button from "@/components/Button";
import Carousel from "@/components/Carousel";

export default function TattoosSection() {
  const tattoosImages = [
    "/placeholder.png",
    "/placeholder.png",
    "/placeholder.png",
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left - Carousel */}
          <div className="relative h-[500px] md:h-[600px]">
            <Carousel images={tattoosImages} alt="Tattoo designs" />
          </div>

          {/* Right - Info */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-black font-playfair">
              Tattoo Designs
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Discover unique tattoo designs that blend minimalist line work
              with intricate detail. Each piece is carefully crafted to
              translate beautifully onto skin while maintaining artistic
              integrity.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              From delicate continuous line work to bold statement pieces, every
              design tells a story and celebrates the art of permanent body art.
            </p>
            <div className="pt-4">
              <Button
                href="/tattoos"
                variant="primary"
                className="!border-[3px] !rounded-none !shadow-none hover:!shadow-none"
                showArrow={false}
              >
                View Tattoos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
