import { Search } from "lucide-react";

export default function Hero() {
    return (
        <section
        id="section_1"
        className="flex min-h-[600px] items-center justify-center section-overlay px-4 pt-20"
        >
        <div className="mx-auto w-full max-w-4xl text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Tu dinero, bajo control
            </h1>

            <p className="mt-4 text-lg text-white/90">
                Administra tus ingresos, gastos y períodos financieros en un solo lugar. Lleva un mejor control de tus finanzas personales y toma decisiones con mayor claridad.

                Registra. Organiza. Analiza.
            </p>

        </div>
        </section>
    );
}