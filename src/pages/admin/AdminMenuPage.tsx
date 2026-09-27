import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import type { Category, MenuItem } from '../../types';

interface ItemFormState {
  name: string;
  nameZh: string;
  description: string;
  price: string;
  categoryName: string;
  available: boolean;
  vegetarian: boolean;
  spicy: boolean;
  containsNuts: boolean;
  imageUrl: string;
}

function toFormState(item: MenuItem): ItemFormState {
  return {
    name: item.name,
    nameZh: item.nameZh ?? '',
    description: item.description,
    price: item.price.toFixed(2),
    categoryName: item.category.name,
    available: item.available,
    vegetarian: item.vegetarian,
    spicy: item.spicy,
    containsNuts: item.containsNuts,
    imageUrl: item.imageUrl ?? '',
  };
}

const BLANK_FORM: ItemFormState = {
  name: '',
  nameZh: '',
  description: '',
  price: '',
  categoryName: '',
  available: true,
  vegetarian: false,
  spicy: false,
  containsNuts: false,
  imageUrl: '',
};

const inputClasses =
  'w-full rounded border border-black/10 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold';

export default function AdminMenuPage() {
  const { username, logout } = useAdminAuth();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Per-item edit buffers, keyed by item id — lets each row be edited
  // independently without touching the others until Save is clicked.
  const [forms, setForms] = useState<Record<number, ItemFormState>>({});
  const [savingId, setSavingId] = useState<number | null>(null);
  const [statusById, setStatusById] = useState<Record<number, string>>({});

  // One "add new item" draft per category, keyed by category id.
  const [newItemForms, setNewItemForms] = useState<Record<number, ItemFormState>>({});
  const [creatingCategoryId, setCreatingCategoryId] = useState<number | null>(null);

  useEffect(() => {
    loadAll();
  }, []);

  function loadAll() {
    setLoading(true);
    Promise.all([
      fetch('/api/admin/menu', { credentials: 'include' }).then((r) => {
        if (!r.ok) throw new Error(`Failed to load menu items: ${r.status}`);
        return r.json();
      }),
      fetch('/api/admin/menu/categories', { credentials: 'include' }).then((r) => {
        if (!r.ok) throw new Error(`Failed to load categories: ${r.status}`);
        return r.json();
      }),
    ])
      .then(([itemData, categoryData]: [MenuItem[], Category[]]) => {
        setItems(itemData);
        setCategories(categoryData);
        setForms(Object.fromEntries(itemData.map((item) => [item.id, toFormState(item)])));
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }

  const itemsByCategory = useMemo(() => {
    const map = new Map<number, MenuItem[]>();
    for (const item of items) {
      const list = map.get(item.category.id) ?? [];
      list.push(item);
      map.set(item.category.id, list);
    }
    return map;
  }, [items]);

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.displayOrder - b.displayOrder),
    [categories]
  );

  function updateForm(id: number, patch: Partial<ItemFormState>) {
    setForms((current) => ({ ...current, [id]: { ...current[id], ...patch } }));
  }

  async function saveItem(id: number) {
    const form = forms[id];
    setSavingId(id);
    setStatusById((s) => ({ ...s, [id]: '' }));
    try {
      const response = await fetch(`/api/admin/menu/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(toRequestBody(form)),
      });
      if (!response.ok) throw new Error(`Save failed: ${response.status}`);
      const updated: MenuItem = await response.json();
      setItems((current) => current.map((i) => (i.id === id ? updated : i)));
      setForms((current) => ({ ...current, [id]: toFormState(updated) }));
      if (!categories.some((c) => c.name === updated.category.name)) {
        setCategories((current) => [...current, updated.category]);
      }
      setStatusById((s) => ({ ...s, [id]: 'Saved' }));
    } catch (err) {
      setStatusById((s) => ({ ...s, [id]: err instanceof Error ? err.message : 'Failed to save' }));
    } finally {
      setSavingId(null);
    }
  }

  async function deleteItem(id: number, name: string) {
    if (!window.confirm(`Remove "${name}" from the menu?`)) return;
    setSavingId(id);
    try {
      const response = await fetch(`/api/admin/menu/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!response.ok) throw new Error(`Delete failed: ${response.status}`);
      const result: { deleted: boolean; archived?: boolean } = await response.json();
      if (result.deleted) {
        setItems((current) => current.filter((i) => i.id !== id));
      } else if (result.archived) {
        // Had order history — backend marked it unavailable instead of
        // deleting it outright, since deleting would break past receipts.
        setItems((current) => current.map((i) => (i.id === id ? { ...i, available: false } : i)));
        setForms((current) => ({ ...current, [id]: { ...current[id], available: false } }));
        setStatusById((s) => ({
          ...s,
          [id]: 'This dish has order history, so it was hidden instead of deleted.',
        }));
      }
    } catch (err) {
      setStatusById((s) => ({ ...s, [id]: err instanceof Error ? err.message : 'Failed to delete' }));
    } finally {
      setSavingId(null);
    }
  }

  function startNewItem(categoryId: number, categoryName: string) {
    setNewItemForms((current) => ({ ...current, [categoryId]: { ...BLANK_FORM, categoryName } }));
  }

  async function createItem(categoryId: number) {
    const form = newItemForms[categoryId];
    setCreatingCategoryId(categoryId);
    try {
      const response = await fetch('/api/admin/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(toRequestBody(form)),
      });
      if (!response.ok) throw new Error(`Create failed: ${response.status}`);
      const created: MenuItem = await response.json();
      setItems((current) => [...current, created]);
      setForms((current) => ({ ...current, [created.id]: toFormState(created) }));
      setNewItemForms((current) => {
        const next = { ...current };
        delete next[categoryId];
        return next;
      });
      if (!categories.some((c) => c.name === created.category.name)) {
        setCategories((current) => [...current, created.category]);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create item');
    } finally {
      setCreatingCategoryId(null);
    }
  }

  const [newCategoryName, setNewCategoryName] = useState('');

  function addBlankCategorySection() {
    const name = newCategoryName.trim();
    if (!name) return;
    if (categories.some((c) => c.name === name)) {
      alert('A category with that name already exists.');
      return;
    }
    // No dedicated "create category" endpoint -- a category only really
    // exists once it has an item, so this just opens the "new item" form
    // for that name; the category itself gets created when that item is
    // saved (the backend creates categories on demand).
    const tempId = -Date.now();
    setCategories((current) => [...current, { id: tempId, name, displayOrder: current.length }]);
    setNewItemForms((current) => ({ ...current, [tempId]: { ...BLANK_FORM, categoryName: name } }));
    setNewCategoryName('');
  }

  if (loading) return <p className="text-center text-brand-ink/60 py-20">Loading menu...</p>;
  if (error) return <p className="text-center text-red-600 py-20">Error loading menu: {error}</p>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold text-brand-green">Menu Editor</h1>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/admin/orders" className="text-brand-green font-medium hover:underline">
            Orders
          </Link>
          <span className="text-brand-ink/60">Logged in as {username}</span>
          <button onClick={logout} className="text-brand-green font-medium hover:underline">
            Log out
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-black/5 p-4 mb-6 flex items-end gap-2">
        <div className="flex-1">
          <label className="block text-xs text-brand-ink/60 mb-1">Add a new category</label>
          <input
            className={inputClasses}
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="e.g. Chef's Specials"
          />
        </div>
        <button
          onClick={addBlankCategorySection}
          className="bg-brand-green text-white text-sm font-medium px-4 py-1.5 rounded-full hover:bg-brand-green-dark transition-colors"
        >
          Add Category
        </button>
      </div>

      <div className="space-y-8">
        {sortedCategories.map((category) => {
          const categoryItems = itemsByCategory.get(category.id) ?? [];
          const newForm = newItemForms[category.id];

          return (
            <div key={category.id}>
              <h2 className="font-display text-xl font-bold text-brand-ink mb-2">{category.name}</h2>
              <div className="bg-white rounded-xl shadow-sm border border-black/5 divide-y divide-black/5">
                {categoryItems.map((item) => {
                  const form = forms[item.id];
                  if (!form) return null;
                  const status = statusById[item.id];
                  return (
                    <div key={item.id} className="p-3">
                      <div className="grid grid-cols-12 gap-2 items-center">
                        <input
                          className={`${inputClasses} col-span-3`}
                          value={form.name}
                          onChange={(e) => updateForm(item.id, { name: e.target.value })}
                          placeholder="English name"
                        />
                        <input
                          className={`${inputClasses} col-span-2`}
                          value={form.nameZh}
                          onChange={(e) => updateForm(item.id, { nameZh: e.target.value })}
                          placeholder="中文名"
                        />
                        <div className="col-span-1 flex items-center gap-0.5">
                          <span className="text-sm text-brand-ink/60">£</span>
                          <input
                            className={inputClasses}
                            value={form.price}
                            onChange={(e) => updateForm(item.id, { price: e.target.value })}
                            inputMode="decimal"
                          />
                        </div>
                        <label className="col-span-1 flex items-center gap-1 text-xs whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={form.available}
                            onChange={(e) => updateForm(item.id, { available: e.target.checked })}
                          />
                          Live
                        </label>
                        <label className="col-span-1 flex items-center gap-1 text-xs whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={form.vegetarian}
                            onChange={(e) => updateForm(item.id, { vegetarian: e.target.checked })}
                          />
                          🌱
                        </label>
                        <label className="col-span-1 flex items-center gap-1 text-xs whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={form.spicy}
                            onChange={(e) => updateForm(item.id, { spicy: e.target.checked })}
                          />
                          🌶️
                        </label>
                        <label className="col-span-1 flex items-center gap-1 text-xs whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={form.containsNuts}
                            onChange={(e) => updateForm(item.id, { containsNuts: e.target.checked })}
                          />
                          🥜
                        </label>
                        <button
                          onClick={() => saveItem(item.id)}
                          disabled={savingId === item.id}
                          className="col-span-1 bg-brand-green text-white text-xs font-medium py-1.5 rounded-full hover:bg-brand-green-dark disabled:opacity-50"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => deleteItem(item.id, form.name)}
                          disabled={savingId === item.id}
                          className="col-span-1 text-red-600 text-xs font-medium hover:underline disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                      <input
                        className={`${inputClasses} mt-2`}
                        value={form.description}
                        onChange={(e) => updateForm(item.id, { description: e.target.value })}
                        placeholder="Description"
                      />
                      {status && (
                        <p className={`text-xs mt-1 ${status === 'Saved' ? 'text-brand-green' : 'text-red-600'}`}>
                          {status}
                        </p>
                      )}
                    </div>
                  );
                })}

                {categoryItems.length === 0 && !newForm && (
                  <p className="p-3 text-sm text-brand-ink/50">No items in this category yet.</p>
                )}

                {newForm ? (
                  <div className="p-3 bg-brand-cream/50">
                    <div className="grid grid-cols-12 gap-2 items-center">
                      <input
                        className={`${inputClasses} col-span-3`}
                        value={newForm.name}
                        onChange={(e) =>
                          setNewItemForms((c) => ({ ...c, [category.id]: { ...c[category.id], name: e.target.value } }))
                        }
                        placeholder="English name"
                      />
                      <input
                        className={`${inputClasses} col-span-2`}
                        value={newForm.nameZh}
                        onChange={(e) =>
                          setNewItemForms((c) => ({ ...c, [category.id]: { ...c[category.id], nameZh: e.target.value } }))
                        }
                        placeholder="中文名"
                      />
                      <div className="col-span-1 flex items-center gap-0.5">
                        <span className="text-sm text-brand-ink/60">£</span>
                        <input
                          className={inputClasses}
                          value={newForm.price}
                          onChange={(e) =>
                            setNewItemForms((c) => ({ ...c, [category.id]: { ...c[category.id], price: e.target.value } }))
                          }
                          inputMode="decimal"
                        />
                      </div>
                      <input
                        className={`${inputClasses} col-span-4`}
                        value={newForm.description}
                        onChange={(e) =>
                          setNewItemForms((c) => ({
                            ...c,
                            [category.id]: { ...c[category.id], description: e.target.value },
                          }))
                        }
                        placeholder="Description"
                      />
                      <button
                        onClick={() => createItem(category.id)}
                        disabled={creatingCategoryId === category.id || !newForm.name || !newForm.price}
                        className="col-span-1 bg-brand-green text-white text-xs font-medium py-1.5 rounded-full hover:bg-brand-green-dark disabled:opacity-50"
                      >
                        Create
                      </button>
                      <button
                        onClick={() =>
                          setNewItemForms((c) => {
                            const next = { ...c };
                            delete next[category.id];
                            return next;
                          })
                        }
                        className="col-span-1 text-brand-ink/50 text-xs font-medium hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3">
                    <button
                      onClick={() => startNewItem(category.id, category.name)}
                      className="text-brand-green text-sm font-medium hover:underline"
                    >
                      + Add dish to {category.name}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function toRequestBody(form: ItemFormState) {
  return {
    name: form.name,
    nameZh: form.nameZh || null,
    description: form.description,
    price: Number(form.price),
    categoryName: form.categoryName,
    available: form.available,
    vegetarian: form.vegetarian,
    spicy: form.spicy,
    containsNuts: form.containsNuts,
    imageUrl: form.imageUrl || null,
  };
}
