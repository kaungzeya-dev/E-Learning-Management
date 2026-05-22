export default function DetailTable({ rows = [] }) {
  return (
    <div className="table-responsive">
      <table className="table table-bordered align-middle w-100">
        <thead className="table-light">
          <tr>
            <th scope="col">Field</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={idx}>
              <td className="fw-semibold" style={{ width: '30%' }}>{r.label}</td>
              <td>{r.value ?? 'N/A'}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan="2" className="text-center text-secondary">No details available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}


