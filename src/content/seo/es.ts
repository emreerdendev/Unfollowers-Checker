import type { SeoContent } from './types'

export const es: SeoContent = {
  home: {
    title: 'Unfollowers Checker — ¿Quién no te sigue de vuelta?',
    description:
      'Herramienta gratuita y de código abierto para ver quién no te sigue de vuelta en Instagram, X (Twitter), GitHub, Bluesky, GitLab y Mastodon. Sin contraseña.',
    heading: 'Descubre quién no te sigue de vuelta, en cada plataforma',
    intro: [
      'Unfollowers Checker compara las cuentas que sigues con las que te siguen y muestra a todos los que no te siguen de vuelta. Funciona en Instagram, X (Twitter), GitHub, Bluesky, GitLab y Mastodon.',
      'Es gratis y de código abierto, nunca pide tu contraseña y no guarda tus datos. En GitHub, Bluesky, GitLab, Mastodon e Instagram también puedes dejar de seguir en bloque a las cuentas que elijas.',
    ],
    faq: [
      {
        q: '¿Qué plataformas son compatibles?',
        a: 'Instagram, X (Twitter), GitHub, Bluesky, GitLab y Mastodon. Elige una plataforma en la parte superior de la página para empezar.',
      },
      {
        q: '¿Puedo dejar de seguir a gente con esta herramienta?',
        a: 'Sí, en GitHub, Bluesky, GitLab, Mastodon e Instagram. Selecciona las cuentas y deja de seguirlas de una vez. X no ofrece una API gratuita para esto, así que cada resultado enlaza al perfil y dejas de seguir desde X.',
      },
    ],
  },

  platforms: {
    github: {
      title: 'Unfollowers de GitHub — ¿Quién no te sigue de vuelta?',
      description:
        'Escribe un usuario de GitHub y mira quién no le sigue de vuelta. Gratis y de código abierto. Inicia sesión con GitHub para dejar de seguir en bloque.',
      heading: 'Mira quién no te sigue de vuelta en GitHub',
      intro: [
        'Escribe un usuario de GitHub y Unfollowers Checker muestra todas las cuentas que sigue y que no le siguen de vuelta. Usa la API pública de GitHub, así que no necesitas iniciar sesión y funciona con cualquier usuario público.',
        'Para limpiar tu propia lista, inicia sesión con GitHub (OAuth oficial), selecciona las cuentas y deja de seguirlas en bloque.',
      ],
      faq: [
        {
          q: '¿Tengo que iniciar sesión para revisar mis seguidores de GitHub?',
          a: 'No. Las listas de seguidores y seguidos son públicas en GitHub. Solo inicias sesión para dejar de seguir desde tu propia cuenta.',
        },
        {
          q: '¿Qué permisos pide el inicio de sesión con GitHub?',
          a: 'Solo el que GitHub exige para seguir y dejar de seguir en tu nombre. El token de acceso se queda en el servidor y nunca llega a tu navegador.',
        },
        {
          q: '¿Funciona con cuentas de miles de seguidores?',
          a: 'Sí. Las cuentas muy grandes se comparan hasta un límite, por lo que los resultados pueden ser parciales; la página te lo indica.',
        },
      ],
    },
    bluesky: {
      title: 'Unfollowers de Bluesky — ¿Quién no te sigue de vuelta?',
      description:
        'Mira qué cuentas de Bluesky no te siguen de vuelta, sin iniciar sesión. Inicia sesión con Bluesky para dejar de seguirlas en bloque. Gratis y abierto.',
      heading: 'Mira quién no te sigue de vuelta en Bluesky',
      intro: [
        'Escribe un usuario de Bluesky como nombre.bsky.social y Unfollowers Checker muestra todas las cuentas que no le siguen de vuelta. Los datos vienen de la API pública AT Protocol de Bluesky, así que no hace falta iniciar sesión para verlos.',
        'Inicia sesión con el OAuth oficial de Bluesky para dejar de seguir en bloque a las cuentas que elijas.',
      ],
      faq: [
        {
          q: '¿Funciona con usuarios de dominio propio?',
          a: 'Sí. Cualquier usuario de Bluesky funciona, incluidos dominios propios como tunombre.com. También puedes pegar un enlace de perfil de bsky.app.',
        },
        {
          q: '¿Necesito una contraseña de aplicación?',
          a: 'No. El inicio de sesión usa el OAuth oficial de Bluesky: nunca escribes una contraseña aquí.',
        },
        {
          q: '¿Puedo revisar la cuenta de otra persona?',
          a: 'Sí, las listas de seguimiento son públicas en Bluesky. Dejar de seguir solo afecta a tu propia cuenta.',
        },
      ],
    },
    gitlab: {
      title: 'Seguidores de GitLab — ¿Quién no te sigue de vuelta?',
      description:
        'Inicia sesión con GitLab para ver quién no te sigue de vuelta en gitlab.com y dejar de seguirlos en bloque. Gratis, de código abierto, nada se guarda.',
      heading: 'Mira quién no te sigue de vuelta en GitLab',
      intro: [
        'GitLab mantiene privadas las listas de seguidores, así que Unfollowers Checker te pide primero iniciar sesión con GitLab. Después carga tu lista y muestra a todos los que sigues y no te siguen de vuelta.',
        'Selecciona las cuentas que quieras y deja de seguirlas de una vez. Funciona con gitlab.com y no necesita un plan de pago.',
      ],
      faq: [
        {
          q: '¿Por qué tengo que iniciar sesión en GitLab?',
          a: 'La API de GitLab solo da las listas de seguidores a usuarios con sesión iniciada, así que solo puedes revisar tu propia cuenta.',
        },
        {
          q: '¿Funciona con GitLab autoalojado?',
          a: 'Todavía no. Por ahora solo se admite gitlab.com.',
        },
      ],
    },
    mastodon: {
      title: 'Unfollowers de Mastodon — ¿Quién no te sigue de vuelta?',
      description:
        'Escribe un usuario con formato user@instancia y mira quién no te sigue de vuelta en Mastodon. Funciona con cualquier instancia, sin iniciar sesión. Gratis.',
      heading: 'Mira quién no te sigue de vuelta en Mastodon',
      intro: [
        'Escribe un usuario de Mastodon con el formato user@instancia y Unfollowers Checker muestra todas las cuentas que no le siguen de vuelta. Ver los resultados funciona con cuentas de cualquier instancia.',
        'Inicia sesión para dejar de seguir en bloque a las cuentas que elijas. El inicio de sesión y dejar de seguir funcionan por ahora en mastodon.social.',
      ],
      faq: [
        {
          q: '¿Qué instancias de Mastodon son compatibles?',
          a: 'Ver resultados funciona en cualquier instancia que muestre públicamente las listas de seguimiento. Iniciar sesión y dejar de seguir funcionan por ahora en mastodon.social.',
        },
        {
          q: '¿Y si una cuenta oculta sus listas?',
          a: 'Algunos usuarios de Mastodon ocultan a quién siguen o quién les sigue. En ese caso las listas no se pueden leer y la comprobación no es posible.',
        },
      ],
    },
    instagram: {
      title: 'Unfollowers de Instagram — Gratis y sin contraseña',
      description:
        'Mira quién no te sigue de vuelta en Instagram y deja de seguirlos en bloque. Funciona en tu propia sesión: sin contraseña, sin app, sin enviar nada a un servidor.',
      heading: 'Mira quién no te sigue de vuelta en Instagram',
      intro: [
        'Instagram no muestra quién no te sigue de vuelta. Unfollowers Checker te da un pequeño script que pegas en la consola del navegador mientras estás en instagram.com. Carga tus seguidores y las cuentas que sigues con tu propia sesión y muestra a todos los que no te siguen de vuelta.',
        'Nunca escribes tu contraseña y nada se envía a nuestros servidores. Desde el panel puedes buscar, filtrar y dejar de seguir por lotes a las cuentas elegidas, con pausas prudentes entre cada una.',
      ],
      faq: [
        {
          q: '¿Instagram muestra quién me dejó de seguir?',
          a: 'No. Instagram no te avisa ni muestra una lista de quién te dejó de seguir o no te sigue de vuelta. Herramientas como esta comparan tus listas de seguidores y seguidos.',
        },
        {
          q: '¿Es seguro usarlo?',
          a: 'Nunca compartes tu contraseña y el script solo habla con Instagram desde tu propio navegador. Añade pausas aleatorias y se detiene solo cuando Instagram pide ir más despacio. Toda actividad automatizada tiene algo de riesgo: mantén los tiempos por defecto y no dejes de seguir a cientos de cuentas de golpe.',
        },
        {
          q: '¿Por qué pego un script en la consola?',
          a: 'Instagram no tiene una API pública de seguidores. Ejecutar el script en instagram.com le permite usar la sesión que ya tienes abierta, así que no hace falta contraseña ni inicio de sesión de terceros. El script es de código abierto: puedes leerlo antes de ejecutarlo.',
        },
        {
          q: '¿Funciona en el móvil?',
          a: 'Necesita un navegador de escritorio con herramientas de desarrollador, como Chrome, Edge, Firefox o Safari en un ordenador.',
        },
        {
          q: '¿Qué pasa si el escaneo se corta a la mitad?',
          a: 'El progreso se guarda después de cada página. Vuelve a abrir el panel y continúa donde lo dejaste.',
        },
      ],
    },
    twitter: {
      title: 'Unfollowers de X (Twitter) — ¿Quién no te sigue de vuelta?',
      description:
        'Descubre quién no te sigue de vuelta en X (Twitter) con tu archivo oficial de datos. La comparación se hace en tu navegador y los archivos no salen de tu equipo.',
      heading: 'Mira quién no te sigue de vuelta en X (Twitter)',
      intro: [
        'X no ofrece una API gratuita para las listas de seguidores, así que Unfollowers Checker usa tu archivo oficial de datos de X. Sube following.js y follower.js desde él y la página muestra todas las cuentas que sigues y no te siguen de vuelta.',
        'Todo funciona en tu navegador: los archivos se leen y comparan localmente y nunca se suben. Cada resultado enlaza al perfil para que dejes de seguirlo en X.',
      ],
      faq: [
        {
          q: '¿Cómo consigo mi archivo de datos de X?',
          a: 'En X, ve a Configuración → Tu cuenta → Descargar un archivo de tus datos. Prepararlo suele tardar alrededor de un día. Descomprímelo y busca following.js y follower.js en la carpeta data.',
        },
        {
          q: '¿Por qué veo IDs numéricos en vez de nombres de usuario?',
          a: 'El archivo de X solo contiene IDs de cuenta, no nombres de usuario. Al hacer clic en un resultado se abre el perfil correcto en X.',
        },
        {
          q: '¿Puedo dejar de seguir desde aquí?',
          a: 'En X no, porque no hay una API gratuita para ello. Abre cada perfil desde la lista y deja de seguirlo en X.',
        },
      ],
    },
  },

  general: [
    {
      q: '¿Unfollowers Checker es gratis?',
      a: 'Sí, totalmente gratis, sin anuncios ni límites. Es de código abierto en GitHub.',
    },
    {
      q: '¿Pedís mi contraseña?',
      a: 'Nunca. Cuando hace falta iniciar sesión, se usa el OAuth oficial de cada plataforma. Instagram funciona en tu propia sesión del navegador y X con tu archivo descargado.',
    },
    {
      q: '¿Guardáis mis datos?',
      a: 'No. No hay base de datos. Las listas se obtienen, se comparan y se devuelven en esa única petición; tus preferencias se quedan en el almacenamiento local de tu navegador.',
    },
  ],

  guides: {
    title: 'Guías — Unfollowers Checker',
    description:
      'Guías paso a paso para descubrir quién no te sigue de vuelta.',
    heading: 'Guías',
    intro: 'Guías prácticas, paso a paso.',
  },

  faq: {
    title: 'Preguntas frecuentes — Unfollowers Checker',
    description:
      'Respuestas sobre Unfollowers Checker: cómo funciona en Instagram, X, GitHub, Bluesky, GitLab y Mastodon, si es seguro y qué guarda.',
    heading: 'Preguntas frecuentes',
    intro:
      'Cómo funciona en cada plataforma, qué guarda y cómo usarlo con seguridad.',
    general: 'General',
  },

  notFound: {
    title: 'Página no encontrada',
    body: 'Esta página no existe o se ha movido. Elige una plataforma desde la página de inicio.',
    backHome: 'Ir a la página de inicio',
  },
}
