import Spinner from 'react-bootstrap/Spinner'
import { useRouter } from 'next/router'
import { trans } from '../lib/translations'

const Loading = ({ loading }) => {
  const router = useRouter()
  const { locale } = router

  if (!loading) {
    return null
  }

  return (
    <div className="card mb-3">
      <div className="card-body card-loading text-center">
        <Spinner animation="border" role="status" size="xl" variant="primary" className="mb-4">
          <span className="sr-only">{trans('loading', locale)}...</span>
        </Spinner>
        <h1>{trans('loading', locale)}...</h1>
      </div>
      <style jsx>{`
        .card-loading {
          min-height: 400px;
          padding-top: 80px;
        }
      `}</style>
    </div>
  )
}

export default Loading
