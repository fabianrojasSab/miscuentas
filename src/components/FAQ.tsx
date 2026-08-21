"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "¿Qué puedo hacer con la aplicación?",
    answer:
      "Puedes registrar y administrar tus ingresos y gastos, organizarlos mediante categorías y llevar un control de tu información financiera por diferentes períodos, como años, meses, semanas o días.",
  },
  {
    question: "¿Cómo se organizan mis gastos?",
    answer:
      "Los gastos pueden clasificarse por categorías y tipos, permitiéndote mantener una mejor organización. Además, puedes consultar y gestionar los gastos correspondientes a cada período financiero.",
  },
  {
    question: "¿Puedo consultar mis movimientos anteriores?",
    answer:
      "Sí. La aplicación permite consultar los registros de ingresos y gastos que hayas creado, facilitando el seguimiento de tus movimientos y el análisis de tu información financiera.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="section_4" className="px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-bold text-slate-800">
          Preguntas frecuentes
        </h2>

        <div className="mt-10 grid items-center gap-12 lg:grid-cols-2">
          
          <div className="relative h-80 lg:h-[450px]">
            <Image
              src="/images/faq_graphic.jpg"
              alt="Frequently Asked Questions"
              fill
              className="object-contain"
            />
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={faq.question}
                className="overflow-hidden rounded-xl border border-slate-200"
              >
                <button
                  onClick={() =>
                    setOpen(open === index ? null : index)
                  }
                  className="flex w-full items-center justify-between p-5 text-left font-semibold text-slate-800"
                >
                  {faq.question}

                  <ChevronDown
                    className={`transition ${
                      open === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {open === index && (
                  <div className="border-t border-slate-200 p-5 text-slate-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}