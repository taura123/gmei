"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit2, Trash2, Users, Shield, ShieldCheck, Eye, EyeOff, X, Mail, User, Clock, Crown } from "lucide-react";

interface UserAccount {
    id: string;
    name: string | null;
    email: string;
    role: string;
    image: string | null;
    createdAt: string;
    updatedAt: string;
}

const ROLES = ["Super Admin", "Admin", "Editor"];

const getRoleIcon = (role: string) => {
    switch (role) {
        case "Super Admin": return <Crown className="h-3.5 w-3.5" />;
        case "Admin": return <ShieldCheck className="h-3.5 w-3.5" />;
        default: return <Shield className="h-3.5 w-3.5" />;
    }
};

const getRoleColor = (role: string) => {
    switch (role) {
        case "Super Admin": return "bg-amber-100 text-amber-700 border-amber-200";
        case "Admin": return "bg-blue-100 text-blue-700 border-blue-200";
        default: return "bg-slate-100 text-slate-600 border-slate-200";
    }
};

const getInitials = (name: string | null, email: string) => {
    if (name) return name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
    return email.substring(0, 2).toUpperCase();
};

const getAvatarColor = (name: string | null, email: string) => {
    const str = name || email;
    const colors = [
        "from-blue-500 to-indigo-600",
        "from-emerald-500 to-teal-600",
        "from-purple-500 to-violet-600",
        "from-orange-500 to-red-600",
        "from-pink-500 to-rose-600",
        "from-cyan-500 to-sky-600",
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
};

export default function UsersClient({ currentUserRole, currentUserEmail }: { currentUserRole: string, currentUserEmail: string }) {
    const [users, setUsers] = useState<UserAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Form
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "Admin",
    });

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/users");
            const data = await res.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setForm({ name: "", email: "", password: "", role: "Admin" });
        setEditingUser(null);
        setError("");
        setShowPassword(false);
    };

    const openAddModal = () => { resetForm(); setShowModal(true); };

    const openEditModal = (user: UserAccount) => {
        setEditingUser(user);
        setForm({
            name: user.name || "",
            email: user.email,
            password: "",
            role: user.role,
        });
        setError("");
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!form.name || !form.email) {
            setError("Nama dan email wajib diisi.");
            return;
        }
        if (!editingUser && !form.password) {
            setError("Password wajib diisi untuk user baru.");
            return;
        }
        if (form.password && form.password.length < 6) {
            setError("Password minimal 6 karakter.");
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            const payload: any = { name: form.name, email: form.email, role: form.role };
            if (form.password) payload.password = form.password;

            if (editingUser) {
                payload.id = editingUser.id;
                const res = await fetch("/api/users", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                const data = await res.json();
                if (!res.ok) { setError(data.error || "Gagal memperbarui user."); return; }
            } else {
                const res = await fetch("/api/users", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                const data = await res.json();
                if (!res.ok) { setError(data.error || "Gagal membuat user."); return; }
            }
            await fetchUsers();
            setShowModal(false);
            resetForm();
        } catch (e) {
            setError("Terjadi kesalahan koneksi.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/users?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                await fetchUsers();
                setDeleteConfirm(null);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const filteredUsers = users.filter(u =>
        (u.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const superAdminCount = users.filter(u => u.role === "Super Admin").length;
    const adminCount = users.filter(u => u.role === "Admin").length;
    const editorCount = users.filter(u => u.role === "Editor").length;

    return (
        <div className="p-8 lg:p-12 space-y-8 max-w-[1600px] mx-auto">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Users className="h-6 w-6 text-blue-600" />
                        Manajemen User
                    </h2>
                    <p className="text-slate-500 text-sm font-medium">Kelola akun pengguna dan hak akses sistem administrasi.</p>
                </div>
                {currentUserRole === "Super Admin" && (
                    <Button
                        onClick={openAddModal}
                        className="rounded-2xl bg-blue-600 hover:bg-blue-700 h-12 px-6 font-bold shadow-xl shadow-blue-500/20 transition-all active:scale-95"
                    >
                        <Plus className="mr-2 h-5 w-5" />
                        TAMBAH USER BARU
                    </Button>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="rounded-2xl border-none shadow-lg bg-white">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                            <Users className="h-6 w-6 text-slate-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-slate-900">{users.length}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total User</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border-none shadow-lg bg-white">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                            <Crown className="h-6 w-6 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-slate-900">{superAdminCount}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Super Admin</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border-none shadow-lg bg-white">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                            <ShieldCheck className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-slate-900">{adminCount}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border-none shadow-lg bg-white">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-green-50 flex items-center justify-center">
                            <Shield className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-slate-900">{editorCount}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Editor</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* User Table */}
            <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/40 overflow-hidden bg-white">
                <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
                        <div className="relative flex-1 w-full max-w-xl">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input
                                placeholder="Cari nama, email, atau role..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="pl-12 h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 font-medium placeholder:text-slate-400"
                            />
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
                            MENAMPILKAN: <span className="text-slate-900">{filteredUsers.length}</span> dari <span className="text-slate-900">{users.length}</span>
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-3xl border border-slate-100">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 text-slate-500">
                                    <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px]">User</th>
                                    <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px]">Email</th>
                                    <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px]">Role</th>
                                    <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px]">Terdaftar</th>
                                    <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px] text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {loading ? (
                                    <tr><td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="h-8 w-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                                            <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Memuat data user...</span>
                                        </div>
                                    </td></tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr><td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-40">
                                            <Users className="h-12 w-12 text-slate-300" />
                                            <span className="text-slate-500 font-medium text-lg">Tidak ada user ditemukan.</span>
                                        </div>
                                    </td></tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-blue-50/30 transition-all duration-300 group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className={`h-11 w-11 rounded-2xl bg-gradient-to-br ${getAvatarColor(user.name, user.email)} flex items-center justify-center text-white font-black text-sm shadow-md`}>
                                                        {getInitials(user.name, user.email)}
                                                    </div>
                                                    <span className="font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                                                        {user.name || "—"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="text-slate-500 font-medium">{user.email}</span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${getRoleColor(user.role)}`}>
                                                    {getRoleIcon(user.role)}
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    {new Date(user.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                {currentUserRole === "Super Admin" && (
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                                        <Button
                                                            variant="outline" size="icon"
                                                            onClick={() => openEditModal(user)}
                                                            className="h-10 w-10 rounded-xl border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-white hover:shadow-lg transition-all"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </Button>
                                                        {user.email !== currentUserEmail && (
                                                            <Button
                                                                variant="outline" size="icon"
                                                                onClick={() => setDeleteConfirm(user.id)}
                                                                className="h-10 w-10 rounded-xl border-slate-200 text-rose-500 hover:text-white hover:bg-rose-600 hover:border-rose-600 hover:shadow-lg hover:shadow-rose-200 transition-all"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* ===== ADD / EDIT MODAL ===== */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between px-8 pt-8 pb-2">
                            <div>
                                <h3 className="text-xl font-black text-slate-900">
                                    {editingUser ? "Edit User" : "Tambah User Baru"}
                                </h3>
                                <p className="text-sm text-slate-500 font-medium mt-1">
                                    {editingUser ? "Perbarui informasi akun." : "Buat akun baru untuk sistem administrasi."}
                                </p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => { setShowModal(false); resetForm(); }} className="rounded-xl h-10 w-10 hover:bg-slate-100">
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="px-8 py-6 space-y-5">
                            {error && (
                                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold flex items-center gap-2">
                                    <span>❌</span> {error}
                                </div>
                            )}

                            <div>
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Nama Lengkap *</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        placeholder="Contoh: Budi Santoso"
                                        className="pl-11 h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Email *</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        type="email"
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                        placeholder="contoh@gramedia.com"
                                        className="pl-11 h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">
                                    Password {editingUser ? "(kosongkan jika tidak diubah)" : "*"}
                                </label>
                                <div className="relative">
                                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        value={form.password}
                                        onChange={e => setForm({ ...form, password: e.target.value })}
                                        placeholder={editingUser ? "••••••••" : "Min. 6 karakter"}
                                        className="pl-11 pr-12 h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Role *</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {ROLES.map(role => (
                                        <button
                                            key={role}
                                            type="button"
                                            onClick={() => setForm({ ...form, role })}
                                            className={`p-3 rounded-xl border-2 text-center font-bold text-xs transition-all ${form.role === role
                                                ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                                                : "border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50"
                                                }`}
                                        >
                                            <div className="flex flex-col items-center gap-1.5">
                                                {getRoleIcon(role)}
                                                {role}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 px-8 py-6 bg-slate-50/50 border-t border-slate-100">
                            <Button variant="outline" onClick={() => { setShowModal(false); resetForm(); }} className="rounded-xl h-12 px-6 font-bold">
                                Batal
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="rounded-xl h-12 px-8 bg-blue-600 hover:bg-blue-700 font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {submitting ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Menyimpan...
                                    </div>
                                ) : editingUser ? "Simpan Perubahan" : "Buat Akun"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== DELETE CONFIRMATION ===== */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="h-16 w-16 rounded-2xl bg-rose-100 flex items-center justify-center mx-auto">
                            <Trash2 className="h-8 w-8 text-rose-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">Hapus User?</h3>
                            <p className="text-slate-500 text-sm">Akun ini tidak bisa login lagi setelah dihapus. Tindakan ini tidak dapat dibatalkan.</p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="flex-1 rounded-xl h-12 font-bold">
                                Batal
                            </Button>
                            <Button onClick={() => handleDelete(deleteConfirm)} className="flex-1 rounded-xl h-12 bg-rose-600 hover:bg-rose-700 font-bold shadow-lg shadow-rose-500/20 active:scale-95">
                                Ya, Hapus
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
