import ArtworkGrid from "@/components/ArtworkGrid";

export const metadata = {
  title: "Graphics | Anissa Aouar",
  description:
    "Explore Anissa Aouar's graphic illustrations, featuring conceptual and colourful artworks, minimal continuous line drawings, and pop surrealist imagery.",
};

export default function GraphicsPage() {
  return (
    <div className="bg-white text-black pt-20">
      <section className="min-h-screen">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-black mb-36">
              Graphics
            </h1>
          </div>

          {/* Graphics Artwork Grid */}
          <ArtworkGrid category="graphics" />
        </div>
      </section>
    </div>
  );
}
