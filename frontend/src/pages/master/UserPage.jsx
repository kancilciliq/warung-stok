import CrudPage from '../../components/common/CrudPage';
import Badge from '../../components/common/Badge';
import { userApi } from '../../api/userApi';

const columns = [
  { key: 'name', header: 'Nama' },
  { key: 'username', header: 'Username' },
  { key: 'role', header: 'Role', render: (r) => <Badge variant={r.role === 'admin' ? 'blue' : 'gray'}>{r.role}</Badge> },
];
const fields = [
  { name: 'name', label: 'Nama Lengkap', required: true },
  { name: 'username', label: 'Username', required: true },
  { name: 'password', label: 'Password (min. 6 karakter)', type: 'password', required: true, requiredOnCreateOnly: true },
  { name: 'role', label: 'Role', type: 'select', required: true, options: [{ value: 'staff', label: 'Staff' }, { value: 'admin', label: 'Admin' }] },
];

export default function UserPage() {
  return (
    <CrudPage
      title="Pengguna"
      subtitle="Kelola akun karyawan (khusus admin)"
      entityName="Pengguna"
      api={userApi}
      columns={columns}
      fields={fields}
      emptyForm={{ name: '', username: '', password: '', role: 'staff' }}
      searchKeys={['name', 'username']}
    />
  );
}
