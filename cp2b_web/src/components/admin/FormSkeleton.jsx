import { Form, Placeholder, Card } from 'react-bootstrap';
import PropTypes from 'prop-types';

const FormSkeleton = ({ fields = 6 }) => {
  return (
    <Card>
      <Card.Body>
        <Placeholder animation="glow">
          {[...Array(fields)].map((_, index) => (
            <Form.Group key={index} className="mb-3">
              <Placeholder xs={3} className="mb-2" />
              <Placeholder xs={12} style={{ height: '38px' }} />
            </Form.Group>
          ))}
          <div className="d-flex gap-2 mt-4">
            <Placeholder.Button xs={2} variant="primary" />
            <Placeholder.Button xs={2} variant="secondary" />
          </div>
        </Placeholder>
      </Card.Body>
    </Card>
  );
};

FormSkeleton.propTypes = {
  fields: PropTypes.number
};

export default FormSkeleton;
