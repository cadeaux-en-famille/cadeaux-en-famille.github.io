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
    saving: "Enregistrement…",
    cancel: "Annuler",
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

  nav: {
    home: "Accueil",
    myList: "Ma liste",
    profile: "Profil",
  },

  home: {
    greeting: "Bonjour {name} !",
    intro: "Bienvenue dans votre espace personnel.",
    adminBadge: "Administrateur",
    drawTitle: "Mon tirage",
    drawSoon: "Votre tirage de Noël apparaîtra ici très bientôt.",
    myListTitle: "Ma liste d'envies",
    listEmpty: "Votre liste est vide : ajoutez vos premières idées !",
    listOne: "1 envie dans votre liste",
    listMany: "{count} envies dans votre liste",
    profileTitle: "Mon profil",
    profileText: "Votre nom affiché et vos notifications",
    notMemberTitle: "Compte non activé",
    notMemberText:
      "Votre adresse est reconnue, mais votre compte n'est pas encore rattaché à la famille. " +
      "Contactez l'organisateur.",
  },

  myList: {
    title: "Ma liste d'envies",
    intro: "Seule la personne qui vous offre un cadeau peut voir cette liste.",
    empty: "Votre liste est vide pour l'instant.",
    add: "Ajouter une envie",
    addTitle: "Nouvelle envie",
    addSubmit: "Ajouter",
    added: "Envie ajoutée.",
    edit: "Modifier",
    save: "Enregistrer",
    saved: "Envie modifiée.",
    archive: "Archiver",
    archived: "Envie archivée. Elle n'est plus visible par la personne qui vous offre.",
    restore: "Remettre dans ma liste",
    restored: "Envie remise dans votre liste.",
    delete: "Supprimer",
    deleteConfirm: "Confirmer la suppression",
    deleted: "Envie supprimée.",
    clear: "Vider toute ma liste",
    clearConfirm: "Confirmer : tout supprimer, archives comprises",
    cleared: "Votre liste a été vidée.",
    archivedTitle: "Envies archivées ({count})",
    openLink: "Voir le produit",
    priority1: "Très envie",
    priority2: "Envie",
    priority3: "Si possible",
    fields: {
      title: "Mon envie",
      titleRequired: "Indiquez votre envie.",
      url: "Lien vers le produit",
      urlHint: "Facultatif : copiez l'adresse de la page du produit.",
      shop: "Boutique",
      price: "Prix indicatif (€)",
      priceInvalid: "Le prix doit être un nombre, par exemple 24,90.",
      priority: "Priorité",
      description: "Précisions",
      descriptionHint: "Taille, couleur, modèle, ou toute précision utile.",
    },
    profile: {
      title: "Mes goûts",
      intro: "Des repères pour la personne qui vous offre un cadeau, en plus de votre liste.",
      interests: "Centres d'intérêt",
      interestsHint: "Loisirs, passions, auteurs, séries…",
      sizes: "Tailles",
      sizesHint: "Vêtements, chaussures, bagues…",
      colors: "Couleurs préférées",
      colorsHint: "",
      dislikes: "À éviter",
      dislikesHint: "Ce que vous n'aimez pas ou avez déjà.",
      favorite_shops: "Boutiques favorites",
      favorite_shopsHint: "Magasins ou sites où trouver des idées.",
      save: "Enregistrer mes goûts",
      saved: "Vos goûts sont enregistrés.",
    },
  },

  profile: {
    title: "Mon profil",
    nameLabel: "Nom affiché",
    nameHint: "C'est le nom que voit la famille (40 caractères au maximum).",
    nameSave: "Enregistrer",
    nameSaved: "Votre nom est enregistré.",
    nameInvalid: "Le nom doit contenir entre 1 et 40 caractères.",
    prefsTitle: "Mes notifications",
    prefsIntro: "Choisissez comment être prévenu. Chaque changement est enregistré aussitôt.",
    prefsColumn: "Notification",
    inApp: "Sur le site",
    byEmail: "Par email",
    prefsSaved: "Préférence enregistrée.",
    signInNote: "Le code de connexion est toujours envoyé par email, quels que soient ces réglages.",
  },

  // One entry per notification kind (table notification_kinds).
  notifications: {
    private_message: {
      label: "Message personnel",
      hint: "Un message de mon Père Noël secret ou de la personne à qui j'offre.",
    },
    family_message: { label: "Message à toute la famille", hint: "Un nouveau message dans le fil familial." },
    draw_opened: { label: "Nouveau tirage", hint: "Le tirage de l'année est disponible." },
    wishlist_reminder: { label: "Rappel de liste", hint: "Penser à créer ou compléter ma liste d'envies." },
    receiver_list_changed: {
      label: "Liste de mon receveur modifiée",
      hint: "La personne à qui j'offre a changé sa liste.",
    },
    event_reminder: { label: "Rappel avant l'événement", hint: "Une semaine avant Noël." },
    weekly_digest: {
      label: "Récapitulatif hebdomadaire",
      hint: "Un seul email par semaine au lieu d'emails séparés.",
    },
  },

  // Error messages, by ApiError.key (see js/api.js).
  errors: {
    "23514": "Une des valeurs saisies n'est pas acceptée (trop longue ou mal formée).",
    "42501": "Vous n'avez pas le droit de faire cette action.",
    network: "Connexion impossible. Vérifiez votre accès à Internet et réessayez.",
    rate_limited: "Trop de demandes en peu de temps. Patientez une minute avant de réessayer.",
    over_email_send_rate_limit: "Trop de codes demandés. Patientez quelques minutes avant de réessayer.",
    otp_expired: "Ce code est incorrect ou a expiré. Demandez un nouveau code.",
    not_configured: "Le site n'est pas encore configuré.",
    session_expired: "Votre session a expiré. Reconnectez-vous.",
    generic: "Une erreur inattendue est survenue. Réessayez dans un instant.",
    genericWithCode: "Une erreur inattendue est survenue (code : {code}). Réessayez dans un instant.",
  },

  notFound: {
    title: "Page introuvable",
    text: "Cette page n'existe pas ou n'est plus disponible.",
  },
};
