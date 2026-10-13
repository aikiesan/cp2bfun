import { useEffect, useRef, useState } from 'react';
import './FlipBook.css';

/**
 * Leitor de livreto com virada de página: as folhas giram da direita para a
 * esquerda em torno da lombada, como num gibi de papel.
 *
 * - A partir de 768 px, duas páginas abertas lado a lado. Fechado, o livro
 *   mostra só a capa (ou só a contracapa), centralizada.
 * - Abaixo disso, uma página por vez; a folha virada some para a esquerda.
 *
 * O modelo é o do papel: cada folha (leaf) tem frente e verso. No modo duplo
 * a folha i leva as páginas 2i (frente, à direita) e 2i + 1 (verso, à
 * esquerda); no simples, cada página é uma folha sem verso. `flipped` é
 * quantas folhas já foram viradas. A posição guardada é a da página, não a
 * da folha, para que girar o celular não devolva o leitor para outra página.
 *
 * Vira com clique ou toque na página (metade direita avança, esquerda
 * volta), deslizando o dedo, pelas setas do teclado, pelos botões e pela
 * barra de páginas. Com movimento reduzido a troca é imediata (FlipBook.css).
 */

const SPREAD_QUERY = '(min-width: 768px)';
const SWIPE_MIN_PX = 40;
// Depois de um deslize o navegador às vezes ainda dispara um clique; ele não
// pode virar a página de novo.
const CLICK_AFTER_SWIPE_MS = 400;
// Folhas a ±N da posição atual recebem a imagem; as demais esperam o leitor
// chegar perto. Depois de carregada, a imagem fica (guardada pelo índice da
// página, que não muda quando o leitor alterna entre uma e duas páginas).
const PRELOAD_LEAVES = 2;

const useMediaQuery = (query) => {
  const get = () => (typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia(query).matches
    : false);
  const [matches, setMatches] = useState(get);
  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
};

const Face = ({ page, side, hidden, load }) => (
  <div className={`flipbook__face flipbook__face--${side}`} aria-hidden={hidden || undefined}>
    {page?.src && load && (
      <img src={page.src} alt={page.alt} draggable="false" decoding="async" />
    )}
  </div>
);

const FlipBook = ({ pages, pageSize, labels, pageLabel }) => {
  const spread = useMediaQuery(SPREAD_QUERY);
  const [pageIdx, setPageIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const rootRef = useRef(null);
  const bookRef = useRef(null);
  const loadedRef = useRef(new Set());
  const swipeRef = useRef(null);
  const swipedAtRef = useRef(0);

  const n = pages.length;
  // Uma página por vez dispensa as páginas em branco (o verso da capa, que
  // no livro aberto só existe para pôr a página 1 à direita).
  const single = pages.map((p, i) => (p.src ? i : -1)).filter((i) => i >= 0);
  const leaves = spread
    ? Array.from({ length: Math.ceil(n / 2) }, (_, i) => [pages[2 * i], pages[2 * i + 1] || null])
    : single.map((i) => [pages[i], null]);
  const maxFlip = spread ? Math.floor(n / 2) : single.length - 1;
  const firstAfter = single.findIndex((i) => i >= pageIdx);
  const flipped = spread
    ? Math.floor((pageIdx + 1) / 2)
    : (firstAfter === -1 ? single.length - 1 : firstAfter);
  // Índice, em `pages`, da página na frente de cada folha.
  const frontIndex = (leaf) => (spread ? 2 * leaf : single[leaf]);

  // Página que representa cada posição: no duplo, a da esquerda (a capa,
  // com o livro fechado na frente). Assim, ao passar para uma página por vez,
  // o leitor continua de onde parou em vez de pular a página da esquerda.
  const goToFlip = (f) => {
    const target = Math.max(0, Math.min(f, maxFlip));
    if (!spread) setPageIdx(single[target]);
    else setPageIdx(target === 0 ? 0 : 2 * target - 1);
  };
  const next = () => goToFlip(flipped + 1);
  const prev = () => goToFlip(flipped - 1);

  // Setas do teclado: só quando o foco está no leitor ou solto na página,
  // para não roubar as setas de um menu aberto ou de um campo.
  const keyNavRef = useRef(null);
  keyNavRef.current = { next, prev, first: () => goToFlip(0), last: () => goToFlip(maxFlip) };
  useEffect(() => {
    const onKey = (e) => {
      const { next, prev, first, last } = keyNavRef.current;
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const t = e.target;
      const free = t === document.body || rootRef.current?.contains(t);
      if (!free || t.tagName === 'INPUT') return;
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
      else if (e.key === 'Home' && rootRef.current?.contains(t)) { e.preventDefault(); first(); }
      else if (e.key === 'End' && rootRef.current?.contains(t)) { e.preventDefault(); last(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const canFullscreen = typeof document !== 'undefined' && document.fullscreenEnabled;
  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement === rootRef.current);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);
  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else rootRef.current?.requestFullscreen?.();
  };

  // Clique: a metade direita do livro avança, a esquerda volta. A divisa é
  // o centro da caixa do livro — com ele fechado e deslocado, cai na borda
  // da capa (ou da contracapa), que é o que se espera.
  const onBookClick = (e) => {
    if (Date.now() - swipedAtRef.current < CLICK_AFTER_SWIPE_MS) return;
    const box = bookRef.current.getBoundingClientRect();
    if (e.clientX >= box.left + box.width / 2) next(); else prev();
  };
  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse') return;
    swipeRef.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e) => {
    const s = swipeRef.current;
    swipeRef.current = null;
    if (!s || e.pointerType === 'mouse') return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) > SWIPE_MIN_PX && Math.abs(dx) > Math.abs(dy)) {
      swipedAtRef.current = Date.now();
      if (dx < 0) next(); else prev();
    }
  };

  // Páginas visíveis agora (as outras saem da árvore de acessibilidade).
  const visible = spread ? [2 * flipped - 1, 2 * flipped] : [frontIndex(flipped)];
  const visibleLabels = visible
    .filter((i) => i >= 0 && i < n && pages[i].src)
    .map((i) => pageLabel(pages[i]));
  const position = visibleLabels.join(' · ');

  // Deslocamento do livro fechado: só a capa (direita) ou só a contracapa
  // (esquerda) à vista, então o meio livro vazio sai da frente.
  let shift = '0%';
  if (spread && flipped === 0) shift = '-25%';
  else if (spread && flipped === maxFlip && n % 2 === 0) shift = '25%';

  const [w, h] = pageSize;
  const cols = spread ? 2 : 1;

  return (
    <div
      ref={rootRef}
      className={`flipbook ${spread ? 'flipbook--spread' : 'flipbook--single'}`}
      style={{ '--fb-ratio': w / h, '--fb-cols': cols }}
    >
      <div className="flipbook__stage">
        <div
          ref={bookRef}
          className="flipbook__book"
          style={{ aspectRatio: `${cols * w} / ${h}`, transform: `translateX(${shift})` }}
          onClick={onBookClick}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => { swipeRef.current = null; }}
          role="presentation"
        >
          {leaves.map(([front, back], i) => {
            const isFlipped = i < flipped;
            const frontIdx = frontIndex(i);
            if (Math.abs(i - flipped) <= PRELOAD_LEAVES) {
              loadedRef.current.add(frontIdx);
              if (spread) loadedRef.current.add(frontIdx + 1);
            }
            const loaded = (idx) => loadedRef.current.has(idx);
            return (
              <div
                key={`${cols}-${i}`}
                className={`flipbook__leaf${isFlipped ? ' is-flipped' : ''}`}
                // Folhas por virar: a de menor índice por cima. Viradas: a
                // última virada por cima. A troca acontece no meio do giro
                // (FlipBook.css), quando a folha está de perfil.
                style={{ zIndex: isFlipped ? i + 1 : leaves.length - i }}
              >
                <Face page={front} side="front" load={loaded(frontIdx)} hidden={!visible.includes(frontIdx)} />
                {spread && <Face page={back} side="back" load={loaded(frontIdx + 1)} hidden={!visible.includes(frontIdx + 1)} />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flipbook__controls">
        <button type="button" className="flipbook__btn" onClick={() => goToFlip(0)} disabled={flipped === 0} aria-label={labels.first}>
          <i className="bi bi-chevron-bar-left" aria-hidden="true"></i>
        </button>
        <button type="button" className="flipbook__btn flipbook__btn--main" onClick={prev} disabled={flipped === 0} aria-label={labels.prev}>
          <i className="bi bi-arrow-left" aria-hidden="true"></i>
        </button>
        <p className="flipbook__position" aria-live="polite">{position}</p>
        <button type="button" className="flipbook__btn flipbook__btn--main" onClick={next} disabled={flipped === maxFlip} aria-label={labels.next}>
          <i className="bi bi-arrow-right" aria-hidden="true"></i>
        </button>
        <button type="button" className="flipbook__btn" onClick={() => goToFlip(maxFlip)} disabled={flipped === maxFlip} aria-label={labels.last}>
          <i className="bi bi-chevron-bar-right" aria-hidden="true"></i>
        </button>
        {canFullscreen && (
          <button
            type="button"
            className="flipbook__btn flipbook__btn--fullscreen"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? labels.exitFullscreen : labels.fullscreen}
            aria-pressed={isFullscreen}
          >
            <i className={`bi ${isFullscreen ? 'bi-fullscreen-exit' : 'bi-arrows-fullscreen'}`} aria-hidden="true"></i>
          </button>
        )}
      </div>

      <input
        type="range"
        className="flipbook__range form-range"
        min={0}
        max={maxFlip}
        step={1}
        value={flipped}
        onChange={(e) => goToFlip(Number(e.target.value))}
        aria-label={labels.slider}
        aria-valuetext={position}
      />
      <p className="flipbook__hint">{labels.hint}</p>
    </div>
  );
};

export default FlipBook;
