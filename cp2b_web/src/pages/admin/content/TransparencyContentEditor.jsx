import ContentEditorBase from '../ContentEditorBase';

const TransparencyContentEditor = () => {
  const fields = [
    { key: 'fapesp_title', label: 'Título da Seção FAPESP', type: 'text' },
    { key: 'fapesp_number', label: 'Número do Processo FAPESP', type: 'text', placeholder: '2020/12345-6' },
    { key: 'fapesp_link', label: 'Link FAPESP', type: 'text', placeholder: 'https://bv.fapesp.br/...' },
    { key: 'reports_title', label: 'Título da Seção de Relatórios', type: 'text' },
    { key: 'financial_title', label: 'Título da Seção Financeira', type: 'text' },
    { key: 'financial_content', label: 'Conteúdo Financeiro', type: 'textarea', rows: 6 },
  ];

  return (
    <ContentEditorBase
      pageKey="transparency"
      pageLabel="Transparência"
      fields={fields}
    />
  );
};

export default TransparencyContentEditor;
