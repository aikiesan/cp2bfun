import ContentEditorBase from '../ContentEditorBase';

const MicroscopioContentEditor = () => {
  const fields = [
    { key: 'page_description', label: 'Descrição da Página', type: 'textarea', rows: 4, required: true },
  ];

  return (
    <ContentEditorBase
      pageKey="microscopio"
      pageLabel="Coluna Microscópio"
      fields={fields}
    />
  );
};

export default MicroscopioContentEditor;
