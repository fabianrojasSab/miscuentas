import Image from "next/image";
import { Button } from "./buttons";

export default function FeaturedTopics() {
  return (
    <section className="bg-secondary px-4 py-16">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
        
        {/* Card Web Design */}
        <article className="overflow-hidden rounded-3xl bg-white p-6 shadow-lg transition hover:-translate-y-1">
          <div className="flex justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                Miz cuentas
              </h3>

              <p className="mt-2 text-slate-600">
                Toma el control de tus finanzas.
              </p>
            </div>
          </div>

          <div className="relative mt-6 h-56">
            <Image
              src="/images/topics/img_featured_topics.png"
              alt="Web Design"
              fill
              className="object-contain"
            />
          </div>
        </article>

        {/* Finance */}
        <article className="relative col-span-1 overflow-hidden rounded-3xl lg:col-span-2">
          <div className="relative min-h-[400px]">
            <Image
              src="/images/img2_featured_topics.jpg"
              alt="Finance"
              fill
              className="object-cover"
            />

            <div className="absolute inset-0 bg-black/50" />

            <div className="absolute inset-0 flex flex-col justify-between p-8">
              <div className="max-w-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      Empieza a organizar tus finanzas hoy
                    </h3>

                    <p className="mt-4 mb-4 text-white/90">
                      No necesitas procesos complicados para comenzar a tener un mejor control de tu dinero. Registra tus ingresos, organiza tus gastos y consulta tu información financiera desde un mismo lugar.
                    </p>

                    <Button href="/auth/logIn" size={"lg"}>
                      !Comenzar¡
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between text-white">
                <button>🔖</button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}