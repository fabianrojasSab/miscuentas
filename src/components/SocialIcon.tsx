import { BsWhatsapp } from "react-icons/bs";
import { cn } from "@/lib/utils";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";

interface SocialIconProps {
    type: "whatsapp" | "instagram" | "twitter"; // Aqui se pueden agregar mas tipos de iconos
    href: string;
    className?: string;
}

export const socialIcons = {
    whatsapp: BsWhatsapp,
    instagram: FaInstagram,
    twitter: FaTwitter,
};

export const SocialIcon = ({ type, href, className }: SocialIconProps) => {
    const Icon = socialIcons[type];

    return (
        <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
            "text-foreground/80 hover:text-foreground transition-colors",
            className
        )}
        aria-label={type}
        >
        <Icon className="w-5 h-5" />
        </a>
    );
};
