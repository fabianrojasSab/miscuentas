import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/header";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
      (async () => {
          const res = await fetch("/api/me");
          const data = await res.json();
          setUser(data.user);
          if (data.user){
            if(data.user.needsOnboarding === true){
              router.push("/user/onboarding");
            }else{
              router.push("/user/dashboard");
            }
          }
      })();
  }, []);

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} flex min-h-screen items-center justify-center bg-background font-sans`}
    >
      <main>
        <Header />
        <div className="flex h-screen w-screen items-center flex-col">
        </div>
      </main>
    </div>
  );
}
