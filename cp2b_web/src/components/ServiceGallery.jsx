import { forwardRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { serviceVisual } from '../data/serviceVisuals';
import { formatFormulas } from '../utils/formatFormulas';
import './ServiceGallery.css';

// Catálogo de serviços técnicos como galeria: a ilustração diz o que o serviço
// é, o título e o TRL confirmam, e a descrição só abre quando pedida. Serviços
// ainda sem ilustração usam um ícone no mesmo quadro, para a grade não mudar
// de forma quando as imagens chegarem.
const shortLab = (acronym) => String(acronym || '').replace(/\s*\(.*?\)\s*/g, '').trim();

// "Catalisadores/Inóculos" não tem onde quebrar e estourava o card de duas
// colunas no celular; o <wbr> depois da barra dá a quebra sem hífen.
const breakAfterSlash = (text) =>
  text.split('/').flatMap((part, i) => (i === 0 ? [part] : ['/', <wbr key={i} />, part]));

// Quando o filtro (laboratório ou TRL) muda, os cards que ficam deslizam até
// o novo lugar e os que saem somem esmaecendo. layout="position" anima só a
// posição: abrir a descrição muda o tamanho do card, e escalar o texto no
// meio do caminho o deformaria. Com movimento reduzido nada desliza nem
// escala: a grade só troca, sem transição.
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];
const SWAP_S = 0.35;
const motionFor = (reduceMotion) => (reduceMotion
  ? { layout: false, initial: false, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0 } }
  : {
    layout: 'position',
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.96 },
    transition: { duration: SWAP_S, ease: EASE_OUT_EXPO },
  });

// A mensagem de vazio espera a saída dos cards: fora do fluxo (popLayout) e
// ainda esmaecendo, eles passariam por cima dela. O atraso é o da saída; com
// movimento reduzido a saída é imediata, e a mensagem também.
const emptyMotion = (reduceMotion) => (reduceMotion
  ? { initial: false }
  : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: SWAP_S, duration: 0.2 } });

// O ref vai até o <li>: o AnimatePresence em modo popLayout precisa medir o
// card que sai para tirá-lo do fluxo enquanto os outros ocupam o espaço.
const ServiceCard = forwardRef(function ServiceCard({ service, language, labels, reduceMotion }, ref) {
  const [open, setOpen] = useState(false);
  const item = service[language] || service.pt;
  const visual = serviceVisual(service.id);
  const descId = `svc-desc-${service.id}`;
  return (
    <motion.li ref={ref} className={`svc${open ? ' is-open' : ''}`} {...motionFor(reduceMotion)}>
      <div className={`svc__art${visual.image ? '' : ' svc__art--icon'}`} aria-hidden="true">
        {visual.image
          ? <img src={visual.image} alt="" width="640" height="640" loading="lazy" decoding="async" />
          : <i className={`bi ${visual.icon}`} />}
      </div>
      <div className="svc__body">
        <span className="svc__meta">
          {shortLab(service.labAcronym)} <span aria-hidden="true">·</span> {service.trl}
        </span>
        <h3 className="svc__title">{breakAfterSlash(formatFormulas(item.title))}</h3>
        <button
          type="button"
          className="svc__more"
          aria-expanded={open}
          aria-controls={descId}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? labels.hideDetails : labels.details}
          <i className={`bi bi-${open ? 'dash' : 'plus'}`} aria-hidden="true" />
        </button>
        {open && <p className="svc__text" id={descId}>{formatFormulas(item.description)}</p>}
      </div>
    </motion.li>
  );
});

const ServiceGallery = ({ services, language, labels, emptyText }) => {
  const reduceMotion = useReducedMotion();
  return (
    <>
      <ul className="svc-grid">
        {/* initial={false}: na chegada à página os cards já estão lá; só as
            trocas de filtro animam. */}
        <AnimatePresence initial={false} mode="popLayout">
          {services.map((s) => (
            <ServiceCard key={s.id} service={s} language={language} labels={labels} reduceMotion={reduceMotion} />
          ))}
        </AnimatePresence>
      </ul>
      {services.length === 0 && emptyText && (
        <motion.p className="svc-empty" {...emptyMotion(reduceMotion)}>{emptyText}</motion.p>
      )}
    </>
  );
};

export default ServiceGallery;
