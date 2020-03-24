import { FC } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import { ErrorBoundary } from '@Components/Elements/ErrorBoundary'

export const Loader: FC<{ loading: boolean }> = ({ children, loading }) => (
  <ErrorBoundary>{loading ? <CircularProgress /> : { children }}</ErrorBoundary>
)
