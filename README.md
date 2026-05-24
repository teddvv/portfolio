# Portfolio — Teddy Pategou

> Portfolio personnel développé dans le cadre du module Web Design d'Epitech Strasbourg (Promo 2028).

**Stack :** React 18 + Vite + Tailwind CSS + Lucide Icons

---

## 🚀 Démarrage rapide

### Prérequis
- [Node.js](https://nodejs.org/) version 18 ou supérieure
- npm (livré avec Node)

### Installation
```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement
npm run dev
```

Le site sera accessible sur `http://localhost:5173`.

### Build de production
```bash
npm run build      # Génère le dossier dist/
npm run preview    # Prévisualise le build localement
```

---

## 📁 Structure du projet

```
portfolio-teddy/
├── public/                  # Assets statiques servis tels quels
│   ├── photo-pro.jpg        # Photo professionnelle
│   ├── cv-teddy-pategou.pdf # CV téléchargeable
│   ├── favicon.svg          # Favicon
│   └── projects/            # Screenshots des projets
├── src/
│   ├── App.jsx              # Composant principal (toutes les sections)
│   ├── main.jsx             # Point d'entrée React
│   └── index.css            # Tailwind + styles globaux
├── .github/workflows/
│   └── deploy.yml           # CI/CD GitHub Pages
├── index.html               # HTML avec meta SEO
├── vite.config.js           # Config Vite (base path GitHub Pages)
├── tailwind.config.js       # Config Tailwind
└── package.json
```

---

## 🌐 Déploiement sur GitHub Pages

### Étape 1 — Créer le dépôt GitHub

```bash
# Initialiser git dans le dossier
git init
git add .
git commit -m "Initial commit: portfolio"

# Créer un dépôt sur GitHub (ex. https://github.com/teddvv/portfolio)
git remote add origin https://github.com/teddvv/portfolio.git
git branch -M main
git push -u origin main
```

### Étape 2 — Adapter le base path

Ouvre `vite.config.js` et vérifie que `base` correspond bien au **nom de ton dépôt** :

```js
export default defineConfig({
  plugins: [react()],
  base: '/portfolio/',  // 👈 Remplace par '/nom-de-ton-repo/'
});
```

> Si tu utilises un domaine personnalisé ou un site utilisateur (ex. `teddvv.github.io`), mets `base: '/'`.

### Étape 3 — Activer GitHub Pages

1. Va sur ton dépôt GitHub → onglet **Settings**
2. Dans la sidebar : **Pages**
3. Sous **Build and deployment** → **Source** : sélectionne **GitHub Actions**

### Étape 4 — Déployer

Le workflow `.github/workflows/deploy.yml` se lance automatiquement à chaque push sur la branche `main`. Tu peux suivre le build dans l'onglet **Actions** du dépôt.

À la fin du déploiement, ton site sera accessible à :
```
https://teddvv.github.io/portfolio/
```

---

## ✏️ Personnaliser le contenu

Tout le contenu se trouve dans `src/App.jsx`. Les sections sont clairement séparées par des commentaires `{/* === SECTION === */}` :

- **HERO** — Catchphrase et accroche
- **ABOUT** — Bio et stats
- **WORK** — Les 3 projets (TARDIS, BracketBot, NextBuy)
- **QUOTE** — Citation
- **JOURNEY** — Apprentissages de l'année
- **BEYOND** — Expériences hors école
- **INTERESTS** — Centres d'intérêt
- **CONTACT** — Formulaire et liens

### Mettre à jour le CV
Remplace simplement le fichier `public/cv-teddy-pategou.pdf` par la nouvelle version (même nom).

### Ajouter un projet
1. Place les screenshots dans `public/projects/`
2. Dans `App.jsx`, copie/colle un des blocs `<Reveal>` de la section WORK
3. Adapte le titre, la description, les technos et les chemins d'image

### Modifier les meta tags SEO
Tout est dans `index.html` (description, Open Graph, Twitter Card).

---

## 📊 Performance & SEO

Pour vérifier la qualité du site, lance Lighthouse :

```bash
npm run build && npm run preview
```

Puis dans Chrome DevTools → onglet **Lighthouse** → **Analyze page load**.

Les bonnes pratiques déjà appliquées :
- ✅ Meta tags complets (Open Graph, Twitter Card)
- ✅ Images optimisées et redimensionnées
- ✅ Préchargement des polices Google Fonts
- ✅ Lazy loading natif des images (à activer si besoin avec `loading="lazy"`)
- ✅ Smooth scroll et animations performantes (IntersectionObserver, CSS transforms)
- ✅ Responsive complet (mobile / tablet / desktop)
- ✅ HTML sémantique (`<nav>`, `<section>`, `<footer>`, `<blockquote>`)

---

## 📬 Contact

- **Email** — teddypat.pro@gmail.com
- **LinkedIn** — [linkedin.com/in/teddy-trevor-pategou](https://www.linkedin.com/in/teddy-trevor-pategou/)
- **GitHub** — [github.com/teddvv](https://github.com/teddvv)

---

© 2026 Teddy Pategou — Epitech Strasbourg
