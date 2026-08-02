import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQ() {
  const faqs = [
    {
      question: "What is AI SENSE?",
      answer:
        "AI SENSE is an AI-powered Arduino development platform that helps users generate code, learn modules, and develop Arduino UNO projects quickly.",
    },
    {
      question: "Which board does AI SENSE support?",
      answer:
        "Currently AI SENSE is designed specifically for Arduino UNO.",
    },
    {
      question: "Can beginners use AI SENSE?",
      answer:
        "Yes. AI SENSE is built for beginners, students, and professionals.",
    },
    {
      question: "Can AI generate complete Arduino code?",
      answer:
        "Yes. AI SENSE generates complete Arduino sketches based on your prompt.",
    },
    {
      question: "Is AI SENSE free?",
      answer:
        "The basic version is free with core features. Advanced features may be added later.",
    },
  ];

  const [open, setOpen] = useState(null);

  return (
    <section className="bg-slate-900 py-24">

      <div className="max-w-5xl mx-auto px-8">

        <h2 className="text-5xl font-bold text-center text-white">
          Frequently Asked Questions
        </h2>

        <p className="text-center text-gray-400 mt-5">
          Everything you need to know about AI SENSE.
        </p>

        <div className="mt-16 space-y-5">

          {faqs.map((faq, index) => (

            <div
              key={index}
              className="bg-slate-950 rounded-2xl border border-slate-800"
            >

              <button
                onClick={() =>
                  setOpen(open === index ? null : index)
                }
                className="w-full flex justify-between items-center p-6"
              >

                <h3 className="text-xl font-semibold text-white text-left">
                  {faq.question}
                </h3>

                {open === index ? (
                  <ChevronUp className="text-blue-400" />
                ) : (
                  <ChevronDown className="text-blue-400" />
                )}

              </button>

              {open === index && (

                <div className="px-6 pb-6">

                  <p className="text-gray-400">
                    {faq.answer}
                  </p>

                </div>

              )}

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}