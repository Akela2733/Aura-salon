import { useState, FormEvent } from "react";
import { Star, MessageSquare, PenTool, Check } from "lucide-react";

interface Testimonial {
  id: string;
  guest: string;
  rating: number;
  review: string;
  service: string;
  date: string;
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    guest: "Dilini Rajapaksa",
    rating: 5,
    review: "The Colombo Sunset Balayage is absolute perfection. Menaka Fernando is a master of warm tones and light reflections.",
    service: "Sunset Balayage",
    date: "2026-06-20"
  },
  {
    id: "t2",
    guest: "Shihan Mendis",
    rating: 5,
    review: "An absolute sanctuary. The Ayurvedic head massage by Yolanda took me to a place of complete quietude. Colombo 7's best secret.",
    service: "Ayurvedic Spa Massage",
    date: "2026-06-18"
  },
  {
    id: "t3",
    guest: "Amali Karunaratne",
    rating: 5,
    review: "Anura's geometric bob cut is structural art. The hair moves with such natural weight and perimeter alignment.",
    service: "Geometric Dry Cut",
    date: "2026-06-15"
  },
  {
    id: "t4",
    guest: "Ranil Samaranayake",
    rating: 5,
    review: "Luxury in every detail. The virtual walkthrough is gorgeous, booking is seamless, and the physical studio is extremely serene.",
    service: "Premium Grooming & Style",
    date: "2026-06-10"
  }
];

export default function ClientTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);
  const [guestName, setGuestName] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !reviewText.trim()) return;

    const newTestimonial: Testimonial = {
      id: "t-custom-" + Date.now(),
      guest: guestName.trim(),
      rating,
      review: reviewText.trim(),
      service: serviceName.trim() ? serviceName.trim() : "Custom Salon Treatment",
      date: new Date().toISOString().split("T")[0]
    };

    setTestimonials((prev) => [newTestimonial, ...prev]);
    setGuestName("");
    setReviewText("");
    setServiceName("");
    setRating(5);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="mt-6 glass-card rounded-2xl p-6 backdrop-blur-xl text-white animate-fade-in">
      <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
        <MessageSquare className="h-6 w-6 text-amber-400" />
        <div>
          <h3 className="font-display text-lg font-semibold text-white">Guest Testimonials</h3>
          <p className="font-sans text-xs text-white/50">Station 02 — Read verified reviews or share your experience</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-5">
        {/* Left Column: Form (2/5 size) */}
        <div className="md:col-span-2 border-r border-white/10 pr-0 md:pr-6 space-y-4 text-left">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-amber-400 font-bold">
            <PenTool className="h-4 w-4" /> Share Your Experience
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-mono text-[10px] text-white/50 uppercase tracking-widest mb-1.5 font-semibold">Your Name</label>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Jane Perera"
                className="glass-input w-full rounded-lg p-3 font-sans text-xs"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] text-white/50 uppercase tracking-widest mb-1.5 font-semibold">Treatment / Service Received</label>
              <input
                type="text"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="e.g., Geometric Bob Cut"
                className="glass-input w-full rounded-lg p-3 font-sans text-xs"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] text-white/50 uppercase tracking-widest mb-1.5 font-semibold">Experience Rating</label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-5 w-5 ${
                        star <= rating ? "fill-amber-400 text-amber-400" : "text-white/20"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-mono text-[10px] text-white/50 uppercase tracking-widest mb-1.5 font-semibold">Review Comment</label>
              <textarea
                required
                rows={3}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Describe your session, treatment, or styling results..."
                className="glass-input w-full rounded-lg p-3 font-sans text-xs resize-none"
              />
            </div>

            <button
              type="submit"
              className={`w-full flex items-center justify-center gap-2 rounded-lg py-3 text-xs font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                submitted
                  ? "bg-emerald-600 text-white"
                  : "bg-amber-600 text-white hover:bg-amber-700"
              }`}
            >
              {submitted ? (
                <>
                  <Check className="h-4 w-4" /> Review Submitted
                </>
              ) : (
                "Submit Review"
              )}
            </button>
          </form>
        </div>

        {/* Right Column: List of Testimonials (3/5 size) */}
        <div className="md:col-span-3 space-y-4 max-h-[360px] overflow-y-auto pr-1.5 hud-scroll text-left">
          <div className="font-mono text-xs uppercase tracking-wider text-amber-400 font-bold mb-1">
            Verified Guest Reviews ({testimonials.length})
          </div>

          <div className="space-y-3.5">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-xl border border-white/10 bg-black/20 space-y-2 hover:border-amber-500/20 transition-all duration-300"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="font-sans text-sm font-semibold text-white block">{t.guest}</span>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-amber-500/70 block mt-0.5">
                      {t.service} • {t.date}
                    </span>
                  </div>
                  <div className="flex gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`h-3 w-3 ${
                          idx < t.rating ? "fill-amber-400 text-amber-400" : "text-white/10"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="font-sans text-xs text-white/70 leading-relaxed italic font-light">
                  "{t.review}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
