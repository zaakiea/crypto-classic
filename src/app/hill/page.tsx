"use client";

import { useState, useMemo } from "react";
import { hill, hillDeterminant, toAlpha } from "@/lib/ciphers";

function gcd(a: number, b: number): number {
    while (b) { [a, b] = [b, a % b]; }
    return a;
}

type MatrixSize = 2 | 3 | 4 | 5;

const DEFAULT_MATRICES: Record<MatrixSize, number[]> = {
    2: [3, 3, 2, 5],
    3: [6, 24, 1, 13, 16, 10, 20, 17, 15],
    4: [3, 0, 0, 0, 0, 5, 0, 0, 0, 0, 7, 0, 0, 0, 0, 9],
    5: [3, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 11],
};

const GRID_COLS: Record<MatrixSize, string> = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
};

export default function HillScreen() {
    const [inputText, setInputText] = useState("");
    const [matrixSize, setMatrixSize] = useState<MatrixSize>(3);
    const [matrixValues, setMatrixValues] = useState<Record<MatrixSize, number[]>>({
        ...DEFAULT_MATRICES,
    });
    const [outputText, setOutputText] = useState("");
    const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");

    const currentMatrix = matrixValues[matrixSize];

    const det = useMemo(
        () => hillDeterminant(currentMatrix, matrixSize),
        [currentMatrix, matrixSize]
    );
    const isValid = gcd(det, 26) === 1;

    const rawDet = useMemo(() => {
        function detRaw(m: number[][]): number {
            const sz = m.length;
            if (sz === 1) return m[0][0];
            if (sz === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];
            let d = 0;
            for (let j = 0; j < sz; j++) {
                const minor = m.slice(1).map((row) => [
                    ...row.slice(0, j),
                    ...row.slice(j + 1),
                ]);
                d += (j % 2 === 0 ? 1 : -1) * m[0][j] * detRaw(minor);
            }
            return d;
        }
        const m = Array.from({ length: matrixSize }, (_, i) =>
            currentMatrix.slice(i * matrixSize, (i + 1) * matrixSize)
        );
        return detRaw(m);
    }, [currentMatrix, matrixSize]);

    function updateCell(i: number, val: string) {
        const v = Math.max(0, Math.min(25, parseInt(val) || 0));
        setMatrixValues((prev) => ({
            ...prev,
            [matrixSize]: prev[matrixSize].map((x, idx) => (idx === i ? v : x)),
        }));
    }

    function changeSize(newSize: MatrixSize) {
        setMatrixSize(newSize);
        setOutputText("");
    }

    function resetMatrix() {
        setMatrixValues((prev) => ({
            ...prev,
            [matrixSize]: [...DEFAULT_MATRICES[matrixSize]],
        }));
    }

    function randomize() {
        const n = matrixSize;
        setMatrixValues((prev) => ({
            ...prev,
            [n]: Array.from({ length: n * n }, () => Math.floor(Math.random() * 26)),
        }));
    }

    function runCipher(m: "encrypt" | "decrypt" = mode) {
        try {
            const result = hill(inputText, currentMatrix, matrixSize, m);
            setOutputText(result);
        } catch (e: unknown) {
            setOutputText(`❌ Error: ${e instanceof Error ? e.message : String(e)}`);
        }
    }

    const charCount = toAlpha(inputText).length;

    const SIZES: MatrixSize[] = [2, 3, 4, 5];

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            <div className="space-y-3">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Hill Cipher</h1>
                <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                    Enkripsi dan dekripsi pesan menggunakan aljabar linear dan matriks modular.
                    Pilih ukuran matriks kunci yang diinginkan.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: input + matrix config */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Input */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <label className="block mb-3">
                            <span className="text-slate-900 font-semibold text-sm">Masukkan Teks</span>
                            <span className="ml-2 text-slate-400 text-xs font-normal">Hanya huruf A-Z</span>
                        </label>
                        <textarea
                            className="w-full h-40 bg-slate-50 border border-slate-200 rounded-lg p-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-mono text-sm leading-relaxed transition-all"
                            placeholder="Ketik pesan yang ingin dienkripsi. Contoh: ATTACKATDAWN"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                        />
                        <div className="flex justify-between items-center mt-3 text-xs text-slate-500">
                            <span>
                                {charCount} karakter
                                {charCount % matrixSize !== 0 && charCount > 0 &&
                                    ` → dipad ke ${charCount + (matrixSize - (charCount % matrixSize))} dengan 'X'`}
                            </span>
                            <button
                                onClick={() => setInputText("")}
                                className="text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                                Bersihkan
                            </button>
                        </div>
                    </div>

                    {/* Matrix config */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h3 className="text-slate-900 font-bold text-sm">Konfigurasi Kunci</h3>
                                <p className="text-slate-500 text-xs mt-0.5">Nilai tiap sel: 0 – 25</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={resetMatrix}
                                    className="text-xs font-medium text-slate-600 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors border border-slate-200"
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={randomize}
                                    className="text-xs font-medium text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors border border-indigo-200"
                                >
                                    Acak
                                </button>
                            </div>
                        </div>

                        {/* Size selector */}
                        <div className="mb-5">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                Ukuran Matriks
                            </p>
                            <div className="flex gap-2">
                                {SIZES.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => changeSize(s)}
                                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all border ${matrixSize === s
                                                ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200"
                                                : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                                            }`}
                                    >
                                        {s}×{s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Matrix inputs */}
                        <div className="flex flex-col sm:flex-row gap-6 items-start">
                            <div
                                className={`grid ${GRID_COLS[matrixSize]} gap-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200`}
                            >
                                {currentMatrix.map((val, i) => (
                                    <input
                                        key={`${matrixSize}-${i}`}
                                        className="w-11 h-11 text-center rounded-lg border-slate-300 bg-white text-slate-900 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm shadow-sm"
                                        max="25"
                                        min="0"
                                        type="number"
                                        value={val}
                                        onChange={(e) => updateCell(i, e.target.value)}
                                    />
                                ))}
                            </div>
                            <div className="flex-1 space-y-3 pt-1">
                                <div
                                    className={`flex items-center gap-2 text-xs font-medium p-2 rounded border ${isValid
                                            ? "text-green-700 bg-green-50 border-green-200"
                                            : "text-red-600 bg-red-50 border-red-200"
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-sm">
                                        {isValid ? "check_circle" : "error"}
                                    </span>
                                    {isValid ? "Matriks Invertibel (Valid)" : "Matriks Tidak Dapat Diinvers!"}
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Matriks: <span className="font-mono font-bold">{matrixSize}×{matrixSize}</span>
                                    <br />
                                    Determinan: <span className="font-mono font-bold">{rawDet}</span>
                                    <br />
                                    Det mod 26: <span className="font-mono font-bold">{det}</span>
                                    <br />
                                    GCD(Det, 26): <span className="font-mono font-bold">{gcd(det, 26)}</span>
                                </p>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    GCD harus = 1 agar bisa didekripsi.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: mode switch + run + output */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="flex flex-col gap-3">
                        {/* Mode switch */}
                        <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
                            <button
                                onClick={() => setMode("encrypt")}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${mode === "encrypt"
                                        ? "bg-indigo-600 text-white shadow-md"
                                        : "text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                <span className="material-symbols-outlined text-[18px]">lock</span>
                                Enkripsi
                            </button>
                            <button
                                onClick={() => setMode("decrypt")}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${mode === "decrypt"
                                        ? "bg-indigo-600 text-white shadow-md"
                                        : "text-slate-500 hover:text-slate-700"
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
                            <span className="material-symbols-outlined text-[20px]">
                                {mode === "encrypt" ? "lock" : "lock_open"}
                            </span>
                            {mode === "encrypt" ? "Enkripsi Pesan" : "Dekripsi Pesan"}
                        </button>
                    </div>

                    {/* Output */}
                    <div className="bg-slate-100 text-slate-900 rounded-xl shadow-lg overflow-hidden flex flex-col min-h-[300px] border border-slate-200">
                        <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
                            <span className="font-mono text-xs uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                <span className="material-symbols-outlined text-emerald-500 text-[18px]">terminal</span>
                                Hasil Output
                            </span>
                            <button
                                onClick={() => outputText && navigator.clipboard.writeText(outputText)}
                                className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors text-slate-400 hover:text-slate-700"
                                title="Salin"
                            >
                                <span className="material-symbols-outlined text-sm">content_copy</span>
                            </button>
                        </div>
                        <div className="flex-1 p-6 font-mono text-sm leading-relaxed text-slate-700 overflow-y-auto">
                            {outputText ? (
                                <span className="break-all">{outputText}</span>
                            ) : (
                                <div className="flex flex-col gap-4 h-full justify-center items-center text-center text-slate-400">
                                    <span className="material-symbols-outlined text-4xl opacity-50">terminal</span>
                                    <p>Hasil enkripsi atau dekripsi akan muncul di sini.</p>
                                </div>
                            )}
                        </div>
                        <div className="bg-slate-50 p-3 text-xs text-slate-400 text-center border-t border-slate-200">
                            Kripto Klasik — Hill {matrixSize}×{matrixSize}
                        </div>
                    </div>

                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex gap-3">
                        <span className="material-symbols-outlined text-indigo-600 mt-0.5">info</span>
                        <div className="text-xs text-slate-600 leading-relaxed">
                            <strong className="text-slate-900 block mb-1">Catatan Penting</strong>
                            Teks diproses dalam blok {matrixSize} huruf. Karakter{" "}
                            <span className="font-mono font-bold">&apos;X&apos;</span> ditambahkan
                            otomatis jika panjang teks bukan kelipatan {matrixSize}.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
