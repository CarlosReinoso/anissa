"use client";

import Image from "next/image";
import Button from "./Button";

export default function About() {
  return (
    <section className="py-12 flex flex-col md:flex-row items-center max-w-5xl mx-auto gap-12 px-4">
      <div>
        <Image
          src="/about-homepage.jpg"
          // src="/testy.jpg"
          alt="About Mariella"
          width={320}
          height={400}
          className="rounded shadow w-full h-auto"
        />
      </div>
      <div>
        <h3 className="mb-12">Welcome...</h3>
        <p className="mb-2">
          ...to Taliswoman, where every piece of jewellery is lovingly crafted
          to bring a touch of magic and joy into your life.
        </p>
        <p className="mb-2">
          Founded by Mariella, Taliswoman is inspired by a passion for
          creativity, healing, and the belief that objects can act as containers
          for hopes and prayers.
        </p>
        <p className="">
          Each piece, intuitively designed and hand-made, is charged with a
          unique healing intention. Enjoy browsing the unique creations – you'll
          discover pieces of jewellery that, literally, work like a charm.
        </p>
        <div>
          <Button href="/about" className="mt-6">
            Discover More
          </Button>
        </div>
      </div>
    </section>
  );
}
