import { SalonService, SalonProduct } from "../types";

export const SALON_PRODUCTS: SalonProduct[] = [
  { id: "p-shampoo", name: "Professional Shampoo (Kérastase Paris)", price: 4800, description: "Nutritive lipid formulation for architectural hair shine and bounce.", category: "hair_care" },
  { id: "p-serum", name: "Hair Serum (Moroccanoil Infusion)", price: 5500, description: "Infused with pure cold-pressed argan oil to defend against humidity.", category: "hair_care" },
  { id: "p-mask", name: "Hair Mask (Aura Clay Sanctuary)", price: 6200, description: "Intense ocean silt mask with wild-harvested mint and gotukola.", category: "hair_care" },
  { id: "p-cleanser", name: "Facial Cleanser (Dermalogica Active)", price: 3900, description: "Ultra-gentle deep pore cleanser with lavender and tea tree extracts.", category: "skin_care" },
  { id: "p-toner", name: "Botanical Toner (Aveda Rose Silt)", price: 4200, description: "Rebalancing hydration spray utilizing organic micro-distilled hydrosols.", category: "skin_care" },
  { id: "p-foundation", name: "HD Foundation (M·A·C Studio)", price: 7800, description: "Long-lasting camera-ready liquid foundation with SPF protection.", category: "makeup" },
  { id: "p-palette", name: "Nude Eyeshadow Palette (Anastasia)", price: 8500, description: "Sartorial Earth tones formulated with highly concentrated mineral pigments.", category: "makeup" },
  { id: "p-polish", name: "Nail Polish Collection (OPI Infinite)", price: 2800, description: "Chip-resistant rich pastel formula featuring dual-coat lacquer technology.", category: "nail" }
];

export const SALON_SERVICES: SalonService[] = [
  // Hair Services
  { id: "h-cut", name: "Haircut & Styling", duration: "45 mins", price: 2500, description: "Precision trim & signature styling mapped to your hair's geometric volume.", stationIndex: 1, category: "hair" },
  { id: "h-color", name: "Hair Coloring", duration: "90 mins", price: 12000, description: "Bespoke highlights or balayage with ammonia-free premium organic pigments.", stationIndex: 2, category: "hair" },
  { id: "h-treat", name: "Hair Treatments", duration: "60 mins", price: 8000, description: "Deep botanical restoration mask and essential oils for luxurious silk texture.", stationIndex: 1, category: "hair" },
  { id: "h-straight", name: "Hair Straightening", duration: "120 mins", price: 15000, description: "Sleek organic keratin therapy for long-lasting frizz-free shine and structure.", stationIndex: 3, category: "hair" },
  { id: "h-spa", name: "Hair Spa", duration: "50 mins", price: 4500, description: "Quiet rinse, mineral steam towel, cold eye relief, and wild mint massage.", stationIndex: 1, category: "hair" },
  { id: "h-bridal", name: "Bridal Hair Styling", duration: "90 mins", price: 10000, description: "Elegant, customized headwear-compatible hair design for your special day.", stationIndex: 4, category: "hair" },

  // Makeup Services
  { id: "m-party", name: "Party Makeup", duration: "60 mins", price: 5000, description: "Sophisticated and luminous evening look tailored for high-profile gatherings.", stationIndex: 4, category: "makeup" },
  { id: "m-bridal", name: "Bridal Makeup", duration: "120 mins", price: 25000, description: "Exquisite waterproof high-definition airbrush makeup with glowing contours.", stationIndex: 4, category: "makeup" },
  { id: "m-event", name: "Event Makeup", duration: "75 mins", price: 8000, description: "Bespoke camera-ready styling for private occasions and long-lasting wear.", stationIndex: 4, category: "makeup" },
  { id: "m-photo", name: "Photoshoot Makeup", duration: "90 mins", price: 12000, description: "Studio-balanced matte lighting application customized under specialized ring light rigs.", stationIndex: 4, category: "makeup" },

  // Nail Services
  { id: "n-mani", name: "Manicure", duration: "40 mins", price: 3000, description: "Soothing cuticle care, natural ocean mineral soak, and professional polish.", stationIndex: 0, category: "nail" },
  { id: "n-pedi", name: "Pedicure", duration: "45 mins", price: 3500, description: "Lavender sea salt scrub, pressure point foot massage, and luxury coat.", stationIndex: 0, category: "nail" },
  { id: "n-ext", name: "Nail Extensions", duration: "80 mins", price: 6000, description: "Seamless, premium quality extensions shaped to your preferred silhouette.", stationIndex: 0, category: "nail" },
  { id: "n-art", name: "Nail Art", duration: "30 mins", price: 2500, description: "Hand-painted minimal geometric lines or organic botanical patterns.", stationIndex: 0, category: "nail" },

  // Skin Care
  { id: "s-facial", name: "Facials", duration: "60 mins", price: 5000, description: "Deep botanical extraction, pore balancing, and cold-pressed oil moisture infusion.", stationIndex: 1, category: "skin" },
  { id: "s-cleanup", name: "Cleanups", duration: "45 mins", price: 3500, description: "Exfoliating sea clay peel and refresh designed for immediate radiance.", stationIndex: 1, category: "skin" },
  { id: "s-treatment", name: "Skin Treatments", duration: "75 mins", price: 10000, description: "Therapeutic vitamin-rich serum therapy and active oxygen skin hydration.", stationIndex: 1, category: "skin" },
  { id: "s-aging", name: "Anti-Aging Treatments", duration: "90 mins", price: 12000, description: "Gold leaf luxury peptide lift and microcurrent collagen stimulation.", stationIndex: 1, category: "skin" },

  // Spa Services
  { id: "sp-body", name: "Full Body Spa", duration: "90 mins", price: 9000, description: "Aromatherapy oil massage with heated river stones and full sensory alignment.", stationIndex: 1, category: "spa" },
  { id: "sp-head", name: "Head Massage", duration: "30 mins", price: 4500, description: "Traditional Ayurvedic warm oil head and neck tension relief session.", stationIndex: 1, category: "spa" },
  { id: "sp-relax", name: "Relaxation Therapy", duration: "60 mins", price: 6000, description: "Sandalwood sensory body wrap, relaxing ambient sounds, and steam therapy.", stationIndex: 1, category: "spa" },

  // Special Packages
  { id: "pkg-hair", name: "Hair Package", duration: "60 mins", price: 2500, description: "Starting package featuring signature geometric dry sculpture and conditioning.", stationIndex: 3, category: "package" },
  { id: "pkg-makeup", name: "Makeup Package", duration: "65 mins", price: 5000, description: "Starter package for evening wear and luminous glowing highlight aesthetics.", stationIndex: 4, category: "package" },
  { id: "pkg-bridal", name: "Bridal Package", duration: "180 mins", price: 25000, description: "Full luxury wedding ritual including bespoke bridal hair and waterproof makeup.", stationIndex: 5, category: "package" },
  { id: "pkg-spa", name: "Spa Package", duration: "45 mins", price: 4500, description: "Holistic bundle including Ayurvedic head massage and cold stone eye relief.", stationIndex: 1, category: "package" }
];
