import CrudPage from '../../components/common/CrudPage';
import { categoryApi } from '../../api/categoryApi';

const columns = [
  { key: 'name', header: 'Nama Kategori' },
  { key: 'description', header: 'Deskripsi' },
];
const fields = [
  { name: 'name', label: 'Nama Kategori', required: true },
  { name: 'description', label: 'Deskripsi', type: 'textarea' },
];

export default function CategoryPage() {
  return (
    <CrudPage
      title="Kategori Barang"
      subtitle="Kelompokkan barang berdasarkan kategori"
      entityName="Kategori"
      api={categoryApi}
      columns={columns}
      fields={fields}
      emptyForm={{ name: '', description: '' }}
      searchKeys={['name', 'description']}
    />
  );
}
