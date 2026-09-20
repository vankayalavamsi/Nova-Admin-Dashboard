import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="notfound">
      <h1>404</h1>
      <p>The page you&apos;re looking for doesn&apos;t exist or was moved.</p>
      <Link className="btn btn-primary" to="/">Back to dashboard</Link>
    </div>
  )
}