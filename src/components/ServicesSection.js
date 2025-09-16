"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Button from "./Button";

export default function ServicesSection() {
  const mainServices = [
    {
      title: "Neurological Physiotherapy",
      description:
        "At Embody Perthshire, I provide specialist neurological physiotherapy in the comfort of your own home, helping you or your loved one move with greater confidence, independence, and ease",
      details:
        "With over a decade of experience in neurological rehabilitation across the NHS and private sectors, I work with people living with a wide range of neurological conditions, as well as older adults needing rehabilitation or support with balance and mobility.",
      // approach:
      //   "I take a whole-person approach — combining clinical expertise with encouragement and care. My focus is on supporting progress not only during sessions but also in everyday life, helping you build confidence, strength, and independence where it matters most.",
      image: "/physio/IMG-20250901-WA0010.jpg",
      features: [
        "Home-based sessions",
        "Neurological rehabilitation",
        "Balance and mobility support",
        "Older adults care",
      ],
    },
  ];

  const exerciseClasses = [
    {
      title: "Pilates",
      description:
        "A community Pilates class suitable for both beginners and those with more experience, providing a full-body workout to improve strength, flexibility, posture, and balance.",
      details:
        "This class is designed to leave you feeling strong, balanced, and energised, whether you're completely new to Pilates or looking to build on your practice. Exercises are adapted to different levels.",
      image: "/IMG-20250813-WA0107.jpg",
      features: [
        "Community classes",
        "All levels welcome",
        "Full-body workout",
        "Improved posture & balance",
      ],
      schedule: "Wednesday • 18:00pm-19:00pm • Pitlochry Town Hall",
    },
    {
      title: "MS Move Well",
      description:
        "A 1-hour online exercise class for people with mild to moderate Multiple Sclerosis symptoms, focusing on strength, balance, stamina, and coordination through varied, moderate-intensity exercises.",
      details:
        "This class is designed to help manage MS symptoms, improve fitness, and support day-to-day function. Participants should be able to exercise in standing for the majority of the session (with rests as required). This class is funded by the MS Society.",
      image: "/IMG-20250813-WA0106.jpg",
      features: [
        "Online sessions",
        "MS symptom management",
        "Strength & balance training",
        "MS Society funded",
      ],
      schedule: "Thursday • 10:30am-11:30am • Online",
    },
  ];

  const renderService = (service, index, isExerciseClass = false) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 * index }}
      viewport={{ once: true }}
      className="mb-16"
    >
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div
          className={`order-2 ${index % 2 === 0 ? "lg:order-1" : "lg:order-2"}`}
        >
          <h3 className="text-2xl md:text-3xl font-playfair text-black mb-6">
            {service.title}
          </h3>
          <p className="text-lg text-secondary leading-relaxed mb-6">
            {service.description}
          </p>
          <p className="text-secondary leading-relaxed mb-8">
            {service.details}
          </p>
          <p className="text-secondary leading-relaxed mb-8">
            {service.approach}
          </p>

          {service.schedule && (
            <div className="bg-primary/10 border-l-4 border-primary p-4 mb-8">
              <p className="text-black font-semibold">Class Schedule:</p>
              <p className="text-secondary">{service.schedule}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-8">
            {service.features.map((feature, featureIndex) => (
              <div key={featureIndex} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-black font-medium">{feature}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button href="/contact" variant="primary">
              {isExerciseClass ? "Book Class" : "Book Consultation"}
            </Button>
            <Button href="/classes" variant="secondary">
              Learn More
            </Button>
          </div>
        </div>

        <div
          className={`order-1 ${index % 2 === 0 ? "lg:order-2" : "lg:order-1"}`}
        >
          <div className="relative">
            <Image
              src={service.image}
              alt={service.title}
              width={600}
              height={500}
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-third/10 to-primary/10">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair text-black mb-6">
            Services
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-third mx-auto mb-8"></div>
        </motion.div>

        {/* Main Services */}
        {mainServices.map((service, index) => renderService(service, index))}

        {/* Exercise Classes Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 * mainServices.length }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair text-black mb-6">
            Exercise Classes
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-third mx-auto mb-8"></div>
        </motion.div>

        {exerciseClasses.map((service, index) =>
          renderService(service, index, true)
        )}
      </div>
    </section>
  );
}
