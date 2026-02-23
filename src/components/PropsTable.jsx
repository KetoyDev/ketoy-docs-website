import './PropsTable.css'

export default function PropsTable({ params }) {
  if (!params || params.length === 0) return null

  return (
    <div className="props-table-wrapper">
      <table className="props-table">
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {params.map((p) => (
            <tr key={p.name}>
              <td><code>{p.name}</code></td>
              <td><code>{p.type}</code></td>
              <td className="props-table__default">{p.default}</td>
              <td>{p.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
