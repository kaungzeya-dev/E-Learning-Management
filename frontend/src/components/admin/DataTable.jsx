export default function DataTable({ columns, data, onRowClick, emptyMessage = 'No data found' }) {
  return (
    <div className="table-responsive">
      <table className="table align-middle w-100">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} scope="col" className={col.align === 'end' ? 'text-end' : ''}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr 
              key={row.id || rowIdx}
              className={onRowClick ? 'clickable-row' : ''}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((col, colIdx) => (
                <td key={colIdx} className={col.align === 'end' ? 'text-end' : ''}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="text-center text-secondary">{emptyMessage}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

