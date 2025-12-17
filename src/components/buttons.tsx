import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { SocialIcon, socialIcons } from "./SocialIcon";
import Link from "next/link";

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

type CommonProps = VariantProps<typeof buttonVariants> & {
    iconType?: SocialIconType;
    className?: string;
    children?: React.ReactNode;
};

type ButtonAsButton = CommonProps &
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never; // 👈 si es button, NO href
};

type ButtonAsAnchor = CommonProps &
    React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string; // 👈 si hay href, es anchor
};

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

function Button(props: ButtonProps) {
    const { className, variant, size, iconType = "none", children } = props;
    
    const showIcon = iconType !== "none";
    const IconComponent =
        showIcon && iconType in socialIcons
            ? socialIcons[iconType as keyof typeof socialIcons]
            : null;

    const classes = cn(buttonVariants({ variant, size, iconType }), className);

    if ("href" in props) {
        const { href, ...rest } = props;
        return (
        <Link href={href} data-slot="button" className={classes} {...rest}>
            {IconComponent && <IconComponent className="h-4 w-4" />}
            {children}
        </Link>
        );
    }

    const { ...rest } = props;
    return (
        <button
        data-slot="button"
        className={classes}
        {...rest}
        >
        {IconComponent && <IconComponent className="h-4 w-4" />}
        {children}
        </button>
    );
}

export { Button, buttonVariants }