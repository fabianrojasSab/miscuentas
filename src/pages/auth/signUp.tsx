import { Button } from "@/components/buttons";
import { Header } from "@/components/header";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUp() {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        const form = e.currentTarget;

        const body = {
            name: form.name.value,
            email: form.email.value,
            password: form.password.value,
            passwordConfirm: form.passwordConfirm.value,
        };

        const res = await fetch("/api/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const data = await res.json();
            setError(data.error);
            return;
        }

        router.push("/auth/logIn");
    }

    return (
        <div>
            <Header />
            <div className="relative z-10 w-[45%] flex flex-col justify-center items-center px-16">
                <h1 className="text-5xl font-bold text-gray-900 mb-10">Registrarse</h1>
                <form onSubmit={handleSubmit}>
                    <Input type="text" name="name" placeholder="Nombre completo" className="mb-4"/>
                    <Input type="email" name="email" placeholder="Correo electronico" className="mb-4"/>
                    <Input type="password" name="password" placeholder="Contraseña" className="mb-4"/>
                    <Input type="password" name="passwordConfirm" placeholder="Confirmar contraseña" className="mb-4"/>
                    
                    {error && (
                        <p className="text-red-600 text-center">{error}</p>
                    )}
        
                    <Button type="submit"> Registrarse</Button>
                </form>
            </div>
        </div>
    )
}