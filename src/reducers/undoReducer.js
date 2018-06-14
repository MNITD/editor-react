const editorState = reducer => {
  const persistedState = {
    past: [],
    present: {
      blocks: [],
    },
    future: [],
  }

  return (state = persistedState, action) => {
    const { past, present, future } = state

    switch (action.type) {
      case "UNDO": {
        const lastPast = past[past.length - 1]
        return {
          ...state,
          past: past.slice(0, past.length - 1),
          present: lastPast || present,
          future: lastPast ? [...future, present] : future,
        }
      }
      case "REDO": {
        const lastFuture = future[future.length - 1]
        return {
          ...state,
          past: lastFuture ? [...past, present] : past,
          present: lastFuture || present,
          future: future.slice(0, future.length - 1),
        }
      }
      case "GET_DOCUMENT": {
        const { document } = action
        return {
          ...state,
          past: [],
          future: [],
          present: { ...present, blocks: document.tree },
        }
      }
      default: {
        const newPresent = reducer(present, action)
        if (newPresent === present) {
          return state
        } else {
          return {
            ...state,
            past: [...past, { ...present }],
            present: newPresent,
            future: [],
          }
        }
      }
    }
  }
}

export default editorState
