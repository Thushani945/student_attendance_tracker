import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { studentsApi, attendanceApi } from '../api';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    students: 0,
    total: 0,
    present: 0,
    absent: 0,
    late: 0
  });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const [studentsRes, attendanceRes] = await Promise.all([
          studentsApi.getAll(),
          attendanceApi.getAll()
        ]);
        const students = studentsRes.data.data || [];
        const records = attendanceRes.data.data || [];

        const present = records.filter((r) => r.status === 'present').length;
        const absent = records.filter((r) => r.status === 'absent').length;
        const late = records.filter((r) => r.status === 'late').length;

        setStats({
          students: students.length,
          total: records.length,
          present,
          absent,
          late
        });

        const sorted = [...records].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setRecent(sorted.slice(0, 6));
      } catch {
        setStats({ students: 0, total: 0, present: 0, absent: 0, late: 0 });
        setRecent([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard…</div>;
  }

  return (
    <>
      <header className="page-header">
        <h2>Dashboard</h2>
        <p>Overview of students and attendance at a glance.</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card total">
          <span className="label">Students</span>
          <span className="value">{stats.students}</span>
        </div>
        <div className="stat-card total">
          <span className="label">Total records</span>
          <span className="value">{stats.total}</span>
        </div>
        <div className="stat-card present">
          <span className="label">Present</span>
          <span className="value">{stats.present}</span>
        </div>
        <div className="stat-card absent">
          <span className="label">Absent</span>
          <span className="value">{stats.absent}</span>
        </div>
        <div className="stat-card late">
          <span className="label">Late</span>
          <span className="value">{stats.late}</span>
        </div>
      </div>

      <section className="card">
        <div className="card-header">
          <h3>Recent attendance</h3>
          <Link to="/attendance" className="btn btn-ghost btn-sm">
            View all
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="empty-state">
            <strong>No attendance yet</strong>
            <p>
              <Link to="/attendance">Mark attendance</Link> to see records here.
            </p>
          </div>
        ) : (
          <ul className="recent-list">
            {recent.map((record) => (
              <li key={record._id}>
                <span>
                  <strong>{record.student?.name || 'Unknown'}</strong>
                  <span className="recent-meta"> · {record.subject}</span>
                </span>
                <span>
                  <span className={`badge badge-${record.status}`}>{record.status}</span>
                  <span className="recent-meta" style={{ marginLeft: '0.5rem' }}>
                    {formatDate(record.date)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
