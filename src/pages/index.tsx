import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/header";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedTopics from "@/components/FeaturedTopics";
import BrowseTopics from "@/components/BrowseTopics";
import Timeline from "@/components/Timeline";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";

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
    <main>
      <Navbar />
      <Hero />
      <FeaturedTopics />
      <BrowseTopics />
      <Timeline />
      <FAQ />
      <Contact />
    </main>
  );
}
