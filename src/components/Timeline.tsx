import { Search, Bookmark, BookOpen } from "lucide-react";

const steps = [
  {
    title: "Crea tu cuenta",
    description:
      "Regístrate e inicia sesión para acceder a tu espacio personal.",
    icon: Search,
  },
  {
    title: "Configura tus categorías y gastos",
    description:
      "Organiza los tipos de gastos que deseas controlar según tus necesidades.",
    icon: Bookmark,
  },
  {
    title: "Registra tus ingresos",
    description:
      "Agrega los ingresos que recibes y conserva un historial de cada registro.",
    icon: BookOpen,
  },
  {
    title: "Controla tus gastos por período",
    description:
      "Consulta y administra tus gastos según el período financiero que estés trabajando.",
    icon: BookOpen,
  },
];

export default function Timeline() {
  return (
    <section
      id="section_3"
      className="bg-slate-900 px-4 py-20 text-white"
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold sm:text-4xl">
          Llevar el control de tus finanzas es más sencillo
        </h2>

        <div className="relative mt-16 space-y-12">
          <div className="absolute left-7 top-0 h-full w-px bg-cyan-400 md:left-1/2" />

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className={`relative flex gap-8 md:items-center ${
                  index % 2 === 0
                    ? "md:flex-row"
                    : "md:flex-row-reverse"
                }`}
              >
                <div className="z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-cyan-500">
                  <Icon size={24} />
                </div>

                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur md:w-1/2">
                  <h3 className="text-xl font-bold">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-slate-300">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-300">
            Quieres saber más?
          </p>

          <button className="mt-4 rounded-full border border-white px-6 py-3 font-semibold transition hover:bg-white hover:text-slate-900">
            Inscribete
          </button>
        </div>
      </div>
    </section>
  );
}