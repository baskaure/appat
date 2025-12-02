import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  message: string;
  conversationHistory?: Array<{ role: string; content: string }>;
}

const responses: { [key: string]: string[] } = {
  greeting: [
    "Bonjour! Je suis l'assistant de Chirurgic Eyes. Comment puis-je vous aider?",
    "Bienvenue! Je suis ici pour répondre à vos questions sur nos services de production vidéo.",
  ],
  project: [
    "Nous travaillons sur des projets variés incluant des films publicitaires, clips musicaux, documentaires et contenus de marque. Quel type de projet vous intéresse?",
    "Nos domaines d'expertise incluent la direction artistique, la production vidéo, le montage et la post-production. Parlez-moi de votre vision!",
  ],
  contact: [
    "Vous pouvez nous contacter via le formulaire de contact en bas de la page ou directement par message ici. Quel est votre projet?",
    "N'hésitez pas à nous envoyer les détails de votre projet via le formulaire. Nous serons ravi de discuter avec vous!",
  ],
  pricing: [
    "Les tarifs varient selon la complexité et l'envergure du projet. Décrivez-moi votre projet pour une estimation personnalisée.",
    "Chaque projet est unique et nous proposons des devis adaptés à vos besoins. Quel budget avez-vous en tête?",
  ],
  timeline: [
    "La durée dépend de la nature du projet. Les petits projets prennent généralement 2-3 semaines, les plus importants 6-8 semaines.",
    "Nous nous adaptons à vos délais. Dites-moi vos attentes et nous verrons ce que nous pouvons faire!",
  ],
  skills: [
    "Nous maîtrisons la direction artistique, la production vidéo, le montage, la post-production, le color grading et le storytelling.",
    "Notre équipe spécialisée peut gérer tous les aspects de votre projet vidéo, du concept à la livraison finale.",
  ],
  default: [
    "C'est une excellente question! Pouvez-vous me donner plus de détails? Avez-vous un projet spécifique en tête?",
    "Intéressant! Parlez-moi davantage de ce que vous recherchez pour mieux vous aider.",
    "Je comprends. Dites-moi en plus pour que je puisse vous proposer la meilleure solution!",
  ],
};

function matchKeywords(text: string): string {
  const lower = text.toLowerCase();

  if (
    lower.includes("bonjour") ||
    lower.includes("salut") ||
    lower.includes("hello") ||
    lower.includes("hi")
  ) {
    return "greeting";
  }

  if (
    lower.includes("projet") ||
    lower.includes("vidéo") ||
    lower.includes("film") ||
    lower.includes("produit")
  ) {
    return "project";
  }

  if (
    lower.includes("contact") ||
    lower.includes("email") ||
    lower.includes("appel") ||
    lower.includes("discussion")
  ) {
    return "contact";
  }

  if (
    lower.includes("prix") ||
    lower.includes("tarif") ||
    lower.includes("coût") ||
    lower.includes("budget")
  ) {
    return "pricing";
  }

  if (
    lower.includes("délai") ||
    lower.includes("temps") ||
    lower.includes("durée") ||
    lower.includes("combien de temps")
  ) {
    return "timeline";
  }

  if (
    lower.includes("compétence") ||
    lower.includes("service") ||
    lower.includes("expertise") ||
    lower.includes("montage") ||
    lower.includes("color grading")
  ) {
    return "skills";
  }

  return "default";
}

function getRandomResponse(category: string): string {
  const categoryResponses = responses[category] || responses.default;
  return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
}

Deno.serve(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    const body: RequestBody = await req.json();
    const userMessage = body.message || "";

    if (!userMessage.trim()) {
      return new Response(
        JSON.stringify({
          reply: "Veuillez poser une question ou écrire un message.",
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const category = matchKeywords(userMessage);
    const reply = getRandomResponse(category);

    return new Response(JSON.stringify({ reply }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        reply: "Une erreur est survenue. Veuillez réessayer.",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
