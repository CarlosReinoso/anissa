import ArtworkGrid from "@/components/ArtworkGrid";
import { ARTIST_INFO } from "@/constants";

export default function Home() {
  return (
    <div className="bg-white text-black pt-20">
      {/* Hero Section with Artwork Grid */}
      <section className="min-h-screen">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-black mb-4">
              {ARTIST_INFO.name}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {ARTIST_INFO.title} • {ARTIST_INFO.location}
            </p>
          </div>

          {/* Featured Artwork Grid */}
          <ArtworkGrid category="all" limit={6} />

          <div className="text-center mt-12">
            <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {ARTIST_INFO.bio}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
