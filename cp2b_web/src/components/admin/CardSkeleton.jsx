import { Card, Placeholder } from 'react-bootstrap';
import PropTypes from 'prop-types';

const CardSkeleton = ({ count = 1 }) => {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <Card key={index} className="mb-3">
          <Card.Body>
            <Placeholder animation="glow">
              <Placeholder xs={3} className="mb-3" style={{ height: '2rem' }} />
              <Placeholder xs={12} className="mb-2" />
              <Placeholder xs={8} />
            </Placeholder>
          </Card.Body>
        </Card>
      ))}
    </>
  );
};

CardSkeleton.propTypes = {
  count: PropTypes.number
};

export default CardSkeleton;
