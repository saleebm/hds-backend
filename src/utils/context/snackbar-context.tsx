import {
  Context,
  createContext,
  Dispatch,
  ReactNode,
  useReducer,
  useContext,
} from 'react'
import { produce } from 'immer'

/**
 *TODO:
 * if I could go back to when I created this, or have time to refactor,
 * wrap it so that isOpen does not have to be explicitly stated everytime
 * I call toggleSnackbar.
 *
 *TODO:
 * Also, when user closes it, there is a flash of the default status. fix this
 */
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
  toggleSnackbar: (_snackbarContext: SnackbarState) => {},
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
