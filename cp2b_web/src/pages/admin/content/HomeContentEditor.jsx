import ContentEditorBase from '../ContentEditorBase';

const HomeContentEditor = () => {
  const fields = [
    { key: 'forum_badge', label: 'Badge (pequeno texto acima do título)', type: 'text' },
    { key: 'forum_subtitle', label: 'Subtítulo', type: 'text' },
    { key: 'forum_title', label: 'Título Principal', type: 'text', required: true },
    { key: 'forum_description', label: 'Descrição', type: 'textarea', rows: 4, required: true },
    { key: 'forum_button_text', label: 'Texto do Botão', type: 'text' },
    { key: 'forum_button_link', label: 'Link do Botão', type: 'text', placeholder: '/contato' },
  ];

  return (
    <ContentEditorBase
      pageKey="home"
      pageLabel="Página Inicial (Fórum)"
      fields={fields}
    />
  );
};

export default HomeContentEditor;
