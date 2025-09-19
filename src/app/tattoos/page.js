import ArtworkGrid from "@/components/ArtworkGrid";

export const metadata = {
  title: "Tattoos | Anissa Aouar",
  description:
    "Discover Anissa Aouar's tattoo designs, featuring unique illustrations that can be scaled to any size while maintaining the personality of original hand drawings.",
};

export default function TattoosPage() {
  return (
    <div className="bg-white text-black pt-20">
      <section className="min-h-screen">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-black mb-4">
              Tattoos
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Each tattoo design is sketched out then turned into vectors, which
              means it can be used at any scale but still carries the
              personality of that original hand drawing. Explore unique designs
              that bring you into a vibrant and pop surrealist world.
            </p>
          </div>

          {/* Tattoo Artwork Grid */}
          <ArtworkGrid category="tattoos" />
        </div>
      </section>
    </div>
  );
}
