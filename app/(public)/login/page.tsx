"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const AdminLoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError(res.error);
            } else {
                router.push("/dashboard");
                router.refresh();
            }
        } catch (err) {
            setError("Terjadi kesalahan sistem.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <div className="relative h-12 w-48 mx-auto mb-8">
                        <Image src="/images/LOGO/LOGO GMEI (1).png" alt="Gramedia" fill className="object-contain" priority />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Admin Portal</h1>
                    <p className="text-slate-500 text-sm">Silakan login untuk mengelola konten website.</p>
                </div>

                <Card className="rounded-[2rem] border-slate-100 shadow-xl overflow-hidden bg-white">
                    <CardHeader className="bg-slate-900 text-white p-8">
                        <CardTitle className="text-xl">Login Administrator</CardTitle>
                        <CardDescription className="text-slate-400">Masukkan kredensial Anda untuk melanjutkan</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <CardContent className="p-8 space-y-6">
                            {error && (
                                <div className="p-3 bg-red-50 text-red-500 rounded-xl text-sm font-medium border border-red-100">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="admin@gramedia-mitra.co.id"
                                        className="pl-10 rounded-xl"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="••••••••"
                                        className="pl-10 pr-10 rounded-xl"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="remember" />
                                <label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Ingat perangkat ini
                                </label>
                            </div>
                        </CardContent>
                        <CardFooter className="p-8 pt-0">
                            <Button disabled={isLoading} type="submit" className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 h-12 text-sm font-bold tracking-wide">
                                {isLoading ? "MEMPROSES..." : "MASUK KE DASHBOARD"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                <p className="text-center text-xs text-slate-400">
                    © {new Date().getFullYear()} PT Gramedia Mitra Edukasi Indonesia. Seluruh hak cipta dilindungi.
                </p>
            </div>
        </div>
    );
};

export default AdminLoginPage;
