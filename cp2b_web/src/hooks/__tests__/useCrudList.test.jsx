import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import useCrudList from '../useCrudList';

describe('useCrudList', () => {
  it('loads items on mount', async () => {
    const fetchItems = vi.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]);
    const { result } = renderHook(() =>
      useCrudList({ fetchItems, deleteItem: vi.fn() })
    );

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.items).toHaveLength(2);
    expect(result.current.error).toBeNull();
  });

  it('surfaces a friendly error when loading fails', async () => {
    const fetchItems = vi.fn().mockRejectedValue(new Error('boom'));
    const { result } = renderHook(() =>
      useCrudList({ fetchItems, deleteItem: vi.fn() })
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toMatch(/carregar/i);
    expect(result.current.items).toEqual([]);
  });

  it('removes an item optimistically after a successful delete', async () => {
    const fetchItems = vi.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]);
    const deleteItem = vi.fn().mockResolvedValue();
    const { result } = renderHook(() => useCrudList({ fetchItems, deleteItem }));

    await waitFor(() => expect(result.current.loading).toBe(false));
    let outcome;
    await act(async () => {
      outcome = await result.current.removeItem({ id: 1 });
    });

    expect(outcome).toBe(true);
    expect(deleteItem).toHaveBeenCalledWith({ id: 1 });
    expect(result.current.items).toEqual([{ id: 2 }]);
  });

  it('keeps the item and reports the API error when delete fails', async () => {
    const fetchItems = vi.fn().mockResolvedValue([{ id: 1 }]);
    const apiError = Object.assign(new Error('fail'), {
      response: { data: { error: 'Evento em uso' } },
    });
    const deleteItem = vi.fn().mockRejectedValue(apiError);
    const { result } = renderHook(() => useCrudList({ fetchItems, deleteItem }));

    await waitFor(() => expect(result.current.loading).toBe(false));
    let outcome;
    await act(async () => {
      outcome = await result.current.removeItem({ id: 1 });
    });

    expect(outcome).toBe(false);
    expect(result.current.items).toHaveLength(1);
    expect(result.current.error).toBe('Evento em uso');
  });

  it('supports a custom id extractor', async () => {
    const fetchItems = vi.fn().mockResolvedValue([{ slug: 'a' }, { slug: 'b' }]);
    const deleteItem = vi.fn().mockResolvedValue();
    const { result } = renderHook(() =>
      useCrudList({ fetchItems, deleteItem, getId: (i) => i.slug })
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      await result.current.removeItem({ slug: 'a' });
    });
    expect(result.current.items).toEqual([{ slug: 'b' }]);
  });
});
