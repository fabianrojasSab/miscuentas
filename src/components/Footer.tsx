import { APP_VERSION } from "@/lib/version";

export function Footer() {
    return (
        <footer className="border-t py-4 text-center text-sm text-muted-foreground">
            <a> © TODOS LOS DERECHOS RESERVADOS - MikeSyn</a>
            <p>Mi Cuenta · Versión {APP_VERSION}</p>
        </footer>
    );
}