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
    unknownAddress:
      "Cette adresse ne permet pas de se connecter. Vérifiez qu'elle est bien écrite. " +
      "Si c'est la bonne, votre accès n'est pas encore ouvert : l'organisateur vous enverra " +
      "une invitation par email.",
    notReady: "La connexion n'est pas encore ouverte. Revenez un peu plus tard.",
    codeSent:
      "Un code à 6 chiffres vient d'être envoyé à {email}. " +
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
    messages: "Messages",
    profile: "Profil",
    notifications: "Notifications",
    notificationsCount: "Notifications : {count} non lue(s)",
  },

  home: {
    greeting: "Bonjour {name} !",
    intro: "Bienvenue dans votre espace personnel.",
    adminBadge: "Administrateur",
    drawTitle: "Mon tirage",
    noEvent: "Aucun tirage en cours pour le moment. Vous serez prévenu dès le prochain.",
    eventDate: "Le {date}",
    eventBudget: "Budget conseillé : {budget}",
    eventDeadline: "Listes d'envies à remplir avant le {date}",
    daysLeft: "J-{days}",
    tomorrow: "Demain !",
    today: "C'est aujourd'hui !",
    drawNotYet: "Le tirage n'a pas encore eu lieu. Vous serez prévenu dès qu'il sera fait.",
    drawReady: "Votre tirage est prêt. Assurez-vous que personne ne regarde votre écran…",
    reveal: "Découvrir à qui j'offre",
    youGiveTo: "Vous offrez un cadeau à",
    seeList: "Voir la liste de {name}",
    declareIntro:
      "Le tirage de cette année a déjà eu lieu. Indiquez la personne à qui vous offrez un cadeau : " +
      "vous pourrez ensuite voir sa liste d'envies. Votre choix reste secret.",
    declareLabel: "J'offre un cadeau à",
    declareChoose: "Choisir…",
    declareSubmit: "Valider mon choix",
    declareConfirm: "Confirmer : c'est bien cette personne",
    declareMissing: "Choisissez une personne dans la liste.",
    declareHint: "En cas d'erreur, demandez à l'organisateur d'effacer votre choix (il ne le verra pas).",
    myListTitle: "Ma liste d'envies",
    listEmpty: "Votre liste est vide : ajoutez vos premières idées !",
    listOne: "1 envie dans votre liste",
    listMany: "{count} envies dans votre liste",
    historyTitle: "Historique",
    historyText: "Les années passées : à qui j'ai offert",
    messagesTitle: "Messages",
    messagesText: "Mon Père Noël secret, mon receveur et toute la famille",
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

  receiver: {
    title: "La liste de {name}",
    intro: "{event} · budget conseillé {budget}. Cette page n'est visible que par vous.",
    noneTitle: "Pas de tirage en cours",
    noneText: "Vous n'avez pas encore de personne à qui offrir un cadeau pour l'événement en cours.",
    wishesTitle: "Ses envies",
    wishesEmpty: "{name} n'a pas encore rempli sa liste d'envies. Revenez un peu plus tard !",
    ask: "Poser une question anonyme",
    chooseWish: "Je prends cette idée",
    chosen: "Dans mon suivi d'achat ✓",
    tastesTitle: "Ses goûts",
    tastesEmpty: "Aucune indication pour le moment.",
    purchasesTitle: "Mon suivi d'achat",
    purchasesIntro: "Notez vos idées et où vous en êtes. {name} ne verra jamais ce suivi.",
    purchasesEmpty: "Rien pour l'instant : choisissez une envie ci-dessus ou notez votre propre idée.",
    purchaseStatus: "Où j'en suis",
    status: { idea: "Idée", bought: "Acheté", wrapped: "Emballé" },
    ownIdea: "Ma propre idée",
    ownIdeaAdd: "Ajouter à mon suivi",
    purchaseAdded: "Ajouté à votre suivi.",
    purchaseSaved: "Suivi mis à jour.",
  },

  messages: {
    title: "Messages",
    intro: "{event} : écrivez à votre Père Noël secret, à la personne à qui vous offrez, ou à toute la famille.",
    noEvent: "Aucun événement en cours : les messages s'ouvrent avec le prochain tirage.",
    withGiverTitle: "Avec mon Père Noël secret",
    withGiverHint:
      "Vous ne savez pas qui c'est et ça restera secret. Écrivez-lui, donnez-lui des indices : " +
      "il peut vous répondre ici, toujours anonymement.",
    withReceiverTitle: "Avec {name}",
    withReceiverHidden: "Avec la personne à qui j'offre",
    withReceiverHint:
      "Cette personne ne saura jamais que c'est vous : demandez-lui une taille, une couleur… " +
      "elle peut vous répondre ici.",
    familyTitle: "Toute la famille",
    familyHint: "Messages signés, lus par tous les participants.",
    toEveryone: "À toute la famille",
    secretGiver: "Père Noël secret",
    myReceiver: "Mon receveur",
    noGiverYet:
      "Cette conversation s'ouvrira dès que quelqu'un vous aura tiré au sort. " +
      "Vous pourrez alors échanger sans jamais savoir qui c'est.",
    noReceiverYet:
      "Dès que vous saurez à qui vous offrez pour {event}, vous pourrez lui écrire ici " +
      "sans qu'il sache que c'est vous, et il pourra vous répondre.",
    me: "Moi",
    empty: "Aucun message pour l'instant.",
    write: "Écrire un message…",
    send: "Envoyer",
    sending: "Envoi…",
  },

  history: {
    title: "Historique",
    intro: "Les événements auxquels vous avez participé, du plus récent au plus ancien.",
    empty: "Aucun événement pour l'instant.",
    gaveTo: "J'ai offert un cadeau à {name}",
    noDraw: "Pas de tirage enregistré pour moi cette année-là.",
    inProgress: "Événement en cours : voir mon tirage sur l'accueil",
    myGifts: "Mes cadeaux notés comme achetés :",
  },

  notificationsScreen: {
    title: "Notifications",
    empty: "Aucune notification.",
    markAll: "Tout marquer comme lu",
  },

  profile: {
    title: "Mon profil",
    signOutTitle: "Session",
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
      hint: "Un message de mon Père Noël secret ou de la personne à qui j'offre.", text: "Vous avez un nouveau message personnel."
    },
    family_message: { label: "Message à toute la famille", hint: "Un nouveau message dans le fil familial.", text: "{author} a écrit à toute la famille." },
    draw_opened: { label: "Nouveau tirage", hint: "Le tirage de l'année est disponible.", text: "Le tirage est fait : découvrez à qui vous offrez !" },
    wishlist_reminder: { label: "Rappel de liste", hint: "Penser à créer ou compléter ma liste d'envies.", text: "Pensez à compléter votre liste d'envies." },
    receiver_list_changed: {
      label: "Liste de mon receveur modifiée",
      hint: "La personne à qui j'offre a changé sa liste.", text: "La personne à qui vous offrez a modifié sa liste."
    },
    event_reminder: { label: "Rappel avant l'événement", hint: "Une semaine avant Noël.", text: "L'événement approche : plus qu'une semaine !" },
    invitation: {
      label: "Invitation au site",
      hint: "Email envoyé à l'ouverture du site.",
      text: "Bienvenue sur le site du tirage des cadeaux !",
    },
    weekly_digest: {
      label: "Récapitulatif hebdomadaire",
      hint: "Un seul email par semaine au lieu d'emails séparés.", text: "Votre récapitulatif de la semaine est disponible."
    },
  },

  admin: {
    title: "Administration",
    navLabel: "Admin",
    notAllowed: "Cet écran est réservé à l'administrateur.",
    pausedBanner: "Les envois d'emails sont suspendus depuis le {date} : aucun email ne part.",
    pausedBannerLink: "Gérer les envois",
    tabs: {
      events: "Événements",
      members: "Membres",
      settings: "Tirage automatique",
      emails: "Modèles d'emails",
    },
    events: {
      intro:
        "Créez l'événement de l'année, choisissez les participants et suivez l'avancement. " +
        "Vous ne voyez jamais qui offre à qui.",
      none: "Aucun événement pour l'instant.",
      create: "Créer un événement",
      createTitle: "Nouvel événement",
      year: "Année",
      title: "Titre",
      titleDefault: "Noël {year}",
      date: "Date de l'événement",
      budget: "Budget conseillé (€)",
      deadline: "Date limite des listes d'envies",
      mode: "Mode de tirage",
      modeRandom: "Tirage au sort par le site",
      modeDeclared: "Tirage déjà fait : chacun déclare à qui il offre",
      participants: "Participants",
      participantsHint: "Seuls les membres actifs sont proposés.",
      createSubmit: "Créer l'événement",
      created: "Événement créé.",
      invalidYear: "Indiquez une année entre 2000 et 2100.",
      invalidDate: "Indiquez une date.",
      invalidBudget: "Le budget doit être un nombre, par exemple 25.",
      status: { preparing: "En préparation", drawn: "Tiré", closed: "Terminé" },
      modeLabel: { random: "Tirage par le site", declared: "Tirage déclaré" },
      budgetLine: "Budget conseillé : {budget}",
      dateLine: "Date : {date}",
      deadlineLine: "Listes à remplir avant le {date}",
      progressDeclared: "Déclarations reçues : {assigned} sur {total}",
      progressViewed: "Tirage consulté : {viewed} sur {total}",
      progressWishes: "Listes d'envies remplies : {count} sur {total}",
      edit: "Modifier",
      save: "Enregistrer",
      saved: "Événement modifié.",
      participantsTitle: "Participants ({count})",
      participantsLocked: "Les participants ne peuvent plus être modifiés une fois le tirage fait.",
      participantSaved: "Participants mis à jour.",
      runDraw: "Lancer le tirage",
      runDrawConfirm: "Confirmer : lancer le tirage maintenant",
      drawDone: "Tirage effectué : {count} participants ont leur personne. Vous ne voyez pas les résultats.",
      resetDraw: "Annuler le tirage",
      resetDrawConfirm: "Confirmer l'annulation",
      drawReset: "Tirage annulé.",
      resetDeclaration: "Effacer une déclaration erronée",
      resetDeclarationHint:
        "Choisissez la personne qui s'est trompée : sa déclaration est effacée sans que vous la voyiez, " +
        "et elle pourra en saisir une nouvelle.",
      resetDeclarationSubmit: "Effacer sa déclaration",
      declarationReset: "Déclaration effacée.",
      close: "Clôturer l'événement",
      closeConfirm: "Confirmer la clôture",
      closed: "Événement clôturé : les listes ne sont plus visibles par les donneurs.",
      delete: "Supprimer l'événement",
      deleteConfirm: "Confirmer la suppression",
      deleted: "Événement supprimé.",
    },
    members: {
      intro:
        "Les membres sont ajoutés, retirés ou rattachés à leur adresse email par l'Action GitHub " +
        "« Import members ». Les adresses ne sont jamais affichées sur le site.",
      name: "Membre",
      household: "Foyer",
      noHousehold: "Aucun",
      active: "Actif",
      signIn: "Connexion",
      canSignIn: "Possible",
      cannotSignIn: "Pas encore",
      admin: "administrateur",
      saved: "Membre modifié.",
      householdHint: "Les deux membres d'un couple partagent le même foyer : ils ne se tirent jamais au sort.",
      resend: "Renvoyer l'invitation",
      resendConfirm: "Confirmer l'envoi",
      resent: "Invitation de {name} prête : elle partira à la prochaine distribution.",
      invite: "Ouvrir l'accès",
      inviteConfirm: "Ouvrir pour {name} ?",
      invited: "{name} est invité : son compte et son invitation partent à la prochaine distribution.",
      invitedOn: "invité le {date}",
      inviteHint:
        "Vous pouvez ouvrir le site à une personne à la fois pour l'essayer : elle seule reçoit un compte " +
        "et une invitation. Les autres ne peuvent toujours pas se connecter ni recevoir d'email. " +
        "Les envois ont lieu entre 8\u00a0h et 20\u00a0h.",
      openHint: "Le site est ouvert à toute la famille : chacun peut se connecter et recevoir ses emails.",
    },
    settings: {
      intro:
        "Chaque année à la date choisie, le site crée l'événement de Noël, inscrit les membres actifs, " +
        "fait le tirage et prévient tout le monde.",
      enabled: "Tirage automatique activé",
      day: "Jour du tirage",
      month: "Mois du tirage",
      budget: "Budget conseillé par défaut (€)",
      deadlineDays: "Listes à remplir combien de jours avant Noël",
      save: "Enregistrer",
      saved: "Paramètres enregistrés.",
      invalid: "Vérifiez les valeurs saisies.",
      next: "Prochain tirage automatique : le {date}.",
      nextDue: "Le tirage automatique est attendu : il se fera cette nuit.",
      nextOff: "Tirage automatique désactivé : créez l'événement vous-même depuis « Événements ».",
      lastDone: "Dernière année déjà traitée automatiquement : {year}.",
      months: [
        "janvier", "février", "mars", "avril", "mai", "juin",
        "juillet", "août", "septembre", "octobre", "novembre", "décembre",
      ],
      emailsTitle: "Emails aux membres",
      emailsOff:
        "Désactivés : aucun membre ne reçoit d'email, seuls les vôtres partent. " +
        "Ils seront activés par l'Action GitHub « Open the site to the family ».",
      emailsOn: "Activés depuis le {date}.",
      sendingTitle: "Envoi des emails",
      sendingOn: "Les emails partent normalement, entre 8\u00a0h et 20\u00a0h. Emails en attente : {count}.",
      pause: "Suspendre tous les envois",
      pauseConfirm: "Confirmer la suspension",
      paused: "Envois suspendus depuis le {date}. Emails en attente : {count}.",
      resume: "Reprendre les envois",
      resumeConfirm: "Confirmer la reprise",
      resumeCancel: "Reprendre et annuler les emails en attente",
      resumeCancelConfirm: "Annuler {count} email(s) et reprendre ?",
      cancelled: "{count} email(s) annulé(s). Les envois ont repris.",
      pausedDone: "Envois suspendus. Aucun email ne partira jusqu'à la reprise.",
      resumedDone: "Les envois ont repris.",
      pauseHint:
        "La suspension arrête tous les emails envoyés par le site : rappels, messages, invitations. " +
        "Les notifications restent visibles sur le site et les emails attendent la reprise ; " +
        "s'ils contiennent une erreur, reprenez en les annulant. Les codes de connexion ne sont pas concernés.",
    },
    emails: {
      intro:
        "Modifiez le texte des emails envoyés aux membres. Les variables entre accolades sont " +
        "remplacées à l'envoi. Aucune variable ne donne accès au résultat du tirage.",
      kind: "Email",
      subject: "Objet",
      body: "Texte",
      variables: "Variables disponibles :",
      preview: "Aperçu",
      save: "Enregistrer le modèle",
      saved: "Modèle enregistré.",
      test: "M'envoyer un email de test",
      testQueued:
        "Email de test prêt : il vous arrivera dans l'heure, ou tout de suite si vous lancez " +
        "l'Action GitHub « Send emails ».",
      reset: "Revenir au texte par défaut",
      resetDone: "Texte par défaut rétabli (pensez à enregistrer).",
      custom: "Modèle personnalisé",
      default: "Texte par défaut",
      required: "L'objet et le texte sont obligatoires.",
      sample: {
        prenom: "Camille",
        evenement: "Noël 2027",
        budget: "25,00 €",
        date: "25 décembre 2027",
        date_limite: "25 novembre 2027",
        lien: "https://cadeaux-en-famille.github.io",
        resume: "- 2 nouveaux messages personnels\n- 1 message à toute la famille",
      },
    },
  },

  // Lines of the weekly digest email ({resume} variable), one per kind.
  digest: {
    private_message: "- {count} nouveau(x) message(s) personnel(s)",
    family_message: "- {count} nouveau(x) message(s) à toute la famille",
    receiver_list_changed: "- La personne à qui vous offrez a modifié sa liste d'envies",
  },

  // Default email texts, used until the admin saves his own version.
  // Variables: {prenom} {evenement} {budget} {date} {date_limite} {lien}
  emailDefaults: {
    invitation: {
      subject: "Le site du tirage des cadeaux est ouvert !",
      body:
        "Bonjour {prenom},\n\nLa famille a maintenant son site pour le tirage des cadeaux : vous y trouverez " +
        "la personne à qui vous offrez un cadeau, sa liste d'envies, et vous pourrez remplir la vôtre.\n\n" +
        "Pour vous connecter, ouvrez le lien ci-dessous et saisissez cette adresse email : vous recevrez " +
        "un code à 6 chiffres, sans mot de passe.\n\n{lien}\n\nÀ très bientôt !",
    },
    draw_opened: {
      subject: "{evenement} : le tirage est fait !",
      body:
        "Bonjour {prenom},\n\nLe tirage de {evenement} est fait. Connectez-vous pour découvrir " +
        "à qui vous offrirez un cadeau, et pensez à remplir votre liste d'envies avant le {date_limite}.\n\n" +
        "Budget conseillé : {budget}.\n\n{lien}\n\nÀ bientôt !",
    },
    wishlist_reminder: {
      subject: "Pensez à votre liste d'envies",
      body:
        "Bonjour {prenom},\n\nVotre liste d'envies pour {evenement} est encore vide ou presque. " +
        "Ajoutez quelques idées avant le {date_limite} pour aider la personne qui vous offre un cadeau.\n\n{lien}",
    },
    event_reminder: {
      subject: "{evenement} approche !",
      body:
        "Bonjour {prenom},\n\n{evenement} a lieu le {date}. Il est encore temps de préparer votre cadeau " +
        "(budget conseillé : {budget}).\n\n{lien}",
    },
    private_message: {
      subject: "Vous avez un nouveau message",
      body: "Bonjour {prenom},\n\nVous avez reçu un nouveau message pour {evenement}. Connectez-vous pour le lire.\n\n{lien}",
    },
    family_message: {
      subject: "Nouveau message à toute la famille",
      body: "Bonjour {prenom},\n\nUn nouveau message a été publié pour {evenement}.\n\n{lien}",
    },
    receiver_list_changed: {
      subject: "Une liste d'envies a changé",
      body:
        "Bonjour {prenom},\n\nLa personne à qui vous offrez un cadeau pour {evenement} a modifié sa liste d'envies.\n\n{lien}",
    },
    weekly_digest: {
      subject: "Votre récapitulatif de la semaine",
      body: "Bonjour {prenom},\n\nVoici les nouveautés de la semaine pour {evenement} :\n\n{resume}\n\n{lien}",
    },
  },

  // Error messages, by ApiError.key (see js/api.js).
  errors: {
    emails: {
      disabled: "Les emails aux membres ne sont pas encore activés : le site n'est pas ouvert.",
      cannot_sign_in: "Ce membre n'a pas encore d'adresse de connexion.",
      empty: "L'objet et le texte sont obligatoires.",
    },
    messages: {
      not_a_member: "Votre compte n'est pas rattaché à la famille.",
      event_closed: "Cet événement est terminé : les messages sont fermés.",
      invalid_body: "Le message doit contenir entre 1 et 2000 caractères.",
      invalid_thread: "Conversation inconnue.",
      no_receiver: "Vous n'avez pas encore de personne à qui offrir pour cet événement.",
      no_giver: "Votre Père Noël secret n'est pas encore connu : réessayez un peu plus tard.",
    },
    draw: {
      admin_only: "Seul l'administrateur peut faire cette action.",
      not_a_member: "Votre compte n'est pas rattaché à la famille.",
      event_not_found: "Cet événement n'existe plus.",
      not_random_mode: "Cet événement utilise un tirage déclaré, pas un tirage au sort.",
      already_drawn: "Le tirage a déjà été fait pour cet événement.",
      already_viewed: "Impossible d'annuler : quelqu'un a déjà consulté son tirage.",
      cannot_reset: "Ce tirage ne peut pas être annulé.",
      cannot_close: "Seul un événement tiré peut être clôturé.",
      not_enough_participants: "Il faut au moins 3 participants pour un tirage.",
      no_valid_draw: "Aucun tirage ne respecte toutes les règles avec ces participants.",
      declaration_closed: "Les déclarations sont fermées pour cet événement.",
      not_a_participant: "Vous ne participez pas à cet événement.",
      receiver_not_participant: "Cette personne ne participe pas à cet événement.",
      receiver_is_self: "Vous ne pouvez pas vous offrir un cadeau à vous-même.",
      receiver_is_partner: "Vous ne pouvez pas déclarer votre conjoint.",
      already_declared: "Vous avez déjà fait votre déclaration.",
      receiver_taken: "Cette personne a déjà été choisie par quelqu'un d'autre.",
      event_has_draws:
        "Cet événement contient déjà des tirages ou des déclarations : il ne peut plus être supprimé. " +
        "Rechargez la page pour voir son état actuel.",
    },
    "23505": "Cet élément existe déjà (par exemple un événement pour cette année).",
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
