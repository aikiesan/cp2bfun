import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Tabs, Tab, Badge, Spinner } from 'react-bootstrap';
import {
  HelpTooltip,
  EmptyState,
  ConfirmDialog,
  TableSkeleton,
  useToast
} from '../../components/admin';
import {
  fetchPartners,
  createPartner,
  updatePartner,
  deletePartner
} from '../../services/api';

const PartnersEditor = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [activeTab, setActiveTab] = useState('host');
  const [formData, setFormData] = useState({
    name_pt: '',
    name_en: '',
    category: 'host',
    location: '',
    logo: '',
    website: '',
    description_pt: '',
    description_en: '',
    sort_order: 10,
    active: true
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const toast = useToast();

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    setLoading(true);
    try {
      const data = await fetchPartners();
      setPartners(data || []);
    } catch (error) {
      toast.error('Erro ao carregar parceiros');
    } finally {
      setLoading(false);
    }
  };

  const handleNew = (category) => {
    setEditingPartner(null);
    setFormData({
      name_pt: '',
      name_en: '',
      category: category || activeTab,
      location: '',
      logo: '',
      website: '',
      description_pt: '',
      description_en: '',
      sort_order: 10,
      active: true
    });
    setErrors({});
    setShowModal(true);
  };

  const handleEdit = (partner) => {
    setEditingPartner(partner);
    setFormData({
      name_pt: partner.name_pt || '',
      name_en: partner.name_en || '',
      category: partner.category || 'host',
      location: partner.location || '',
      logo: partner.logo || '',
      website: partner.website || '',
      description_pt: partner.description_pt || '',
      description_en: partner.description_en || '',
      sort_order: partner.sort_order || 10,
      active: partner.active !== undefined ? partner.active : true
    });
    setErrors({});
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name_pt.trim()) {
      newErrors.name_pt = 'Nome em português é obrigatório';
    }
    if (formData.name_pt.length > 255) {
      newErrors.name_pt = 'Nome deve ter no máximo 255 caracteres';
    }
    if (formData.name_en && formData.name_en.length > 255) {
      newErrors.name_en = 'Nome deve ter no máximo 255 caracteres';
    }
    if (!formData.category) {
      newErrors.category = 'Categoria é obrigatória';
    }
    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'URL inválida';
    }
    if (formData.logo && !isValidUrl(formData.logo)) {
      newErrors.logo = 'URL inválida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.warning('Corrija os erros no formulário');
      return;
    }

    setSubmitting(true);
    try {
      if (editingPartner) {
        await updatePartner(editingPartner.id, formData);
        toast.success('Parceiro atualizado com sucesso!');
      } else {
        await createPartner(formData);
        toast.success('Parceiro criado com sucesso!');
      }
      setShowModal(false);
      loadPartners();
    } catch (error) {
      toast.error(error.message || 'Erro ao salvar parceiro');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePartner(deleteId);
      toast.success('Parceiro excluído com sucesso!');
      setDeleteId(null);
      loadPartners();
    } catch (error) {
      toast.error('Erro ao excluir parceiro');
    }
  };

  const categoryLabels = {
    host: 'Instituições Sede',
    public: 'Entidades Públicas',
    research: 'Instituições de Pesquisa',
    companies: 'Empresas'
  };

  const categoryIcons = {
    host: 'bi-building-fill',
    public: 'bi-bank',
    research: 'bi-mortarboard',
    companies: 'bi-briefcase'
  };

  const filterByCategory = (category) => {
    return partners.filter(p => p.category === category);
  };

  const renderPartnersTable = (category) => {
    const categoryPartners = filterByCategory(category);

    if (loading) {
      return <TableSkeleton rows={5} columns={5} />;
    }

    if (categoryPartners.length === 0) {
      return (
        <EmptyState
          icon={categoryIcons[category]}
          title={`Nenhum parceiro em ${categoryLabels[category]}`}
          description="Comece adicionando seu primeiro parceiro nesta categoria."
          actionLabel="Adicionar Parceiro"
          onAction={() => handleNew(category)}
        />
      );
    }

    return (
      <Table hover responsive>
        <thead>
          <tr>
            <th style={{ width: '60px' }}>Logo</th>
            <th>Nome (PT)</th>
            <th>Nome (EN)</th>
            <th>Localização</th>
            <th>Status</th>
            <th>Ordem</th>
            <th className="text-end" style={{ width: '150px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {categoryPartners.map(partner => (
            <tr key={partner.id}>
              <td>
                {partner.logo ? (
                  <img
                    src={partner.logo}
                    alt={partner.name_pt}
                    style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div
                    className="bg-light d-flex align-items-center justify-content-center"
                    style={{ width: '40px', height: '40px', borderRadius: '4px' }}
                  >
                    <i className={`bi ${categoryIcons[category]} text-muted`}></i>
                  </div>
                )}
              </td>
              <td className="fw-semibold">{partner.name_pt}</td>
              <td className="text-muted">{partner.name_en || '-'}</td>
              <td>
                <small className="text-muted">
                  <i className="bi bi-geo-alt me-1"></i>
                  {partner.location || '-'}
                </small>
              </td>
              <td>
                {partner.active ? (
                  <Badge bg="success">Ativo</Badge>
                ) : (
                  <Badge bg="secondary">Inativo</Badge>
                )}
              </td>
              <td>
                <Badge bg="light" text="dark">{partner.sort_order}</Badge>
              </td>
              <td className="text-end">
                {partner.website && (
                  <Button
                    variant="outline-info"
                    size="sm"
                    className="me-1"
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="bi bi-globe"></i>
                  </Button>
                )}
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-1"
                  onClick={() => handleEdit(partner)}
                >
                  <i className="bi bi-pencil"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => setDeleteId(partner.id)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Gerenciar Parceiros</h2>
          <p className="text-muted mb-0">
            Organize parceiros por categoria: Sede, Públicas, Pesquisa, Empresas
          </p>
        </div>
        <Button variant="primary" onClick={() => handleNew()}>
          <i className="bi bi-plus-lg me-2"></i>
          Novo Parceiro
        </Button>
      </div>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-4"
              >
                <Tab
                  eventKey="host"
                  title={
                    <span>
                      <i className={`bi ${categoryIcons.host} me-2`}></i>
                      {categoryLabels.host}
                      <Badge bg="secondary" className="ms-2">
                        {filterByCategory('host').length}
                      </Badge>
                    </span>
                  }
                >
                  <div className="mb-3">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleNew('host')}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Adicionar Instituição Sede
                    </Button>
                  </div>
                  {renderPartnersTable('host')}
                </Tab>

                <Tab
                  eventKey="public"
                  title={
                    <span>
                      <i className={`bi ${categoryIcons.public} me-2`}></i>
                      {categoryLabels.public}
                      <Badge bg="secondary" className="ms-2">
                        {filterByCategory('public').length}
                      </Badge>
                    </span>
                  }
                >
                  <div className="mb-3">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleNew('public')}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Adicionar Entidade Pública
                    </Button>
                  </div>
                  {renderPartnersTable('public')}
                </Tab>

                <Tab
                  eventKey="research"
                  title={
                    <span>
                      <i className={`bi ${categoryIcons.research} me-2`}></i>
                      {categoryLabels.research}
                      <Badge bg="secondary" className="ms-2">
                        {filterByCategory('research').length}
                      </Badge>
                    </span>
                  }
                >
                  <div className="mb-3">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleNew('research')}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Adicionar Instituição de Pesquisa
                    </Button>
                  </div>
                  {renderPartnersTable('research')}
                </Tab>

                <Tab
                  eventKey="companies"
                  title={
                    <span>
                      <i className={`bi ${categoryIcons.companies} me-2`}></i>
                      {categoryLabels.companies}
                      <Badge bg="secondary" className="ms-2">
                        {filterByCategory('companies').length}
                      </Badge>
                    </span>
                  }
                >
                  <div className="mb-3">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleNew('companies')}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Adicionar Empresa
                    </Button>
                  </div>
                  {renderPartnersTable('companies')}
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Create/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className={`bi ${editingPartner ? 'bi-pencil' : 'bi-plus-circle'} me-2`}></i>
            {editingPartner ? 'Editar Parceiro' : 'Novo Parceiro'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              {/* Left Column - Main Info */}
              <Col md={8}>
                <h6 className="mb-3 text-muted">Informações Principais</h6>

                <Form.Group className="mb-3">
                  <Form.Label>
                    Nome (PT) <span className="text-danger">*</span>
                    <HelpTooltip text="Nome oficial do parceiro em português" />
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name_pt"
                    value={formData.name_pt}
                    onChange={handleChange}
                    isInvalid={!!errors.name_pt}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name_pt}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    {formData.name_pt.length}/255 caracteres
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    Nome (EN)
                    <HelpTooltip text="Nome traduzido para inglês (opcional)" />
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name_en"
                    value={formData.name_en}
                    onChange={handleChange}
                    isInvalid={!!errors.name_en}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name_en}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    {formData.name_en.length}/255 caracteres
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    Localização
                    <HelpTooltip text="Cidade, estado ou país. Ex: Campinas, SP" />
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Ex: Campinas, SP"
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        URL do Logo
                        <HelpTooltip text="Link para imagem do logo (PNG, JPG, SVG)" />
                      </Form.Label>
                      <Form.Control
                        type="url"
                        name="logo"
                        value={formData.logo}
                        onChange={handleChange}
                        isInvalid={!!errors.logo}
                        placeholder="https://..."
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.logo}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Website
                        <HelpTooltip text="Site oficial do parceiro" />
                      </Form.Label>
                      <Form.Control
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        isInvalid={!!errors.website}
                        placeholder="https://..."
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.website}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <hr className="my-4" />
                <h6 className="mb-3 text-muted">Descrição (Opcional)</h6>

                <Form.Group className="mb-3">
                  <Form.Label>Descrição (PT)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description_pt"
                    value={formData.description_pt}
                    onChange={handleChange}
                    placeholder="Descrição sobre o parceiro em português..."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Descrição (EN)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description_en"
                    value={formData.description_en}
                    onChange={handleChange}
                    placeholder="Description about the partner in English..."
                  />
                </Form.Group>
              </Col>

              {/* Right Column - Settings */}
              <Col md={4}>
                <h6 className="mb-3 text-muted">Configurações</h6>

                <Form.Group className="mb-3">
                  <Form.Label>
                    Categoria <span className="text-danger">*</span>
                    <HelpTooltip text="Tipo de parceiro para organização" />
                  </Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    isInvalid={!!errors.category}
                    required
                  >
                    <option value="host">Instituição Sede</option>
                    <option value="public">Entidade Pública</option>
                    <option value="research">Instituição de Pesquisa</option>
                    <option value="companies">Empresa</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.category}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    Ordem de Exibição
                    <HelpTooltip text="Menor número aparece primeiro. Use múltiplos de 10 para facilitar reorganização." />
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="sort_order"
                    value={formData.sort_order}
                    onChange={handleChange}
                    min="0"
                    step="10"
                  />
                  <Form.Text className="text-muted">
                    Menor = Aparece primeiro
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="active-switch"
                    name="active"
                    label="Parceiro Ativo"
                    checked={formData.active}
                    onChange={handleChange}
                  />
                  <Form.Text className="text-muted">
                    Parceiros inativos não aparecem no site público
                  </Form.Text>
                </Form.Group>

                {formData.logo && (
                  <div className="mt-4">
                    <Form.Label className="d-block">Preview do Logo</Form.Label>
                    <div className="border rounded p-3 text-center bg-light">
                      <img
                        src={formData.logo}
                        alt="Preview"
                        style={{ maxWidth: '100%', maxHeight: '100px', objectFit: 'contain' }}
                        onError={(e) => {
                          e.target.src = '';
                          e.target.alt = 'Erro ao carregar imagem';
                        }}
                      />
                    </div>
                  </div>
                )}
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)} disabled={submitting}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Salvando...
                </>
              ) : (
                <>
                  <i className="bi bi-check-lg me-2"></i>
                  {editingPartner ? 'Atualizar' : 'Criar'} Parceiro
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        show={deleteId !== null}
        title="Excluir Parceiro"
        message="Tem certeza que deseja excluir este parceiro? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        confirmVariant="danger"
        icon="bi-trash"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </Container>
  );
};

export default PartnersEditor;
