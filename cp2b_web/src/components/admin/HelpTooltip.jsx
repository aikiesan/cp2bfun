import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';

const HelpTooltip = ({ text, placement = 'top' }) => {
  return (
    <OverlayTrigger
      placement={placement}
      overlay={<Tooltip>{text}</Tooltip>}
    >
      <i
        className="bi bi-question-circle text-muted ms-1"
        style={{ cursor: 'help', fontSize: '0.9rem' }}
      ></i>
    </OverlayTrigger>
  );
};

HelpTooltip.propTypes = {
  text: PropTypes.string.isRequired,
  placement: PropTypes.oneOf(['top', 'bottom', 'left', 'right'])
};

export default HelpTooltip;
