// Avatar de coordenador de eixo: foto quando disponível, iniciais em círculo
// quando não. Extraído de Research.jsx para ser reaproveitado por AxisMindMap.
const CoordinatorAvatar = ({ person }) => (
  <div className="d-flex align-items-center gap-2">
    {person.photo ? (
      <img
        src={person.photo}
        alt={person.name}
        style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
      />
    ) : (
      <div style={{
        width: 96, height: 96, borderRadius: '50%', backgroundColor: '#e0e0e0',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.85rem', fontWeight: 700, color: '#555', flexShrink: 0
      }}>
        {person.name.split(' ').filter((w) => w.length > 2).slice(0, 2).map((w) => w[0]).join('')}
      </div>
    )}
    <div>
      <div className="fw-semibold" style={{ fontSize: '0.82rem', lineHeight: 1.2 }}>{person.name}</div>
      <div className="text-success" style={{ fontSize: '0.72rem', fontWeight: 600 }}>{person.role}</div>
    </div>
  </div>
);

export default CoordinatorAvatar;
