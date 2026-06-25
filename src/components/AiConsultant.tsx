import { useState } from "react";
import { Sparkles, Loader2, ArrowRight, BookCheck, ClipboardList } from "lucide-react";
import { StyleProfile } from "../types";

interface AiConsultantProps {
  clientName: string;
  onProfileGenerated: (profile: StyleProfile) => void;
  savedProfile: StyleProfile | null;
}

const HAIR_TYPES = ["Straight (1A-1C)", "Wavy (2A-2C)", "Curly (3A-3C)", "Coily (4A-4C)"];

const HAIR_CONCERNS_LIST = [
  "High Tropical Humidity Frizz",
  "Sun & Chlorine Dryness",
  "Lacking Volume & Bounce",
  "Scalp Sensitivity / Hydration",
  "Heat & Chemical Damage",
  "Density & Thinning Management"
];

export default function AiConsultant({ clientName, onProfileGenerated, savedProfile }: AiConsultantProps) {
  const [hairType, setHairType] = useState(HAIR_TYPES[0]);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [desiredStyle, setDesiredStyle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [consultationResult, setConsultationResult] = useState<string | null>(savedProfile?.aiRecommendation || null);

  const toggleConcern = (concern: string) => {
    setSelectedConcerns((prev) =>
      prev.includes(concern) ? prev.filter((c) => c !== concern) : [...prev, concern]
    );
  };

  const generateStylingProfile = async () => {
    if (!desiredStyle.trim()) {
      setError("Please describe your desired hairstyle or aesthetic.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hairType,
          hairConcerns: selectedConcerns,
          desiredStyle,
          clientName
        })
      });

      if (!response.ok) {
        throw new Error("Our AI consultant is busy with another guest. Please try again.");
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setConsultationResult(data.recommendation);
      onProfileGenerated({
        hairType,
        hairConcerns: selectedConcerns,
        desiredStyle,
        aiRecommendation: data.recommendation,
        createdAt: new Date().toISOString()
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected issue occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 glass-card rounded-2xl p-6 md:p-8 text-white animate-fade-in">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <Sparkles className="h-6 w-6 text-amber-400 animate-pulse" />
        <div>
          <h3 className="font-display text-lg font-semibold text-white">AI Stylist Consultant</h3>
          <p className="font-sans text-xs text-white/50">Powered by Google Gemini 2.5 — Custom Luxury Profiles</p>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {/* Hair Type Selector */}
        <div>
          <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-amber-400 font-semibold">
            1. Select Hair Texture Category
          </label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {HAIR_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setHairType(t)}
                className={`rounded-xl border p-3.5 text-left text-xs font-sans transition-all duration-300 cursor-pointer ${
                  hairType === t
                    ? "border-amber-500/50 bg-amber-500/10 text-amber-300 font-medium"
                    : "border-white/10 bg-white/5 text-white/60 hover:border-amber-500/30"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Hair Concerns Checklist */}
        <div>
          <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-amber-400 font-semibold">
            2. Identify Tropical Environment Concerns
          </label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              const active = selectedConcerns.includes(concern);
              return (
                <button
                  key={concern}
                  onClick={() => toggleConcern(concern)}
                  className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-left text-xs font-sans transition-all duration-300 cursor-pointer ${
                    active
                      ? "border-amber-500/50 bg-amber-500/10 text-amber-300"
                      : "border-white/10 bg-white/5 text-white/60 hover:border-amber-500/30"
                  }`}
                >
                  <div
                    className={`h-3.5 w-3.5 rounded-sm border transition-all flex-shrink-0 ${
                      active ? "border-amber-500 bg-amber-500" : "border-white/20 bg-white/5"
                    }`}
                  />
                  <span>{concern}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Desired Style Input */}
        <div>
          <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-amber-400 font-semibold">
            3. Describe Desired Silhouette / Palette
          </label>
          <textarea
            value={desiredStyle}
            onChange={(e) => setDesiredStyle(e.target.value)}
            placeholder="e.g., A textured modern bob suited to wear parted, or warm balayage highlights capturing Sri Lankan sunrise, minimal maintenance."
            rows={3}
            className="glass-input w-full rounded-lg p-3.5 font-sans text-sm"
          />
        </div>

        {error && <p className="font-mono text-xs text-red-500">{error}</p>}

        <button
          onClick={generateStylingProfile}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 btn-gold rounded-xl py-4 text-sm font-mono uppercase tracking-widest disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Drafting AI Architecture...
            </>
          ) : (
            <>
              Generate Luxury Blueprint <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        {/* Output AI Recommendations */}
        {consultationResult && (
          <div className="mt-6 rounded-xl border border-amber-500/20 bg-black/40 p-6 text-left">
            <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
              <ClipboardList className="h-5 w-5 text-amber-400" />
              <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-semibold">
                AI Custom Styling Blueprint
              </span>
            </div>

            <div className="mt-4 max-h-64 overflow-y-auto pr-1 hud-scroll text-sm leading-relaxed text-white/80 whitespace-pre-line font-sans">
              {consultationResult}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3.5 font-mono text-xs text-white/30">
              <span className="flex items-center gap-1.5">
                <BookCheck className="h-4 w-4 text-emerald-600" /> Synced to booking plan
              </span>
              <span>Colombo 7 Station 03</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
