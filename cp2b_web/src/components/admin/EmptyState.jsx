import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const EmptyState = ({
  icon = 'bi-inbox',
  title = 'Nenhum item encontrado',
  description = '',
  actionLabel = '',
  actionLink = '',
  onAction = null
}) => {
  return (
    <div className="text-center py-5">
      <div className="mb-4">
        <i
          className={`bi ${icon} text-muted`}
          style={{ fontSize: '4rem' }}
        ></i>
      </div>
      <h4 className="text-muted mb-2">{title}</h4>
      {description && (
        <p className="text-muted mb-4">{description}</p>
      )}
      {actionLabel && (actionLink || onAction) && (
        <>
          {actionLink ? (
            <Button as={Link} to={actionLink} variant="primary">
              {actionLabel}
            </Button>
          ) : (
            <Button onClick={onAction} variant="primary">
              {actionLabel}
            </Button>
          )}
        </>
      )}
    </div>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  actionLabel: PropTypes.string,
  actionLink: PropTypes.string,
  onAction: PropTypes.func
};

export default EmptyState;
