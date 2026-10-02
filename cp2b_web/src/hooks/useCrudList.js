import { useState, useEffect, useCallback } from 'react';

/**
 * Generic state machine for admin list pages: load a collection, expose
 * loading/error state, and delete items with per-item pending state.
 *
 * Single responsibility: data orchestration only — rendering (tables, empty
 * states, confirm dialogs) stays in the page component.
 *
 * @param {Object}   options
 * @param {Function} options.fetchItems  async () => item[]
 * @param {Function} options.deleteItem  async (item) => void
 * @param {Function} [options.getId]     item => unique key (default: item.id)
 */
const useCrudList = ({ fetchItems, deleteItem, getId = (item) => item.id }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchItems();
      setItems(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('useCrudList: fetch failed', err);
      setError('Não foi possível carregar os dados. O servidor está no ar?');
    } finally {
      setLoading(false);
    }
    // fetchItems is expected to be stable (module-level fn or useCallback)
  }, [fetchItems]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const removeItem = useCallback(
    async (item) => {
      const id = getId(item);
      setDeletingId(id);
      try {
        await deleteItem(item);
        setItems((prev) => prev.filter((i) => getId(i) !== id));
        return true;
      } catch (err) {
        console.error('useCrudList: delete failed', err);
        setError(err.response?.data?.error || 'Não foi possível excluir o item.');
        return false;
      } finally {
        setDeletingId(null);
      }
    },
    [deleteItem, getId]
  );

  return { items, loading, error, setError, deletingId, refresh, removeItem };
};

export default useCrudList;
