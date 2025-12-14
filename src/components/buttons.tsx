import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { SocialIcon, socialIcons } from "./SocialIcon";

type SocialIconType = keyof typeof socialIcons | "none";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium mr-4 inline-flex items-center",
    {
        variants: {
            variant: {
                default: "rounded-full bg-primary px-4 py-2 text-primary-foreground shadow-lg hover:bg-primary/90",
                transparent: "bg-transparent hover:bg-accent/10 text-foreground",
                color: "rounded-md bg-surface-color px-4 py-2 text-surface-color-foreground shadow-lg hover:bg-primary/90",
                icon: "rounded-md bg-surface-color px-4 py-2 text-surface-color-foreground shadow-lg hover:bg-primary/90",
            },
            size: {
                default: "h-9 px-4 py-2 has-[>svg]:px-3",
                sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
                lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
                icon: "size-9",
                "icon-sm": "size-8",
                "icon-lg": "size-10",
            },
            iconType: {
                facebook: "",
                whatsapp: "",
                youtube: "",
                none: ""
            },
        },
        defaultVariants: {
        variant: "default",
        size: "default",
        iconType: "none",
        },
    }
)

type ButtonProps = (
    | React.ButtonHTMLAttributes<HTMLButtonElement>
    | React.AnchorHTMLAttributes<HTMLAnchorElement>
    ) &
    VariantProps<typeof buttonVariants> & {
        href?: string;
        iconType?: SocialIconType;
    };


function Button({
    className,
    variant,
    size,
    href,
    iconType = "none",
    children,
    ...props
}: ButtonProps) {
    const Comp: "a" | "button" = href ? "a" : "button";
    
    const showIcon = iconType !== "none";
    const IconComponent =
    showIcon && iconType in socialIcons
        ? socialIcons[iconType as keyof typeof socialIcons]
        : null;

    return (
    <Comp
        href={href}
        data-slot="button"
        className={cn(buttonVariants({ variant, size, iconType }), className)}
        >
        {IconComponent && <IconComponent className="h-4 w-4" />}
        {children}
    </Comp>
    )
}

export { Button, buttonVariants }