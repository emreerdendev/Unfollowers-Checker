import type { Guide } from './types'

export const fr: Guide[] = [
  {
    slug: 'see-who-unfollowed-you-on-instagram',
    title: 'Comment voir qui ne vous suit pas en retour sur Instagram',
    description:
      'Instagram n’indique pas qui s’est désabonné de vous. Voici une méthode gratuite pour lister tous ceux qui ne vous suivent pas en retour, sans donner votre mot de passe à une application.',
    published: '2026-11-13',
    platform: 'instagram',
    sections: [
      {
        paragraphs: [
          'Instagram ne vous prévient pas quand quelqu’un se désabonne, et il n’existe aucune liste intégrée des personnes qui ne vous suivent pas en retour. La seule façon de le savoir est de comparer deux listes : les comptes que vous suivez et les comptes qui vous suivent.',
          'Pour un petit compte, vous pouvez le faire à la main, mais au-delà de quelques centaines d’abonnements cela devient irréaliste. Ce guide présente une méthode gratuite pour le faire automatiquement, sans installer d’application ni confier votre mot de passe à qui que ce soit.',
        ],
      },
      {
        heading: 'Ce qu’il vous faut',
        bullets: [
          'Un ordinateur avec un navigateur de bureau comme Chrome, Edge, Firefox ou Safari.',
          'Être connecté à instagram.com dans ce navigateur.',
          'Environ cinq minutes. L’analyse des gros comptes prend plus de temps.',
        ],
      },
      {
        heading: 'Étape par étape',
        steps: [
          'Ouvrez la page Instagram d’Unfollowers Checker et appuyez sur « Copier le code ».',
          'Allez sur instagram.com dans le même navigateur et assurez-vous d’être connecté.',
          'Ouvrez la console développeur : F12 ou Ctrl+Maj+J sous Windows et Linux, Cmd+Option+J sur Mac. Cliquez sur l’onglet Console.',
          'Collez le script et appuyez sur Entrée. Un panneau apparaît dans un coin de la page.',
          'Appuyez sur « Analyser maintenant ». Le panneau charge vos abonnés, puis compare chaque compte que vous suivez avec cette liste, et affiche tous ceux qui ne vous suivent pas en retour.',
          'Si vous le souhaitez, sélectionnez des comptes et désabonnez-vous. Le panneau espace les requêtes et vérifie chaque désabonnement auprès d’Instagram.',
        ],
      },
      {
        heading:
          'Pourquoi un script dans la console plutôt qu’une application ?',
        paragraphs: [
          'Instagram n’a pas d’API publique pour les listes d’abonnés. Les applications qui promettent ce service demandent généralement votre nom d’utilisateur et votre mot de passe, puis se connectent depuis leurs propres serveurs, ce qui met votre compte en danger.',
          'Un script exécuté sur instagram.com utilise la session avec laquelle vous êtes déjà connecté. Votre mot de passe ne quitte jamais votre navigateur, et rien n’est envoyé à un serveur tiers. Le script est open source : vous pouvez lire exactement ce qu’il fait avant de l’exécuter.',
        ],
      },
      {
        heading: 'Conseils',
        bullets: [
          'Si l’analyse s’arrête en cours de route, rouvrez le panneau : la progression est enregistrée après chaque page, vous pouvez donc reprendre au lieu de tout recommencer.',
          'Gardez les délais par défaut. Ils sont volontairement lents pour ressembler à une utilisation normale.',
          'Ne vous désabonnez pas de centaines de comptes d’un coup. Étalez les grands nettoyages sur quelques jours.',
        ],
      },
    ],
  },
  {
    slug: 'are-instagram-unfollower-apps-safe',
    title:
      'Les applis de désabonnés Instagram sont-elles sûres ? À vérifier d’abord',
    description:
      'Beaucoup d’applis « qui s’est désabonné de moi » demandent votre mot de passe Instagram. Voici comment distinguer un outil risqué d’un outil sûr, et limiter le risque de blocage d’action.',
    published: '2026-11-13',
    platform: 'instagram',
    sections: [
      {
        paragraphs: [
          'Une recherche « qui s’est désabonné de moi sur Instagram » fait apparaître des dizaines d’applications. Certaines sont inoffensives ; d’autres font courir un vrai risque à votre compte. La différence tient généralement à une seule chose : ce que l’outil vous demande de lui confier.',
        ],
      },
      {
        heading: 'Signaux d’alerte',
        bullets: [
          'Il demande votre mot de passe Instagram. Un tiers qui se connecte à votre place peut être signalé comme suspect, et vous ne contrôlez pas ce qu’il fait de la session.',
          'Il n’affiche qu’une partie de la liste et exige un abonnement pour « débloquer » le reste.',
          'Il promet de montrer qui a consulté votre profil ou vos stories. Instagram ne rend pas ces données accessibles : cette promesse est fausse.',
          'On ne sait pas clairement qui l’édite, ce qu’il conserve ni où vont vos données.',
        ],
      },
      {
        heading: 'Des approches plus sûres',
        bullets: [
          'Les outils qui s’exécutent dans votre propre session de navigateur sur instagram.com, afin que votre mot de passe ne quitte jamais votre appareil.',
          'Les outils qui fonctionnent à partir de l’export de données officiel d’Instagram, que vous téléchargez vous-même.',
          'Les outils open source, dont tout le monde peut lire le code et vérifier ce qu’il fait.',
        ],
      },
      {
        heading: 'Éviter un blocage d’action',
        paragraphs: [
          'Même un outil qui ne voit jamais votre mot de passe peut déclencher les limites d’Instagram s’il agit trop vite. Instagram peut alors bloquer temporairement des actions comme s’abonner et se désabonner.',
        ],
        bullets: [
          'Désabonnez-vous par petits lots, avec des pauses entre chaque compte.',
          'Arrêtez-vous si Instagram affiche un avertissement, et attendez un jour ou deux avant de continuer.',
          'N’utilisez pas plusieurs outils d’automatisation en même temps.',
        ],
      },
      {
        heading: 'Comment Unfollowers Checker s’y prend',
        paragraphs: [
          'Unfollowers Checker s’exécute sous forme de script dans votre propre session de navigateur, ne demande jamais votre mot de passe et n’envoie rien à ses propres serveurs. Il ajoute des délais aléatoires et des temps de pause, s’interrompt automatiquement quand Instagram demande de ralentir, et vérifie chaque désabonnement. Toute activité automatisée comporte un certain risque : utilisez-le avec prudence.',
        ],
      },
    ],
  },
  {
    slug: 'bluesky-who-doesnt-follow-you-back',
    title: 'Comment trouver qui ne vous suit pas en retour sur Bluesky',
    description:
      'Une méthode rapide et gratuite pour lister les comptes Bluesky que vous suivez et qui ne vous suivent pas en retour, puis vous en désabonner en masse avec la connexion officielle de Bluesky.',
    published: '2026-11-13',
    platform: 'bluesky',
    sections: [
      {
        paragraphs: [
          'Bluesky affiche votre nombre d’abonnés et d’abonnements, mais pas qui manque dans l’une ou l’autre liste. Comme les listes d’abonnements sont publiques sur Bluesky, vous pouvez les comparer sans vous connecter.',
        ],
      },
      {
        heading: 'Étape par étape',
        steps: [
          'Ouvrez la page Bluesky d’Unfollowers Checker.',
          'Saisissez votre identifiant, par exemple nom.bsky.social ou votre domaine personnalisé. Vous pouvez aussi coller le lien de votre profil bsky.app.',
          'Appuyez sur Vérifier. Vous verrez tous les comptes que vous suivez et qui ne vous suivent pas en retour.',
          'Pour vous désabonner, appuyez sur « Se connecter avec Bluesky ». La connexion passe par l’OAuth officiel de Bluesky : vous ne saisissez jamais de mot de passe ni de mot de passe d’application.',
          'Sélectionnez les comptes voulus et appuyez sur « Ne plus suivre la sélection ».',
        ],
      },
      {
        heading: 'Bon à savoir',
        bullets: [
          'Vous pouvez vérifier n’importe quel identifiant public, pas seulement le vôtre. Le désabonnement ne concerne jamais que votre propre compte.',
          'Rien n’est stocké : les listes sont récupérées, comparées et renvoyées pour cette seule requête.',
          'Les très gros comptes sont comparés jusqu’à une certaine limite ; leurs résultats peuvent donc être partiels.',
        ],
      },
    ],
  },
  {
    slug: 'download-your-x-twitter-archive',
    title: 'Comment télécharger l’archive de vos données X (Twitter)',
    description:
      'Étape par étape : demandez l’archive de vos données X, trouvez following.js et follower.js à l’intérieur, et voyez qui ne vous suit pas en retour, sans API X.',
    published: '2026-11-13',
    platform: 'twitter',
    sections: [
      {
        paragraphs: [
          'X ne propose plus de moyen gratuit pour que des outils lisent les listes d’abonnés, mais vous pouvez toujours obtenir vos propres listes : X permet à chaque compte de télécharger une archive de ses données. Deux fichiers de cette archive, following.js et follower.js, suffisent pour trouver qui ne vous suit pas en retour.',
        ],
      },
      {
        heading: 'Demander l’archive',
        steps: [
          'Sur X, ouvrez Plus (ou le menu de votre profil) et allez dans Paramètres et confidentialité.',
          'Choisissez Votre compte, puis Télécharger une archive de vos données.',
          'Confirmez votre mot de passe. X peut aussi envoyer un code de vérification à votre adresse e-mail ou à votre téléphone.',
          'Appuyez sur Demander l’archive.',
        ],
      },
      {
        heading: 'Patienter',
        paragraphs: [
          'X prépare l’archive en arrière-plan. Cela prend généralement environ un jour, parfois plus pour les gros comptes. Vous recevrez un e-mail et une notification dans l’application quand elle sera prête, et le téléchargement reste disponible pendant quelques jours.',
        ],
      },
      {
        heading: 'Trouver les deux fichiers',
        steps: [
          'Téléchargez l’archive (un fichier .zip) et décompressez-la.',
          'Ouvrez le dossier data qu’elle contient.',
          'Trouvez following.js et follower.js. Les gros comptes peuvent avoir des parties supplémentaires, comme following-part1.js : gardez-les aussi.',
        ],
      },
      {
        heading: 'Les comparer',
        paragraphs: [
          'Ouvrez la page X d’Unfollowers Checker et déposez-y les deux fichiers (et les éventuels fichiers part). La comparaison se fait entièrement dans votre navigateur : les fichiers ne sont jamais téléversés. Chaque résultat renvoie au profil sur X, où vous pouvez vous désabonner.',
        ],
      },
      {
        heading: 'Bon à savoir',
        bullets: [
          'L’archive ne contient que des ID de compte, pas des noms d’utilisateur : les résultats affichent donc des ID. Un clic ouvre le bon profil.',
          'L’archive est un instantané. Pour vérifier à nouveau plus tard, demandez-en une nouvelle.',
          'Le reste de l’archive (posts, messages, paramètres) n’est pas lu : seuls les deux fichiers d’abonnements sont utilisés.',
        ],
      },
    ],
  },
  {
    slug: 'github-who-doesnt-follow-you-back',
    title: 'Comment voir qui ne vous suit pas en retour sur GitHub',
    description:
      'GitHub n’indique pas qui ne vous suit pas en retour. Voici une méthode gratuite pour les lister pour n’importe quel nom d’utilisateur, et vous en désabonner en masse depuis votre compte.',
    published: '2026-11-13',
    platform: 'github',
    sections: [
      {
        paragraphs: [
          'GitHub affiche combien de personnes vous suivent et combien vous en suivez, mais pas qui manque dans l’une ou l’autre liste. Comme les listes d’abonnements sont publiques sur GitHub, elles peuvent être comparées sans connexion.',
        ],
      },
      {
        heading: 'Étape par étape',
        steps: [
          'Ouvrez la page GitHub d’Unfollowers Checker.',
          'Saisissez un nom d’utilisateur GitHub, le vôtre ou celui de quelqu’un d’autre. Un lien de profil fonctionne aussi.',
          'Appuyez sur Vérifier. Vous verrez tous les comptes que cet utilisateur suit et qui ne le suivent pas en retour.',
          'Pour nettoyer votre propre liste, appuyez sur Se connecter en haut de la page. La connexion passe par l’OAuth officiel de GitHub ; le jeton d’accès reste sur le serveur.',
          'Sélectionnez les comptes voulus et appuyez sur Ne plus suivre la sélection.',
        ],
      },
      {
        heading: 'Bon à savoir',
        bullets: [
          'Consulter un compte public ne nécessite aucune connexion. Le désabonnement ne concerne jamais que votre propre compte, et vous demande d’abord une confirmation.',
          'Rien n’est stocké : les listes sont récupérées, comparées et renvoyées pour cette seule requête.',
          'Les très gros comptes sont comparés jusqu’à une certaine limite ; leurs résultats peuvent donc être partiels, ce que la page vous signale.',
        ],
      },
    ],
  },
  {
    slug: 'instagram-action-blocked',
    title: 'Instagram « Action bloquée » : ce que cela signifie et que faire',
    description:
      'Pourquoi Instagram bloque des actions comme s’abonner et se désabonner, combien de temps cela dure en général, ce qui aide, et comment l’éviter en faisant le tri dans vos abonnements.',
    published: '2026-11-13',
    platform: 'instagram',
    sections: [
      {
        paragraphs: [
          '« Action bloquée » (ou « Réessayez plus tard ») est une restriction temporaire qu’Instagram impose à un compte qui en fait trop, trop vite. Elle touche généralement des actions comme s’abonner, se désabonner, aimer ou commenter, tandis que le reste de l’application continue de fonctionner.',
        ],
      },
      {
        heading: 'Pourquoi cela arrive',
        bullets: [
          'Beaucoup d’abonnements ou de désabonnements en peu de temps, ce qui semble automatisé.',
          'Répéter une action juste après qu’Instagram l’a refusée.',
          'Des applications tierces qui se connectent à votre place ou agissent en votre nom.',
          'Un compte nouveau ou récemment modifié, qu’Instagram surveille de plus près.',
        ],
      },
      {
        heading: 'Combien de temps cela dure',
        paragraphs: [
          'Instagram ne publie ni limites ni durées exactes. La plupart des blocages sont levés en quelques heures à quelques jours. Réessayer pendant le blocage tend à le prolonger.',
        ],
      },
      {
        heading: 'Que faire',
        steps: [
          'Arrêtez l’action qui a été bloquée, et ne continuez pas à la réessayer.',
          'Patientez : laissez passer au moins un jour avant de réessayer.',
          'Consultez Paramètres → Applications et sites web, et supprimez toute application que vous ne reconnaissez pas ou n’utilisez plus.',
          'Si vous pensez que quelqu’un d’autre a utilisé votre compte, changez votre mot de passe et activez l’authentification à deux facteurs.',
          'Si le message indique qu’il s’agit d’une erreur, vous pouvez le signaler à Instagram depuis la fenêtre affichée.',
        ],
      },
      {
        heading: 'Se désabonner sans être bloqué',
        bullets: [
          'Désabonnez-vous par petits lots, avec des pauses entre chaque compte.',
          'Étalez un grand nettoyage sur plusieurs jours.',
          'Évitez les outils qui demandent votre mot de passe.',
        ],
      },
      {
        heading: 'Comment Unfollowers Checker s’y prend',
        paragraphs: [
          'Le panneau Instagram d’Unfollowers Checker s’exécute dans votre propre session de navigateur, ajoute des délais aléatoires et des temps de pause, et s’interrompt automatiquement quand Instagram demande de ralentir. Toute activité automatisée comporte un certain risque : gardez les délais par défaut.',
        ],
      },
    ],
  },
]
