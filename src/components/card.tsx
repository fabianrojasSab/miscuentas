import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "./buttons"

type CoffeeCardVariant = "vertical" | "horizontal"

interface CoffeeCardProps {
    name: string
    description: string | null
    price: number | null
    imageSrc: string
    buttonHref: string
    variant?: CoffeeCardVariant
}

export function CoffeeCard({
    name,
    description,
    price,
    imageSrc,
    buttonHref,
    variant = "vertical",
}: CoffeeCardProps) {
    const isVertical = variant === "vertical"

    return (
        <div
        className={cn(
            "rounded-2xl bg-white shadow-xl shadow-black/10 overflow-hidden",
            "transition-transform hover:-translate-y-1 hover:shadow-xl",
            isVertical
            ? "w-[220px] flex flex-col items-stretch p-4 bg-[#efe7ff]"
            : "w-full max-w-3xl flex items-stretch bg-white p-3"
        )}
        >
        {/* Imagen */}
        <div
            className={cn(
            "relative overflow-hidden",
            isVertical
                ? "w-full h-32 rounded-2xl mb-3"
                : "w-40 h-28 rounded-2xl mr-4"
            )}
        >
            <Image
            src={imageSrc}
            alt={name}
            fill
            className="object-cover"
            />
        </div>

        {/* Contenido */}
        <div
            className={cn(
            "flex flex-col justify-between",
            isVertical ? "flex-1" : "flex-1 pr-4"
            )}
        >
            <div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
                {name}
            </h3>
            <p className="text-xs text-gray-600 leading-snug mb-3 line-clamp-4">
                {description}
            </p>
            </div>

            <div
            className={cn(
                "flex items-center",
                isVertical ? "justify-center mb-3" : "justify-between"
            )}
            >
            <span className="text-sm font-semibold text-[#ff4b5c]">
                ${" "}{price}
            </span>
            </div>

            <Button href={buttonHref} variant={"color"}> Comprar </Button>
        </div>
        </div>
    )
}
