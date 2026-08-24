// Avatar de coordenador de eixo: foto quando disponível, iniciais em círculo
// quando não. Extraído de Research.jsx para ser reaproveitado por AxisMindMap.
import Avatar from './Avatar';
import { getTeamPhoto } from '../data/teamPhotos';

const CoordinatorAvatar = ({ person, name, photo, role, axisId }) => {
  const pName = person?.name || name || '';
  const pPhoto = person?.photo !== undefined ? person.photo : (photo || getTeamPhoto(pName));
  const pRole = person?.role || role || '';
  const pAxisId = person?.axisId || axisId;

  return (
    <div className="d-flex align-items-center gap-2 coordinator-avatar">
      <Avatar photo={pPhoto} name={pName} axisId={pAxisId} size={96} />
      {(pName || pRole) && (
        <div>
          {pName && <div className="fw-semibold" style={{ fontSize: '0.82rem', lineHeight: 1.2 }}>{pName}</div>}
          {pRole && <div className="text-success" style={{ fontSize: '0.72rem', fontWeight: 600 }}>{pRole}</div>}
        </div>
      )}
    </div>
  );
};

export default CoordinatorAvatar;
