import { Button } from "@/components/buttons";
import { Header } from "@/components/header";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/router";

export default function LogIn() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setError(null);
        setLoading(true);

        const form = e.currentTarget;

        const body = {
            email: form.email.value.trim(),
            password: form.password.value,
        };

        try {
            const res = await fetch("/api/login", {
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
                    "El correo o la contraseña son incorrectos."
                );
                return;
            }

            if (data.user.sw_admin === 1) {
                await router.push("/admin/dashboard");
                return;
            }

            if (data.user.needsOnboarding === true) {
                await router.push("/user/onboarding");
                return;
            }

            await router.push("/user/dashboard");
        } catch (err) {
            console.error("Error al iniciar sesión:", err);

            setError(
                "No fue posible iniciar sesión. Por favor, inténtalo nuevamente."
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
                            Iniciar sesión
                        </h1>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Ingresa a tu cuenta para continuar
                        </p>
                    </div>

                    {/* Card */}
                    <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >
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
                                    placeholder="Ingresa tu contraseña"
                                    autoComplete="current-password"
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
                                {loading ? "Ingresando..." : "Ingresar"}
                            </Button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}