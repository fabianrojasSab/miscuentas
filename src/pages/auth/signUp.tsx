import { Button } from "@/components/buttons";
import { Header } from "@/components/header";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/router";

export default function SignUp() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setError(null);
        setLoading(true);

        const form = e.currentTarget;

        const body = {
            name: form.user_name.value.trim(),
            email: form.email.value.trim(),
            password: form.password.value,
            passwordConfirm: form.passwordConfirm.value,
        };

        if (body.password !== body.passwordConfirm) {
            setError("Las contraseñas no coinciden.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(
                    data.error ??
                    "No fue posible crear la cuenta."
                );
                return;
            }

            await router.push("/auth/logIn");
        } catch (err) {
            console.error("Error al registrarse:", err);

            setError(
                "No fue posible crear la cuenta. Por favor, inténtalo nuevamente."
            );
        } finally {
            setLoading(false);
            setTimeout(() => setError(null), 5000);
        }
    }

    return (
        <div className="min-h-screen bg-muted/30">
            <Header />

            <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-10">
                <div className="w-full max-w-md">

                    {/* Encabezado */}
                    <div className="mb-8 text-center">
                        <h1 className="text-4xl font-bold tracking-tight">
                            Crear cuenta
                        </h1>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Regístrate para comenzar a administrar tus finanzas
                        </p>
                    </div>

                    {/* Card */}
                    <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >
                            {/* Nombre */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="user_name"
                                    className="text-sm font-medium"
                                >
                                    Nombre
                                </label>

                                <Input
                                    id="user_name"
                                    name="user_name"
                                    type="text"
                                    placeholder="Tu nombre"
                                    autoComplete="name"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            {/* Correo */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="email"
                                    className="text-sm font-medium"
                                >
                                    Correo electrónico
                                </label>

                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="correo@ejemplo.com"
                                    autoComplete="email"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            {/* Contraseña */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="password"
                                    className="text-sm font-medium"
                                >
                                    Contraseña
                                </label>

                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Ingresa una contraseña"
                                    autoComplete="new-password"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            {/* Confirmar contraseña */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="passwordConfirm"
                                    className="text-sm font-medium"
                                >
                                    Confirmar contraseña
                                </label>

                                <Input
                                    id="passwordConfirm"
                                    name="passwordConfirm"
                                    type="password"
                                    placeholder="Repite tu contraseña"
                                    autoComplete="new-password"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            {/* Error */}
                            {error && (
                                <div
                                    role="alert"
                                    className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                                >
                                    {error}
                                </div>
                            )}

                            {/* Botón */}
                            <Button
                                type="submit"
                                disabled={loading}
                                variant="default"
                            >
                                {loading
                                    ? "Creando cuenta..."
                                    : "Crear cuenta"}
                            </Button>
                        </form>

                        {/* Login */}
                        <div className="mt-6 border-t pt-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                ¿Ya tienes una cuenta?
                            </p>

                            <Button
                                type="button"
                                variant="color"
                                disabled={loading}
                                onClick={() => router.push("/auth/logIn")}
                                className="mt-1"
                            >
                                Iniciar sesión
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}