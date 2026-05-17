import { useEffect, useState } from 'react';
import { studentsApi } from '../api';
import Modal from './Modal';
import { useToast } from './Toast';

const emptyForm = {
  name: '',
  studentId: '',
  email: '',
  course: '',
  year: ''
};

export default function Students() {
  const { showToast } = useToast();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await studentsApi.getAll();
      setStudents(res.data.data || []);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load students', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.name?.toLowerCase().includes(q) ||
      s.studentId?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.course?.toLowerCase().includes(q)
    );
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (student) => {
    setEditing(student);
    setForm({
      name: student.name,
      studentId: student.studentId,
      email: student.email,
      course: student.course,
      year: String(student.year)
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
    setSaving(true);
    const payload = { ...form, year: Number(form.year) };
    try {
      if (editing) {
        await studentsApi.update(editing._id, payload);
        showToast('Student updated successfully');
      } else {
        await studentsApi.create(payload);
        showToast('Student added successfully');
      }
      closeModal();
      loadStudents();
    } catch (err) {
      showToast(err.response?.data?.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    try {
      await studentsApi.remove(id);
      showToast('Student deleted');
      loadStudents();
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  return (
    <>
      <header className="page-header">
        <h2>Students</h2>
        <p>Manage student records — add, edit, or remove.</p>
      </header>

      <section className="card">
        <div className="card-header">
          <h3>All students ({filtered.length})</h3>
          <div className="toolbar">
            <input
              type="search"
              className="search-input"
              placeholder="Search students…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="button" className="btn btn-primary" onClick={openCreate}>
              + Add student
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading students…</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <strong>No students found</strong>
            <p>Add your first student to get started.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Student ID</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Year</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s._id}>
                    <td><strong>{s.name}</strong></td>
                    <td>{s.studentId}</td>
                    <td>{s.email}</td>
                    <td>{s.course}</td>
                    <td>{s.year}</td>
                    <td>
                      <div className="actions">
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => openEdit(s)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(s._id)}
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
          title={editing ? 'Edit student' : 'Add student'}
          onClose={closeModal}
          footer={
            <>
              <button type="button" className="btn btn-ghost" onClick={closeModal}>
                Cancel
              </button>
              <button
                type="submit"
                form="student-form"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? 'Saving…' : editing ? 'Update' : 'Add student'}
              </button>
            </>
          }
        >
          <form id="student-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full name</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="studentId">Student ID</label>
              <input
                id="studentId"
                name="studentId"
                value={form.studentId}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="course">Course</label>
                <input id="course" name="course" value={form.course} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="year">Year</label>
                <input
                  id="year"
                  name="year"
                  type="number"
                  min="1"
                  max="5"
                  value={form.year}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
