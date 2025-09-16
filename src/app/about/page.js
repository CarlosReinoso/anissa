"use client";
import Image from "next/image";
import SectionHero from "../../components/SectionHero";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <>
      <SectionHero title="" />

      {/* Hero Section with Image */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 to-third/10">
        <div className="max-w-6xl mx-auto px-4">
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
                  src="/hero-mobile.jpg"
                  alt="Carol Doherty - Specialist Neurological Physiotherapist"
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
              <h2 className="text-3xl md:text-4xl font-playfair text-black mb-6">
                Meet Carol Doherty
              </h2>
              <p className="text-lg text-secondary leading-relaxed">
                As a specialist neurological physiotherapist and experienced
                exercise instructor, I am passionate about helping people
                enhance their quality of life through movement. Guided by a deep
                desire to make a meaningful difference, I have built a career
                that combines clinical expertise with years of teaching
                experience to support people in feeling stronger, healthier, and
                more confident in their everyday lives.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="bg-primary/20 px-4 py-2 rounded-full">
                  <span className="text-black font-medium">Expert Support</span>
                </div>
                <div className="bg-third/20 px-4 py-2 rounded-full">
                  <span className="text-black font-medium">
                    Movement for Life
                  </span>
                </div>
                <div className="bg-fourth/20 px-4 py-2 rounded-full">
                  <span className="text-black font-medium">Home Visits</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* My Journey Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair text-black mb-6">
              My Journey Into Physiotherapy
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-third mx-auto mb-8"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-playfair text-black mb-6">
                The Beginning
              </h3>
              <p className="text-lg text-secondary mb-6 leading-relaxed">
                My journey began with a deep desire to make a meaningful
                difference in people’s lives. Even before qualifying as a
                physiotherapist, I was teaching exercise classes and discovering
                how movement could transform health and wellbeing. Over time,
                these two paths came together — physiotherapy gave me a deeper
                understanding of anatomy and movement, while teaching Pilates,
                yoga and community fitness showed me how people can build
                strength, improve balance and enhance their overall health
                through exercise.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-playfair text-black mb-6">
                Specialising in Neurological Care
              </h3>
              <p className="text-lg text-secondary mb-6 leading-relaxed">
                During my training and early career, I discovered a particular
                passion for neurological physiotherapy. I was drawn to the
                complexity and challenge of helping people with these
                conditions, where every individual’s journey is unique. Working
                with people living with diagnoses such as Multiple Sclerosis,
                Parkinson’s and other long-term neurological challenges has
                shown me the importance of personalised, compassionate care to
                support progress and improve quality of life.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* My Approach Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-third/10 to-primary/10">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-playfair text-black mb-6">
              My Approach to Care
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-third mx-auto mb-8"></div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary text-xl">❤️</span>
                </div>
                <h3 className="text-xl font-playfair text-black">
                  Person-Centred Care
                </h3>
              </div>
              <p className="text-secondary leading-relaxed">
                I believe in treating the whole person, not just their
                condition. Every individual has unique goals, challenges, and
                circumstances. My approach is to listen, understand, and work
                together to create a treatment plan that fits your life and
                aspirations.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-fourth/20 rounded-full flex items-center justify-center mr-4">
                  <span className="text-fourth text-xl">🌟</span>
                </div>
                <h3 className="text-xl font-playfair text-black">
                  Holistic Care
                </h3>
              </div>
              <p className="text-secondary leading-relaxed">
                I take a whole-person approach — combining clinical expertise
                with encouragement and care. My focus is on supporting progress
                not only during sessions but also in everyday life, helping you
                build confidence, strength, and independence where it matters
                most.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-third/20 rounded-full flex items-center justify-center mr-4">
                  <span className="text-third text-xl">🏠</span>
                </div>
                <h3 className="text-xl font-playfair text-black">
                  Home-Based Care
                </h3>
              </div>
              <p className="text-secondary leading-relaxed">
                I chose to offer home visits because I believe rehabilitation is
                most effective in your natural environment. Working in your home
                allows me to see how you move and function in your daily life,
                leading to more practical and meaningful treatment.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What Drives Me Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair text-black mb-6">
              What Drives Me
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-third mx-auto mb-8"></div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Seeing Progress",
                description:
                  " There’s nothing more rewarding than witnessing someone regain their confidence and independence.",
                icon: "🌟",
              },
              {
                title: "Building Relationships",
                description:
                  "I value the relationships I build with my clients and their families. Trust and understanding are the foundation of effective rehabilitation.",
                icon: "🤝",
              },
              {
                title: "Making a Difference",
                description:
                  "Every day, I have the privilege of supporting people to improve their quality of life and reach their goals.",
                icon: "💪",
              },
            ].map((motivation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-primary/5 to-third/5 p-6 rounded-2xl border border-primary/10"
              >
                <div className="text-3xl mb-4">{motivation.icon}</div>
                <h3 className="text-xl font-playfair text-black mb-3">
                  {motivation.title}
                </h3>
                <p className="text-secondary leading-relaxed">
                  {motivation.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Areas Covered Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 to-third/10">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-playfair text-black mb-6">
              Serving Perth and Highland Perthshire
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-third mx-auto mb-8"></div>
            <p className="text-lg text-secondary max-w-2xl mx-auto mb-8">
              I provide home visits throughout Perth City and Highland
              Perthshire, bringing specialist neurological physiotherapy care
              directly to your door.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white px-6 py-3 rounded-full shadow-lg">
                <span className="text-black font-medium">Perth City</span>
              </div>
              <div className="bg-white px-6 py-3 rounded-full shadow-lg">
                <span className="text-black font-medium">
                  Highland Perthshire
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
