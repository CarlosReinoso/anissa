"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { EMAIL_ADDRESS } from "../../constants";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create mailto link with prepopulated information
    const subject = encodeURIComponent("Commission Inquiry - Anissa Aouar");
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    const mailtoLink = `mailto:${EMAIL_ADDRESS}?subject=${subject}&body=${body}`;

    // Open default mail provider
    window.location.href = mailtoLink;

    // Show success message
    setSubmitStatus("success");
    setTimeout(() => {
      setFormData({ name: "", email: "", message: "" });
    }, 500);
  };

  return (
    <div className="bg-white text-black pt-20">
      {/* Main Contact Section */}
      <section className="py-16 md:py-24 mt-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
                  Let's Create Together
                </h1>
                <div className="w-24 h-1 bg-black mb-8"></div>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Whether you're interested in commissioning a custom
                  illustration, booking a tattoo session, or collaborating on a
                  creative project, I'd love to hear from you.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Fill in your details and message, and I'll get back to you as
                  soon as possible.
                </p>
              </div>

              {/* Contact Details */}
              <div className="bg-gray-50 p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-black mb-6">
                  Contact Information
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xl">✉️</span>
                    </div>
                    <div>
                      <p className="text-black font-medium mb-1">Email</p>
                      <a
                        href={`mailto:${EMAIL_ADDRESS}`}
                        className="text-gray-700 hover:text-black transition-colors break-all"
                      >
                        {EMAIL_ADDRESS}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <div className="text-3xl mb-3">🎨</div>
                  <h4 className="font-bold text-black mb-2">Illustrations</h4>
                  <p className="text-sm text-gray-600">
                    Custom artwork & commissions
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <div className="text-3xl mb-3">✨</div>
                  <h4 className="font-bold text-black mb-2">Tattoos</h4>
                  <p className="text-sm text-gray-600">Unique tattoo designs</p>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h2 className="text-2xl font-bold text-black mb-6">
                  Send a Message
                </h2>

                {submitStatus === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-green-600 text-2xl">✓</span>
                    </div>
                    <h3 className="text-xl font-bold text-black mb-2">
                      Email Ready to Send!
                    </h3>
                    <p className="text-gray-600">
                      Your email app should have opened with your message ready
                      to send. Just click send when you're ready!
                    </p>
                    <button
                      onClick={() => setSubmitStatus(null)}
                      className="mt-6 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-black font-medium mb-2"
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-black font-medium mb-2"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors"
                        placeholder="Enter your email address"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-black font-medium mb-2"
                      >
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors resize-none"
                        placeholder="Tell me about your project or ask any questions..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-black text-white py-4 px-8 rounded-full font-medium text-lg hover:bg-gray-800 transition-colors flex items-center justify-center"
                    >
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Additional Information Section */}
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
              How It Works
            </h2>
            <div className="w-24 h-1 bg-black mx-auto mb-8"></div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "💬",
                title: "Get In Touch",
                description:
                  "Send me a message with your project details, ideas, or questions. The more details you provide, the better!",
              },
              {
                icon: "🎨",
                title: "Discuss Your Vision",
                description:
                  "We'll discuss your concept, timeline, budget, and any specific requirements you have in mind.",
              },
              {
                icon: "✨",
                title: "Bring It To Life",
                description:
                  "Once we're aligned, I'll begin creating your custom artwork or preparing for your tattoo session.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-black mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
