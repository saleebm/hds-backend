import { produce } from 'immer'

import { GlobalActions, GlobalActionTypes } from '../action'
import { IGlobalState } from '../types'

export const globalState: IGlobalState = {
  errors: [],
}

export const GlobalReducer = (
  state: IGlobalState = globalState,
  action: GlobalActions
) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GlobalActionTypes.ClearErrors:
        draft.errors = []
        return draft
      case GlobalActionTypes.SetError:
        draft.errors.push({
          error: action.error,
          reference: action.error.reference,
        })
        return draft
    }
  })
