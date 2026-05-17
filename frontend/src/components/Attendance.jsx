import { useEffect, useState } from 'react';
import { attendanceApi, studentsApi } from '../api';
import Modal from './Modal';
import { useToast } from './Toast';

const emptyForm = {
  student: '',
  date: new Date().toISOString().slice(0, 10),
  status: 'present',
  subject: '',
  remarks: ''
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export default function Attendance() {
  const { showToast } = useToast();
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [attRes, stuRes] = await Promise.all([
        attendanceApi.getAll(),
        studentsApi.getAll()
      ]);
      setRecords(attRes.data.data || []);
      setStudents(stuRes.data.data || []);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load attendance', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = records.filter((r) => {
    const q = search.toLowerCase();
    const name = r.student?.name?.toLowerCase() || '';
    const subject = r.subject?.toLowerCase() || '';
    const status = r.status?.toLowerCase() || '';
    return name.includes(q) || subject.includes(q) || status.includes(q);
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, date: new Date().toISOString().slice(0, 10) });
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    setForm({
      student: record.student?._id || record.student,
      date: new Date(record.date).toISOString().slice(0, 10),
      status: record.status,
      subject: record.subject,
      remarks: record.remarks || ''
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!students.length) {
      showToast('Add at least one student first', 'error');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await attendanceApi.update(editing._id, form);
        showToast('Attendance updated');
      } else {
        await attendanceApi.create(form);
        showToast('Attendance marked');
      }
      closeModal();
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this attendance record?')) return;
    try {
      await attendanceApi.remove(id);
      showToast('Record deleted');
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  return (
    <>
      <header className="page-header">
        <h2>Attendance</h2>
        <p>Mark and manage attendance for each student and subject.</p>
      </header>

      <section className="card">
        <div className="card-header">
          <h3>Records ({filtered.length})</h3>
          <div className="toolbar">
            <input
              type="search"
              className="search-input"
              placeholder="Search by name, subject…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="button" className="btn btn-primary" onClick={openCreate}>
              + Mark attendance
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading attendance…</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <strong>No records yet</strong>
            <p>Mark attendance to build your history.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Remarks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r._id}>
                    <td>
                      <strong>{r.student?.name || '—'}</strong>
                      {r.student?.studentId && (
                        <div className="recent-meta">{r.student.studentId}</div>
                      )}
                    </td>
                    <td>{r.subject}</td>
                    <td>{formatDate(r.date)}</td>
                    <td>
                      <span className={`badge badge-${r.status}`}>{r.status}</span>
                    </td>
                    <td>{r.remarks || '—'}</td>
                    <td>
                      <div className="actions">
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => openEdit(r)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(r._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {modalOpen && (
        <Modal
          title={editing ? 'Edit attendance' : 'Mark attendance'}
          onClose={closeModal}
          footer={
            <>
              <button type="button" className="btn btn-ghost" onClick={closeModal}>
                Cancel
              </button>
              <button
                type="submit"
                form="attendance-form"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? 'Saving…' : editing ? 'Update' : 'Save'}
              </button>
            </>
          }
        >
          <form id="attendance-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="student">Student</label>
              <select
                id="student"
                name="student"
                value={form.student}
                onChange={handleChange}
                required
              >
                <option value="">Select student</option>
                {students.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.studentId})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select id="status" name="status" value={form.status} onChange={handleChange}>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="e.g. Web Services"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="remarks">Remarks (optional)</label>
              <input
                id="remarks"
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
                placeholder="On time, excused, etc."
              />
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
