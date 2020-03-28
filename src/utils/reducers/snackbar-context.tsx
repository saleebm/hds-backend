import {
  Context,
  createContext,
  Dispatch,
  ReactNode,
  useReducer,
  useContext,
} from 'react'
import { produce } from 'immer'

export interface SnackbarState {
  message: string
  isOpen: boolean
  severity?: 'success' | 'error' | 'warning' | 'info'
}

const initialSnackBarContext: SnackbarState = {
  message: '',
  isOpen: false,
  severity: undefined,
}

const SnackbarContext: Context<{
  toggleSnackbar: Dispatch<SnackbarState>
  snackbarContext: SnackbarState
}> = createContext({
  toggleSnackbar: (snackbarContext: SnackbarState) => {},
  snackbarContext: initialSnackBarContext,
})

function reducer(state: SnackbarState, setSnackbar: SnackbarState) {
  return produce(state, (draft: SnackbarState) => {
    draft.message = setSnackbar.message
    draft.severity = setSnackbar.severity
    draft.isOpen = setSnackbar.isOpen
  })
}

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [snackbarContext, toggleSnackbar] = useReducer(
    reducer,
    initialSnackBarContext
  )

  return (
    <SnackbarContext.Provider
      value={{
        snackbarContext,
        toggleSnackbar,
      }}
    >
      {children}
    </SnackbarContext.Provider>
  )
}

export default () => useContext(SnackbarContext)
