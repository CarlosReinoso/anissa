"use client";
import { motion } from "framer-motion";
import { motion as m } from "framer-motion";

export default function WhyChooseSection() {
  const features = [
    {
      icon: "🧠",
      title: "Specialist Expertise",
      description:
        "Over 10 years' experience as a Specialist Neurological Physiotherapist across NHS and private settings.",
      color: "from-primary to-primary/70",
    },
    {
      icon: "💪",
      title: "Extensive Fitness Background",
      description:
        "16 years teaching Pilates, Yoga, and a wide range of exercise classes, from gentle, modified sessions to high-intensity workouts.",
      color: "from-third to-third/70",
    },
    {
      icon: "🎯",
      title: "Whole-Person Approach",
      description:
        "Blending physiotherapy, Pilates, Yoga, and evidence-based exercise to improve strength, balance, and confidence.",
      color: "from-fourth to-fourth/70",
    },
    {
      icon: "🏠",
      title: "Local & Flexible",
      description:
        "Based in Perthshire, offering home visits, community classes, and online sessions tailored to your needs and location.",
      color: "from-secondary to-secondary/70",
    },
  ];

  return (
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
            Why Choose Embody Perthshire?
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-third mx-auto mb-8"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-primary/30 h-full flex flex-col">
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-playfair text-black mb-4 text-center flex-shrink-0">
                  {feature.title}
                </h3>
                <p className="text-secondary leading-relaxed text-center flex-grow">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-lg text-secondary max-w-3xl mx-auto leading-relaxed">
            From Specialist Neurophysiotherapy to community fitness classes,
            Embody Perthshire is here to help you move better and live more
            actively. Get in touch to book your first appointment or explore the
            timetable to find a class that's right for you.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
