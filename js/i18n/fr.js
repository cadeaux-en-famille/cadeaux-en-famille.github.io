// All texts shown to family members live here, in French.
// Rule: no user-facing French string anywhere else in the JavaScript code.
// Keys are grouped by screen; use t("group.key") to read them (see ../i18n.js).

export const fr = {
  common: {
    siteName: "Tirage des cadeaux",
    skipToContent: "Aller au contenu",
    footer: "Site familial privé, réservé aux membres invités.",
    loading: "Chargement…",
    back: "Retour à l'accueil",
  },

  welcome: {
    title: "Le tirage des cadeaux en famille",
    intro:
      "Chaque année, chacun tire au sort la personne à qui il offrira un cadeau. " +
      "Ici, vous découvrez votre tirage, vous remplissez votre liste d'envies " +
      "et vous trouvez des idées pour la personne qui vous est attribuée.",
    howTitle: "Comment ça marche ?",
    steps: [
      "Saisissez votre adresse email.",
      "Recevez un code à 6 chiffres par email.",
      "Saisissez le code : vous êtes connecté, sans mot de passe.",
    ],
    emailLabel: "Votre adresse email",
    emailPlaceholder: "prenom@exemple.fr",
    submit: "Recevoir mon code",
    invalidEmail: "Cette adresse email ne semble pas valide.",
    notReady:
      "La connexion n'est pas encore ouverte. Vous recevrez un email dès que le site sera prêt.",
    privacy:
      "Seuls les membres de la famille invités peuvent se connecter. " +
      "Votre liste d'envies n'est visible que par la personne qui vous offre un cadeau.",
  },

  notFound: {
    title: "Page introuvable",
    text: "Cette page n'existe pas ou n'est plus disponible.",
  },
};
