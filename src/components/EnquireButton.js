"use client";

import { EMAIL_ADDRESS } from "../constants";
import Button from "./Button";

const EnquireButton = ({ product }) => {
  const handleEnquire = (e) => {
    e.stopPropagation();
    const subject = `Enquiry for ${product.name}`;
    const body = `Hello,\n\nI am interested in the following piece:\n\nPiece: ${product.name}\nPrice: £${product.price}\n\nPlease provide more information about availability and ordering process.\n\nBest regards,`;
    window.location.href = `mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <Button onClick={handleEnquire} className="text-sm md:text-base lg:text-lg">
      Enquire about this piece
    </Button>
  );
};

export default EnquireButton;
