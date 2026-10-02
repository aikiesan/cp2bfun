import './OrgChart.css';

// Organograma institucional do CP2b, renderizado em CSS grid (não imagem)
// para ficar legível no mobile, indexável e traduzível.
// `chart` segue o formato de governanceChart[language] em src/data/content.js.
const OrgChart = ({ chart }) => {
  if (!chart) return null;

  return (
    <div className="org-chart">
      <div className="org-chart__row org-chart__row--committees">
        {chart.committees.map((label) => (
          <div className="org-chart__box org-chart__box--committee" key={label}>{label}</div>
        ))}
      </div>

      <div className="org-chart__row org-chart__row--direction">
        <div className="org-chart__box org-chart__box--sponsor">{chart.sponsors[0]}</div>
        <div className="org-chart__direction-stack">
          {chart.direction.map((label) => (
            <div className="org-chart__box org-chart__box--direction" key={label}>{label}</div>
          ))}
        </div>
        <div className="org-chart__box org-chart__box--sponsor">{chart.sponsors[1]}</div>
      </div>

      <div className="org-chart__row org-chart__row--management">
        {chart.management.map((label) => (
          <div className="org-chart__box org-chart__box--management" key={label}>{label}</div>
        ))}
      </div>

      <div className="org-chart__band org-chart__band--axes">{chart.axes}</div>
      <div className="org-chart__band org-chart__band--assembly">{chart.assembly}</div>
      <div className="org-chart__band org-chart__band--partners">{chart.partners}</div>
    </div>
  );
};

export default OrgChart;
