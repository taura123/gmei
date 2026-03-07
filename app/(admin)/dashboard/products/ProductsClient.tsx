"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit2, Trash2, Package, Filter, X, Upload, ImageIcon, Download, FileSpreadsheet } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { exportData, ExportFormat } from "@/lib/export-utils";
import { logActivity } from "@/lib/activity-client";

interface Product {
    id: string;
    title: string;
    description: string;
    price: number | null;
    image: string;
    category: string;
    subcategory: string | null;
    link: string | null;
}

const CATEGORIES = ["Educational Books", "Non-Book Products"];

export default function ProductsClient() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [syncingProducts, setSyncingProducts] = useState(false);
    const [syncMessage, setSyncMessage] = useState<string | null>(null);
    const [exportFormat, setExportFormat] = useState<"CSV" | "XLSX" | "PDF">("CSV");

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // Form state
    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        image: "",
        category: CATEGORIES[0],
        subcategory: "",
        link: ""
    });

    // Image upload
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products");
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSyncProducts = async () => {
        setSyncingProducts(true);
        setSyncMessage(null);
        try {
            const res = await axios.post('/api/sync/products');
            setSyncMessage(res.data.message || 'Sinkronisasi selesai!');
            setTimeout(() => fetchProducts(), 3000);
        } catch {
            setSyncMessage('Gagal melakukan sinkronisasi. Coba lagi.');
        } finally {
            setSyncingProducts(false);
            setTimeout(() => setSyncMessage(null), 5000);
        }
    };

    const resetForm = () => {
        setForm({ title: "", description: "", price: "", image: "", category: CATEGORIES[0], subcategory: "", link: "" });
        setImageFile(null);
        setImagePreview(null);
        setEditingProduct(null);
    };

    const openAddModal = () => {
        resetForm();
        setShowModal(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setForm({
            title: product.title,
            description: product.description,
            price: product.price ? String(product.price) : "",
            image: product.image,
            category: product.category,
            subcategory: product.subcategory || "",
            link: product.link || ""
        });
        setImagePreview(product.image);
        setShowModal(true);
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Client-side validation
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            alert("❌ Tipe file tidak didukung. Gunakan PNG, JPG, WEBP, atau GIF.");
            e.target.value = "";
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert(`❌ Ukuran file terlalu besar (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maksimum 5MB.`);
            e.target.value = "";
            return;
        }

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async () => {
        if (!form.title || !form.description || !form.category) return;
        setSubmitting(true);

        try {
            let imageUrl = form.image;

            // Upload image if new file selected
            if (imageFile) {
                setUploading(true);
                const uploadData = new FormData();
                uploadData.append("file", imageFile);
                const uploadRes = await fetch("/api/upload", { method: "POST", body: uploadData });
                const uploadJson = await uploadRes.json();
                imageUrl = uploadJson.url || imageUrl;
                setUploading(false);
            }

            const payload = { ...form, image: imageUrl };

            if (editingProduct) {
                // UPDATE
                const res = await fetch("/api/products", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: editingProduct.id, ...payload })
                });
                if (res.ok) {
                    await fetchProducts();
                    setShowModal(false);
                    resetForm();
                }
            } else {
                // CREATE
                const res = await fetch("/api/products", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    await fetchProducts();
                    setShowModal(false);
                    resetForm();
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                await fetchProducts();
                setDeleteConfirm(null);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleExport = () => {
        const headers = [
            { key: "title", label: "Nama Produk" },
            { key: "category", label: "Kategori Utama" },
            { key: "subcategory", label: "Subkategori" },
            { key: "price", label: "Harga (IDR)" },
            { key: "description", label: "Deskripsi" },
            { key: "link", label: "Link" },
        ];
        exportData(filteredProducts, headers, "Katalog_Produk_GMEI", exportFormat);

        // Log activity
        logActivity(
            "EXPORT",
            "PRODUCT",
            `mengekspor ${filteredProducts.length} produk ke format ${exportFormat}.`
        );
    };

    const [activeFilter, setActiveFilter] = useState("Semua Katalog");
    const FILTER_OPTIONS = ["Semua Katalog", "Katalog SD", "Katalog SMP", "Katalog SMA/SMK", "Alat Peraga Edukasi (APE)", "Peralatan Penunjang TIK", "Lainnya"];

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());

        let matchesFilter = true;
        if (activeFilter !== "Semua Katalog") {
            if (activeFilter === "Lainnya") {
                matchesFilter = !FILTER_OPTIONS.includes(p.subcategory || "");
            } else {
                matchesFilter = (p.subcategory === activeFilter);
            }
        }

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="p-8 lg:p-12 space-y-8 max-w-[1600px] mx-auto">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Package className="h-6 w-6 text-blue-600" />
                        Kelola Produk
                    </h2>
                    <p className="text-slate-500 text-sm font-medium">Manajemen inventaris produk dan kategori GMEI beserta sinkronisasi otomatis katalog pendidikan.</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSyncProducts}
                            disabled={syncingProducts}
                            className="flex items-center gap-2 px-4 py-2 bg-[#1E4198] text-white rounded-2xl shadow-sm hover:bg-blue-700 transition-all font-bold text-sm disabled:opacity-60 h-12"
                        >
                            <Download className={`h-4 w-4 ${syncingProducts ? 'animate-bounce' : ''}`} />
                            {syncingProducts ? 'Menyinkronkan...' : 'Produk SIPLah'}
                        </button>
                        <div className="flex items-center bg-emerald-50 rounded-2xl p-1 border border-emerald-100 h-12 shadow-sm">
                            <select
                                value={exportFormat}
                                onChange={(e) => setExportFormat(e.target.value as any)}
                                className="bg-transparent border-none text-emerald-700 font-bold text-[10px] uppercase tracking-wider px-3 focus:ring-0 outline-none cursor-pointer"
                            >
                                <option value="CSV">CSV</option>
                                <option value="XLSX">EXCEL (.xlsx)</option>
                                <option value="PDF">PDF REPORT</option>
                            </select>
                            <button
                                onClick={handleExport}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-bold text-xs h-10 shadow-lg shadow-emerald-100"
                            >
                                <FileSpreadsheet className="h-4 w-4" />
                                EKSPOR
                            </button>
                        </div>
                        <Button
                            onClick={openAddModal}
                            className="rounded-2xl bg-blue-600 hover:bg-blue-700 h-12 px-6 font-bold shadow-xl shadow-blue-500/20 transition-all active:scale-95"
                        >
                            <Plus className="mr-2 h-5 w-5" />
                            TAMBAH PRODUK BARU
                        </Button>
                    </div>
                    {syncMessage && (
                        <p className="text-sm font-medium text-emerald-600 animate-pulse">{syncMessage}</p>
                    )}
                </div>
            </div>

            {/* List Control */}
            <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/40 overflow-hidden bg-white">
                <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
                        <div className="relative flex-1 w-full max-w-xl">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input
                                placeholder="Cari nama produk atau kategori..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 font-medium placeholder:text-slate-400 transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative">
                                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                <select
                                    className="h-14 pl-10 pr-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 font-bold appearance-none cursor-pointer outline-none"
                                    value={activeFilter}
                                    onChange={(e) => setActiveFilter(e.target.value)}
                                >
                                    {FILTER_OPTIONS.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="h-10 w-[1px] bg-slate-100 mx-2 hidden md:block" />
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
                                TOTAL: <span className="text-slate-900">{filteredProducts.length}</span>
                            </p>
                        </div>
                    </div>

                    <div className="md:hidden flex items-center gap-2 mb-4 px-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tip: Geser tabel ke samping untuk detail</span>
                    </div>

                    <div className="overflow-x-auto rounded-[2rem] border border-slate-100 custom-scrollbar scroll-smooth">
                        <table className="w-full text-sm text-left border-collapse min-w-[1000px]">
                            <thead>
                                <tr className="bg-slate-50/80 text-slate-500">
                                    <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px] sticky left-0 bg-slate-50/80 border-r border-slate-100 z-10 backdrop-blur-md">Informasi Produk</th>
                                    <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px]">Kategori</th>
                                    <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px]">Harga (RP)</th>
                                    <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px] text-right sticky right-0 bg-slate-50/80 border-l border-slate-100 z-10 backdrop-blur-md">Manajemen</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="h-8 w-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                                                <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Menyelaraskan Data...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4 opacity-40">
                                                <Package className="h-12 w-12 text-slate-300" />
                                                <span className="text-slate-500 font-medium text-lg">Tidak ada data ditemukan.</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-blue-50/30 transition-all duration-300 group">
                                            <td className="px-8 py-6 sticky left-0 bg-white group-hover:bg-blue-50 transition-colors z-10 border-r border-slate-50">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-14 w-14 rounded-2xl bg-slate-100 flex-shrink-0 relative overflow-hidden ring-1 ring-slate-100 group-hover:ring-blue-100 transition-all">
                                                        {product.image ? (
                                                            product.image.startsWith('http') ? (
                                                                <img
                                                                    src={product.image}
                                                                    alt={product.title}
                                                                    className="w-full h-full object-cover"
                                                                    referrerPolicy="no-referrer"
                                                                />
                                                            ) : (
                                                                <Image
                                                                    src={product.image}
                                                                    alt={product.title}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            )
                                                        ) : (
                                                            <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-black text-xs uppercase">
                                                                IMG
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="font-black text-slate-900 truncate group-hover:text-blue-700 transition-colors">{product.title}</span>
                                                        <span className="text-xs text-slate-400 truncate max-w-[240px] font-medium italic">{product.description || 'Tidak ada deskripsi'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-wider border border-slate-200 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 font-black text-slate-900">
                                                {product.price ? (
                                                    <span className="flex items-center gap-1">
                                                        <span className="text-[10px] text-slate-400">IDR</span>
                                                        {Number(product.price).toLocaleString('id-ID')}
                                                    </span>
                                                ) : <span className="text-slate-300">N/A</span>}
                                            </td>
                                            <td className="px-8 py-6 text-right sticky right-0 bg-white group-hover:bg-blue-50 transition-colors z-10 border-l border-slate-50">
                                                <div className="flex justify-end gap-2 transition-all duration-300">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => openEditModal(product)}
                                                        className="h-10 w-10 rounded-xl border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-white hover:shadow-lg transition-all"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => setDeleteConfirm(product.id)}
                                                        className="h-10 w-10 rounded-xl border-slate-200 text-rose-500 hover:text-white hover:bg-rose-600 hover:border-rose-600 hover:shadow-lg hover:shadow-rose-200 transition-all"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
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
                    <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-8 pt-8 pb-2">
                            <div>
                                <h3 className="text-xl font-black text-slate-900">
                                    {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
                                </h3>
                                <p className="text-sm text-slate-500 font-medium mt-1">
                                    {editingProduct ? "Perbarui informasi produk yang sudah ada." : "Isi detail produk untuk menambahkannya ke katalog."}
                                </p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => { setShowModal(false); resetForm(); }} className="rounded-xl h-10 w-10 hover:bg-slate-100">
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Modal Body */}
                        <div className="px-8 py-6 space-y-5 max-h-[60vh] overflow-y-auto">
                            {/* Image Upload */}
                            <div>
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Foto Produk</label>
                                <div
                                    onClick={() => fileRef.current?.click()}
                                    className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all min-h-[160px] relative overflow-hidden"
                                >
                                    {imagePreview ? (
                                        <div className="relative w-full h-40">
                                            <Image src={imagePreview} alt="Preview" fill className="object-contain rounded-xl" />
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="h-8 w-8 text-slate-300 mb-2" />
                                            <span className="text-sm text-slate-400 font-bold">Klik untuk upload gambar</span>
                                            <span className="text-xs text-slate-300 mt-1">PNG, JPG, WEBP (max 5MB)</span>
                                        </>
                                    )}
                                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Nama Produk *</label>
                                <Input
                                    value={form.title}
                                    onChange={e => setForm({ ...form, title: e.target.value })}
                                    placeholder="Contoh: Buku Teks Matematika Kelas 7"
                                    className="h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Deskripsi *</label>
                                <textarea
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    placeholder="Deskripsi singkat tentang produk..."
                                    rows={3}
                                    className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-none"
                                />
                            </div>

                            {/* Price & Category */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Harga (Rp)</label>
                                    <Input
                                        type="number"
                                        value={form.price}
                                        onChange={e => setForm({ ...form, price: e.target.value })}
                                        placeholder="50000"
                                        className="h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Kategori *</label>
                                    <select
                                        value={form.category}
                                        onChange={e => setForm({ ...form, category: e.target.value })}
                                        className="w-full h-12 rounded-xl border border-slate-200 px-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none bg-white"
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Subcategory & Link */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Subkategori</label>
                                    <Input
                                        value={form.subcategory}
                                        onChange={e => setForm({ ...form, subcategory: e.target.value })}
                                        placeholder="BTP, BTU, APE, ATK..."
                                        className="h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Link Produk</label>
                                    <Input
                                        value={form.link}
                                        onChange={e => setForm({ ...form, link: e.target.value })}
                                        placeholder="https://..."
                                        className="h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 px-8 py-6 bg-slate-50/50 border-t border-slate-100">
                            <Button variant="outline" onClick={() => { setShowModal(false); resetForm(); }} className="rounded-xl h-12 px-6 font-bold">
                                Batal
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={submitting || !form.title || !form.description}
                                className="rounded-xl h-12 px-8 bg-blue-600 hover:bg-blue-700 font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {submitting ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        {uploading ? "Mengunggah..." : "Menyimpan..."}
                                    </div>
                                ) : editingProduct ? "Simpan Perubahan" : "Tambah Produk"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== DELETE CONFIRMATION MODAL ===== */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="h-16 w-16 rounded-2xl bg-rose-100 flex items-center justify-center mx-auto">
                            <Trash2 className="h-8 w-8 text-rose-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">Hapus Produk?</h3>
                            <p className="text-slate-500 text-sm">Tindakan ini tidak dapat dibatalkan. Produk akan dihapus secara permanen dari katalog.</p>
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
