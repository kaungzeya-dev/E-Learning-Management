import DetailModal from './DetailModal.jsx'
import DetailTable from './DetailTable.jsx'

export default function DetailView({ show, onClose, title, rows, loading, children }) {
  return (
    <DetailModal show={show} onClose={onClose} title={title} loading={loading}>
      <DetailTable rows={rows} />
      {children}
    </DetailModal>
  )
}


