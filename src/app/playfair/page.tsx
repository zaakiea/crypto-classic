"use client";

import { useState } from "react";
import { playfair, buildPlayfairMatrix, toAlpha } from "@/lib/ciphers";

export default function PlayfairScreen() {
    const [inputText, setInputText] = useState("");
    const [keyword, setKeyword] = useState("MONARCHY");
    const [outputText, setOutputText] = useState("");
    const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");

    const matrix = buildPlayfairMatrix(keyword || "A");

    function runCipher(m: "encrypt" | "decrypt" = mode) {
        try {
            const result = playfair(inputText, keyword, m);
            setOutputText(result);
        } catch (e: unknown) {
            setOutputText(`❌ Error: ${e instanceof Error ? e.message : String(e)}`);
        }
    }

    const charCount = toAlpha(inputText).length;

    return (
        <div className="mx-auto max-w-5xl flex flex-col gap-8">
            <header className="flex flex-col gap-2">
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
                    Playfair Cipher
                </h2>
                <p className="text-slate-500 text-base md:text-lg max-w-2xl">
                    Metode enkripsi digraph substitusi klasik yang menggunakan matriks
                    5×5 untuk mengamankan pesan Anda.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: input + output */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <label className="flex flex-col gap-2">
                            <span className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                                Input Teks
                            </span>
                            <textarea
                                className="w-full min-h-[160px] resize-y rounded-lg border border-slate-300 bg-slate-50 p-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-indigo-600"
                                placeholder="Masukkan teks yang ingin dienkripsi atau didekripsi di sini..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                        </label>
                        <div className="mt-2 flex justify-end text-xs text-slate-400">{charCount} karakter</div>
                        <div className="mt-4 flex flex-col gap-3">
                            {/* Mode switch */}
                            <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
                                <button
                                    onClick={() => setMode("encrypt")}
                                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${mode === "encrypt" ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:text-slate-700"
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-[18px]">lock</span>
                                    Enkripsi
                                </button>
                                <button
                                    onClick={() => setMode("decrypt")}
                                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${mode === "decrypt" ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:text-slate-700"
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-[18px]">lock_open</span>
                                    Dekripsi
                                </button>
                            </div>
                            <button
                                onClick={() => runCipher()}
                                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[20px]">{mode === "encrypt" ? "lock" : "lock_open"}</span>
                                {mode === "encrypt" ? "Enkripsi Pesan" : "Dekripsi Pesan"}
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-100 rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-5 py-3 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                            <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <span className="material-symbols-outlined text-emerald-500 text-[20px]">terminal</span>
                                Hasil Output
                            </span>
                            <button
                                onClick={() => outputText && navigator.clipboard.writeText(outputText)}
                                className="text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5 text-xs font-medium bg-white hover:bg-slate-100 px-2.5 py-1.5 "
                            >
                                <span className="material-symbols-outlined text-[14px]">content_copy</span>

                            </button>
                        </div>
                        <div className="p-5 min-h-[120px] font-mono text-sm text-slate-700 bg-white">
                            {outputText ? (
                                <span className="break-all leading-relaxed">{outputText}</span>
                            ) : (
                                <span className="text-slate-400 italic">Hasil enkripsi atau dekripsi akan muncul di sini...</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: key config */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 h-full">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="material-symbols-outlined text-indigo-600 text-[24px]">settings</span>
                            <h3 className="text-lg font-bold text-slate-900">Konfigurasi Kunci</h3>
                        </div>
                        <div className="flex flex-col gap-6">
                            <label className="flex flex-col gap-2">
                                <span className="text-sm font-medium text-slate-900">Kata Kunci (Keyword)</span>
                                <div className="relative">
                                    <input
                                        className="w-full rounded-lg border border-slate-300 bg-slate-50 py-3 pl-4 pr-10 text-base text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-indigo-600"
                                        placeholder="SECRETKEY"
                                        type="text"
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value.toUpperCase())}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        <span className="material-symbols-outlined text-[20px]">vpn_key</span>
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500">
                                    Huruf &apos;J&apos; digabungkan dengan &apos;I&apos;.
                                </p>
                            </label>

                            <div className="border-t border-slate-200 my-1" />

                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-slate-900">Matriks Playfair (5×5)</span>
                                    <span className="text-xs px-2 py-1 rounded bg-indigo-50 text-indigo-600 font-medium">
                                        Auto-generated
                                    </span>
                                </div>
                                <div className="grid grid-cols-5 gap-1.5 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                    {matrix.map((char, index) => (
                                        <div
                                            key={index}
                                            className={`h-10 flex items-center justify-center rounded border font-bold shadow-sm transition-colors ${char === 'I'
                                                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 text-[10px]'
                                                : 'bg-white border-slate-100 text-slate-900 text-sm'
                                                }`}
                                        >
                                            {char === 'I' ? 'I / J' : char}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 flex gap-3 items-start">
                    <span className="material-symbols-outlined text-indigo-600 mt-0.5">lightbulb</span>
                    <div>
                        <h4 className="font-bold text-sm text-slate-900">Tips Penggunaan</h4>
                        <p className="text-xs text-slate-500 mt-1">
                            Pastikan kunci yang Anda gunakan mudah diingat namun sulit ditebak.
                        </p>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200 flex gap-3 items-start">
                    <span className="material-symbols-outlined text-slate-500 mt-0.5">history</span>
                    <div>
                        <h4 className="font-bold text-sm text-slate-900">Sejarah Singkat</h4>
                        <p className="text-xs text-slate-500 mt-1">
                            Ditemukan oleh Charles Wheatstone (1854), dipopulerkan Lord Playfair.
                        </p>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200 flex gap-3 items-start">
                    <span className="material-symbols-outlined text-slate-500 mt-0.5">security</span>
                    <div>
                        <h4 className="font-bold text-sm text-slate-900">Keamanan</h4>
                        <p className="text-xs text-slate-500 mt-1">
                            Tidak aman untuk militer modern, tetapi bagus untuk pembelajaran.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
