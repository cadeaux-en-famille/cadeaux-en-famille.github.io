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
    confirmQuestion: "Vous confirmez ?",
    months: [
      "janvier", "février", "mars", "avril", "mai", "juin",
      "juillet", "août", "septembre", "octobre", "novembre", "décembre",
    ],
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
    helpLink: "Besoin d'aide ? Lire le mode d'emploi illustré",
    privacy:
      "Seuls les membres de la famille invités peuvent se connecter. " +
      "Votre liste d'envies n'est visible que par les personnes qui vous préparent un cadeau et par votre conjoint.",
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
    declareQuestion: "Vous offrez un cadeau à {name} : c'est bien ça ?",
    declareConfirm: "Oui, j'offre à {name}",
    declareMissing: "Choisissez une personne dans la liste.",
    declareHint: "En cas d'erreur, demandez à l'organisateur d'effacer votre choix (il ne le verra pas).",
    birthdaysTitle: "Anniversaires à venir",
    birthdayMe: "Vous",
    birthdayOpen: "Voir la préparation",
    birthdayElsewhere: "En préparation",
    birthdayLaunch: "Lancer la préparation",
    birthdayLaunchQuestion:
      "Lancer la préparation de l'anniversaire de {name} ? Les participants prévus recevront un email ; " +
      "{name} ne verra rien.",
    birthdayLaunchConfirm: "Oui, lancer",
    birthdaySeparator: "\u00a0: ",
    birthdayToday: "aujourd'hui ! 🎂",
    birthdayTomorrow: "demain, le {date}",
    birthdayIn: "le {date}, dans {days} jours",
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
    intro: "Seules les personnes qui vous préparent un cadeau (à Noël ou pour votre anniversaire), et votre conjoint, voient cette liste.",
    empty: "Votre liste est vide pour l'instant.",
    add: "Ajouter une envie",
    addTitle: "Nouvelle envie",
    addSubmit: "Ajouter",
    added: "Envie ajoutée.",
    edit: "Modifier",
    save: "Enregistrer",
    saved: "Envie modifiée.",
    archive: "Archiver",
    archived: "Envie archivée. Elle n'est plus visible par les personnes qui vous offrent un cadeau.",
    restore: "Remettre dans ma liste",
    restored: "Envie remise dans votre liste.",
    delete: "Supprimer",
    deleteConfirm: "Confirmer la suppression",
    deleted: "Envie supprimée.",
    clear: "Vider toute ma liste",
    clearConfirm: "Oui, tout supprimer, archives comprises",
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
      intro: "Des repères pour les personnes qui vous offrent un cadeau, en plus de votre liste.",
      current_wishes: "Envies du moment",
      current_wishesHint:
        "En une phrase, ce qui vous ferait plaisir en ce moment (« plutôt des sorties cette année », " +
        "« tout pour le jardin »…). Lu par les personnes qui vous préparent un cadeau.",
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
    questionsTitle: "Questions de la famille",
    questionsForTitle: "Questions de la famille : {title}",
    questionsHint:
      "Des membres de la famille vous posent des questions pour vous faire plaisir. Vous ne saurez pas qui ; " +
      "vos réponses sont lues par ceux qui vous préparent un cadeau.",
    familyMember: "Un membre de la famille",
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
    myBirthday: "Mon anniversaire {year}",
    birthdayParticipants: "Ont participé à mon cadeau : {names}",
    birthdayOpen: "Voir la page de l'anniversaire",
    birthdayStatus: {
      preparing: "En préparation",
      drawn: "En préparation",
      closed: "Passé",
    },
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
    event_reminder: { label: "Rappel avant l'événement", hint: "Une semaine avant Noël, sauf si mon cadeau est déjà emballé.", text: "L'événement approche : plus qu'une semaine !" },
    invitation: {
      label: "Invitation au site",
      hint: "Email envoyé à l'ouverture du site.",
      text: "Bienvenue sur le site du tirage des cadeaux !",
    },
    birthday_opened: {
      label: "Anniversaire en préparation",
      hint: "Un anniversaire se prépare et j'y participe.",
      text: "Un anniversaire se prépare : choisissez comment participer.",
    },
    birthday_reminder: {
      label: "Rappel d'anniversaire",
      hint: "Deux semaines puis trois jours avant, tant que je n'ai rien choisi.",
      text: "L'anniversaire approche (dans {days} jours) et vous n'avez encore rien choisi.",
    },
    ideas_requested: {
      label: "Demande d'idées",
      hint: "Quelqu'un qui me prépare un cadeau aimerait des idées.",
      text: "Quelqu'un qui vous prépare un cadeau aimerait quelques idées : complétez votre liste.",
    },
    ideas_requested_secret: {
      label: "Demande d'idées (sans précision)",
      hint: "Un membre de la famille aimerait des idées, sans dire pour quelle occasion.",
      text: "Un membre de la famille aimerait quelques idées : pensez à mettre à jour votre liste.",
    },
    family_question: {
      label: "Question de la famille",
      hint: "On me pose une question anonyme pour trouver mon cadeau.",
      text: "Un membre de la famille vous pose une question.",
    },
    family_answer: {
      label: "Réponse de la personne fêtée",
      hint: "La personne dont je prépare l'anniversaire a répondu à une question.",
      text: "La personne fêtée a répondu à une question.",
    },
    weekly_digest: {
      label: "Récapitulatif hebdomadaire",
      hint: "Un seul email par semaine au lieu d'emails séparés.", text: "Votre récapitulatif de la semaine est disponible."
    },
  },

  // The illustrated guide (#/help, and site/help/guide.pdf). One entry per section of
  // site/js/screens/help.js; "alt" holds one description per picture.
  help: {
    title: "Mode d'emploi",
    intro:
        "Tout ce qu'il faut savoir en quelques minutes : se connecter, remplir sa liste d'envies, " +
        "découvrir à qui on offre, et préparer les anniversaires. Les images montrent une famille " +
        "imaginaire.",
    signIn: "Me connecter",
    pdf: "Télécharger le guide (PDF)",
    tocTitle: "Sommaire",
    faqTitle: "Questions fréquentes",
    footerLink: "Mode d'emploi",
    sections: {
      connexion: {
        title: "Se connecter",
        steps: [
          "Ouvrez le lien du site reçu par email (gardez-le dans vos favoris).",
          "Tapez votre adresse email, celle à laquelle vous avez reçu l'invitation, puis « Recevoir mon code ».",
          "Un email arrive avec un code à 6 chiffres. Rien reçu ? Regardez dans les courriers indésirables.",
          "Tapez le code puis « Me connecter ». C'est tout : pas de mot de passe à retenir.",
        ],
        alt: [
          "L'écran de connexion : la case pour l'adresse email et le bouton « Recevoir mon code ».",
          "Le code à 6 chiffres reçu par email se tape dans la case « Code reçu par email ».",
        ],
        tip: "Vous restez connecté sur votre téléphone. Le code ne sert qu'une fois : demandez-en un nouveau si besoin.",
      },
      accueil: {
        title: "L'accueil",
        steps: [
          "L'accueil montre l'événement en cours : la date, le budget conseillé et votre tirage.",
          "Le menu en haut mène à votre liste d'envies, aux messages et à votre profil.",
          "La cloche signale les nouveautés (un message, un rappel…).",
        ],
        alt: ["L'accueil : le tirage de Noël, les anniversaires à venir et le menu."],
        tip: "",
      },
      liste: {
        title: "Ma liste d'envies",
        steps: [
          "Dans « Ma liste », touchez « Ajouter une envie » : un titre suffit.",
          "Vous pouvez ajouter un lien vers un site marchand, un prix, une boutique et une priorité.",
          "Indiquez aussi vos goûts (tailles, couleurs, ce que vous n'aimez pas) : ça aide beaucoup.",
          "En couple ? « Voir la liste de … » montre la liste de votre conjoint, en lecture seule.",
          "« Envies du moment » : une phrase sur ce qui vous ferait plaisir en ce moment (« plutôt des sorties " +
            "cette année »). Si quelqu'un vous demande des idées, un bandeau vous le rappelle en haut de la liste.",
        ],
        alt: ["« Ma liste d'envies » avec quelques idées et le bouton pour en ajouter."],
        tip:
            "Seules les personnes qui vous préparent un cadeau, et votre conjoint, voient votre liste. Elle reste d'une année " +
            "sur l'autre : retirez simplement ce que vous avez reçu.",
      },
      tirage: {
        title: "À qui j'offre à Noël",
        steps: [
          "Cette année, le tirage a déjà eu lieu : sur l'accueil, choisissez dans la liste la personne à qui " +
            "vous offrez et touchez « Valider mon choix ». Le site vous demande alors « … c'est bien ça ? » : " +
            "touchez « Oui, j'offre à … » pour enregistrer (rien n'est enregistré avant).",
          "Les années suivantes, le site fait le tirage et vous prévient par email. Sur l'accueil, touchez " +
            "« Découvrir à qui j'offre ».",
          "Vous découvrez le prénom de la personne à qui vous offrez, sa liste d'envies et ses goûts.",
          "Sa liste ne vous inspire pas ? Touchez « Lui demander des idées » : la personne reçoit une demande " +
            "anonyme (une fois par semaine au plus).",
          "Touchez « Je prends cette idée », puis notez où vous en êtes (idée, acheté, emballé) : " +
            "le rappel d'avant Noël ne vous concerne plus quand c'est emballé.",
        ],
        alt: [
          "Après « Valider mon choix », le site demande de confirmer : touchez « Oui, j'offre à … ».",
          "La page de la personne à qui vous offrez : sa liste d'envies et le suivi de votre achat.",
        ],
        rulesTitle: "Les règles du tirage",
        rules: [
          "On ne se tire jamais soi-même.",
          "On ne tire jamais son conjoint.",
          "On ne retombe pas sur la personne à qui on a offert l'an dernier.",
          "On ne tombe pas non plus sur la personne qui nous a offert l'an dernier.",
          "Pas d'échange : si vous offrez à quelqu'un, cette personne ne vous offre pas en retour.",
        ],
        tip: "Personne d'autre ne voit votre tirage, pas même l'organisateur.",
      },
      messages: {
        title: "Écrire en secret",
        steps: [
          "Dans « Messages », écrivez à la personne à qui vous offrez : elle ne sait pas que c'est vous.",
          "Elle peut vous répondre sans savoir qui vous êtes.",
          "Vous pouvez aussi écrire à votre propre père Noël secret pour lui donner un indice.",
        ],
        alt: ["Les messages : la conversation secrète avec la personne à qui vous offrez."],
        tip: "Pratique pour demander une taille ou une couleur sans gâcher la surprise.",
      },
      anniversaires: {
        title: "Les anniversaires",
        steps: [
          "Quelques semaines avant un anniversaire, les participants reçoivent un email.",
          "Sur l'accueil, « Voir la préparation » ouvre la page de l'anniversaire. Pour un anniversaire " +
            "pas encore ouvert, touchez « Lancer la préparation », puis « Oui, lancer » dans la question qui " +
            "s'affiche juste en dessous.",
          "Sur une idée de sa liste, touchez « Je m'en occupe » (vous l'achetez) ou « Je participe » " +
            "(vous donnez une somme pour un cadeau commun).",
          "Vous pouvez aussi proposer un cadeau commun et discuter avec les autres participants.",
          "« Questions à … » : posez une question à la personne fêtée (pointure, couleur…). Elle répond sans " +
            "savoir qui demande, et tous les participants lisent la réponse. « Lui demander des idées » lui " +
            "demande de compléter sa liste.",
        ],
        alt: [
          "Après « Lancer la préparation », le site demande de confirmer : touchez « Oui, lancer ».",
          "La page d'un anniversaire : qui s'occupe de quoi, et le bouton « Je participe ».",
        ],
        tip:
            "La personne fêtée ne voit ni les participants, ni les cadeaux, ni votre discussion. Si l'anniversaire " +
            "est « secret », les demandes d'idées et les questions ne parlent même pas de son anniversaire.",
      },
      notifications: {
        title: "Mes emails et notifications",
        steps: [
          "Dans « Profil », choisissez ce que vous voulez recevoir par email ou seulement sur le site.",
          "Vous pouvez aussi y changer votre prénom affiché et vous déconnecter.",
        ],
        alt: ["Le profil : les cases pour choisir vos emails et notifications."],
        tip: "Les emails partent entre 8 h et 20 h, jamais la nuit.",
      },
    },
    faq: [
      {
        q: "J'ai touché un bouton et rien ne s'est passé.",
        a:
            "Pour les actions importantes (dire à qui vous offrez, lancer un anniversaire, supprimer quelque " +
            "chose), le site pose d'abord une question juste en dessous du bouton. Touchez la réponse « Oui, … » " +
            "pour confirmer, ou « Annuler ». Tant que vous n'avez pas répondu, rien n'est enregistré.",
      },
      {
        q: "Je n'ai pas reçu de code.",
        a:
            "Attendez une minute et regardez dans les courriers indésirables. Vérifiez l'adresse tapée, puis " +
            "touchez « Renvoyer le code ». Si le site dit que l'adresse ne permet pas de se connecter, " +
            "prévenez l'organisateur.",
      },
      {
        q: "On me pose des questions anonymes : qui les lit ?",
        a:
            "Les personnes qui vous préparent un cadeau. Vous ne saurez pas qui a posé la question ; répondez dans " +
            "« Messages », votre réponse les aide à trouver une idée.",
      },
      {
        q: "J'ai changé d'adresse email.",
        a: "Prévenez l'organisateur : il la change pour vous, et vous recevez une nouvelle invitation.",
      },
      {
        q: "L'organisateur peut-il voir à qui j'offre ?",
        a: "Non. Le tirage est caché à tout le monde, organisateur compris.",
      },
      {
        q: "Je me suis trompé dans ma liste.",
        a: "Dans « Ma liste », chaque envie a ses boutons « Modifier », « Archiver » et « Supprimer », utilisables à tout moment.",
      },
      {
        q: "Le site est-il une application à installer ?",
        a:
            "Non, il s'ouvre dans le navigateur. Sur téléphone, vous pouvez l'ajouter à l'écran d'accueil " +
            "(menu du navigateur, « Ajouter à l'écran d'accueil ») pour le retrouver comme une application.",
      },
    ],
  },

  // The list of my partner (screens/partner.js).
  partner: {
    link: "Voir la liste de {name}",
    title: "La liste de {name}",
    intro:
      "Vous voyez la liste d'envies de {name} parce que vous formez un couple sur le site. Elle est en lecture " +
      "seule, et ne dit pas ce que les autres ont prévu de lui offrir.",
    wishesTitle: "Ses envies",
    wishesEmpty: "{name} n'a encore rien mis dans sa liste.",
    tastesTitle: "Ses goûts",
    noneTitle: "Pas de conjoint enregistré",
    noneText: "Vous n'êtes pas en couple sur le site. L'organisateur peut l'indiquer dans l'administration.",
    back: "Retour à ma liste",
  },

  // « Lui demander des idées » (screens/ideas.js) and the banner on « Ma liste ».
  ideas: {
    ask: "Lui demander des idées",
    confirm: "Oui, envoyer la demande",
    explain: {
      christmas: "Sa liste ne vous inspire pas ? Demandez des idées à {name}, sans dire que c'est vous.",
      birthday: "Demandez à {name} de compléter sa liste, sans dire qui demande.",
      secret: "Demandez à {name} de compléter sa liste : la demande ne parle pas de son anniversaire.",
    },
    question: {
      christmas: "Envoyer à {name} une demande anonyme : « Votre Père Noël secret aimerait quelques idées » ?",
      birthday: "Envoyer à {name} une demande anonyme d'idées pour son anniversaire ?",
      secret: "Envoyer à {name} une demande anonyme, sans parler de son anniversaire, de mettre à jour sa liste ?",
    },
    sent: "Demande envoyée à {name}.",
    last: "Dernière demande le {date}.",
    lastWaiting: "Demande envoyée le {date} : prochaine demande possible le {next}.",
    banner: {
      christmas: "{title} : la personne qui vous offre un cadeau aimerait quelques idées (demande du {date}).",
      birthday: "{title} : un membre de la famille aimerait quelques idées (demande du {date}).",
      secret: "Un membre de la famille aimerait quelques idées de cadeaux pour vous (demande du {date}).",
    },
    bannerHint: "Ajoutez des envies ci-dessous, ou dites en une phrase ce qui vous ferait plaisir dans « Envies du moment ».",
  },

  // Birthday events (scripts/birthdays.mjs reads titleDefault for the automatic ones).
  birthday: {
    titleDefault: "Anniversaire de {name}",
    notFoundTitle: "Anniversaire introuvable",
    notFoundText: "Cet anniversaire n'existe pas ou vous n'y participez pas.",
    dateLine: "Le {date}",
    contributionLine: "Contribution indicative : {amount} par personne",
    totalLine: "Déjà réuni : {amount}",
    intro:
        "On prépare la surprise de {name}, qui ne voit rien de cette page. Prenez une idée en charge, " +
        "participez à un cadeau commun ou proposez-en un : chacun voit qui fait quoi.",
    closedIntro: "Cet anniversaire est passé. Voici ce qui avait été organisé pour {name}.",
    notTakingPart:
        "Vous ne participez pas à cet anniversaire : vous voyez seulement qui y participe. " +
        "{name} ne voit rien de cette page.",
    wishesTitle: "La liste d'envies de {name}",
    wishesEmpty: "{name} n'a encore rien mis dans sa liste d'envies. Proposez un cadeau commun ci-dessous.",
    commonTitle: "Cadeaux communs proposés",
    commonEmpty: "Aucune proposition pour l'instant.",
    propose: "Proposer un cadeau commun",
    proposeHint: "Une idée qui n'est pas dans sa liste, à laquelle les autres pourront participer.",
    proposeTitle: "Idée de cadeau",
    proposeUrl: "Lien (facultatif)",
    proposeNote: "Précisions (facultatif)",
    proposeSubmit: "Proposer",
    proposed: "Proposition ajoutée.",
    proposedBy: "Proposé par {name}",
    removeProposal: "Retirer la proposition",
    removeProposalConfirm: "Confirmer le retrait",
    proposalRemoved: "Proposition retirée.",
    you: "vous",
    withAmount: "{name} ({amount})",
    buyerLine: "Pris en charge par {name}",
    helpersLine: "Participent : {names}",
    giftTotal: "Total : {amount}",
    nobodyYet: "Personne ne s'en occupe pour l'instant.",
    takeInHand: "Je m'en occupe",
    chipIn: "Je participe",
    amountLabel: "Mon montant en euros (facultatif)",
    amountHint: "Contribution indicative : {amount}. Laissez vide pour ne pas indiquer de montant.",
    confirmPledge: "Valider",
    buyerDone: "C'est noté : vous vous en occupez.",
    helperDone: "C'est noté : vous participez.",
    youBuy: "Vous vous en occupez.",
    youHelp: "Vous participez.",
    changeAmount: "Changer le montant",
    withdraw: "Me retirer",
    withdrawConfirm: "Confirmer",
    withdrawn: "Vous ne participez plus à ce cadeau.",
    tastesTitle: "Les goûts de {name}",
    tastesEmpty: "Rien de renseigné pour l'instant.",
    discussionTitle: "Discussion entre participants",
    discussionHint: "Pour vous organiser entre vous : {name} ne voit pas ces messages.",
    participantsTitle: "Participants ({count})",
    participantsHint: "La personne qui a lancé l'anniversaire (ou l'administrateur) choisit les participants.",
    editParticipants: "Modifier les participants",
    participantsLegend: "Qui participe ?",
    participantsEditHint:
        "Les nouveaux participants sont prévenus. Une personne retirée perd ce qu'elle avait choisi.",
    saveParticipants: "Enregistrer les participants",
    participantsSaved: "Participants enregistrés.",
    questionsTitle: "Questions à {name}",
    questionsHint:
      "Posez une question à {name} (taille, couleur, envie…) : {name} ne sait pas qui la pose, et tous les " +
      "participants lisent les questions et les réponses.",
    questionsEmpty: "Aucune question pour l'instant.",
    lastRequestBy: "Dernière demande d'idées envoyée par {name}.",
    lastRequestAuto: "Une demande d'idées est partie automatiquement à l'ouverture : sa liste était vide.",
    secretOn: "Anniversaire secret :",
    secretOnText:
      "{name} ne sait pas qu'il se prépare. Les demandes d'idées et les questions ne parlent pas de son anniversaire.",
    secretOff: "Anniversaire non secret :",
    secretOffText:
      "{name} sait que son anniversaire se prépare (sans savoir qui participe ni ce qui est prévu). Les demandes " +
      "d'idées le mentionnent.",
    makePublic: "Ne plus le garder secret",
    makePublicQuestion: "{name} pourra savoir que son anniversaire se prépare. Continuer ?",
    makePublicConfirm: "Oui, ne plus le garder secret",
    makeSecret: "Le rendre secret",
    makeSecretQuestion: "Les prochaines demandes d'idées ne parleront plus de l'anniversaire de {name}. Continuer ?",
    makeSecretConfirm: "Oui, le rendre secret",
    madePublic: "L'anniversaire n'est plus secret.",
    madeSecret: "L'anniversaire est maintenant secret.",
  },

  admin: {
    title: "Administration",
    navLabel: "Admin",
    notAllowed: "Cet écran est réservé à l'administrateur.",
    pausedBanner: "Les envois d'emails sont suspendus depuis le {date} : aucun email ne part.",
    pausedBannerLink: "Gérer les envois",
    tabs: {
      events: "Noël",
      birthdays: "Anniversaires",
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
      runDrawConfirm: "Oui, lancer le tirage maintenant",
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
        "Ajoutez un membre, corrigez un nom, un foyer, une adresse email ou une date d'anniversaire. " +
        "Un membre qui ne participe plus est retiré de la famille, jamais effacé : son historique est conservé.",
      add: "Ajouter un membre",
      addTitle: "Nouveau membre",
      addSubmit: "Ajouter",
      added: "{name} fait maintenant partie de la famille.",
      edit: "Modifier",
      editTitle: "Modifier {name}",
      save: "Enregistrer",
      saved: "{name} : modifications enregistrées.",
      savedWithEmail:
        "{name} : modifications enregistrées. Le compte de connexion suivra la nouvelle adresse " +
        "à la prochaine distribution des emails, qui y enverra une invitation.",
      nameLabel: "Prénom ou surnom",
      nameRequired: "Indiquez un nom.",
      nameTooLong: "Le nom ne doit pas dépasser 40 caractères.",
      household: "Foyer",
      noHousehold: "Aucun (personne seule)",
      noHouseholdLong: "Sans foyer",
      inHousehold: "Foyer {label}",
      householdWith: "Foyer {label} : {names}",
      householdEmpty: "Foyer {label} (vide)",
      newHousehold: "Nouveau foyer",
      emailLabel: "Adresse email",
      emailChangeHint:
        "Pour un changement d'adresse ou une erreur de saisie. La personne se connectera ensuite avec " +
        "la nouvelle adresse ; l'ancienne ne fonctionnera plus.",
      noEmail: "Pas d'adresse email",
      birthday: "Anniversaire",
      birthdayDay: "Jour",
      birthdayMonth: "Mois",
      birthdayHint: "Sans l'année. Visible par toute la famille, qui le voit approcher sur l'accueil.",
      birthdayIncomplete: "Choisissez le jour et le mois de l'anniversaire, ou aucun des deux.",
      birthdayInvalid: "Cette date n'existe pas.",
      bornOn: "anniversaire le {date}",
      admin: "Administrateur",
      canSignIn: "Peut se connecter",
      cannotSignIn: "Ne peut pas encore se connecter",
      accountSoon: "Compte créé à la prochaine distribution des emails",
      left: "Ne fait plus partie de la famille",
      leave: "Retirer de la famille",
      leaveConfirm: "Oui, retirer {name}",
      leftDone: "{name} ne fait plus partie de la famille. Son historique est conservé.",
      comeBack: "Réintégrer",
      comeBackConfirm: "Oui, réintégrer {name}",
      cameBack: "{name} fait de nouveau partie de la famille.",
      householdHint: "Les deux membres d'un couple partagent le même foyer : ils ne se tirent jamais au sort.",
      emailHint:
        "Les adresses ne sont visibles que par vous. Un membre retiré ne reçoit plus rien et ne participe " +
        "plus aux tirages ; ce n'est pas possible pendant un tirage en cours.",
      resend: "Renvoyer l'invitation",
      resendConfirm: "Confirmer l'envoi",
      resent: "Invitation de {name} prête : elle partira à la prochaine distribution.",
      invite: "Ouvrir l'accès",
      inviteConfirm: "Oui, ouvrir l'accès à {name}",
      invited: "{name} est invité : son compte et son invitation partent à la prochaine distribution.",
      invitedOn: "invité le {date}",
      addressPending: "Nouvelle adresse pas encore prise en compte : elle le sera au prochain envoi automatique.",
      invitation: {
        to_prepare: "Invitation demandée le {date} : elle partira au prochain envoi automatique.",
        queued: "Invitation prête depuis le {date} : en attente d'envoi (entre 8 h et 20 h, ou envois suspendus).",
        sent: "Invitation envoyée le {date} (acceptée par le serveur d'envoi).",
        failed: "L'envoi de l'invitation a échoué le {date} : {error}. Vérifiez l'adresse.",
        cancelled: "Invitation annulée le {date}.",
      },
      inviteHint:
        "Vous pouvez ouvrir le site à une personne à la fois pour l'essayer : elle seule reçoit un compte " +
        "et une invitation. Les autres ne peuvent toujours pas se connecter ni recevoir d'email. " +
        "Les envois ont lieu entre 8\u00a0h et 20\u00a0h.",
      openHint: "Le site est ouvert à toute la famille : chacun peut se connecter et recevoir ses emails.",
    },
    birthdays: {
      intro:
        "L'anniversaire des membres cochés ci-dessous s'ouvre tout seul avant la date. Celui des autres " +
        "s'ouvre quand un membre clique sur « Lancer la préparation » depuis l'accueil. " +
        "Ni la personne fêtée ni son conjoint n'y participent par défaut.",
      contribution: "Contribution indicative par personne (€)",
      contributionHint: "Proposée pour chaque nouvel anniversaire ; modifiable ensuite pour chacun.",
      invalidContribution: "Indiquez un montant, par exemple 25 ou 25,50.",
      opening: "Ouverture automatique",
      openAmount: "Délai",
      openUnit: "En",
      weeks: "semaines",
      months: "mois",
      openingHint:
        "Un anniversaire s'ouvre tout seul ce délai avant la date (de 1 à 6 mois, ou de 1 à 26 semaines), " +
        "et ses participants reçoivent un email. Un membre peut toujours le lancer plus tôt.",
      invalidMonths: "Indiquez un nombre de mois entre 1 et 6.",
      invalidWeeks: "Indiquez un nombre de semaines entre 1 et 26.",
      defaultParticipants: "Membres concernés",
      defaultParticipantsHint:
        "Pour chaque membre coché, l'anniversaire s'ouvre automatiquement, et il participe par défaut à " +
        "l'anniversaire des autres (sauf à celui de son conjoint). La personne qui lance un anniversaire " +
        "peut ensuite changer ses participants.",
      save: "Enregistrer",
      saved: "Réglages des anniversaires enregistrés.",
      withoutDate: "Sans date d'anniversaire (à renseigner dans Membres) : {names}.",
      listTitle: "Anniversaires",
      none: "Aucun anniversaire en préparation ni passé pour l'instant.",
      hiddenHint: "Votre anniversaire et celui de votre conjoint n'apparaissent pas ici : c'est une surprise pour vous aussi.",
      contributionLine: "Contribution indicative : {amount}",
      participantsLine: "{count} participant(s)",
      launchedBy: "Lancé par {name}",
      automatic: "Ouvert automatiquement",
      openPage: "Participants",
      cancel: "Annuler l'anniversaire",
      cancelConfirm: "Confirmer l'annulation",
      cancelled: "{title} est annulé.",
      secretDefault: "Anniversaires secrets par défaut",
      secretDefaultHint:
        "Secret : la personne fêtée ne sait pas que son anniversaire se prépare, et les demandes d'idées restent " +
        "neutres. Modifiable ensuite pour chaque anniversaire.",
      secretLine: "Secret",
      publicLine: "Non secret",
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
      nextOff: "Tirage automatique désactivé : créez l'événement vous-même depuis « Noël ».",
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
      resumeCancelConfirm: "Oui, annuler {count} email(s) et reprendre",
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
        "la personne à qui vous offrez un cadeau, sa liste d'envies, et vous pourrez remplir la vôtre. On y " +
        "prépare aussi les anniversaires.\n\n" +
        "Pour vous connecter, ouvrez le lien ci-dessous et saisissez cette adresse email : vous recevrez " +
        "un code à 6 chiffres, sans mot de passe.\n\n{lien}\n\n" +
        "Un mode d'emploi illustré, en quelques minutes : {lien}/#/help\n\nÀ très bientôt !",
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
    birthday_opened: {
      subject: "{evenement} : on prépare la surprise !",
      body:
        "Bonjour {prenom},\n\n{evenement} tombe le {date} et vous faites partie des participants. " +
        "Sur le site, vous trouverez sa liste d'envies : prenez une idée en charge, participez à un cadeau " +
        "commun ou proposez-en un. Chacun voit qui fait quoi, et la personne fêtée ne voit rien.\n\n" +
        "Contribution indicative : {budget}.\n\n{lien}\n\nChut, c'est une surprise !",
    },
    birthday_reminder: {
      subject: "{evenement} approche",
      body:
        "Bonjour {prenom},\n\n{evenement} tombe le {date} et vous n'avez encore choisi aucun cadeau. " +
        "Il est encore temps de prendre une idée en charge ou de participer à un cadeau commun " +
        "(contribution indicative : {budget}).\n\n{lien}",
    },
    ideas_requested: {
      subject: "{evenement} : on aimerait quelques idées",
      body:
        "Bonjour {prenom},\n\nQuelqu'un qui vous prépare un cadeau ({evenement}) aimerait quelques idées. " +
        "Ajoutez des envies à votre liste, ou dites en une phrase ce qui vous ferait plaisir en ce moment " +
        "(« Mes envies du moment »).\n\n{lien}",
    },
    ideas_requested_secret: {
      subject: "Votre liste d'envies vous attend",
      body:
        "Bonjour {prenom},\n\nUn membre de la famille aimerait quelques idées de cadeaux pour vous. " +
        "Pensez à mettre à jour votre liste d'envies, ou à dire en une phrase ce qui vous ferait plaisir " +
        "en ce moment (« Mes envies du moment »).\n\n{lien}",
    },
    family_question: {
      subject: "Une question de la famille",
      body:
        "Bonjour {prenom},\n\nUn membre de la famille vous pose une question, sans dire qui il est. " +
        "Vous pouvez lui répondre sur le site, dans « Messages ».\n\n{lien}",
    },
    family_answer: {
      subject: "{evenement} : une réponse à vos questions",
      body:
        "Bonjour {prenom},\n\nLa personne fêtée a répondu à une question sur la page de l'anniversaire.\n\n{lien}",
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
    ideas: {
      too_soon: "Une demande a déjà été envoyée il y a moins de 7 jours. Réessayez plus tard.",
      not_your_receiver: "Vous ne pouvez demander des idées qu'à la personne à qui vous offrez.",
      note_birthday_only: "Pour ajouter un mot, utilisez les messages anonymes.",
      invalid_question: "Écrivez votre message (1 000 caractères au plus).",
      no_question: "Cette conversation n'existe plus. Rechargez la page.",
    },
    birthday: {
      not_allowed: "On ne prépare pas son propre anniversaire, ni celui de son conjoint.",
      no_date: "Cette personne n'a pas de date d'anniversaire.",
      invalid_title: "Indiquez un titre (80 caractères au plus pour un anniversaire, 120 pour une idée).",
      too_early: "C'est trop tôt : un anniversaire se lance au plus six mois avant.",
      already_open: "Cet anniversaire est déjà en préparation.",
      not_organiser: "Seule la personne qui a lancé l'anniversaire (ou l'administrateur) choisit les participants.",
      closed: "Cet anniversaire est passé : il ne peut plus être modifié.",
      celebrated_cannot_take_part: "La personne fêtée ne peut pas participer à son propre anniversaire.",
      no_participants: "Choisissez au moins un participant.",
      not_a_participant: "Vous ne participez pas à cet anniversaire.",
      invalid_request: "Demande incomplète. Rechargez la page.",
      invalid_amount: "Indiquez un montant positif, par exemple 20 ou 15,50.",
      wish_not_found: "Cette idée n'est plus dans sa liste. Rechargez la page.",
      gift_not_found: "Ce cadeau n'existe plus. Rechargez la page.",
      buyer_taken: "Quelqu'un s'occupe déjà de ce cadeau : vous pouvez y participer.",
      invalid_url: "Le lien doit commencer par http:// ou https://.",
      note_too_long: "Les précisions ne doivent pas dépasser 500 caractères.",
      not_your_gift: "Seule la personne qui l'a proposé peut retirer ce cadeau.",
      gift_has_contributions: "D'autres participent déjà à ce cadeau : il ne peut plus être retiré.",
    },
    members: {
      household_full: "Ce foyer compte déjà deux personnes : un foyer est un couple.",
      admin_cannot_leave: "L'administrateur ne peut pas se retirer de la famille.",
      in_current_draw:
        "Cette personne participe à un tirage en cours : elle pourra être retirée une fois l'événement clôturé.",
      email_required: "Cette personne peut déjà se connecter : son adresse peut être changée, pas effacée.",
      not_found: "Ce membre n'existe plus. Rechargez la page.",
      invalid_email: "Cette adresse email n'est pas valide.",
      email_taken: "Cette adresse email est déjà celle d'un autre membre.",
      name_taken: "Un membre porte déjà ce nom : ajoutez une initiale pour les distinguer.",
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
