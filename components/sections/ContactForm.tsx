"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, AlertCircle, Loader2, User, Mail, MessageSquare, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import axios from "axios";

const contactSchema = z.object({
    name: z.string().min(3, "Nama minimal 3 karakter"),
    email: z.string().email("Format email tidak valid"),
    subject: z.string().min(5, "Subjek minimal 5 karakter"),
    message: z.string().min(10, "Pesan minimal 10 karakter"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await axios.post("/api/contact", data);
            setIsSuccess(true);
            reset();
        } catch (err: any) {
            setError(err.response?.data?.error || "Terjadi kesalahan. Silakan coba lagi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[3rem] p-12 text-center shadow-2xl border border-emerald-100 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 -z-10" />
                <div className="flex justify-center mb-6">
                    <div className="h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                    </div>
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Pesan Terkirim!</h3>
                <p className="text-slate-500 font-medium mb-8 max-w-sm mx-auto">
                    Terima kasih telah menghubungi kami. Tim Gramedia Mitra Edukasi akan segera merespons pesan Anda melalui email.
                </p>
                <Button
                    onClick={() => setIsSuccess(false)}
                    variant="outline"
                    className="rounded-2xl px-8 border-slate-200 hover:bg-slate-50 font-bold"
                >
                    Kirim Pesan Lain
                </Button>
            </motion.div>
        );
    }

    return (
        <Card className="rounded-[3rem] bg-white p-8 md:p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 blur-[100px] -z-10" />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <User className="h-3 w-3" /> Nama Lengkap
                        </label>
                        <div className="relative">
                            <Input
                                {...register("name")}
                                placeholder="Masukkan nama Anda"
                                className={`h-14 rounded-2xl bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-blue-600/20 font-medium transition-all ${errors.name ? 'ring-2 ring-red-500/20' : ''}`}
                            />
                            {errors.name && <p className="text-xs font-bold text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.name.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Mail className="h-3 w-3" /> Alamat Email
                        </label>
                        <div className="relative">
                            <Input
                                {...register("email")}
                                type="email"
                                placeholder="email@contoh.com"
                                className={`h-14 rounded-2xl bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-blue-600/20 font-medium transition-all ${errors.email ? 'ring-2 ring-red-500/20' : ''}`}
                            />
                            {errors.email && <p className="text-xs font-bold text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.email.message}</p>}
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Tag className="h-3 w-3" /> Subjek Pesan
                    </label>
                    <div className="relative">
                        <Input
                            {...register("subject")}
                            placeholder="Apa yang ingin Anda tanyakan?"
                            className={`h-14 rounded-2xl bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-blue-600/20 font-medium transition-all ${errors.subject ? 'ring-2 ring-red-500/20' : ''}`}
                        />
                        {errors.subject && <p className="text-xs font-bold text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.subject.message}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <MessageSquare className="h-3 w-3" /> Pesan Anda
                    </label>
                    <div className="relative">
                        <textarea
                            {...register("message")}
                            placeholder="Tuliskan pesan Anda secara detail..."
                            rows={5}
                            className={`w-full p-6 rounded-[2rem] bg-slate-50 border-none focus:outline-none focus:ring-2 focus:ring-blue-600/20 font-medium transition-all resize-none ${errors.message ? 'ring-2 ring-red-500/20' : ''}`}
                        />
                        {errors.message && <p className="text-xs font-bold text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.message.message}</p>}
                    </div>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-sm font-bold"
                        >
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-16 rounded-[1.5rem] bg-[#1E4198] hover:bg-[#F58220] transition-all duration-500 font-black text-lg shadow-xl shadow-blue-500/20 group relative overflow-hidden"
                >
                    {isSubmitting ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                        <>
                            <span className="relative z-10 flex items-center gap-2">
                                Kirim Pesan
                                <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </span>
                        </>
                    )}
                </Button>
            </form>
        </Card>
    );
}
