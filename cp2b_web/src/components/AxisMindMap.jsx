import { Accordion } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import CoordinatorAvatar from './CoordinatorAvatar';
import { sdgMap } from '../data/content';
import './AxisMindMap.css';

// Formato mapa mental: Eixo -> Atividades desenvolvidas -> Itens (projetos,
// competências, equipe, infraestrutura). Construído sobre <Accordion>
// aninhados (não uma lib de mind map) para manter acessibilidade, navegação
// por teclado e o texto no DOM para SEO — o efeito "mapa mental" vem do
// tratamento visual (conectores, indentação, cor por eixo), não de canvas/SVG.

const BRANCH_META = {
  pt: {
    competencias: { label: 'Competências e Capacidades', icon: 'bi-lightbulb' },
    projetos: { label: 'Projetos', icon: 'bi-diagram-3' },
    equipe: { label: 'Equipe e Pesquisadores', icon: 'bi-people' },
    infra: { label: 'Infraestrutura e Laboratórios', icon: 'bi-building' },
  },
  en: {
    competencias: { label: 'Competencies and Capabilities', icon: 'bi-lightbulb' },
    projetos: { label: 'Projects', icon: 'bi-diagram-3' },
    equipe: { label: 'Team and Researchers', icon: 'bi-people' },
    infra: { label: 'Infrastructure and Laboratories', icon: 'bi-building' },
  },
};

const AXIS_COLORS = [
  '#2f6fd6', '#3fa34d', '#7b4fc9', '#2f9e6b',
  '#e07a2c', '#c9a635', '#4a8fc4', '#a6455c',
];

const BranchItem = ({ branchId, item }) => {
  if (branchId === 'competencias') {
    return (
      <div className="axis-mindmap__leaf">
        <div className="fw-semibold small">{item.competency || item.area}</div>
        {item.area && item.competency && <div className="text-muted small">{item.area}</div>}
        {item.definition && <p className="text-muted small mb-1 mt-1">{item.definition}</p>}
        {item.person && (
          <span className="axis-mindmap__chip">{item.person}{item.institution ? ` · ${item.institution}` : ''}</span>
        )}
      </div>
    );
  }
  if (branchId === 'projetos') {
    return (
      <div className="axis-mindmap__leaf">
        <div className="fw-semibold small">{item.title}</div>
        {item.description && <p className="text-muted small mb-1 mt-1">{item.description}</p>}
        <div className="d-flex flex-wrap gap-2 mt-1">
          {item.period && <span className="axis-mindmap__chip">{item.period}</span>}
          {item.trl && <span className="axis-mindmap__chip">TRL {item.trl}</span>}
          {item.person && <span className="axis-mindmap__chip">{item.person}</span>}
          {item.partners && <span className="axis-mindmap__chip">{item.partners}</span>}
        </div>
      </div>
    );
  }
  if (branchId === 'equipe') {
    return (
      <div className="axis-mindmap__leaf">
        <div className="fw-semibold small">{item.person}</div>
        <div className="text-muted small">
          {[item.level, item.institution].filter(Boolean).join(' · ')}
        </div>
        {item.area && <div className="text-muted small">{item.area}</div>}
      </div>
    );
  }
  // infra
  return (
    <div className="axis-mindmap__leaf">
      <div className="fw-semibold small">{item.acronym || item.name}</div>
      <div className="text-muted small">{[item.institution, item.lead].filter(Boolean).join(' · ')}</div>
      {item.trl && <span className="axis-mindmap__chip mt-1">{item.trl}</span>}
    </div>
  );
};

const AxisMindMap = ({ axis, details, language, labels }) => {
  const [searchParams] = useSearchParams();
  const branchLabels = BRANCH_META[language] || BRANCH_META.pt;
  const deepLinkAxis = searchParams.get('eixo');
  const deepLinkBranch = searchParams.get('ramo');
  const color = AXIS_COLORS[(parseInt(axis.id, 10) - 1) % AXIS_COLORS.length];

  return (
    <Accordion.Item eventKey={axis.id} className="border-bottom border-dark bg-transparent">
      <Accordion.Header>
        <div className="py-2">
          <span className="d-block mono-label text-muted mb-1">{labels.axis} {axis.id}</span>
          <span className="fw-bold fs-5">{axis.title.split('–')[1] || axis.title}</span>
        </div>
      </Accordion.Header>
      <Accordion.Body className="pb-4 pt-0">
        {axis.coordinators && axis.coordinators.length > 0 && (
          <div className="d-flex flex-wrap gap-3 mb-4">
            {axis.coordinators.map((person) => (
              <CoordinatorAvatar key={person.name} person={person} />
            ))}
          </div>
        )}
        <p className="text-muted mb-4" style={{ whiteSpace: 'pre-line' }}>{axis.content}</p>

        {axis.sdgs && axis.sdgs.length > 0 && (
          <div className="mb-4">
            <span className="mono-label text-muted d-block mb-2">{labels.sdgs}</span>
            <div className="d-flex flex-wrap gap-2">
              {axis.sdgs.map((sdgId) => (
                <img
                  key={sdgId}
                  src={sdgMap[sdgId]}
                  alt={`ODS ${sdgId}`}
                  title={`Sustainable Development Goal ${sdgId}`}
                  style={{ width: '60px', height: '60px', borderRadius: '8px' }}
                />
              ))}
            </div>
          </div>
        )}

        {details && details.length > 0 && (
          <div className="axis-mindmap" style={{ '--axis-color': color }}>
            <span className="mono-label text-muted d-block mb-2">{labels.activities}</span>
            <Accordion
              flush
              defaultActiveKey={deepLinkAxis === axis.id ? deepLinkBranch : undefined}
            >
              {details.map((branch) => {
                const meta = branchLabels[branch.id] || { label: branch.id, icon: 'bi-diagram-2' };
                return (
                  <Accordion.Item eventKey={branch.id} key={branch.id} className="axis-mindmap__branch">
                    <Accordion.Header>
                      <i className={`bi ${meta.icon} me-2`} style={{ color }} />
                      <span className="fw-semibold">{meta.label}</span>
                      <span className="axis-mindmap__count">{branch.items.length}</span>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="axis-mindmap__leaves">
                        {branch.items.map((item, i) => (
                          <BranchItem branchId={branch.id} item={item} key={i} />
                        ))}
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                );
              })}
            </Accordion>
          </div>
        )}
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default AxisMindMap;
