import { Container, Accordion, Card, Alert, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/**
 * Plain-language manual for the admin panel, written for non-technical staff.
 * Every module gets a "how do I..." section; no jargon.
 */

const SECTIONS = [
  {
    id: 'noticias',
    icon: 'bi-newspaper',
    title: 'Publicar uma notícia',
    body: (
      <>
        <ol>
          <li>No menu lateral, abra <strong>Conteúdo → Notícias</strong> e clique em <strong>Nova Notícia</strong>.</li>
          <li>Preencha o <strong>título em português</strong> — o endereço da página (slug) é criado sozinho.</li>
          <li>Escreva o resumo e o texto completo. Se puder, preencha também a versão em inglês; se deixar em branco, o site mostra o texto em português para visitantes em inglês.</li>
          <li>Envie uma <strong>imagem de capa</strong> (ideal: foto na horizontal, pelo menos 1200px de largura).</li>
          <li>Clique em <strong>Salvar</strong>. A notícia aparece no site imediatamente — não é preciso &quot;publicar&quot; em outro lugar.</li>
        </ol>
        <p className="mb-0">
          Para que a notícia apareça <em>em destaque no topo da página inicial</em>, vá em{' '}
          <Link to="/admin/featured">Destaques</Link> e escolha a notícia nas posições A, B ou C.
        </p>
      </>
    ),
  },
  {
    id: 'eventos',
    icon: 'bi-calendar-event',
    title: 'Criar um evento (com página própria)',
    body: (
      <>
        <ol>
          <li>Abra <strong>Conteúdo → Eventos</strong> e clique em <strong>Novo Evento</strong>.</li>
          <li>Preencha título, datas de início/término, tipo (fórum, workshop…) e local.</li>
          <li>O campo <strong>Slug</strong> define o endereço da página do evento (ex.: <code>/eventos/forum-paulista-2026</code>). Ele é gerado sozinho a partir do título.</li>
          <li>Na seção <strong>Programação</strong>, adicione os itens do cronograma (horário + atividade + palestrante). Use as setas para reordenar.</li>
          <li>Em <strong>Álbuns da Galeria vinculados</strong>, selecione os álbuns de fotos do evento — eles aparecem na página do evento automaticamente.</li>
          <li>Se houver inscrições, cole o link no campo <strong>Link de inscrição</strong>.</li>
        </ol>
        <p className="mb-0">
          Depois do evento, mude o <strong>Status</strong> para &quot;Realizado&quot; — ele passa para a lista de eventos anteriores.
        </p>
      </>
    ),
  },
  {
    id: 'galeria',
    icon: 'bi-images',
    title: 'Enviar fotos para a galeria',
    body: (
      <>
        <ol>
          <li>Abra <strong>Conteúdo → Galeria</strong> e clique em <strong>Enviar fotos</strong>.</li>
          <li>Crie um álbum novo (dê o nome do evento, ex.: &quot;I Fórum Paulista — Junho 2026&quot;) ou escolha um álbum existente.</li>
          <li>Marque <strong>uma</strong> foto como <strong>capa</strong> — é ela que representa o álbum na página da galeria.</li>
          <li>As fotos são comprimidas automaticamente; mesmo assim, evite arquivos acima de 10&nbsp;MB.</li>
        </ol>
        <p className="mb-0">
          A galeria pública organiza os álbuns por ano em <code>/galeria</code>. Para mostrar um álbum na página de um evento, vincule-o no editor do evento.
        </p>
      </>
    ),
  },
  {
    id: 'destaques',
    icon: 'bi-star',
    title: 'Trocar os destaques da página inicial',
    body: (
      <p className="mb-0">
        Vá em <Link to="/admin/featured">Conteúdo → Destaques</Link>. As posições <strong>A</strong> (grande, à esquerda),{' '}
        <strong>B</strong> e <strong>C</strong> (menores, à direita) correspondem ao topo da página inicial. Você pode
        destacar notícias, artigos do Microscópio ou oportunidades. Vídeos em destaque são gerenciados em{' '}
        <Link to="/admin/videos">Vídeos</Link>.
      </p>
    ),
  },
  {
    id: 'conteudo-paginas',
    icon: 'bi-file-earmark-text',
    title: 'Editar textos das páginas (Home, Sobre, Governança…)',
    body: (
      <p className="mb-0">
        Em <strong>Conteúdo de Páginas</strong> no menu lateral, cada página institucional tem um editor próprio: os
        textos da <Link to="/admin/content/home">página inicial</Link> (seção do Fórum),{' '}
        <Link to="/admin/content/about">Sobre</Link>, <Link to="/admin/content/governance">Governança</Link> e{' '}
        <Link to="/admin/content/transparency">Transparência</Link>. Preencha sempre português e inglês.
      </p>
    ),
  },
  {
    id: 'configuracoes',
    icon: 'bi-sliders',
    title: 'Alterar contato, redes sociais e rodapé',
    body: (
      <p className="mb-0">
        Em <Link to="/admin/settings">Sistema → Configurações do Site</Link> você altera endereço, telefone, e-mail,
        links das redes sociais e os créditos do rodapé. Deixe o campo de uma rede social <em>vazio</em> para esconder o
        ícone dela no site. As mudanças valem para o site inteiro na hora.
      </p>
    ),
  },
  {
    id: 'equipe',
    icon: 'bi-people',
    title: 'Equipe, eixos de pesquisa e parceiros',
    body: (
      <p className="mb-0">
        Em <strong>Sobre &amp; Equipe</strong>: <Link to="/admin/team">Membros da Equipe</Link> gerencia pesquisadores e
        colaboradores (com foto), <Link to="/admin/axes">Eixos de Pesquisa</Link> edita os 8 eixos mostrados em{' '}
        <code>/eixos</code>, e <Link to="/admin/partners">Parceiros</Link> controla os logos por categoria.
      </p>
    ),
  },
  {
    id: 'mensagens',
    icon: 'bi-envelope',
    title: 'Mensagens de contato e newsletter',
    body: (
      <p className="mb-0">
        Mensagens enviadas pelo formulário de contato chegam em <Link to="/admin/messages">Engajamento → Mensagens</Link>{' '}
        (o número vermelho no menu indica não lidas). Os inscritos da newsletter ficam em{' '}
        <Link to="/admin/newsletter">Newsletter</Link>, onde você pode exportar a lista de e-mails.
      </p>
    ),
  },
  {
    id: 'status',
    icon: 'bi-toggles',
    title: 'Tirar uma página do ar temporariamente',
    body: (
      <p className="mb-0">
        Em <Link to="/admin/page-status">Sistema → Status das Páginas</Link> você pode desativar páginas específicas —
        visitantes verão uma tela de &quot;em manutenção&quot; até você reativá-las. Útil enquanto prepara conteúdo novo.
      </p>
    ),
  },
  {
    id: 'senha',
    icon: 'bi-shield-lock',
    title: 'Senha do painel e segurança',
    body: (
      <>
        <p>
          O painel é protegido por uma senha única definida no servidor (variável <code>ADMIN_PASSWORD</code>). Depois de
          entrar, o acesso vale por 7 dias neste navegador. Use <strong>Sair</strong> no menu lateral em computadores
          compartilhados.
        </p>
        <p className="mb-0">
          Para trocar a senha é preciso alterar a variável no servidor e reiniciar o backend — peça a quem cuida da
          hospedagem (trocar a senha desconecta todos os navegadores).
        </p>
      </>
    ),
  },
  {
    id: 'problemas',
    icon: 'bi-life-preserver',
    title: 'Algo deu errado?',
    body: (
      <>
        <ul>
          <li>
            <strong>&quot;Backend indisponível&quot; no painel</strong> — o servidor da API está fora do ar. No servidor
            (VM), rode <code>sudo systemctl restart cp2b-backend</code> ou verifique os containers Docker.
          </li>
          <li>
            <strong>Salvei mas o site não mudou</strong> — atualize a página com <kbd>Ctrl</kbd>+<kbd>F5</kbd>. Conteúdo
            (notícias, eventos, fotos) muda na hora; mudanças de <em>código</em> só entram com um novo deploy.
          </li>
          <li>
            <strong>Apaguei algo sem querer</strong> — itens excluídos não têm lixeira. O servidor faz backup do banco de
            dados (script <code>backup.sh</code>); um backup recente pode ser restaurado por quem cuida da hospedagem.
          </li>
          <li>
            <strong>Foto não aparece</strong> — confira o formato (JPG, PNG ou WebP) e o tamanho (máx. 10&nbsp;MB).
          </li>
        </ul>
        <p className="mb-0">
          Depois de qualquer atualização do sistema, o comando <code>npm run smoke</code> (rodado no servidor) confere
          automaticamente se as páginas principais, a API e o mapa do site estão funcionando.
        </p>
      </>
    ),
  },
];

const AjudaAdmin = () => (
  <Container className="pb-5" style={{ maxWidth: '900px' }}>
    <div className="mb-4">
      <h2 className="fw-bold mb-1">Guia de Uso do Painel</h2>
      <p className="text-muted mb-0">
        Como manter o site do CP2b atualizado — escrito para quem não é da área técnica.
      </p>
    </div>

    <Alert variant="success" className="d-flex gap-2">
      <i className="bi bi-lightbulb fs-5"></i>
      <div>
        <strong>Regra de ouro:</strong> tudo que você salva aqui aparece no site na mesma hora. Não existe botão de
        &quot;publicar&quot; separado — salvar já é publicar. Na dúvida, abra o site em outra aba e confira.
      </div>
    </Alert>

    <Row className="g-3 mb-4">
      {[
        { to: '/admin/news/new', icon: 'bi-newspaper', label: 'Publicar notícia' },
        { to: '/admin/events/new', icon: 'bi-calendar-plus', label: 'Criar evento' },
        { to: '/admin/gallery/upload', icon: 'bi-camera', label: 'Enviar fotos' },
        { to: '/admin/settings', icon: 'bi-sliders', label: 'Configurações' },
      ].map((a) => (
        <Col sm={6} md={3} key={a.to}>
          <Card as={Link} to={a.to} className="text-decoration-none text-center h-100 stat-card">
            <Card.Body>
              <i className={`bi ${a.icon} d-block mb-2`} style={{ fontSize: '1.6rem', color: 'var(--cp2b-petrol)' }}></i>
              <span className="fw-semibold" style={{ color: 'var(--cp2b-dark)' }}>{a.label}</span>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>

    <Accordion alwaysOpen defaultActiveKey={['noticias']}>
      {SECTIONS.map((section) => (
        <Accordion.Item eventKey={section.id} key={section.id}>
          <Accordion.Header>
            <i className={`bi ${section.icon} me-2`}></i>
            {section.title}
          </Accordion.Header>
          <Accordion.Body>{section.body}</Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  </Container>
);

export default AjudaAdmin;
