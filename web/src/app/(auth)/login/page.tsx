"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const LoginSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(6, { message: "6 caractères minimum" }),
});

type LoginValues = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  const onSubmit = async (values: LoginValues) => {
    setIsLoading(true);
    const parsed = LoginSchema.safeParse(values);
    if (!parsed.success) {
      setIsLoading(false);
      return;
    }
    await new Promise((r) => setTimeout(r, 600));
    setIsLoading(false);
    console.log("login:", parsed.data);
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


