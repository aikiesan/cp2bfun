import { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Spinner, Tabs, Tab } from 'react-bootstrap';
import api from '../../services/api';
import { ConfirmDialog, useToast } from '../../components/admin';
import { teamCategories as categories } from '../../data/content';


// `axes`, `is_director`, `photo` e os identificadores existiam apenas via
// SQL: o formulario nunca os teve e o backend os descartava. Agora que sao
// editaveis aqui, precisam estar no estado inicial tambem -- um campo fora
// dele nao seria enviado.
const EMPTY_FORM = {
  name: '',
  role_pt: '',
  role_en: '',
  institution: '',
  email: '',
  phone: '',
  category: 'coordinators',
  sort_order: 0,
  axes: '',
  is_director: false,
  membership: '',
  photo: '',
  orcid: '',
  lattes: '',
  scholar: '',
  scopus: '',
  wos: '',
  bv_fapesp: '',
  institutional_url: '',
  bio_pt: '',
  bio_en: '',
};

const TeamEditor = () => {
  const toast = useToast();
  const [members, setMembers] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('coordinators');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);

  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    fetchMembers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await api.get('/team/grouped');
      setMembers(response.data);
    } catch (err) {
      toast.error('Erro ao carregar equipe. Verifique se a API está rodando.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      // Percorre EMPTY_FORM em vez de listar os campos: um campo novo passa a
      // carregar sozinho, e nenhum fica de fora por esquecimento.
      setFormData(
        Object.fromEntries(
          Object.entries(EMPTY_FORM).map(([field, fallback]) => [
            field,
            member[field] ?? fallback,
          ])
        )
      );
    } else {
      setEditingMember(null);
      setFormData({
        ...EMPTY_FORM,
        category: activeTab,
        sort_order: (members[activeTab]?.length || 0) + 1,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMember(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingMember) {
        await api.put(`/team/${editingMember.id}`, formData);
        toast.success('Membro atualizado com sucesso.');
      } else {
        await api.post('/team', formData);
        toast.success('Membro adicionado com sucesso.');
      }
      await fetchMembers();
      handleCloseModal();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao salvar membro. Tente novamente.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (member) => {
    setMemberToDelete(member);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!memberToDelete) return;
    try {
      await api.delete(`/team/${memberToDelete.id}`);
      await fetchMembers();
      toast.success(`Membro "${memberToDelete.name}" excluído com sucesso.`);
    } catch (err) {
      toast.error('Erro ao excluir membro. Tente novamente.');
      console.error(err);
    } finally {
      setShowDeleteDialog(false);
      setMemberToDelete(null);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Equipe</h2>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          <i className="bi bi-person-plus me-2"></i>Novo Membro
        </Button>
      </div>

      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
        {categories.map((cat) => (
          <Tab key={cat.value} eventKey={cat.value} title={`${cat.pt} (${members[cat.value]?.length || 0})`}>
            {members[cat.value]?.length > 0 ? (
              <Table responsive hover className="bg-white rounded">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nome</th>
                    <th>Funcao</th>
                    <th>Instituicao</th>
                    <th>Contato</th>
                    <th>Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {members[cat.value].map((member, idx) => (
                    <tr key={member.id}>
                      <td>{idx + 1}</td>
                      <td><strong>{member.name}</strong></td>
                      <td>
                        <small>{member.role_pt}</small>
                        {member.role_en && <small className="d-block text-muted">{member.role_en}</small>}
                      </td>
                      <td>{member.institution || '-'}</td>
                      <td>
                        {member.email && <small className="d-block">{member.email}</small>}
                        {member.phone && <small className="text-muted">{member.phone}</small>}
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleOpenModal(member)}
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteClick(member)}
                          title="Excluir"
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p className="text-muted py-3 px-2">Nenhum membro nesta categoria.</p>
            )}
          </Tab>
        ))}
      </Tabs>

      <ConfirmDialog
        show={showDeleteDialog}
        title="Excluir Membro"
        message={`Tem certeza que deseja excluir "${memberToDelete?.name}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        confirmVariant="danger"
        icon="bi-person-x"
        onConfirm={handleDeleteConfirm}
        onCancel={() => { setShowDeleteDialog(false); setMemberToDelete(null); }}
      />

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingMember ? 'Editar Membro' : 'Novo Membro'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>

            <Form.Group className="mb-3">
              <Form.Label>Nome *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Categoria *</Form.Label>
              <Form.Select name="category" value={formData.category} onChange={handleChange}>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.pt}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Funcao (PT)</Form.Label>
                  <Form.Control
                    type="text"
                    name="role_pt"
                    value={formData.role_pt}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Funcao (EN)</Form.Label>
                  <Form.Control
                    type="text"
                    name="role_en"
                    value={formData.role_en}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Instituicao</Form.Label>
              <Form.Control
                type="text"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Telefone</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Ordem de Exibicao</Form.Label>
              <Form.Control
                type="number"
                name="sort_order"
                value={formData.sort_order}
                onChange={handleChange}
              />
            </Form.Group>

            <hr className="my-4" />
            <h6 className="text-uppercase text-muted small mb-3">Eixos e vinculo</h6>

            <div className="row">
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>Eixos</Form.Label>
                  <Form.Control
                    type="text"
                    name="axes"
                    value={formData.axes}
                    onChange={handleChange}
                    placeholder="6,7"
                  />
                  <Form.Text muted>
                    Numeros de 1 a 8, separados por virgula. Determina em que secoes de
                    /equipe a pessoa aparece.
                  </Form.Text>
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>Vinculo</Form.Label>
                  <Form.Select name="membership" value={formData.membership} onChange={handleChange}>
                    <option value="">(pelo cargo)</option>
                    <option value="direcao">Direcao do CP2b</option>
                    <option value="nucleo">Atua em algum eixo</option>
                    <option value="associado">Pesquisador(a) associado(a) do CP2b</option>
                    <option value="parceira">Pesquisador(a) em instituicao parceira</option>
                    <option value="apoio">Apoio tecnico ou administrativo</option>
                  </Form.Select>
                  <Form.Text muted>
                    Separa quem integra o CP2b de quem colabora de uma instituicao
                    parceira. Em branco, /equipe deduz pelo cargo.
                  </Form.Text>
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>Foto</Form.Label>
                  <Form.Control
                    type="text"
                    name="photo"
                    value={formData.photo}
                    onChange={handleChange}
                    placeholder="/assets/team/"
                  />
                  <Form.Text muted>
                    Caminho da imagem em public/assets/team/ — por exemplo
                    nome-da-pessoa.webp. Sem foto, o card mostra as iniciais.
                  </Form.Text>
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                id="team-is-director"
                name="is_director"
                checked={Boolean(formData.is_director)}
                onChange={handleChange}
                label="Integra a Direcao do CP2b"
              />
            </Form.Group>

            <hr className="my-4" />
            <h6 className="text-uppercase text-muted small mb-3">Identificadores</h6>
            <p className="text-muted small">
              URLs completas. Aparecem como botoes no perfil da pessoa em /equipe; o que
              ficar em branco simplesmente nao aparece.
            </p>

            <div className="row">
              {[
                ['lattes', 'Lattes', 'http://lattes.cnpq.br/0000000000000000'],
                ['orcid', 'ORCID', 'https://orcid.org/0000-0000-0000-0000'],
                ['scholar', 'Google Scholar', 'https://scholar.google.com/citations?user='],
                ['bv_fapesp', 'BV FAPESP', 'https://bv.fapesp.br/pt/pesquisador/'],
                ['scopus', 'Scopus', 'https://www.scopus.com/authid/detail.uri?authorId='],
                ['wos', 'Web of Science', 'https://www.webofscience.com/wos/author/rid/'],
              ].map(([field, label, placeholder]) => (
                <div className="col-md-6" key={field}>
                  <Form.Group className="mb-3">
                    <Form.Label>{label}</Form.Label>
                    <Form.Control
                      type="url"
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      placeholder={placeholder}
                    />
                  </Form.Group>
                </div>
              ))}
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Perfil institucional</Form.Label>
              <Form.Control
                type="url"
                name="institutional_url"
                value={formData.institutional_url}
                onChange={handleChange}
                placeholder="https://portal.dados.unicamp.br/perfil?docente="
              />
            </Form.Group>

            <hr className="my-4" />
            <h6 className="text-uppercase text-muted small mb-3">Perfil</h6>

            <Form.Group className="mb-3">
              <Form.Label>Biografia (PT)</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="bio_pt"
                value={formData.bio_pt}
                onChange={handleChange}
              />
              <Form.Text muted>
                Um paragrafo curto de formacao e area de atuacao. Sem biografia, o perfil
                mostra apenas cargo, instituicao, eixos e os links.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Biografia (EN)</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="bio_en"
                value={formData.bio_en}
                onChange={handleChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? <Spinner size="sm" /> : 'Salvar'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default TeamEditor;
