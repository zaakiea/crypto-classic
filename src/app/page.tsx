"use client";

import { useState } from "react";
import { vigenere, toAlpha } from "@/lib/ciphers";

export default function VigenereScreen() {
  const [inputText, setInputText] = useState("");
  const [cipherKey, setCipherKey] = useState("");
  const [outputText, setOutputText] = useState("");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [status, setStatus] = useState<"ready" | "ok" | "error">("ready");
  const [elapsed, setElapsed] = useState(0);

  function runCipher(m: "encrypt" | "decrypt" = mode) {
    const t0 = performance.now();
    try {
      const result = vigenere(inputText, cipherKey, mode);
      setOutputText(result);
      setStatus("ok");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setOutputText(`❌ Error: ${msg}`);
      setStatus("error");
    }
    setElapsed(Math.round(performance.now() - t0));
  }

  function handleCopy() {
    if (outputText) navigator.clipboard.writeText(outputText);
  }

  const charCount = toAlpha(inputText).length;
  const lineCount = outputText ? Math.ceil(outputText.length / 60) : 5;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 5) }, (_, i) => i + 1);

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-10">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight mb-3">
              Vigenère Cipher
            </h2>
            <p className="text-slate-500 text-lg max-w-3xl leading-relaxed">
              Metode enkripsi teks alfabetik dengan menggunakan serangkaian
              sandi Caesar berdasarkan huruf-huruf pada kata kunci.
            </p>
          </div>
          <div className="hidden lg:block">
            <button className="size-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer shadow-sm">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Input card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-500 text-[20px]">input</span>
                Input Teks
              </label>
              <span className="text-[10px] font-mono text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">
                PLAINTEXT / CIPHERTEXT
              </span>
            </div>
            <div className="p-2">
              <textarea
                className="w-full min-h-[200px] resize-y border-0 bg-transparent p-4 text-base text-slate-900 placeholder:text-slate-400 focus:ring-0 leading-relaxed font-mono"
                placeholder="Masukkan pesan yang ingin dienkripsi atau didekripsi di sini..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>
            <div className="bg-slate-50 px-4 py-2 flex justify-between items-center border-t border-slate-100">
              <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">upload_file</span>
                Upload File
              </button>
              <span className="text-xs text-slate-400">{charCount} Karakter</span>
            </div>
          </div>

          {/* Key config card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2 uppercase tracking-wide">
              <span className="material-symbols-outlined text-indigo-500 text-[20px]">tune</span>
              Konfigurasi Kunci
            </h3>
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Kata Kunci (Hanya Alfabet)
                </label>
                <div className="relative group">
                  <input
                    className="w-full rounded-lg border-slate-200 bg-slate-50 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 pl-10 pr-4 py-2.5 transition-all"
                    placeholder="Contoh: SECRETKEY"
                    type="text"
                    value={cipherKey}
                    onChange={(e) => setCipherKey(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-400 group-focus-within:text-indigo-500 transition-colors text-[20px]">vpn_key</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">info</span>
                  Kunci harus berupa huruf A-Z tanpa spasi.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-8">
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

        {/* Right column — output */}
        <div className="lg:col-span-5 h-full">
          <div className="bg-slate-100 rounded-xl shadow-xl border border-slate-200 overflow-hidden h-full flex flex-col min-h-[500px]">
            <div className="px-5 py-3 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-500 text-[20px]">terminal</span>
                Hasil Output
              </label>
              <button
                onClick={handleCopy}
                className="text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5 text-xs font-medium bg-slate-200/60 hover:bg-slate-200 px-2.5 py-1.5 rounded-md border border-slate-200"
              >
                <span className="material-symbols-outlined text-[14px]">content_copy</span>
                Salin
              </button>
            </div>
            <div className="flex-1 p-0 relative font-mono text-sm">
              <div className="absolute inset-0 flex">
                <div className="w-12 bg-slate-200/50 border-r border-slate-200 py-4 text-right pr-3 text-slate-400 select-none leading-relaxed text-xs">
                  {lineNumbers.map((n) => (
                    <div key={n}>{n}</div>
                  ))}
                </div>
                <textarea
                  className="flex-1 w-full h-full bg-transparent border-0 p-4 text-slate-700 resize-none focus:ring-0 leading-relaxed placeholder:text-slate-400 text-sm"
                  placeholder="// Hasil enkripsi atau dekripsi akan muncul di sini..."
                  value={outputText}
                  readOnly
                />
              </div>
            </div>
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <div
                  className={`size-2 rounded-full ${status === "ok"
                    ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                    : status === "error"
                      ? "bg-red-500"
                      : "bg-slate-400"
                    } ${status === "ready" ? "" : "animate-pulse"}`}
                />
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">
                  {status === "ok" ? "Success" : status === "error" ? "Error" : "System Ready"}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                UTF-8 • {elapsed}ms
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
