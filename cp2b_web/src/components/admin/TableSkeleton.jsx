import { Table, Placeholder } from 'react-bootstrap';
import PropTypes from 'prop-types';

const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <Table hover responsive>
      <thead>
        <tr>
          {[...Array(columns)].map((_, index) => (
            <th key={index}>
              <Placeholder animation="glow">
                <Placeholder xs={8} />
              </Placeholder>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...Array(rows)].map((_, rowIndex) => (
          <tr key={rowIndex}>
            {[...Array(columns)].map((_, colIndex) => (
              <td key={colIndex}>
                <Placeholder animation="glow">
                  <Placeholder xs={colIndex === 0 ? 10 : 6} />
                </Placeholder>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

TableSkeleton.propTypes = {
  rows: PropTypes.number,
  columns: PropTypes.number
};

export default TableSkeleton;
