import ContentEditorBase from '../ContentEditorBase';

const GovernanceContentEditor = () => {
  const fields = [
    { key: 'section1_title', label: 'Seção 1 - Título', type: 'text' },
    { key: 'section1_content', label: 'Seção 1 - Conteúdo', type: 'textarea', rows: 6 },
    { key: 'section2_title', label: 'Seção 2 - Título', type: 'text' },
    { key: 'section2_content', label: 'Seção 2 - Conteúdo', type: 'textarea', rows: 6 },
    { key: 'section3_title', label: 'Seção 3 - Título', type: 'text' },
    { key: 'section3_content', label: 'Seção 3 - Conteúdo', type: 'textarea', rows: 6 },
  ];

  return (
    <ContentEditorBase
      pageKey="governance"
      pageLabel="Governança"
      fields={fields}
    />
  );
};

export default GovernanceContentEditor;
