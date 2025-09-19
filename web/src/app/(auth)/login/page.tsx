"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const LoginSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(6, { message: "6 caractères minimum" }),
  rememberMe: z.boolean().optional(),
});

type LoginValues = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    defaultValues: { email: "arthur@gmail.com", password: "motdepasse123", rememberMe: false },
    mode: "onBlur",
  });

  const onSubmit = async (values: LoginValues) => {
    setError(null);
    
    const success = await login(values.email, values.password, values.rememberMe);
    
    if (success) {
      // Redirection vers le dashboard après connexion réussie
      router.push("/dashboard");
    } else {
      setError("Erreur de connexion. Vérifiez vos identifiants.");
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <Image
        src="/images/landscape-nature-art-print-mural-wallpaper.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover -z-10"
      />
      <div className="min-h-[calc(100vh)] flex items-center justify-center px-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
            <CardDescription>Accédez à votre espace Kanban.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md" role="alert">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" autoComplete="email" placeholder="vous@exemple.com" {...register("email")} />
                {errors.email && (
                  <p className="text-sm text-red-600" role="alert">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input id="password" type="password" autoComplete="current-password" placeholder="••••••••" {...register("password")} />
                {errors.password && (
                  <p className="text-sm text-red-600" role="alert">{errors.password.message}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="rememberMe"
                  type="checkbox"
                  className="rounded hover:cursor-pointer border-gray-300"
                  {...register("rememberMe")}
                />
                <Label htmlFor="rememberMe" className="hover:cursor-pointer text-sm font-normal">
                  Rester connecté
                </Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Connexion…" : "Se connecter"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}


