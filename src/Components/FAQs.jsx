import { useState } from "react";

const faqs = [
  {
    question: "What makes this service different from Urban Company or TaskRabbit?",
    answer:
      "Unlike traditional home service platforms, we provide ultra-fast, on-demand services with real-time tracking, ensuring help arrives in minutes. We also empower independent service professionals instead of relying on company-employed workers.",
  },
  {
    question: "Can I track my service provider in real time?",
    answer:
      "Absolutely! Just like food delivery tracking, you can see the exact location of your assigned technician on a live map, along with their estimated arrival time.",
  },
  {
    question: "How does the 10-minute service concept work?",
    answer:
      "We connect you to the nearest available service provider using smart job allocation and optimized routing, ensuring minimal wait time. Our goal is to get a technician to your doorstep within 10 minutes for urgent repairs.",
  },
  {
    question: "How are service professionals rated?",
    answer:
      "Every provider is rated by customers after each service based on punctuality, quality, and professionalism. This ensures that only the best-rated professionals continue to serve customers.",
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 -mt-50 mb-10">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
        Frequently Asked Questions
      </h2>
      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-300">
            <button
              onClick={() => toggleFAQ(index)}
              aria-expanded={openIndex === index}
              aria-controls={`faq-content-${index}`}
              className="w-full flex justify-between items-center py-4 text-gray-900 text-lg font-medium focus:outline-none transition-all duration-300"
            >
              <span>{faq.question}</span>
              <span className="text-gray-600 text-2xl">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>
            <div
              id={`faq-content-${index}`}
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="pb-4 text-gray-700 text-left text-sm">
                {faq.answer.split("\n").map((line, i) => (
                  <p key={i} className="mb-2">{line}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
