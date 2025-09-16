"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import SectionHero from "../../components/SectionHero";
import { EMAIL_ADDRESS } from "../../constants";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
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
    const subject = encodeURIComponent("Contact Form - Embody Perthshire");
    const body = encodeURIComponent(
      `Name: ${formData.name}\nPhone: ${formData.phone}\n\nMessage:\n${formData.message}`
    );
    const mailtoLink = `mailto:${EMAIL_ADDRESS}?subject=${subject}&body=${body}`;

    // Open default mail provider
    window.open(mailtoLink, "_blank");

    // Show success message
    setSubmitStatus("success");
    setFormData({ name: "", phone: "", message: "" });
  };

  return (
    <>
      <SectionHero title="" />

      {/* Main Contact Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 to-third/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-playfair text-black mb-6">
                  Send a Message
                </h3>

                {submitStatus === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-green-600 text-2xl">✓</span>
                    </div>
                    <h4 className="text-xl font-playfair text-black mb-2">
                      Email Ready to Send!
                    </h4>
                    <p className="text-secondary">
                      Your email app should have opened with your message ready
                      to send. Just click send when you're ready!
                    </p>
                    <button
                      onClick={() => setSubmitStatus(null)}
                      className="mt-6 px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/80 transition-colors"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-black font-medium mb-2"
                      >
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                        placeholder="Enter your phone number"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
                        placeholder="Tell me about your needs or ask any questions..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-primary text-white py-4 px-8 rounded-full font-medium text-lg hover:bg-primary/80 transition-colors flex items-center justify-center"
                    >
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-playfair text-black mb-6">
                  Let's Start Your Journey
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-primary to-third mb-8"></div>
                <p className="text-lg text-secondary leading-relaxed mb-6">
                  If you'd like to find out more about neurological
                  physiotherapy, joining a class, or have a question about my
                  services, please get in touch using the form.
                </p>
                <p className="text-lg text-secondary leading-relaxed">
                  Fill in your name, phone number, and message, and I'll respond
                  as soon as possible.
                </p>
              </div>

              {/* Contact Details */}
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-playfair text-black mb-6">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-primary text-xl">📧</span>
                    </div>
                    <div>
                      <p className="text-black font-medium">Email</p>
                      <a
                        href={`mailto:${EMAIL_ADDRESS}`}
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        {EMAIL_ADDRESS}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-third/20 rounded-full flex items-center justify-center">
                      <span className="text-third text-xl">📞</span>
                    </div>
                    <div>
                      <p className="text-black font-medium">Phone</p>
                      <a
                        href="tel:07833516585"
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        07833516585
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Areas */}
              <div className="bg-gradient-to-br from-third/10 to-primary/10 p-8 rounded-2xl border border-third/20">
                <h3 className="text-xl font-playfair text-black mb-4">
                  Service Areas
                </h3>
                <p className="text-secondary mb-4">
                  Serving clients across Perth and Highland Perthshire. Online
                  sessions are also available.
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="bg-white px-4 py-2 rounded-full shadow-sm">
                    <span className="text-black font-medium text-sm">
                      Perth City
                    </span>
                  </div>
                  <div className="bg-white px-4 py-2 rounded-full shadow-sm">
                    <span className="text-black font-medium text-sm">
                      Highland Perthshire
                    </span>
                  </div>
                  <div className="bg-white px-4 py-2 rounded-full shadow-sm">
                    <span className="text-black font-medium text-sm">
                      Online Sessions
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Additional Information Section */}
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

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "📞",
                title: "Quick Response",
                description:
                  "I aim to respond to all messages within 24 hours during business days.",
              },
              {
                icon: "🏠",
                title: "Home Visits",
                description:
                  "Convenient home visits available across Perth and Highland Perthshire.",
              },
              {
                icon: "💻",
                title: "Online Sessions",
                description:
                  "Virtual consultations available for those who prefer remote sessions.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                viewport={{ once: true }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-third/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <h3 className="text-xl font-playfair text-black mb-3">
                  {item.title}
                </h3>
                <p className="text-secondary leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
