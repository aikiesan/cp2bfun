import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Vídeo mudo em loop que só pesa quando o visitante chega até ele.
 *
 * Antes o vídeo de /sobre tinha autoPlay e preload="auto": o navegador
 * baixava o arquivo inteiro assim que a página abria, mesmo para quem nunca
 * rolava até ele. Agora:
 * - até chegar perto da tela, só o pôster é baixado (preload="none");
 * - a uns 300 px de distância o vídeo começa a carregar, e toca sozinho
 *   quando pelo menos metade dele está visível; fora da tela, pausa;
 * - se o visitante pausou, ele não volta a tocar sozinho;
 * - com movimento reduzido ou economia de dados (Save-Data), nada toca nem
 *   carrega sozinho: fica o pôster com os controles, e o play é do visitante.
 *
 * Cada fonte pode ter um `media` (por exemplo, um arquivo menor para
 * celular). O navegador usa a primeira fonte cujo `media` combina.
 */

// A que distância da tela o vídeo começa a carregar.
const PRELOAD_MARGIN = '300px 0px';
// Quanto do vídeo precisa estar visível para ele tocar sozinho.
const PLAY_RATIO = 0.5;

const wantsLessData = () =>
  typeof navigator !== 'undefined' && Boolean(navigator.connection && navigator.connection.saveData);

const LazyVideo = ({ sources, poster, className, label }) => {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video || reduceMotion || wantsLessData()) return undefined;
    if (typeof IntersectionObserver === 'undefined') return undefined;

    // Distingue a pausa do visitante da nossa (quando o vídeo sai da tela).
    let pausedByUs = false;
    let pausedByVisitor = false;
    const onPause = () => {
      if (!pausedByUs) pausedByVisitor = true;
      pausedByUs = false;
    };
    const onPlay = () => {
      pausedByVisitor = false;
    };
    video.addEventListener('pause', onPause);
    video.addEventListener('play', onPlay);

    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry || !entry.isIntersecting) return;
        near.disconnect();
        // Se o visitante já deu play, o vídeo já está carregando: load()
        // agora voltaria ao começo.
        if (video.readyState > 0 || !video.paused) return;
        video.preload = 'auto';
        video.load();
      },
      { rootMargin: PRELOAD_MARGIN },
    );

    const onScreen = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.intersectionRatio >= PLAY_RATIO) {
          if (video.paused && !pausedByVisitor) {
            const playing = video.play();
            // O navegador pode recusar o play (política de autoplay): fica o
            // pôster, e o visitante ainda pode tocar pelos controles.
            if (playing && typeof playing.catch === 'function') playing.catch(() => {});
          }
        } else if (!video.paused) {
          pausedByUs = true;
          video.pause();
        }
      },
      { threshold: [0, PLAY_RATIO] },
    );

    near.observe(video);
    onScreen.observe(video);

    return () => {
      near.disconnect();
      onScreen.disconnect();
      video.removeEventListener('pause', onPause);
      video.removeEventListener('play', onPlay);
    };
  }, [reduceMotion]);

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      aria-label={label}
      controls
      playsInline
      muted
      loop
      preload="none"
    >
      {sources.map((source) => (
        <source key={source.src} src={source.src} type={source.type || 'video/mp4'} media={source.media} />
      ))}
    </video>
  );
};

export default LazyVideo;
