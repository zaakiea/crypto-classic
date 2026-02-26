"use client";

import { useState } from "react";
import { simplifiedEnigma } from "@/lib/ciphers";

// Default keys: Rotor I, II, III wirings from classic Enigma (valid A-Z permutations)
const DEFAULT_KEYS = [
    "EKMFLGDQVZNTOWYHXUSPAIBRCJ",
    "AJDKSIRUXBLHWTMCQGZNPYFVOE",
    "BDFHJLCPRTXVZNYEIWGAKMUSQO",
];

const KEY_COLORS = [
    { header: "bg-indigo-600", badge: "bg-indigo-100 text-indigo-700 border-indigo-200", row: "bg-indigo-50" },
    { header: "bg-violet-600", badge: "bg-violet-100 text-violet-700 border-violet-200", row: "bg-violet-50" },
    { header: "bg-purple-600", badge: "bg-purple-100 text-purple-700 border-purple-200", row: "bg-purple-50" },
    { header: "bg-blue-600", badge: "bg-blue-100 text-blue-700 border-blue-200", row: "bg-blue-50" },
    { header: "bg-teal-600", badge: "bg-teal-100 text-teal-700 border-teal-200", row: "bg-teal-50" },
];

const MAX_TABLE_ROWS = 40;

interface Step {
    i: number;
    rotorPos: number;
    inputChar: string;
    outputChar: string;
    formula: string;
}

function shuffle(str: string): string {
    const arr = str.split("");
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join("");
}

export default function EnigmaScreen() {
    const [inputText, setInputText] = useState("");
    const [keys, setKeys] = useState<string[]>(DEFAULT_KEYS);
    const [initialPos, setInitialPos] = useState(0);
    const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
    const [outputText, setOutputText] = useState("");
    const [steps, setSteps] = useState<Step[]>([]);
    const [error, setError] = useState("");

    /* ── Key management ── */
    function addKey() {
        if (keys.length >= 5) return;
        setKeys((prev) => [...prev, shuffle("ABCDEFGHIJKLMNOPQRSTUVWXYZ")]);
    }
    function removeKey(idx: number) {
        if (keys.length <= 1) return;
        const next = keys.filter((_, i) => i !== idx);
        setKeys(next);
        if (initialPos >= next.length) setInitialPos(0);
        setSteps([]); setOutputText("");
    }
    function updateKey(idx: number, val: string) {
        const upper = val.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 26);
        setKeys((prev) => prev.map((k, i) => (i === idx ? upper : k)));
    }
    function randomizeKey(idx: number) {
        setKeys((prev) =>
            prev.map((k, i) => (i === idx ? shuffle("ABCDEFGHIJKLMNOPQRSTUVWXYZ") : k))
        );
    }

    /* ── Cipher ── */
    function buildSteps(clean: string, m: "encrypt" | "decrypt"): Step[] {
        return clean.split("").map((ch, i) => {
            const pos = ((initialPos + i) % keys.length + keys.length) % keys.length;
            const key = keys[pos].toUpperCase().replace(/[^A-Z]/g, "");
            const idx = ch.charCodeAt(0) - 65;
            const out =
                m === "encrypt"
                    ? key[idx] || "?"
                    : String.fromCharCode(Math.max(0, key.indexOf(ch)) + 65);
            return {
                i,
                rotorPos: pos,
                inputChar: ch,
                outputChar: out,
                formula: `K${pos}[${ch}] = ${out}`,
            };
        });
    }

    function runCipher(m: "encrypt" | "decrypt" = mode) {
        setError("");
        try {
            const result = simplifiedEnigma(inputText, keys, initialPos, m);
            setOutputText(result);
            const clean = inputText.toUpperCase().replace(/[^A-Z]/g, "");
            setSteps(buildSteps(clean, m));
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e));
            setOutputText(""); setSteps([]);
        }
    }

    /* ── Helpers ── */
    const cleanInput = inputText.toUpperCase().replace(/[^A-Z]/g, "");
    const charCount = cleanInput.length;

    function isKeyValid(key: string) {
        const k = key.toUpperCase().replace(/[^A-Z]/g, "");
        return k.length === 26 && new Set(k.split("")).size === 26;
    }

    return (
        <div className="mx-auto max-w-6xl space-y-8 pb-12">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Enigma Cipher</h1>
                <p className="text-slate-600 text-lg max-w-3xl leading-relaxed">
                    Simulasi mesin rotor edukatif. Rotor berputar setiap karakter sehingga kunci
                    substitusi berubah secara siklik — K0, K1, K2, K0, K1, ...
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* ── LEFT ─────────────────────────────────────── */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Input */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex justify-between items-center mb-3">
                            <span className="font-semibold text-slate-900 text-sm">
                                {mode === "encrypt" ? "Plaintext" : "Ciphertext"}
                            </span>
                            <span className="text-xs text-slate-400">{charCount} karakter</span>
                        </div>
                        <textarea
                            className="w-full h-36 bg-slate-50 border border-slate-200 rounded-lg p-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-mono text-sm"
                            placeholder="Masukkan teks yang akan diproses..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                        />
                        {error && (
                            <p className="mt-2 text-xs text-red-600 bg-red-50 rounded-lg p-2.5 border border-red-200 flex gap-2 items-start">
                                <span className="material-symbols-outlined text-sm flex-shrink-0">error</span>
                                {error}
                            </p>
                        )}
                        <div className="mt-4 flex flex-col gap-3">
                            <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
                                <button
                                    onClick={() => setMode("encrypt")}
                                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${mode === "encrypt"
                                            ? "bg-indigo-600 text-white shadow-md"
                                            : "text-slate-500 hover:text-slate-700"
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-[18px]">lock</span>
                                    Enkripsi
                                </button>
                                <button
                                    onClick={() => setMode("decrypt")}
                                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${mode === "decrypt"
                                            ? "bg-indigo-600 text-white shadow-md"
                                            : "text-slate-500 hover:text-slate-700"
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
                                <span className="material-symbols-outlined text-[20px]">
                                    {mode === "encrypt" ? "lock" : "lock_open"}
                                </span>
                                {mode === "encrypt" ? "Enkripsi Pesan" : "Dekripsi Pesan"}
                            </button>
                        </div>
                    </div>

                    {/* Output */}
                    <div className="bg-slate-100 rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-5 py-3 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                            <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <span className="material-symbols-outlined text-emerald-500 text-[20px]">terminal</span>
                                Hasil Output
                            </span>
                            <button
                                onClick={() => outputText && navigator.clipboard.writeText(outputText)}
                                className="text-slate-500 hover:text-slate-700 transition-colors text-xs font-medium bg-white hover:bg-slate-100 px-2.5 py-1.5 rounded-md border border-slate-200 flex items-center gap-1.5"
                            >
                                <span className="material-symbols-outlined text-[14px]">content_copy</span>
                                Salin
                            </button>
                        </div>
                        <div className="p-5 min-h-[80px] font-mono text-sm text-slate-800 bg-white leading-relaxed break-all">
                            {outputText || (
                                <span className="text-slate-400 italic">Hasil akan muncul di sini...</span>
                            )}
                        </div>
                    </div>

                    {/* Step-by-step table */}
                    {steps.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                                <span className="font-bold text-sm text-slate-700 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-indigo-500 text-[20px]">table_chart</span>
                                    Tabel Langkah-Langkah
                                </span>
                                {steps.length > MAX_TABLE_ROWS && (
                                    <span className="text-xs text-slate-400">
                                        {MAX_TABLE_ROWS} dari {steps.length} baris ditampilkan
                                    </span>
                                )}
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wide">
                                            <th className="px-4 py-2.5 text-left w-10">i</th>
                                            <th className="px-4 py-2.5 text-left">Posisi Rotor</th>
                                            <th className="px-4 py-2.5 text-left">P(i)</th>
                                            <th className="px-4 py-2.5 text-left">Kunci</th>
                                            <th className="px-4 py-2.5 text-left">C(i)</th>
                                            <th className="px-4 py-2.5 text-left">Formula</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {steps.slice(0, MAX_TABLE_ROWS).map((step) => {
                                            const kc = KEY_COLORS[step.rotorPos % KEY_COLORS.length];
                                            return (
                                                <tr
                                                    key={step.i}
                                                    className={`border-b border-slate-100 ${step.i % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                                                        }`}
                                                >
                                                    <td className="px-4 py-2.5 font-mono text-slate-500 text-xs">{step.i}</td>
                                                    <td className="px-4 py-2.5 font-mono text-slate-600">{step.rotorPos}</td>
                                                    <td className="px-4 py-2.5 font-bold font-mono text-slate-900">{step.inputChar}</td>
                                                    <td className="px-4 py-2.5">
                                                        <span className={`px-2 py-0.5 rounded text-xs font-bold border ${kc.badge}`}>
                                                            K{step.rotorPos}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2.5 font-bold font-mono text-indigo-700">{step.outputChar}</td>
                                                    <td className="px-4 py-2.5 font-mono text-xs text-slate-400">{step.formula}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 font-mono text-xs text-slate-500 flex items-center gap-2">
                                <span>Hasil:</span>
                                <strong className="text-indigo-700 break-all">{outputText}</strong>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── RIGHT ────────────────────────────────────── */}
                <div className="lg:col-span-5 space-y-5">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                        <div className="flex items-center gap-2 mb-5">
                            <span className="material-symbols-outlined text-indigo-600 text-[22px]">settings</span>
                            <h3 className="font-bold text-slate-900 text-lg">Konfigurasi Rotor</h3>
                        </div>

                        {/* Initial position */}
                        <div className="mb-5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                                Posisi Awal Rotor
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    className="w-20 text-center rounded-lg border border-slate-300 bg-slate-50 py-2.5 font-mono font-bold text-xl text-slate-900 focus:ring-indigo-500 focus:border-indigo-500"
                                    max={keys.length - 1}
                                    min={0}
                                    type="number"
                                    value={initialPos}
                                    onChange={(e) => {
                                        const v = Math.max(0, Math.min(keys.length - 1, parseInt(e.target.value) || 0));
                                        setInitialPos(v);
                                    }}
                                />
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Siklus dimulai dari K{initialPos}.<br />
                                    Rentang: 0 – {keys.length - 1}
                                </p>
                            </div>
                        </div>

                        {/* Visual rotor cycle */}
                        <div className="mb-5 p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Siklus Rotor
                            </p>
                            <div className="flex flex-wrap gap-1.5 items-center">
                                {Array.from({ length: Math.min(keys.length * 3, 12) }, (_, i) => {
                                    const pos = ((initialPos + i) % keys.length + keys.length) % keys.length;
                                    const kc = KEY_COLORS[pos % KEY_COLORS.length];
                                    return (
                                        <span key={i} className={`px-2 py-0.5 rounded text-xs font-bold border ${kc.badge}`}>
                                            K{pos}
                                        </span>
                                    );
                                })}
                                <span className="text-slate-400 text-xs">→ ...</span>
                            </div>
                        </div>

                        {/* Keys */}
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Kunci Substitusi ({keys.length})
                            </p>
                            <button
                                onClick={addKey}
                                disabled={keys.length >= 5}
                                className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <span className="material-symbols-outlined text-[16px]">add</span>
                                Tambah Kunci
                            </button>
                        </div>

                        <div className="space-y-3">
                            {keys.map((key, i) => {
                                const kc = KEY_COLORS[i % KEY_COLORS.length];
                                const valid = isKeyValid(key);
                                return (
                                    <div key={i} className="rounded-xl border border-slate-200 overflow-hidden">
                                        <div className={`${kc.header} px-3 py-2 flex items-center justify-between`}>
                                            <span className="text-white font-bold text-sm">K{i}</span>
                                            <div className="flex gap-1.5">
                                                <button
                                                    onClick={() => randomizeKey(i)}
                                                    className="text-white/80 hover:text-white text-xs bg-white/10 hover:bg-white/25 px-2 py-0.5 rounded transition-colors"
                                                >
                                                    Acak
                                                </button>
                                                {keys.length > 1 && (
                                                    <button
                                                        onClick={() => removeKey(i)}
                                                        className="text-white/80 hover:text-red-200 text-xs bg-white/10 hover:bg-red-500/50 px-2 py-0.5 rounded transition-colors"
                                                    >
                                                        Hapus
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="p-2 bg-white">
                                            <input
                                                className="w-full font-mono text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-indigo-400 focus:border-indigo-400 tracking-widest"
                                                maxLength={26}
                                                placeholder="26 huruf permutasi A-Z..."
                                                type="text"
                                                value={key}
                                                onChange={(e) => updateKey(i, e.target.value)}
                                            />
                                            <div className="flex justify-between mt-1 px-1">
                                                <span className={`text-[10px] font-medium ${valid ? "text-green-600" : "text-amber-600"}`}>
                                                    {key.length}/26
                                                    {valid
                                                        ? " ✓ Permutasi valid"
                                                        : key.length === 26
                                                            ? " ✗ Ada huruf duplikat"
                                                            : " — belum lengkap"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex gap-3">
                        <span className="material-symbols-outlined text-indigo-600 mt-0.5 flex-shrink-0">info</span>
                        <div className="text-xs text-slate-700 leading-relaxed space-y-1">
                            <strong className="text-slate-900 block">Cara Kerja</strong>
                            <p>Karakter ke-<em>i</em> diproses dengan kunci K<sub>pos</sub></p>
                            <p className="font-mono bg-white/60 px-2 py-1 rounded">
                                pos = (posisi_awal + i) mod N
                            </p>
                            <p>Enkripsi: C = K<sub>pos</sub>[indeks(P)]</p>
                            <p>Dekripsi: P = alfabet[K<sub>pos</sub>⁻¹.indexOf(C)]</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
