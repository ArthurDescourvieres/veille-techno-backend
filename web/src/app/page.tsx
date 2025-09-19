"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="mt-2 text-white">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans bg-black grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Bienvenue sur Kanban Platform
          </h1>
          <p className="text-lg text-white mb-8">
            Gérez vos projets avec notre plateforme Kanban moderne
          </p>
          <div>
            <a href="/login">
              <Button size="lg" className="bg-white text-black hover:bg-white/90">
                Se connecter
              </Button>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
