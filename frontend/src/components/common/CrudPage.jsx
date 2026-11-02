import { useMemo, useState } from 'react';
import useFetch from '../../hooks/useFetch';
import { getErrorMessage } from '../../api/http';
import { useToast } from '../../context/ToastContext';
import PageHeader from './PageHeader';
import DataTable from './DataTable';
import Modal from './Modal';
import FormField from './FormField';
import ErrorBox from './ErrorBox';

/**
 * Halaman CRUD generik (kategori, supplier, barang, user).
 * props: title, subtitle, entityName, api, columns, fields, emptyForm, searchKeys, toPayload?, rowActions?, deps?
 */
export default function CrudPage({ title, subtitle, entityName, api, columns, fields, emptyForm, searchKeys = ['name'], toPayload, deps = [] }) {
  const { notify } = useToast();
  const { data, loading, error, reload } = useFetch(() => api.list(), deps, []);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null); // null | 'new' | row
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter((r) => searchKeys.some((k) => String(r[k] ?? '').toLowerCase().includes(q)));
  }, [data, search, searchKeys]);

  const openNew = () => { setForm(emptyForm); setEditing('new'); };
  const openEdit = (row) => {
    setForm(Object.fromEntries(Object.keys(emptyForm).map((k) => [k, row[k] ?? ''])));
    setEditing(row);
  };
  const close = () => setEditing(null);
  const onChange = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = toPayload ? toPayload(form, editing === 'new') : form;
      const res = editing === 'new' ? await api.create(payload) : await api.update(editing.id, payload);
      notify(res.message);
      close();
      reload();
    } catch (err) {
      notify(getErrorMessage(err), 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row) => {
    if (!window.confirm(`Hapus ${entityName} "${row.name}"?`)) return;
    try {
      const res = await api.remove(row.id);
      notify(res.message);
      reload();
    } catch (err) {
      notify(getErrorMessage(err), 'error');
    }
  };

  return (
    <>
      <PageHeader title={title} subtitle={subtitle}>
        <input className="input-search" placeholder="Cari..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <button type="button" className="btn btn-primary" onClick={openNew}>+ Tambah {entityName}</button>
      </PageHeader>

      <ErrorBox message={error} onRetry={reload} />
      <div className="card">
        <DataTable
          columns={columns}
          rows={rows}
          loading={loading}
          actions={(row) => (
            <>
              <button type="button" className="btn btn-sm" onClick={() => openEdit(row)}>Edit</button>
              <button type="button" className="btn btn-sm btn-danger" onClick={() => remove(row)}>Hapus</button>
            </>
          )}
        />
      </div>

      {editing && (
        <Modal title={editing === 'new' ? `Tambah ${entityName}` : `Edit ${entityName}`} onClose={close}>
          <form onSubmit={submit}>
            {fields
              .filter((f) => !(f.hideOnEdit && editing !== 'new'))
              .map((f) => (
                <FormField
                  key={f.name}
                  field={editing !== 'new' && f.requiredOnCreateOnly ? { ...f, required: false, placeholder: 'Kosongkan jika tidak diubah' } : f}
                  value={form[f.name]}
                  onChange={onChange}
                />
              ))}
            <div className="modal-footer">
              <button type="button" className="btn" onClick={close}>Batal</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
