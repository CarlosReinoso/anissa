"use client";
import Image from "next/image";
import SectionHero from "../../components/SectionHero";
import Button from "../../components/Button";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function PhysioTherapyPage() {
  const services = [
    {
      name: "Neurological Physiotherapy",
      duration: "45-60 minutes",
      description:
        "Specialised treatment for neurological conditions including stroke, MS, Parkinson’s, cerebral palsy, and other neurological disorders. I also work with adults experiencing mobility or balance difficulties, whether from ageing, surgery, or reduced confidence in movement. Treatment is tailored to support goals such as improving mobility, building strength, enhancing balance, and increasing independence in daily life.",
      image: "physio/IMG-20250901-WA0011.jpg",
      type: "specialist",
      homeVisits: true,
    },
  ];

  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const galleryImages = [
    "/physio/IMG-20250903-WA0007.jpg",
    "/physio/IMG-20250903-WA0006.jpg",
    // "/physio/IMG-20250903-WA0004.jpg",
    "/physio/IMG-20250901-WA0017.jpg",
    "/physio/IMG-20250901-WA0016.jpg",
    "/physio/IMG-20250901-WA0015.jpg",
    "/physio/IMG-20250901-WA0014.jpg",
    "/physio/IMG-20250901-WA0013.jpg",
    "/physio/IMG-20250901-WA0012.jpg",
    "/physio/IMG-20250901-WA0011.jpg",
    "/physio/IMG-20250901-WA0010.jpg",
  ];

  const openModal = (index) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImageIndex(null);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") previousImage();
  };

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
                  src="physio/IMG-20250901-WA0012.jpg"
                  alt="Physiotherapy Services"
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
                Specialist Neurological Physiotherapy
              </h2>
              <p className="text-lg text-secondary leading-relaxed">
                I take a whole-person approach — combining clinical expertise
                with encouragement and care. My focus is on supporting progress
                not only during sessions but also in everyday life, helping you
                build confidence, strength, and independence where it matters
                most.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="bg-primary/20 px-4 py-2 rounded-full">
                  <span className="text-black font-medium">Home Visits</span>
                </div>
                <div className="bg-third/20 px-4 py-2 rounded-full">
                  <span className="text-black font-medium">
                    Neurological Care
                  </span>
                </div>
                <div className="bg-fourth/20 px-4 py-2 rounded-full">
                  <span className="text-black font-medium">
                    Personalised Care
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Conditions Section */}
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
              Conditions I Work With
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
                Regular Support
              </h3>
              <p className="text-lg text-secondary mb-6">
                I regularly support people living with:
              </p>
              <div className="space-y-4">
                {[
                  "Stroke and acquired brain injury",
                  "Multiple sclerosis (MS)",
                  "Parkinson's disease",
                  "Cerebral palsy",
                  "Spinal cord injuries",
                ].map((condition, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-black font-medium">{condition}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-playfair text-black mb-6">
                Additional Expertise
              </h3>
              <p className="text-lg text-secondary mb-6">
                I am also trained and experienced in treating other conditions,
                including:
              </p>
              <div className="space-y-4">
                {[
                  "Peripheral neuropathies (including polyneuropathy)",
                  "Functional Neurological Disorder (FND)",
                  "Guillain–Barré syndrome (GBS)",
                  "Chronic Inflammatory Demyelinating Polyneuropathy (CIDP)",
                  "Transverse myelitis",
                  "Small vessel disease",
                  "Myelopathies",
                  "Undiagnosed or complex neurological conditions",
                ].map((condition, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-third rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-black font-medium">{condition}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Additional Work Section */}
      <section className="pb-16 md:pb-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-playfair text-black mb-6">
              I Also Work With
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-third mx-auto mb-8"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary/5 to-third/5 p-8 rounded-2xl shadow-lg"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary text-xl">🏥</span>
                </div>
                <h3 className="text-xl font-playfair text-black">
                  Post-Surgery Recovery
                </h3>
              </div>
              <p className="text-secondary leading-relaxed">
                Older adults recovering after surgery or hospital admission
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary/5 to-third/5 p-8 rounded-2xl shadow-lg"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-third/20 rounded-full flex items-center justify-center mr-4">
                  <span className="text-third text-xl">⚖️</span>
                </div>
                <h3 className="text-xl font-playfair text-black">
                  Balance & Mobility
                </h3>
              </div>
              <p className="text-secondary leading-relaxed">
                Older adults experiencing falls, balance difficulties, reduced
                mobility, or a lack of confidence in movement
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How Physiotherapy Can Help Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 to-third/10">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair text-black mb-6">
              How Physiotherapy Can Help
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-third mx-auto mb-8"></div>
            <p className="text-lg text-secondary max-w-3xl mx-auto">
              Each home visit is tailored to you, but may include:
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Full Assessment",
                description:
                  "A full assessment of your movement, strength, balance, and function",
                icon: "📊",
              },
              {
                title: "Personalised Programme",
                description:
                  "A personalised exercise and rehabilitation programme",
                icon: "🎯",
              },
              {
                title: "Symptom Management",
                description:
                  "Strategies to help manage spasticity, weakness, or fatigue",
                icon: "⚡",
              },
              {
                title: "Practical Guidance",
                description:
                  "Practical guidance on choosing and using walking aids, and safe ways of moving or transferring",
                icon: "🦯",
              },
              {
                title: "Stamina Building",
                description:
                  "Exercises to build stamina and confidence in daily life",
                icon: "💪",
              },
              {
                title: "Falls Prevention",
                description:
                  "Falls prevention strategies and exercises to improve balance and stability",
                icon: "🛡️",
              },
              {
                title: "Carer Support",
                description: "Advice and support for carers and family members",
                icon: "👨‍👩‍👧‍👦",
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl shadow-lg border border-primary/10"
              >
                <div className="text-3xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-playfair text-black mb-3">
                  {service.title}
                </h3>
                <p className="text-secondary leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
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
              Our Physiotherapy Services
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-third mx-auto mb-8"></div>
            <p className="text-lg text-secondary max-w-3xl mx-auto">
              Comprehensive physiotherapy services tailored to your individual
              needs and rehabilitation goals.
            </p>
          </motion.div>

          <div className="space-y-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 * index }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl border border-primary/10 overflow-hidden shadow-lg"
              >
                <div className="grid md:grid-cols-3 gap-0">
                  {/* Service Image */}
                  <div className="relative h-64 md:h-full">
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 space-y-2">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-500 text-white block">
                        Specialist
                      </span>
                      {service.homeVisits && (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-500 text-white block">
                          Home Visits
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="md:col-span-2 p-8">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-playfair text-black mb-2">
                          {service.name}
                        </h3>
                        <p className="text-secondary leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      {/* Service Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-primary/5 p-4 rounded-xl">
                          <div className="text-sm text-secondary mb-1">
                            Session Duration
                          </div>
                          <div className="font-semibold text-black">
                            {service.duration}
                          </div>
                        </div>
                        <div className="bg-third/5 p-4 rounded-xl">
                          <div className="text-sm text-secondary mb-1">
                            Service Type
                          </div>
                          <div className="font-semibold text-black">
                            Specialist Care
                          </div>
                          {service.homeVisits && (
                            <div className="text-sm text-secondary mt-1">
                              + Home Visits
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Booking Button */}
                      <div className="pt-4">
                        <Button
                          href="/contact"
                          variant="primary"
                          className="w-full sm:w-auto"
                        >
                          Book Consultation
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

      {/* Physiotherapy Gallery Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          {/* <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair text-black mb-6">
              Our Physiotherapy Gallery
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-third mx-auto mb-8"></div>
            <p className="text-lg text-secondary max-w-3xl mx-auto">
              Take a look at our physiotherapy sessions and facilities. Each
              image represents our commitment to providing exceptional care and
              support.
            </p>
          </motion.div> */}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {galleryImages.map((imagePath, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                onClick={() => openModal(index)}
              >
                <div className="aspect-square relative">
                  <Image
                    src={imagePath}
                    alt={`Physiotherapy session ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-secondary text-lg mb-6">
              Every image tells a story of care, dedication, and progress in our
              physiotherapy practice.
            </p>
            <Button href="/contact" variant="primary">
              Book Your Session
            </Button>
          </motion.div>
        </div>
      </section>

      {/* What to Expect Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-playfair text-black mb-6">
              What to Expect
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-third mx-auto mb-8"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: "Initial Assessment",
                description:
                  "Comprehensive evaluation of your condition, medical history, and treatment goals.",
                icon: "📋",
              },
              {
                title: "Personalised Treatment",
                description:
                  "Tailored treatment plan designed specifically for your needs and recovery objectives.",
                icon: "🎯",
              },
              {
                title: "Ongoing Support",
                description:
                  "Continuous monitoring of progress with adjustments to your treatment plan as needed.",
                icon: "📈",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-primary/5 to-third/5 p-6 rounded-2xl shadow-lg text-center"
              >
                <div className="text-3xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-playfair text-black mb-3">
                  {step.title}
                </h3>
                <p className="text-secondary leading-relaxed">
                  {step.description}
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
              Ready to Start Your Recovery Journey?
            </h2>
            <p className="text-lg text-secondary max-w-2xl mx-auto">
              Book your physiotherapy consultation today and take the first step
              towards improved mobility, strength, and quality of life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/contact" variant="primary">
                Book Consultation
              </Button>
              <Button href="/contact" variant="secondary">
                Get in Touch
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Full Screen Image Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors duration-200 backdrop-blur-sm"
                aria-label="Close modal"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Navigation Arrows */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  previousImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors duration-200 backdrop-blur-sm"
                aria-label="Previous image"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors duration-200 backdrop-blur-sm"
                aria-label="Next image"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              {/* Image Container */}
              <div className="relative max-w-7xl max-h-full">
                <motion.div
                  key={selectedImageIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <Image
                    src={galleryImages[selectedImageIndex]}
                    alt={`Physiotherapy session ${selectedImageIndex + 1}`}
                    width={1200}
                    height={800}
                    className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                  />
                </motion.div>

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                  {selectedImageIndex + 1} of {galleryImages.length}
                </div>
              </div>

              {/* Keyboard Instructions */}
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-4 py-2 rounded-full text-xs backdrop-blur-sm">
                <span className="hidden sm:inline">
                  Use arrow keys or click arrows to navigate
                </span>
                <span className="sm:hidden">Tap arrows to navigate</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
