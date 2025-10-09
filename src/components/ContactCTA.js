import Button from "@/components/Button";

export default function ContactCTA() {
  return (
    <section className="py-24 bg-black text-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold font-playfair text-white">
            Ready to Get Inked?
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            Interested in bringing your tattoo vision to life? Get in touch to
            discuss custom designs, bookings, and collaborations. Whether you
            have a specific idea or need creative guidance, let's create
            something extraordinary together.
          </p>
          <div className="pt-6">
            <Button
              href="/contact"
              variant="secondary"
              className="!border-[3px] !rounded-none !shadow-none hover:!shadow-none"
              showArrow={false}
            >
              Contact Me
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
