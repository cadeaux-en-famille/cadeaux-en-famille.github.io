// All texts shown to family members live here, in French.
// Rule: no user-facing French string anywhere else in the JavaScript code.
// Keys are grouped by screen; use t("group.key") to read them (see ../i18n.js).
// {name}-style placeholders are filled by t("key", { name: "..." }).

export const fr = {
  common: {
    siteName: "Tirage des cadeaux",
    skipToContent: "Aller au contenu",
    footer: "Site familial privé, réservé aux membres invités.",
    loading: "Chargement…",
    back: "Retour à l'accueil",
    signOut: "Se déconnecter",
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
    sending: "Envoi en cours…",
    invalidEmail: "Cette adresse email ne semble pas valide.",
    notReady: "La connexion n'est pas encore ouverte. Revenez un peu plus tard.",
    codeSent:
      "Si l'adresse {email} est enregistrée, un code à 6 chiffres vient de lui être envoyé. " +
      "Pensez à regarder dans les courriers indésirables.",
    codeLabel: "Code reçu par email",
    codeSubmit: "Me connecter",
    checking: "Vérification…",
    invalidCode: "Le code contient 6 chiffres.",
    resend: "Renvoyer le code",
    resendIn: "Renvoyer le code ({seconds} s)",
    resent: "Un nouveau code a été envoyé.",
    changeEmail: "Utiliser une autre adresse",
    privacy:
      "Seuls les membres de la famille invités peuvent se connecter. " +
      "Votre liste d'envies n'est visible que par la personne qui vous offre un cadeau.",
  },

  home: {
    greeting: "Bonjour {name} !",
    intro: "Bienvenue dans votre espace personnel.",
    comingSoon:
      "Votre tirage, votre liste d'envies et l'historique des années passées arrivent très bientôt ici.",
    adminBadge: "Administrateur",
    notMemberTitle: "Compte non activé",
    notMemberText:
      "Votre adresse est reconnue, mais votre compte n'est pas encore rattaché à la famille. " +
      "Contactez l'organisateur.",
  },

  // Error messages, by ApiError.key (see js/api.js).
  errors: {
    network: "Connexion impossible. Vérifiez votre accès à Internet et réessayez.",
    rate_limited: "Trop de demandes en peu de temps. Patientez une minute avant de réessayer.",
    over_email_send_rate_limit: "Trop de codes demandés. Patientez quelques minutes avant de réessayer.",
    otp_expired: "Ce code est incorrect ou a expiré. Demandez un nouveau code.",
    not_configured: "Le site n'est pas encore configuré.",
    session_expired: "Votre session a expiré. Reconnectez-vous.",
    generic: "Une erreur inattendue est survenue. Réessayez dans un instant.",
  },

  notFound: {
    title: "Page introuvable",
    text: "Cette page n'existe pas ou n'est plus disponible.",
  },
};
