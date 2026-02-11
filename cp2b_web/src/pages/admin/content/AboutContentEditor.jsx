import ContentEditorBase from '../ContentEditorBase';

const AboutContentEditor = () => {
  const fields = [
    { key: 'resumo', label: 'Resumo', type: 'textarea', rows: 6, required: true },
    { key: 'objetivos', label: 'Objetivos', type: 'textarea', rows: 6, required: true },
    { key: 'resultados', label: 'Resultados Esperados', type: 'textarea', rows: 6, required: true },
  ];

  return (
    <ContentEditorBase
      pageKey="about"
      pageLabel="Página Sobre"
      fields={fields}
    />
  );
};

export default AboutContentEditor;
