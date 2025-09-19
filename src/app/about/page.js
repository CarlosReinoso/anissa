"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { ARTIST_INFO } from "@/constants";


export default function AboutPage() {
  return (
    <div className="bg-white text-black pt-20">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative">
                <Image
                  src="/placeholder.png"
                  alt="Anissa Aouar - Freelance Illustrator & Tattoo Artist"
                  width={500}
                  height={600}
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
                {ARTIST_INFO.name}
              </h1>
              <p className="text-xl text-gray-600 mb-4">{ARTIST_INFO.title}</p>
              <p className="text-lg text-gray-700 mb-6">
                {ARTIST_INFO.location}
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                {ARTIST_INFO.bio}
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="bg-black text-white px-4 py-2 rounded-full">
                  <span className="font-medium">Illustration</span>
                </div>
                <div className="bg-black text-white px-4 py-2 rounded-full">
                  <span className="font-medium">Tattoo Art</span>
                </div>
                <div className="bg-black text-white px-4 py-2 rounded-full">
                  <span className="font-medium">Pop Surrealism</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-6">
              Artistic Philosophy
            </h2>
            <div className="w-24 h-1 bg-black mx-auto mb-8"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              {ARTIST_INFO.philosophy}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
              Creative Process
            </h2>
            <div className="w-24 h-1 bg-black mx-auto mb-8"></div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Sketch & Conceptualize",
                description:
                  "Each piece begins with hand-drawn sketches, exploring concepts and compositions that capture the essence of the subject.",
                icon: "✏️",
              },
              {
                title: "Vector Transformation",
                description:
                  "Sketches are transformed into vector graphics, ensuring scalability while preserving the personality of the original drawing.",
                icon: "🎨",
              },
              {
                title: "Final Artwork",
                description:
                  "The final piece maintains the organic feel of hand-drawn art while being perfectly suited for any application or scale.",
                icon: "✨",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
              >
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-bold text-black mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
              Clients & Collaborations
            </h2>
            <div className="w-24 h-1 bg-black mx-auto mb-8"></div>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
              Regularly commissioned by Deutsche Bank, I translate banking
              concepts and key attributes into metaphorical line illustrations,
              making these concepts more accessible and appealing to their
              clients.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8"
          >
            {ARTIST_INFO.clients.map((client, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
              >
                <p className="font-medium text-gray-800">{client}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
              Let's Work Together
            </h2>
            <div className="w-24 h-1 bg-black mx-auto mb-8"></div>
            <p className="text-lg text-gray-700 mb-8">
              Interested in commissioning artwork or discussing a project? I'd
              love to hear from you.
            </p>
            <a
              href="mailto:anissa.aouar@gmail.com"
              className="inline-block bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
              Get In Touch
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
