import type { Guide } from './types'

export const es: Guide[] = [
  {
    slug: 'see-who-unfollowed-you-on-instagram',
    title: 'Cómo ver quién no te sigue de vuelta en Instagram',
    description:
      'Instagram no te dice quién te ha dejado de seguir. Te enseñamos una forma gratuita de ver a todos los que no te siguen de vuelta, sin dar tu contraseña a ninguna app.',
    published: '2026-11-13',
    platform: 'instagram',
    sections: [
      {
        paragraphs: [
          'Instagram no te avisa cuando alguien te deja de seguir, y no tiene ninguna lista de personas que no te siguen de vuelta. La única forma de saberlo es comparar dos listas: las cuentas que sigues y las cuentas que te siguen.',
          'Con una cuenta pequeña puedes hacerlo a mano, pero a partir de unos cientos se vuelve poco práctico. Esta guía te muestra una forma gratuita de hacerlo automáticamente, sin instalar ninguna app ni darle tu contraseña a nadie.',
        ],
      },
      {
        heading: 'Qué necesitas',
        bullets: [
          'Un ordenador con un navegador de escritorio como Chrome, Edge, Firefox o Safari.',
          'Tener la sesión iniciada en instagram.com en ese navegador.',
          'Unos cinco minutos. Las cuentas grandes tardan más en analizarse.',
        ],
      },
      {
        heading: 'Paso a paso',
        steps: [
          'Abre la página de Instagram en Unfollowers Checker y pulsa “Copiar el código”.',
          'Ve a instagram.com en el mismo navegador y comprueba que tienes la sesión iniciada.',
          'Abre la consola de desarrollador: F12 o Ctrl+Shift+J en Windows y Linux, Cmd+Option+J en Mac. Haz clic en la pestaña Console (Consola).',
          'Pega el script y pulsa Enter. Aparecerá un panel en una esquina de la página.',
          'Pulsa “Analizar ahora”. El panel carga tus seguidores, compara con ellos a todas las cuentas que sigues y te muestra a todos los que no te siguen de vuelta.',
          'Si quieres, selecciona cuentas y deja de seguirlas. El panel espacia las peticiones y verifica con Instagram cada dejar de seguir.',
        ],
      },
      {
        heading: '¿Por qué un script de consola y no una app?',
        paragraphs: [
          'Instagram no tiene una API pública para las listas de seguidores. Las apps que lo prometen suelen pedirte tu usuario y contraseña e iniciar sesión desde sus propios servidores, lo que pone tu cuenta en riesgo.',
          'Un script que ejecutas en instagram.com usa la sesión que ya tienes iniciada. Tu contraseña nunca sale de tu navegador y no se envía nada a servidores de terceros. El script es de código abierto, así que puedes leer exactamente qué hace antes de ejecutarlo.',
        ],
      },
      {
        heading: 'Consejos',
        bullets: [
          'Si el análisis se detiene a mitad, vuelve a abrir el panel: el progreso se guarda después de cada página, así que puedes continuar en lugar de empezar de cero.',
          'Mantén los tiempos predeterminados. Son lentos a propósito para parecer un uso normal.',
          'No dejes de seguir a cientos de cuentas de una sola vez. Reparte las limpiezas grandes en varios días.',
        ],
      },
    ],
  },
  {
    slug: 'are-instagram-unfollower-apps-safe',
    title:
      '¿Son seguras las apps de unfollowers de Instagram? Qué revisar primero',
    description:
      'Muchas apps de “quién me dejó de seguir” piden tu contraseña de Instagram. Así distingues una herramienta arriesgada de una segura, y así reduces el riesgo de un bloqueo de acciones.',
    published: '2026-11-13',
    platform: 'instagram',
    sections: [
      {
        paragraphs: [
          'Si buscas “quién me dejó de seguir en Instagram” encontrarás decenas de apps. Algunas son inofensivas; otras ponen tu cuenta en riesgo de verdad. La diferencia suele reducirse a una cosa: lo que la herramienta te pide que le entregues.',
        ],
      },
      {
        heading: 'Señales de alarma',
        bullets: [
          'Te pide tu contraseña de Instagram. Que un tercero inicie sesión como tú puede marcarse como sospechoso, y no tienes ningún control sobre lo que hace con la sesión.',
          'Solo muestra parte de la lista y quiere una suscripción para “desbloquear” el resto.',
          'Promete mostrar quién ha visto tu perfil o tus historias. Instagram no expone esos datos, así que la promesa es falsa.',
          'No queda claro quién la hace, qué guarda ni adónde van tus datos.',
        ],
      },
      {
        heading: 'Alternativas más seguras',
        bullets: [
          'Herramientas que funcionan en tu propia sesión del navegador en instagram.com, así tu contraseña nunca sale de tu dispositivo.',
          'Herramientas que trabajan con la exportación oficial de datos de Instagram, que descargas tú mismo.',
          'Herramientas de código abierto, donde cualquiera puede leer el código y confirmar qué hace.',
        ],
      },
      {
        heading: 'Cómo evitar un bloqueo de acciones',
        paragraphs: [
          'Incluso una herramienta que nunca ve tu contraseña puede activar los límites de Instagram si actúa demasiado rápido. Instagram puede entonces bloquear temporalmente acciones como seguir y dejar de seguir.',
        ],
        bullets: [
          'Deja de seguir en tandas pequeñas, con pausas entre cada cuenta.',
          'Para si Instagram te muestra una advertencia y espera uno o dos días antes de continuar.',
          'No uses varias herramientas de automatización a la vez.',
        ],
      },
      {
        heading: 'Cómo lo gestiona Unfollowers Checker',
        paragraphs: [
          'Unfollowers Checker funciona como un script en tu propia sesión del navegador, nunca pide tu contraseña y no envía nada a sus propios servidores. Añade esperas aleatorias y pausas de enfriamiento, se detiene automáticamente cuando Instagram le pide que vaya más despacio y verifica cada dejar de seguir. Toda actividad automatizada conlleva algún riesgo, así que úsalo con cuidado.',
        ],
      },
    ],
  },
  {
    slug: 'bluesky-who-doesnt-follow-you-back',
    title: 'Cómo ver quién no te sigue de vuelta en Bluesky',
    description:
      'Una forma rápida y gratuita de ver las cuentas de Bluesky que sigues y no te siguen de vuelta, y dejar de seguirlas en bloque con el inicio de sesión oficial de Bluesky.',
    published: '2026-11-13',
    platform: 'bluesky',
    sections: [
      {
        paragraphs: [
          'Bluesky muestra cuántos seguidores y seguidos tienes, pero no quién falta en una lista o en la otra. Como las listas de seguimiento de Bluesky son públicas, puedes compararlas sin iniciar sesión.',
        ],
      },
      {
        heading: 'Paso a paso',
        steps: [
          'Abre la página de Bluesky en Unfollowers Checker.',
          'Escribe tu identificador, por ejemplo nombre.bsky.social o tu dominio propio. También puedes pegar el enlace de tu perfil de bsky.app.',
          'Pulsa Comprobar. Verás todas las cuentas que sigues y que no te siguen de vuelta.',
          'Para dejar de seguir, pulsa “Iniciar sesión con Bluesky”. El inicio de sesión usa el OAuth oficial de Bluesky, así que nunca escribes una contraseña ni una contraseña de aplicación.',
          'Selecciona las cuentas que quieras y pulsa “Dejar de seguir a los seleccionados”.',
        ],
      },
      {
        heading: 'Conviene saber',
        bullets: [
          'Puedes revisar cualquier identificador público, no solo el tuyo. Dejar de seguir solo afecta a tu propia cuenta.',
          'No se guarda nada: las listas se obtienen, se comparan y se devuelven solo para esa petición.',
          'Las cuentas muy grandes se comparan hasta un límite, por lo que sus resultados pueden ser parciales.',
        ],
      },
    ],
  },
  {
    slug: 'download-your-x-twitter-archive',
    title: 'Cómo descargar tu archivo de datos de X (Twitter)',
    description:
      'Paso a paso: solicita tu archivo de datos de X, encuentra following.js y follower.js dentro y mira quién no te sigue de vuelta, sin la API de X.',
    published: '2026-11-13',
    platform: 'twitter',
    sections: [
      {
        paragraphs: [
          'X ya no ofrece una forma gratuita para que las herramientas lean listas de seguidores, pero aún puedes obtener tus propias listas: X permite a cada cuenta descargar un archivo con sus datos. Dos archivos de ese paquete, following.js y follower.js, son todo lo que necesitas para saber quién no te sigue de vuelta.',
        ],
      },
      {
        heading: 'Solicita el archivo',
        steps: [
          'En X, abre Más opciones (o el menú de tu perfil) y ve a Configuración y privacidad.',
          'Elige Tu cuenta y luego Descargar un archivo de tus datos.',
          'Confirma tu contraseña. X también puede enviarte un código de verificación a tu correo o teléfono.',
          'Pulsa Solicitar archivo.',
        ],
      },
      {
        heading: 'Espera a que esté listo',
        paragraphs: [
          'X prepara el archivo en segundo plano. Suele tardar alrededor de un día, a veces más en cuentas grandes. Recibirás un correo y una notificación en la app cuando esté listo, y la descarga sigue disponible durante unos días.',
        ],
      },
      {
        heading: 'Encuentra los dos archivos',
        steps: [
          'Descarga el archivo (un .zip) y descomprímelo.',
          'Abre la carpeta data que hay dentro.',
          'Busca following.js y follower.js. Las cuentas grandes pueden tener partes adicionales, como following-part1.js: guárdalas también.',
        ],
      },
      {
        heading: 'Compáralos',
        paragraphs: [
          'Abre la página de X en Unfollowers Checker y arrastra los dos archivos (y cualquier archivo de partes). La comparación se hace por completo en tu navegador: los archivos nunca se suben. Cada resultado enlaza al perfil en X, donde puedes dejar de seguir.',
        ],
      },
      {
        heading: 'Conviene saber',
        bullets: [
          'El archivo solo contiene ID de cuenta, no nombres de usuario, así que los resultados muestran ID. Al hacer clic en uno se abre el perfil correcto.',
          'El archivo es una instantánea. Para volver a comprobar más adelante, solicita uno nuevo.',
          'El resto del archivo (publicaciones, mensajes, configuración) no se lee: solo se usan los dos archivos de seguimiento.',
        ],
      },
    ],
  },
  {
    slug: 'github-who-doesnt-follow-you-back',
    title: 'Cómo ver quién no te sigue de vuelta en GitHub',
    description:
      'GitHub no muestra quién no te sigue de vuelta. Te enseñamos una forma gratuita de verlo para cualquier usuario, y de dejar de seguirlos en bloque desde tu propia cuenta.',
    published: '2026-11-13',
    platform: 'github',
    sections: [
      {
        paragraphs: [
          'GitHub muestra cuánta gente te sigue y a cuántos sigues, pero no quién falta en una lista o en la otra. Como las listas de seguimiento de GitHub son públicas, se pueden comparar sin iniciar sesión.',
        ],
      },
      {
        heading: 'Paso a paso',
        steps: [
          'Abre la página de GitHub en Unfollowers Checker.',
          'Escribe un usuario de GitHub, el tuyo o el de cualquiera. También sirve un enlace al perfil.',
          'Pulsa Comprobar. Verás todas las cuentas que sigue ese usuario y que no le siguen de vuelta.',
          'Para limpiar tu propia lista, pulsa Iniciar sesión arriba. El inicio de sesión usa el OAuth oficial de GitHub; el token de acceso se queda en el servidor.',
          'Selecciona las cuentas que quieras y pulsa Dejar de seguir a los seleccionados.',
        ],
      },
      {
        heading: 'Conviene saber',
        bullets: [
          'Para ver cualquier cuenta pública no hace falta iniciar sesión. Dejar de seguir solo afecta a tu propia cuenta, y te pide confirmación antes.',
          'No se guarda nada: las listas se obtienen, se comparan y se devuelven solo para esa petición.',
          'Las cuentas muy grandes se comparan hasta un límite, por lo que sus resultados pueden ser parciales; la página te avisa cuando ocurre.',
        ],
      },
    ],
  },
  {
    slug: 'instagram-action-blocked',
    title: '“Acción bloqueada” en Instagram: qué significa y qué hacer',
    description:
      'Por qué Instagram bloquea acciones como seguir y dejar de seguir, cuánto suele durar, qué ayuda y cómo evitarlo cuando limpias tu lista de seguidos.',
    published: '2026-11-13',
    platform: 'instagram',
    sections: [
      {
        paragraphs: [
          '“Acción bloqueada” (o “Inténtalo de nuevo más tarde”) es una restricción temporal que Instagram aplica a una cuenta que hace algo demasiado, demasiado rápido. Suele afectar a acciones como seguir, dejar de seguir, dar me gusta o comentar, mientras el resto de la app sigue funcionando.',
        ],
      },
      {
        heading: 'Por qué ocurre',
        bullets: [
          'Muchos seguimientos o dejar de seguir en poco tiempo, lo que parece automatizado.',
          'Repetir una acción justo después de que Instagram la haya rechazado.',
          'Apps de terceros que inician sesión como tú o actúan en tu nombre.',
          'Una cuenta nueva o modificada recientemente, que Instagram vigila más de cerca.',
        ],
      },
      {
        heading: 'Cuánto dura',
        paragraphs: [
          'Instagram no publica límites ni duraciones exactos. La mayoría de los bloqueos se levantan en unas horas o unos pocos días. Reintentar mientras estás bloqueado suele hacer que dure más.',
        ],
      },
      {
        heading: 'Qué hacer',
        steps: [
          'Deja de hacer la acción que se bloqueó y no sigas reintentándola.',
          'Espera: deja pasar al menos un día antes de volver a intentarlo.',
          'Revisa Configuración → Aplicaciones y sitios web, y quita cualquier app que no reconozcas o que ya no uses.',
          'Si crees que otra persona ha usado tu cuenta, cambia tu contraseña y activa la autenticación en dos pasos.',
          'Si el mensaje dice que fue un error, puedes decírselo a Instagram desde el propio aviso.',
        ],
      },
      {
        heading: 'Dejar de seguir sin que te bloqueen',
        bullets: [
          'Deja de seguir en tandas pequeñas, con pausas entre cada cuenta.',
          'Reparte una limpieza grande en varios días.',
          'Evita las herramientas que piden tu contraseña.',
        ],
      },
      {
        heading: 'Cómo lo gestiona Unfollowers Checker',
        paragraphs: [
          'El panel de Instagram de Unfollowers Checker funciona en tu propia sesión del navegador, añade esperas aleatorias y pausas de enfriamiento, y se detiene automáticamente cuando Instagram le pide que vaya más despacio. Toda actividad automatizada conlleva algún riesgo, así que mantén los tiempos predeterminados.',
        ],
      },
    ],
  },
]
