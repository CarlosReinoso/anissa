"use client";
import Image from "next/image";
import SectionHero from "../../components/SectionHero";
import Button from "../../components/Button";
import { motion } from "framer-motion";
import { useClasses } from "../hooks/useClasses";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function ClassesPage() {
  const { classes, loading, error } = useClasses();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-red-500">
          Error loading classes. Please try again later.
        </div>
      </div>
    );
  }

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
                  src="/IMG-20250813-WA0107.jpg"
                  alt="Pilates and Movement Classes"
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
                Join Our Movement Classes
              </h2>
              <p className="text-lg text-secondary leading-relaxed">
                Discover the transformative power of movement through our
                carefully designed sessions. Whether you’re returning to
                exercise after a break or looking to build on your current
                fitness, our classes are tailored to support your journey
                towards improved strength, balance, flexibility, and overall
                wellbeing.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="bg-primary/20 px-4 py-2 rounded-full">
                  <span className="text-black font-medium">
                    All Levels Welcome
                  </span>
                </div>
                <div className="bg-third/20 px-4 py-2 rounded-full">
                  <span className="text-black font-medium">
                    Expert Guidance
                  </span>
                </div>
                <div className="bg-fourth/20 px-4 py-2 rounded-full">
                  <span className="text-black font-medium">
                    Supportive Environment
                  </span>
                </div>
                <div className="bg-red-100 px-4 py-2 rounded-full">
                  <span className="text-red-700 font-medium">
                    Booking Essential
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Class Timetable Section */}
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
              Class Timetable
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-third mx-auto mb-8"></div>
            <p className="text-lg text-secondary max-w-3xl mx-auto">
              Join us for our regular classes designed to improve your strength,
              flexibility, and overall wellbeing.
            </p>
          </motion.div>

          <div className="space-y-8">
            {classes.map((classItem, index) => (
              <motion.div
                key={classItem.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 * index }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-primary/5 to-third/5 rounded-2xl border border-primary/10 overflow-hidden shadow-lg"
              >
                <div className="grid md:grid-cols-3 gap-0">
                  {/* Class Image */}
                  <div className="relative h-64 md:h-full">
                    <Image
                      src={classItem.image}
                      alt={classItem.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          classItem.class_type === "online"
                            ? "bg-blue-500 text-white"
                            : "bg-green-500 text-white"
                        }`}
                      >
                        {classItem.class_type === "online"
                          ? "Online"
                          : "In-Person"}
                      </span>
                    </div>
                  </div>

                  {/* Class Details */}
                  <div className="md:col-span-2 p-8">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-playfair text-black mb-2">
                          {classItem.title}
                        </h3>
                        <p className="text-secondary leading-relaxed">
                          {classItem.description}
                        </p>
                        <div className="mt-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                            📅 Booking Essential
                          </span>
                        </div>
                      </div>

                      {/* Schedule Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white/50 p-4 rounded-xl">
                          <div className="text-sm text-secondary mb-1">Day</div>
                          <div className="font-semibold text-black">
                            {classItem.day}
                          </div>
                        </div>
                        <div className="bg-white/50 p-4 rounded-xl">
                          <div className="text-sm text-secondary mb-1">
                            Time
                          </div>
                          <div className="font-semibold text-black">
                            {classItem.time}
                          </div>
                        </div>
                        <div className="bg-white/50 p-4 rounded-xl">
                          <div className="text-sm text-secondary mb-1">
                            Location
                          </div>
                          <div className="font-semibold text-black">
                            {classItem.location}
                          </div>
                        </div>
                      </div>

                      {/* Booking Button */}
                      <div className="pt-4">
                        <Button
                          href={classItem.booking_url || "/contact"}
                          variant="primary"
                          className="w-full sm:w-auto"
                        >
                          Book This Class
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-third/10 to-primary/10">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-playfair text-black mb-6">
              Why Join Our Classes?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-third mx-auto mb-8"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Expert Instruction",
                description:
                  "Learn from an exercise specialist with over 16 years' experience teaching both group and one-to-one classes, blending Pilates, Yoga, Dance, and fitness training.",
                icon: "👩‍⚕️",
              },
              {
                title: "Supportive Community",
                description:
                  "Join a welcoming group environment where you can exercise alongside others and feel part of a supportive community.",
                icon: "👥",
              },
              {
                title: "Convenient Options",
                description:
                  "Choose between in-person classes or online sessions from the comfort of your home.",
                icon: "🏠",
              },
              {
                title: "Ongoing Support",
                description:
                  "Develop your fitness at your own pace with guidance, encouragement, and support to help you feel stronger and fitter over time.",
                icon: "📈",
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl shadow-lg"
              >
                <div className="text-3xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-playfair text-black mb-3">
                  {benefit.title}
                </h3>
                <p className="text-secondary leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/20 to-third/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-playfair text-black mb-6">
              Ready to Start Your Movement Journey?
            </h2>
            <p className="text-lg text-secondary max-w-2xl mx-auto">
              Book your place in our classes today and take the first step
              towards improved strength, energy, and wellbeing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/contact" variant="primary">
                Book a Class
              </Button>
              <Button href="/contact" variant="secondary">
                Get in Touch
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
