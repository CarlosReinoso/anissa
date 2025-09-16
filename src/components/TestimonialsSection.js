"use client";
import { motion } from "framer-motion";

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "Carol's classes gave me more confidence in my movement — and I always leave feeling great.",
      author: "Liz",
    },
    {
      quote:
        "Since starting Carol's classes I've regained flexibility in my lower back and feel stronger than ever.",
      author: "Kate",
    },
    {
      quote:
        "I always sleep better after Carol's Pilates class — such a boost to my wellbeing.",
      author: "Eileen",
    },
    {
      quote:
        "The carefully structured classes enabled me to improve almost without realising it. An excellent way to keep the whole body fit and healthily exercised.",
      author: "Jo",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-third/10 to-primary/10">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair text-black mb-6">
            What Clients Say
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-third mx-auto mb-8"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-primary/20"
            >
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <div className="text-primary text-4xl mb-4">"</div>
                  <p className="text-lg text-secondary leading-relaxed mb-6 italic">
                    {testimonial.quote}
                  </p>
                </div>
                <div className="border-t border-primary/20 pt-4">
                  <p className="text-black font-medium">
                    — {testimonial.author}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
