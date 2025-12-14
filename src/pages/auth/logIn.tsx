import { Button } from "@/components/buttons";
import { Header } from "@/components/header";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogIn() {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const form = e.currentTarget;
        const body = {
            email: form.email.value,
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
                setError(data.error);
                return;
            }

            localStorage.setItem("user", JSON.stringify(data.user));

            if(data.user.sw_admin === 1){
                router.push("/admin/dashboard");
            }else{
                router.push("/user/dashboard");
            }

        } catch (err) {
            setError("Error al iniciar sesión. Por favor, inténtalo de nuevo.");
            setTimeout(() => setError(null), 5000);
            form.reset();
        }
    }

    return (
        <div>
            <Header />
            <div className="relative z-10 w-[45%] flex flex-col justify-center items-center px-16">
                <h1 className="text-5xl font-bold text-gray-900 mb-10">Iniciar sesion</h1>
                <form onSubmit={handleSubmit}>
                    <Input type="email" name="email" placeholder="Correo electronico" className="mb-4"/>
                    <Input type="password" name="password" placeholder="Contraseña" className="mb-4"/>

                    {error && (
                        <p className="text-red-600 text-center">{error}</p>
                    )}

                    <Button> Ingresar</Button>
                </form>
            </div>
        </div>
    )
}