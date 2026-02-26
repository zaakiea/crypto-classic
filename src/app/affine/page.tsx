"use client";

import { useState } from "react";
import { affine, toAlpha } from "@/lib/ciphers";

export default function AffineScreen() {
    const [inputText, setInputText] = useState("");
    const [aVal, setAVal] = useState(5);
    const [bVal, setBVal] = useState(8);
    const [outputText, setOutputText] = useState("");
    const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
    const [statusMsg, setStatusMsg] = useState("Menunggu input...");

    function runCipher(m: "encrypt" | "decrypt" = mode) {
        try {
            const result = affine(inputText, aVal, bVal, m);
            setOutputText(result);
            setStatusMsg(`${m === "encrypt" ? "Enkripsi" : "Dekripsi"} berhasil — ${result.length} karakter`);
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            setOutputText(`❌ Error: ${msg}`);
            setStatusMsg("Error — periksa konfigurasi kunci");
        }
    }

    const charCount = toAlpha(inputText).length;

    return (
        <div className="flex w-full max-w-6xl flex-1 flex-col mx-auto">
            <div className="mb-8 flex flex-col gap-2">
                <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                    Affine Cipher
                </h2>
                <p className="max-w-2xl text-lg text-slate-600">
                    Metode enkripsi substitusi monoalfabetik. Setiap huruf dienkripsi
                    menggunakan fungsi matematika linear{" "}
                    <code className="rounded bg-slate-100 px-1 py-0.5 text-sm font-bold text-slate-800">
                        (ax + b) mod 26
                    </code>
                    .
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                {/* Left: input + key config */}
                <div className="flex flex-col gap-6 lg:col-span-8">
                    {/* Input */}
                    <div className="group relative flex flex-col overflow-hidden rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 hover:shadow-md transition-shadow">
                        <div className="absolute right-0 top-0 h-1 w-full bg-gradient-to-r from-indigo-600 to-purple-500" />
                        <label className="mb-3 flex items-center justify-between" htmlFor="affine-input">
                            <span className="text-base font-semibold text-slate-900">Teks Input</span>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                                Plaintext / Ciphertext
                            </span>
                        </label>
                        <textarea
                            id="affine-input"
                            className="min-h-[160px] w-full resize-none rounded-lg border-0 bg-slate-50 p-4 text-base text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600"
                            placeholder="Masukkan pesan rahasia di sini..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                        />
                        <div className="mt-3 flex items-center justify-between">
                            <button className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-indigo-600">
                                <span className="material-symbols-outlined text-base">upload_file</span>
                                Unggah File .txt
                            </button>
                            <span className="text-xs text-slate-400">{charCount} karakter</span>
                        </div>
                    </div>

                    {/* Key config */}
                    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <div className="mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-indigo-600">tune</span>
                            <h3 className="text-lg font-bold text-slate-900">Konfigurasi Kunci</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-slate-700">
                                    Nilai a (Koprim ke 26)
                                    <span className="ml-1 cursor-help text-slate-400" title="Harus koprim dengan 26">
                                        <span className="material-symbols-outlined align-middle text-sm">info</span>
                                    </span>
                                </label>
                                <div className="relative">
                                    <input
                                        className="w-full rounded-lg border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-indigo-600 focus:ring-indigo-600"
                                        type="number"
                                        value={aVal}
                                        onChange={(e) => setAVal(parseInt(e.target.value) || 1)}
                                    />
                                    <div className="absolute inset-y-0 right-0 pointer-events-none flex items-center pr-3 text-slate-400">
                                        <span className="text-xs font-bold">GCD(a,26)=1</span>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500">Bilangan ganjil selain 13.</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-slate-700">Nilai b (Pergeseran)</label>
                                <div className="relative">
                                    <input
                                        className="w-full rounded-lg border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-indigo-600 focus:ring-indigo-600"
                                        type="number"
                                        value={bVal}
                                        onChange={(e) => setBVal(parseInt(e.target.value) || 0)}
                                    />
                                    <div className="absolute inset-y-0 right-0 pointer-events-none flex items-center pr-3 text-slate-400">
                                        <span className="text-xs font-bold">0 ≤ b ≤ 25</span>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500">Besar pergeseran alfabet.</p>
                            </div>
                        </div>
                        <div className="mt-8 flex flex-col gap-3">
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
                            {/* Run button */}
                            <button
                                onClick={() => runCipher()}
                                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[20px]">{mode === "encrypt" ? "lock" : "lock_open"}</span>
                                {mode === "encrypt" ? "Enkripsi Pesan" : "Dekripsi Pesan"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: output + tips */}
                <div className="flex flex-col gap-6 lg:col-span-4">
                    <div className="flex h-full flex-col overflow-hidden rounded-xl bg-slate-100 text-slate-900 shadow-xl ring-1 ring-slate-200">
                        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 p-4 px-6">
                            <h3 className="font-bold text-slate-800">Hasil Output</h3>
                            <button
                                onClick={() => outputText && navigator.clipboard.writeText(outputText)}
                                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                                title="Salin Hasil"
                            >
                                <span className="material-symbols-outlined text-xl">content_copy</span>
                            </button>
                        </div>
                        <div className="flex flex-1 flex-col p-6">
                            <textarea
                                className="flex-1 resize-none rounded-lg bg-transparent p-0 text-slate-700 placeholder:text-slate-400 focus:ring-0 text-base font-mono leading-relaxed"
                                placeholder="Hasil enkripsi atau dekripsi akan muncul di sini..."
                                value={outputText}
                                readOnly
                            />
                        </div>
                        <div className="border-t border-slate-200 bg-slate-50 px-6 py-3">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span className="material-symbols-outlined text-sm">info</span>
                                <span>{statusMsg}</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-blue-50 p-5 ring-1 ring-blue-100">
                        <div className="mb-2 flex items-center gap-2 text-blue-700">
                            <span className="material-symbols-outlined">lightbulb</span>
                            <span className="font-bold">Tips Matematika</span>
                        </div>
                        <p className="text-sm leading-relaxed text-blue-800">
                            Untuk mendekripsi, kita perlu mencari invers perkalian modular
                            dari <span className="font-mono font-bold">a</span>. Jika a = 5,
                            maka a⁻¹ = 21, karena (5 × 21) mod 26 = 1.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
