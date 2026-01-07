# Présentation du site APPÂT

## 1. Objectif du site
- Mettre en avant l’agence créative APPÂT : vidéo, direction artistique, photo.
- Inspirer confiance via le portfolio (vidéos/photographies) et l’équipe.
- Générer du contact (formulaire + chat d’assistance).

## 2. Stack et architecture
- Frontend : React 18 + Vite + TypeScript, styling Tailwind.
- Assets statiques : `public/` (vidéo de fond, photos shooting, portraits équipe, logo).
- Composant unique `src/App.tsx` pour structurer toutes les sections.
- Chat relié à une fonction edge Supabase (rule-based) dans `supabase/functions/chatbot`.

## 3. Parcours utilisateur
- **Arrivée sur la Hero** : l’utilisateur est directement plongé dans une vidéo plein écran qui pose l’univers d’APPÂT. Les gros titres et les CTA “Voir nos réalisations” et “Discutons” servent à capter l’attention et proposer tout de suite deux choix : découvrir le portfolio ou entrer en contact.
- **Descente vers “À propos”** : en scrollant, il découvre un texte court qui explique l’ADN de l’agence, accompagné d’une grille de compétences (Pub, Interview, Motion, Photo, Réel). Cette étape contextualise ce que l’utilisateur a vu dans la Hero.
- **Découverte de l’équipe** : juste après, la section “Équipe” met des visages sur la marque, avec des cartes type glassmorphism. L’objectif est de renforcer la confiance avant de montrer le portfolio détaillé.
- **Exploration du portfolio vidéo** : la section “Vidéos” propose un filtrage par catégorie (Interview, Motion, Pub, Réel). L’utilisateur peut cibler ce qui l’intéresse, puis ouvrir chaque vidéo dans une modale pour la visionner sans quitter la page.
- **Mise en avant du shooting photo** : la section “Photos” complète le portfolio en montrant la dimension shooting photo. La lightbox plein écran et la navigation fluide permettent de parcourir les images comme une galerie professionnelle.
- **Prise de contact** : en fin de parcours, la section “Contact” propose un formulaire simple (nom, email, message) pour transformer l’intérêt en prise de brief. En parallèle, le bouton de chat est disponible à tout moment pour poser une question rapide.
- **Footer** : il clôt la page avec le logo et les mentions, en rappelant la marque sans surcharger l’utilisateur.

## 4. Interactions et UX
- Navbar collante qui s’opacifie au scroll.
- Filtres dynamiques pour les vidéos.
- Modales (vidéo) et lightbox (photos).
- Bouton de chat flottant, fenêtre de discussion avec historique, auto-scroll, indicateur de saisie.
- Micro-interactions : hover, focus states accessibles, barres de scroll custom, transitions douces.

## 5. Chatbot (Supabase Edge Function)
- Fonction `chatbot/index.ts` : CORS ouvert, POST JSON.
- Détection par mots-clés (salut, projet, contact, prix, délai, compétences).
- Réponses piochées dans un set prédéfini, retournées au front.
- Appel côté client : fetch `${VITE_SUPABASE_URL}/functions/v1/chatbot` avec clé anon.

## 6. Points forts à souligner
- Expérience premium : vidéo de fond, glassmorphism, gradients, typographie sobre.
- Mise en avant de l’équipe + portfolio (vidéos filtrables, lightbox photo).
- Chat serverless léger, sans backend lourd.
- Performances/UX : lazy loading images, scroll lissé, focus states.

## 7. Limites et pistes d’évolution
- Formulaire contact : pas d’envoi réel → à connecter à un service mail/API.
- Chatbot : logique mots-clés → à upgrader pour des réponses contextuelles.
- Vidéos sur Google Drive → prévoir CDN/hébergement propre + fallback.
- Pas de tests ni analytics intégrés → ajouter monitoring et métriques.

## 8. Scripts et développement
- `npm run dev` : serveur de dev Vite.
- `npm run build` : build production.
- `npm run preview` : prévisualisation du build.
- `npm run lint` / `npm run typecheck` : qualité et types.

## 9. Structure des fichiers principaux
- `src/App.tsx` : logique UI et sections.
- `src/index.css` : bases Tailwind + styles globaux.
- `public/` : assets (vidéo, photos shooting, portraits, logo).
- `supabase/functions/chatbot/index.ts` : fonction edge du chat.
- `vite.config.ts`, `tailwind.config.js`, `package.json` : configuration outil/stack.

