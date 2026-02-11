# Admin Components Guide

This guide explains how to use the shared admin UI components to build consistent, professional admin pages.

## 📦 Available Components

All components can be imported from `@/components/admin`:

```javascript
import {
  Breadcrumbs,
  HelpTooltip,
  EmptyState,
  ConfirmDialog,
  TableSkeleton,
  CardSkeleton,
  FormSkeleton,
  useToast
} from '../../components/admin';
```

---

## 🍞 Breadcrumbs

**Auto-generated breadcrumb navigation** based on the current route.

### Usage

Already included in `AdminLayout.jsx` - automatically displays on all admin pages.

### Customization

Edit the `labelMap` in `Breadcrumbs.jsx` to add custom route labels:

```javascript
const labelMap = {
  admin: 'Admin',
  news: 'Notícias',
  publications: 'Publicações',
  // Add your routes here
};
```

---

## ❓ HelpTooltip

**Question mark icon with tooltip** for providing contextual help.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | string | **required** | Tooltip text to display |
| `placement` | string | `'top'` | Tooltip position: `top`, `bottom`, `left`, `right` |

### Example

```jsx
<Form.Label>
  Slug <HelpTooltip text="O slug é usado na URL. Exemplo: /noticias/meu-slug" />
</Form.Label>

<Form.Label>
  Sort Order
  <HelpTooltip
    text="Menor número aparece primeiro. Use múltiplos de 10 (10, 20, 30) para facilitar reorganização."
    placement="right"
  />
</Form.Label>
```

---

## 📭 EmptyState

**Beautiful empty state** when lists have no data or filters return no results.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | string | `'bi-inbox'` | Bootstrap icon class |
| `title` | string | `'Nenhum item encontrado'` | Main heading |
| `description` | string | `''` | Optional description text |
| `actionLabel` | string | `''` | Button label (if provided) |
| `actionLink` | string | `''` | React Router link (if using Link) |
| `onAction` | function | `null` | Click handler (if using Button) |

### Example

```jsx
// With link
<EmptyState
  icon="bi-newspaper"
  title="Nenhuma notícia cadastrada"
  description="Comece criando sua primeira notícia."
  actionLabel="Nova Notícia"
  actionLink="/admin/news/new"
/>

// With button handler
<EmptyState
  icon="bi-search"
  title="Nenhum resultado encontrado"
  description="Tente ajustar os filtros de busca."
  actionLabel="Limpar Filtros"
  onAction={handleClearFilters}
/>

// Minimal (no action)
<EmptyState
  icon="bi-calendar-x"
  title="Nenhum evento próximo"
/>
```

---

## ⚠️ ConfirmDialog

**Modal confirmation dialog** - replaces `window.confirm()`.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `show` | boolean | **required** | Controls modal visibility |
| `title` | string | `'Confirmar Ação'` | Modal title |
| `message` | string | `'Tem certeza que deseja continuar?'` | Confirmation message |
| `confirmLabel` | string | `'Confirmar'` | Confirm button text |
| `cancelLabel` | string | `'Cancelar'` | Cancel button text |
| `confirmVariant` | string | `'primary'` | Bootstrap variant: `primary`, `danger`, `warning`, `success` |
| `icon` | string | `'bi-question-circle'` | Bootstrap icon class |
| `onConfirm` | function | **required** | Handler when confirmed |
| `onCancel` | function | **required** | Handler when cancelled |

### Example

```jsx
const [showConfirm, setShowConfirm] = useState(false);

// Delete confirmation
<ConfirmDialog
  show={showConfirm}
  title="Excluir Notícia"
  message="Tem certeza? Esta ação não pode ser desfeita."
  confirmLabel="Excluir"
  confirmVariant="danger"
  icon="bi-trash"
  onConfirm={handleDelete}
  onCancel={() => setShowConfirm(false)}
/>

// Publish confirmation
<ConfirmDialog
  show={showPublishConfirm}
  title="Publicar Evento"
  message="O evento será visível publicamente. Continuar?"
  confirmLabel="Publicar"
  confirmVariant="success"
  icon="bi-check-circle"
  onConfirm={handlePublish}
  onCancel={() => setShowPublishConfirm(false)}
/>
```

---

## ⏳ Loading Skeletons

**Placeholder loading states** with shimmer animation.

### TableSkeleton

Props: `rows` (default: 5), `columns` (default: 4)

```jsx
{loading ? (
  <TableSkeleton rows={10} columns={5} />
) : (
  <Table>
    {/* Your table content */}
  </Table>
)}
```

### CardSkeleton

Props: `count` (default: 1)

```jsx
{loading ? (
  <CardSkeleton count={3} />
) : (
  items.map(item => <Card>...</Card>)
)}
```

### FormSkeleton

Props: `fields` (default: 6)

```jsx
{loading ? (
  <FormSkeleton fields={8} />
) : (
  <Form>
    {/* Your form fields */}
  </Form>
)}
```

---

## 🍞 Toast Notifications

**Global toast notification system** with auto-dismiss.

### Hook Usage

```jsx
import { useToast } from '../../components/admin';

function MyComponent() {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success('Notícia criada com sucesso!');
  };

  const handleError = () => {
    toast.error('Erro ao salvar dados');
  };

  const handleWarning = () => {
    toast.warning('Campos obrigatórios não preenchidos');
  };

  const handleInfo = () => {
    toast.info('Processando... Aguarde');
  };

  // Custom toast
  toast.showToast('primary', 'Custom message', {
    title: 'Custom Title',
    autohide: false,  // Won't auto-dismiss
    delay: 10000      // 10 seconds
  });
}
```

### Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `success(message, options)` | string, object | Green success toast |
| `error(message, options)` | string, object | Red error toast |
| `warning(message, options)` | string, object | Yellow warning toast |
| `info(message, options)` | string, object | Blue info toast |
| `showToast(variant, message, options)` | string, string, object | Custom toast |

### Options Object

```javascript
{
  title: 'Custom Title',      // Override default title
  autohide: true,             // Auto-dismiss (default: true)
  delay: 5000                 // Milliseconds before auto-dismiss (default: 5000)
}
```

---

## 🎨 Complete Form Example

Here's a full example combining all components:

```jsx
import { useState } from 'react';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
  HelpTooltip,
  ConfirmDialog,
  FormSkeleton,
  useToast
} from '../../components/admin';

const MyEditor = () => {
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    active: true
  });
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();

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
    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }
    if (formData.title.length > 200) {
      newErrors.title = 'Título deve ter no máximo 200 caracteres';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.warning('Corrija os erros no formulário');
      return;
    }

    setLoading(true);
    try {
      // Your API call here
      await api.post('/endpoint', formData);
      toast.success('Item criado com sucesso!');
      navigate('/admin/list');
    } catch (error) {
      toast.error(error.message || 'Erro ao salvar');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      // Your API call here
      await api.delete('/endpoint/123');
      toast.success('Item excluído com sucesso!');
      navigate('/admin/list');
    } catch (error) {
      toast.error('Erro ao excluir item');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading && !formData.title) {
    return <FormSkeleton fields={5} />;
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Novo Item</h2>
        <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
          <i className="bi bi-trash me-2"></i>
          Excluir
        </Button>
      </div>

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={8}>
            <Card className="mb-4">
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Título <span className="text-danger">*</span>
                    <HelpTooltip text="O título será exibido na listagem e no cabeçalho" />
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    isInvalid={!!errors.title}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.title}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    {formData.title.length}/200 caracteres
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Descrição</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card>
              <Card.Body>
                <h6 className="mb-3">Configurações</h6>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="active-switch"
                    name="active"
                    label="Ativo"
                    checked={formData.active}
                    onChange={handleChange}
                  />
                  <Form.Text className="text-muted">
                    Itens inativos não aparecem no site
                  </Form.Text>
                </Form.Group>

                <hr />

                <div className="d-grid gap-2">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg me-2"></i>
                        Salvar
                      </>
                    )}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/admin/list')}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>

      <ConfirmDialog
        show={showDeleteConfirm}
        title="Excluir Item"
        message="Tem certeza? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        confirmVariant="danger"
        icon="bi-trash"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </Container>
  );
};

export default MyEditor;
```

---

## 📋 Complete List Page Example

```jsx
import { useState, useEffect } from 'react';
import { Container, Table, Button, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  EmptyState,
  TableSkeleton,
  ConfirmDialog,
  useToast
} from '../../components/admin';

const MyList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const toast = useToast();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await api.get('/endpoint');
      setItems(response.data);
    } catch (error) {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/endpoint/${deleteId}`);
      toast.success('Item excluído com sucesso');
      fetchItems();
    } catch (error) {
      toast.error('Erro ao excluir item');
    } finally {
      setDeleteId(null);
    }
  };

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Meus Itens</h2>
        <Button as={Link} to="/admin/items/new" variant="primary">
          <i className="bi bi-plus-lg me-2"></i>
          Novo Item
        </Button>
      </div>

      <InputGroup className="mb-3">
        <InputGroup.Text>
          <i className="bi bi-search"></i>
        </InputGroup.Text>
        <Form.Control
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>

      {loading ? (
        <TableSkeleton rows={10} columns={4} />
      ) : filteredItems.length === 0 ? (
        search ? (
          <EmptyState
            icon="bi-search"
            title="Nenhum resultado encontrado"
            description="Tente ajustar sua busca"
            actionLabel="Limpar Busca"
            onAction={() => setSearch('')}
          />
        ) : (
          <EmptyState
            icon="bi-inbox"
            title="Nenhum item cadastrado"
            description="Comece criando seu primeiro item"
            actionLabel="Novo Item"
            actionLink="/admin/items/new"
          />
        )
      ) : (
        <Table hover responsive>
          <thead>
            <tr>
              <th>Título</th>
              <th>Descrição</th>
              <th>Status</th>
              <th className="text-end">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>
                  {item.active ? (
                    <span className="badge bg-success">Ativo</span>
                  ) : (
                    <span className="badge bg-secondary">Inativo</span>
                  )}
                </td>
                <td className="text-end">
                  <Button
                    as={Link}
                    to={`/admin/items/${item.id}`}
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => setDeleteId(item.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <ConfirmDialog
        show={deleteId !== null}
        title="Excluir Item"
        message="Tem certeza? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        confirmVariant="danger"
        icon="bi-trash"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </Container>
  );
};

export default MyList;
```

---

## 🎯 Best Practices

1. **Always use loading skeletons** instead of spinners for better UX
2. **Use EmptyState** for empty lists AND filtered results with no matches
3. **Replace all `window.confirm()`** with ConfirmDialog
4. **Use toast notifications** for all success/error feedback
5. **Add HelpTooltip** to complex or non-obvious form fields
6. **Validate forms** with real-time feedback using `isInvalid` prop
7. **Show character counters** for text fields with limits
8. **Use breadcrumbs** (already automatic) - just add route labels if needed

---

## 🚀 Next Steps

To implement a new admin page:

1. Copy the list or editor example above
2. Replace API endpoints with your actual routes
3. Update field names to match your data model
4. Add any custom validation logic
5. Test thoroughly with loading states, empty states, and error cases

All the hard work is done - just plug in your data! 🎉
