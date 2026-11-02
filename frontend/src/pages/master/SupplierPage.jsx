import CrudPage from '../../components/common/CrudPage';
import { supplierApi } from '../../api/supplierApi';

const columns = [
  { key: 'name', header: 'Nama Supplier' },
  { key: 'phone', header: 'Telepon' },
  { key: 'address', header: 'Alamat' },
];
const fields = [
  { name: 'name', label: 'Nama Supplier', required: true },
  { name: 'phone', label: 'Telepon' },
  { name: 'address', label: 'Alamat', type: 'textarea' },
];

export default function SupplierPage() {
  return (
    <CrudPage
      title="Supplier"
      subtitle="Data pemasok barang (opsional untuk barang masuk)"
      entityName="Supplier"
      api={supplierApi}
      columns={columns}
      fields={fields}
      emptyForm={{ name: '', phone: '', address: '' }}
      searchKeys={['name', 'phone', 'address']}
    />
  );
}
