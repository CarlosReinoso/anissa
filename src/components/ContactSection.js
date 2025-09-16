"use client";
import { motion } from "framer-motion";
import Button from "./Button";

export default function ContactSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary/20 to-third/20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair text-black mb-6">
            Ready to Start Your Journey?
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-third mx-auto mb-8"></div>
          <p className="text-lg text-secondary leading-relaxed max-w-2xl mx-auto">
            Take the first step towards better movement, strength, and
            confidence. I'm here to support you every step of the way.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <Button
            href="/contact"
            variant="primary"
            className="text-lg px-8 py-4"
          >
            Book Your First Appointment
          </Button>
          <Button
            href="/classes"
            variant="secondary"
            className="text-lg px-8 py-4"
          >
            View Class Timetable
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 p-8 bg-white rounded-2xl shadow-lg"
        >
          <h3 className="text-xl font-playfair text-black mb-4">
            Get in Touch
          </h3>
          <p className="text-secondary mb-6">
            Based in Perthshire • Home visits available • Online sessions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact" variant="outline">
              Send Message
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
