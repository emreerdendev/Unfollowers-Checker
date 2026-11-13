import type { SeoContent } from './types'

export const fr: SeoContent = {
  home: {
    title: 'Unfollowers Checker — Qui ne vous suit pas en retour ?',
    description:
      'Outil gratuit et open source pour trouver qui ne vous suit pas en retour sur Instagram, X (Twitter), GitHub, Bluesky, GitLab et Mastodon. Sans mot de passe.',
    heading: 'Trouvez qui ne vous suit pas en retour, sur chaque plateforme',
    intro: [
      'Unfollowers Checker compare les comptes que vous suivez avec ceux qui vous suivent et liste tous ceux qui ne vous suivent pas en retour. Il fonctionne sur Instagram, X (Twitter), GitHub, Bluesky, GitLab et Mastodon.',
      'Il est gratuit et open source, ne demande jamais votre mot de passe et ne conserve pas vos données. Sur GitHub, Bluesky, GitLab, Mastodon et Instagram, vous pouvez aussi vous désabonner en masse des comptes choisis.',
    ],
    faq: [
      {
        q: 'Quelles plateformes sont prises en charge ?',
        a: 'Instagram, X (Twitter), GitHub, Bluesky, GitLab et Mastodon. Choisissez une plateforme en haut de la page pour commencer.',
      },
      {
        q: 'Puis-je me désabonner avec cet outil ?',
        a: 'Oui, sur GitHub, Bluesky, GitLab, Mastodon et Instagram. Sélectionnez les comptes et désabonnez-vous en une fois. X n’offre pas d’API gratuite pour cela : chaque résultat renvoie au profil, et vous vous désabonnez sur X.',
      },
    ],
  },

  platforms: {
    github: {
      title: 'Unfollowers GitHub — Qui ne vous suit pas en retour ?',
      description:
        'Saisissez un nom d’utilisateur GitHub pour voir qui ne suit pas en retour. Gratuit et open source. Connectez-vous avec GitHub pour vous désabonner en masse.',
      heading: 'Voyez qui ne vous suit pas en retour sur GitHub',
      intro: [
        'Saisissez un nom d’utilisateur GitHub et Unfollowers Checker liste tous les comptes qu’il suit et qui ne le suivent pas en retour. L’API publique de GitHub est utilisée : aucune connexion n’est nécessaire et cela fonctionne pour tout utilisateur public.',
        'Pour nettoyer votre propre liste, connectez-vous avec GitHub (OAuth officiel), sélectionnez les comptes et désabonnez-vous en masse.',
      ],
      faq: [
        {
          q: 'Dois-je me connecter pour vérifier mes abonnés GitHub ?',
          a: 'Non. Les listes d’abonnés et d’abonnements sont publiques sur GitHub. La connexion sert uniquement à vous désabonner depuis votre propre compte.',
        },
        {
          q: 'Quelles autorisations la connexion GitHub demande-t-elle ?',
          a: 'Seulement celle que GitHub exige pour suivre et ne plus suivre en votre nom. Le jeton d’accès reste sur le serveur et n’arrive jamais dans votre navigateur.',
        },
        {
          q: 'Cela fonctionne-t-il pour des comptes avec des milliers d’abonnés ?',
          a: 'Oui. Les très gros comptes sont comparés jusqu’à une certaine limite ; les résultats peuvent alors être partiels, ce que la page indique.',
        },
      ],
    },
    bluesky: {
      title: 'Unfollowers Bluesky — Qui ne vous suit pas en retour ?',
      description:
        'Voyez quels comptes Bluesky ne vous suivent pas en retour, sans connexion. Connectez-vous avec Bluesky pour vous désabonner en masse. Gratuit et open source.',
      heading: 'Voyez qui ne vous suit pas en retour sur Bluesky',
      intro: [
        'Saisissez un identifiant Bluesky comme nom.bsky.social et Unfollowers Checker liste tous les comptes qui ne suivent pas en retour. Les données viennent de l’API publique AT Protocol de Bluesky ; aucune connexion n’est requise pour consulter.',
        'Connectez-vous via l’OAuth officiel de Bluesky pour vous désabonner en masse des comptes sélectionnés.',
      ],
      faq: [
        {
          q: 'Les identifiants avec un domaine personnalisé fonctionnent-ils ?',
          a: 'Oui. Tout identifiant Bluesky fonctionne, y compris les domaines personnalisés comme votrenom.fr. Vous pouvez aussi coller un lien de profil bsky.app.',
        },
        {
          q: 'Ai-je besoin d’un mot de passe d’application ?',
          a: 'Non. La connexion passe par l’OAuth officiel de Bluesky : vous ne saisissez jamais de mot de passe ici.',
        },
        {
          q: 'Puis-je vérifier le compte de quelqu’un d’autre ?',
          a: 'Oui, les listes d’abonnements sont publiques sur Bluesky. Le désabonnement ne concerne que votre propre compte.',
        },
      ],
    },
    gitlab: {
      title: 'Abonnés GitLab — Qui ne vous suit pas en retour ?',
      description:
        'Connectez-vous avec GitLab pour voir qui ne vous suit pas en retour sur gitlab.com et vous désabonner en masse. Gratuit, open source, rien n’est stocké.',
      heading: 'Voyez qui ne vous suit pas en retour sur GitLab',
      intro: [
        'GitLab garde les listes d’abonnés privées, donc Unfollowers Checker vous demande d’abord de vous connecter avec GitLab. Il charge ensuite votre liste et affiche tous ceux que vous suivez et qui ne vous suivent pas en retour.',
        'Sélectionnez les comptes voulus et désabonnez-vous en une fois. Fonctionne avec gitlab.com, sans offre payante.',
      ],
      faq: [
        {
          q: 'Pourquoi dois-je me connecter pour GitLab ?',
          a: 'L’API de GitLab ne fournit les listes d’abonnés qu’aux utilisateurs connectés. Vous ne pouvez donc vérifier que votre propre compte.',
        },
        {
          q: 'Cela fonctionne-t-il avec un GitLab auto-hébergé ?',
          a: 'Pas encore. Seul gitlab.com est pris en charge pour l’instant.',
        },
      ],
    },
    mastodon: {
      title: 'Unfollowers Mastodon — Qui ne vous suit pas en retour ?',
      description:
        'Saisissez un identifiant user@instance pour voir qui ne suit pas en retour sur Mastodon. Toute instance, sans connexion pour consulter. Gratuit.',
      heading: 'Voyez qui ne vous suit pas en retour sur Mastodon',
      intro: [
        'Saisissez un identifiant Mastodon au format user@instance et Unfollowers Checker liste tous les comptes qui ne suivent pas en retour. La consultation fonctionne pour les comptes de toute instance.',
        'Connectez-vous pour vous désabonner en masse des comptes choisis. La connexion et le désabonnement fonctionnent actuellement sur mastodon.social.',
      ],
      faq: [
        {
          q: 'Quelles instances Mastodon sont prises en charge ?',
          a: 'La consultation fonctionne sur toute instance qui affiche publiquement les listes d’abonnements. La connexion et le désabonnement fonctionnent actuellement sur mastodon.social.',
        },
        {
          q: 'Et si un compte masque ses listes ?',
          a: 'Certains utilisateurs de Mastodon masquent qui ils suivent ou qui les suit. Les listes ne peuvent alors pas être lues et la vérification est impossible.',
        },
      ],
    },
    instagram: {
      title: 'Unfollowers Instagram — Gratuit, sans mot de passe',
      description:
        'Voyez qui ne vous suit pas en retour sur Instagram et désabonnez-vous en masse. Fonctionne dans votre propre session : sans mot de passe, sans appli, sans serveur.',
      heading: 'Voyez qui ne vous suit pas en retour sur Instagram',
      intro: [
        'Instagram n’indique pas qui ne vous suit pas en retour. Unfollowers Checker vous donne un petit script à coller dans la console de votre navigateur sur instagram.com. Il charge vos abonnés et vos abonnements avec votre propre session et liste tous ceux qui ne vous suivent pas en retour.',
        'Vous ne saisissez jamais votre mot de passe et rien n’est envoyé à nos serveurs. Depuis le panneau, vous pouvez rechercher, filtrer et vous désabonner des comptes choisis par lots, avec des pauses prudentes entre chacun.',
      ],
      faq: [
        {
          q: 'Instagram montre-t-il qui s’est désabonné ?',
          a: 'Non. Instagram ne vous prévient pas et n’affiche aucune liste des personnes qui se sont désabonnées ou ne vous suivent pas en retour. Ce type d’outil compare vos listes d’abonnés et d’abonnements.',
        },
        {
          q: 'Est-ce sûr ?',
          a: 'Vous ne partagez jamais votre mot de passe, et le script ne communique avec Instagram que depuis votre navigateur. Il ajoute des pauses aléatoires et s’arrête automatiquement quand Instagram demande de ralentir. Toute activité automatisée comporte un risque : gardez les délais par défaut et ne vous désabonnez pas de centaines de comptes d’un coup.',
        },
        {
          q: 'Pourquoi coller un script dans la console ?',
          a: 'Instagram n’a pas d’API publique pour les abonnés. Exécuté sur instagram.com, le script utilise votre session existante : aucun mot de passe ni connexion tierce n’est nécessaire. Le script est open source, vous pouvez le lire avant de l’exécuter.',
        },
        {
          q: 'Cela fonctionne-t-il sur téléphone ?',
          a: 'Il faut un navigateur de bureau avec des outils de développement, comme Chrome, Edge, Firefox ou Safari sur ordinateur.',
        },
        {
          q: 'Que se passe-t-il si l’analyse s’arrête en cours ?',
          a: 'La progression est enregistrée après chaque page. Rouvrez le panneau et reprenez là où vous vous étiez arrêté.',
        },
      ],
    },
    twitter: {
      title: 'Unfollowers X (Twitter) — Qui ne vous suit pas en retour ?',
      description:
        'Trouvez qui ne vous suit pas en retour sur X (Twitter) grâce à votre archive officielle. La comparaison se fait dans le navigateur, les fichiers restent chez vous.',
      heading: 'Voyez qui ne vous suit pas en retour sur X (Twitter)',
      intro: [
        'X n’offre pas d’API gratuite pour les listes d’abonnés : Unfollowers Checker utilise donc votre archive officielle de données X. Importez-en following.js et follower.js, et la page liste tous les comptes que vous suivez et qui ne vous suivent pas en retour.',
        'Tout se passe dans votre navigateur : les fichiers sont lus et comparés localement, jamais envoyés. Chaque résultat renvoie au profil pour vous désabonner sur X.',
      ],
      faq: [
        {
          q: 'Comment obtenir mon archive X ?',
          a: 'Sur X, allez dans Paramètres → Votre compte → Télécharger une archive de vos données. La préparation prend généralement environ un jour. Décompressez-la et trouvez following.js et follower.js dans le dossier data.',
        },
        {
          q: 'Pourquoi des identifiants numériques au lieu des noms ?',
          a: 'L’archive X ne contient que des identifiants de compte, pas les noms d’utilisateur. Un clic sur un résultat ouvre le bon profil sur X.',
        },
        {
          q: 'Puis-je me désabonner d’ici ?',
          a: 'Pas sur X, faute d’API gratuite. Ouvrez chaque profil depuis la liste et désabonnez-vous sur X.',
        },
      ],
    },
  },

  general: [
    {
      q: 'Unfollowers Checker est-il gratuit ?',
      a: 'Oui, entièrement gratuit, sans publicité ni limite. Il est open source sur GitHub.',
    },
    {
      q: 'Demandez-vous mon mot de passe ?',
      a: 'Jamais. Quand une connexion est nécessaire, l’OAuth officiel de chaque plateforme est utilisé. Instagram fonctionne dans votre propre session et X avec votre archive téléchargée.',
    },
    {
      q: 'Conservez-vous mes données ?',
      a: 'Non. Il n’y a pas de base de données. Les listes sont récupérées, comparées et renvoyées pour une seule requête ; vos préférences restent dans le stockage local de votre navigateur.',
    },
  ],

  guides: {
    title: 'Guides — Unfollowers Checker',
    description:
      'Guides pas à pas pour trouver qui ne vous suit pas en retour.',
    heading: 'Guides',
    intro: 'Des guides pratiques, pas à pas.',
  },

  faq: {
    title: 'Questions fréquentes — Unfollowers Checker',
    description:
      'Réponses sur Unfollowers Checker : fonctionnement sur Instagram, X, GitHub, Bluesky, GitLab et Mastodon, sécurité et données conservées.',
    heading: 'Questions fréquentes',
    intro:
      'Comment l’outil fonctionne sur chaque plateforme, ce qu’il conserve et comment rester prudent.',
    general: 'Général',
  },

  notFound: {
    title: 'Page introuvable',
    body: 'Cette page n’existe pas ou a été déplacée. Choisissez plutôt une plateforme depuis l’accueil.',
    backHome: 'Aller à l’accueil',
  },
}
