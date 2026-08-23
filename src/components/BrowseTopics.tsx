"use client";

import { useState } from "react";
import Image from "next/image";

type Topic = {
  title: string;
  description: string;
  image: string;
};

const topics: Record<string, Topic[]> = {
  Beneficios: [
    {
      title: "Registra tus ingresos",
      description: "Guarda y consulta todos tus ingresos de forma organizada. Mantén un historial de tus movimientos y conoce mejor el dinero que recibes.",
      image: "/images/topics/img1_browse_topics.png",
    },
    {
      title: "Controla tus gastos",
      description: "Registra tus gastos y clasifícalos por categorías para identificar fácilmente en qué estás utilizando tu dinero.",
      image: "/images/topics/img2_browse_topics.png",
    },
    {
      title: "Organiza tus períodos",
      description: "Gestiona tu información financiera por años, meses, semanas o días para tener un control más detallado de cada período.",
      image: "/images/topics/img3_browse_topics.png",
    },
    {
      title: "Conoce tu estado financiero",
      description: "Consulta la información de tus ingresos y gastos para comprender mejor tu situación financiera y mantener un mayor control sobre tu presupuesto.",
      image: "/images/topics/img4_browse_topics.png",
    },
  ],

};

export default function BrowseTopics() {
  const [activeTab, setActiveTab] = useState("Beneficios");

  return (
    <section id="section_2" className="px-4 py-20">
      <div className="mx-auto max-w-7xl">
        
        <h2 className="text-center text-3xl font-bold text-slate-800 sm:text-4xl">
          Todo lo que necesitas para gestionar tus finanzas
        </h2>

        {/* Tabs */}
        <div className="mt-10 flex justify-center overflow-x-auto">
          <div className="flex min-w-max gap-6 border-b">
            {Object.keys(topics).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`border-b-2 px-4 py-3 font-medium transition ${
                  activeTab === tab
                    ? "border-cyan-500 text-cyan-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {topics[activeTab].map((topic) => (
            <article
              key={topic.title}
              className="group overflow-hidden rounded-3xl bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    {topic.title}
                  </h3>

                  <p className="mt-2 text-slate-500">
                    {topic.description}
                  </p>
                </div>
              </div>

              <div className="relative mt-6 h-48">
                <Image
                  src={topic.image}
                  alt={topic.title}
                  fill
                  className="object-contain transition duration-300 group-hover:scale-105"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}