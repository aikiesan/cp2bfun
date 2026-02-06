import { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert, Spinner, Tabs, Tab } from 'react-bootstrap';
import api from '../../services/api';

const categories = [
  { value: 'coordinators', pt: 'Pesquisadores Responsaveis', en: 'Lead Researchers' },
  { value: 'principals', pt: 'Pesquisadores Principais', en: 'Principal Investigators' },
  { value: 'associates', pt: 'Pesquisadores Associados', en: 'Associate Researchers' },
  { value: 'support', pt: 'Apoio Tecnico e Administrativo', en: 'Technical and Administrative Support' },
  { value: 'students', pt: 'Estudantes', en: 'Students' },
];

const TeamEditor = () => {
  const [members, setMembers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('coordinators');

  const [formData, setFormData] = useState({
    name: '',
    role_pt: '',
    role_en: '',
    institution: '',
    email: '',
    phone: '',
    category: 'coordinators',
    sort_order: 0,
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await api.get('/team/grouped');
      setMembers(response.data);
    } catch (err) {
      setError('Erro ao carregar equipe');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name || '',
        role_pt: member.role_pt || '',
        role_en: member.role_en || '',
        institution: member.institution || '',
        email: member.email || '',
        phone: member.phone || '',
        category: member.category || 'coordinators',
        sort_order: member.sort_order || 0,
      });
    } else {
      setEditingMember(null);
      setFormData({
        name: '',
        role_pt: '',
        role_en: '',
        institution: '',
        email: '',
        phone: '',
        category: activeTab,
        sort_order: (members[activeTab]?.length || 0) + 1,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMember(null);
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (editingMember) {
        await api.put(`/team/${editingMember.id}`, formData);
      } else {
        await api.post('/team', formData);
      }
      await fetchMembers();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar membro');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este membro?')) return;

    try {
      await api.delete(`/team/${id}`);
      await fetchMembers();
    } catch (err) {
      setError('Erro ao excluir membro');
      console.error(err);
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

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

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
                          onClick={() => handleDelete(member.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <Alert variant="info">Nenhum membro nesta categoria.</Alert>
            )}
          </Tab>
        ))}
      </Tabs>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingMember ? 'Editar Membro' : 'Novo Membro'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}

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
