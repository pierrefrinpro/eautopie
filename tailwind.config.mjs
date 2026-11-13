/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bleu-eau': '#0EA5E9',
        'bleu-profond': '#075985',
        // Bleu lisible pour le texte et les boutons (contraste 5,9:1 sur blanc).
        // bleu-eau reste réservé aux décors : il ne passe pas sous du texte.
        'bleu-texte': '#0369A1',
        'bleu-pale': '#DBEAFE',
        'bleu-ciel': '#BAE6FD',
        soleil: '#F59E0B',
        creme: '#FAF9F6',
        'noir-eau': '#0F172A',
        'gris-onde': '#64748B',
        'vert-ok': '#10B981',
        'orange-attention': '#F59E0B',
        'rouge-alerte': '#DC2626',
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'system-ui', 'sans-serif'],
        display: ['"Fraunces Variable"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
