// Avatar de coordenador de eixo: foto quando disponível, iniciais em círculo
// quando não. Extraído de Research.jsx para ser reaproveitado por AxisMindMap.
import Avatar from './Avatar';

const CoordinatorAvatar = ({ person }) => (
  <div className="d-flex align-items-center gap-2">
    <Avatar photo={person.photo} name={person.name} size={96} />
    <div>
      <div className="fw-semibold" style={{ fontSize: '0.82rem', lineHeight: 1.2 }}>{person.name}</div>
      <div className="text-success" style={{ fontSize: '0.72rem', fontWeight: 600 }}>{person.role}</div>
    </div>
  </div>
);

export default CoordinatorAvatar;
