// Mantém o site atualizado sem o visitante precisar fazer nada.
//
// O service worker já era `autoUpdate`: ao encontrar uma versão nova ele assume
// o controle na hora (skipWaiting + clientsClaim) e o `cleanupOutdatedCaches`
// apaga o cache antigo. O que faltava era alguém recarregar a página — sem
// isso a aba continua mostrando o bundle antigo indefinidamente, porque trocar
// de rota numa SPA não rebusca o documento. Quem já tinha visitado o site
// ficava preso na versão velha até dar F5 por conta própria.
//
// Três gatilhos, para o pior caso ser de uma hora e não de um dia:
//   - ao carregar a página;
//   - de hora em hora, enquanto a aba estiver aberta;
//   - quando a aba volta a ficar visível — é o que pega a aba esquecida
//     aberta de um dia para o outro.

const UPDATE_INTERVAL_MS = 60 * 60 * 1000;

// Recarregar sem avisar apagaria o que estiver sendo escrito nos editores do
// admin, que guardam o formulário inteiro em estado de React — um artigo pela
// metade, o cadastro de uma pessoa. Lá a página avisa e quem recarrega é a
// pessoa, quando ela quiser.
export function shouldReloadImmediately(pathname) {
  return !String(pathname || '').startsWith('/admin');
}

// Aviso em DOM puro, e não um componente React, porque ele precisa aparecer
// independentemente da rota montada e sem depender de onde a árvore está.
function showUpdateBanner(onReload) {
  if (document.getElementById('sw-update-banner')) return;

  const bar = document.createElement('div');
  bar.id = 'sw-update-banner';
  bar.setAttribute('role', 'status');
  bar.style.cssText = [
    'position:fixed',
    'inset-inline:0',
    'bottom:0',
    'z-index:2000',
    'display:flex',
    'flex-wrap:wrap',
    'gap:12px',
    'align-items:center',
    'justify-content:center',
    'padding:12px 16px',
    'background:var(--cp2b-azul-petroleo, #1E3E4C)',
    'color:#fff',
    'font-size:0.9rem',
    'box-shadow:0 -2px 12px rgba(0,0,0,.2)',
  ].join(';');

  const text = document.createElement('span');
  text.textContent = 'Uma versão nova do site está disponível.';

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Recarregar';
  button.style.cssText = [
    'padding:6px 16px',
    'border:1px solid #fff',
    'border-radius:999px',
    'background:transparent',
    'color:#fff',
    'font:inherit',
    'font-weight:600',
    'cursor:pointer',
    'min-height:36px',
  ].join(';');
  button.addEventListener('click', onReload);

  bar.append(text, button);
  document.body.appendChild(bar);
}

export function registerServiceWorker() {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;

  window.addEventListener('load', async () => {
    let registration;
    try {
      registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    } catch {
      // Sem service worker o site funciona normalmente, só sem cache offline.
      return;
    }

    // `controllerchange` dispara quando o service worker novo assume. Só
    // interessa quando já havia um controlando: na primeiríssima visita o
    // evento também dispara, e recarregar ali seria um reload gratuito.
    const hadController = Boolean(navigator.serviceWorker.controller);
    let reloading = false;

    const reload = () => {
      if (reloading) return;
      reloading = true;
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController) return;
      if (shouldReloadImmediately(window.location.pathname)) {
        reload();
      } else {
        showUpdateBanner(reload);
      }
    });

    const checkForUpdate = () => {
      registration.update().catch(() => {
        // Offline ou servidor fora: a próxima checagem tenta de novo.
      });
    };

    setInterval(checkForUpdate, UPDATE_INTERVAL_MS);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') checkForUpdate();
    });
  });
}

export default registerServiceWorker;
