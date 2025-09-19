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
            <h1 className="text-4xl md:text-6xl font-bold text-black mb-4">
              Graphics
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A collection of conceptual and colourful artworks, minimal
              continuous line illustrations, and hand-drawn pieces that explore
              humanhood, modern feminism, nature, and reflections of
              subconscious states.
            </p>
          </div>

          {/* Graphics Artwork Grid */}
          <ArtworkGrid category="graphics" />
        </div>
      </section>
    </div>
  );
}
