import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Standard header for admin pages: title, plain-language description and an
 * optional primary action, so every module starts with the same anatomy.
 */
const AdminPageHeader = ({ title, description, actionLabel, actionLink, actionIcon = 'bi-plus-lg', children }) => (
  <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
    <div>
      <h2 className="fw-bold mb-1">{title}</h2>
      {description && <p className="text-muted mb-0">{description}</p>}
    </div>
    <div className="d-flex gap-2">
      {children}
      {actionLabel && actionLink && (
        <Button as={Link} to={actionLink} variant="primary">
          <i className={`bi ${actionIcon} me-2`}></i>
          {actionLabel}
        </Button>
      )}
    </div>
  </div>
);

AdminPageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.node,
  actionLabel: PropTypes.string,
  actionLink: PropTypes.string,
  actionIcon: PropTypes.string,
  children: PropTypes.node,
};

export default AdminPageHeader;
