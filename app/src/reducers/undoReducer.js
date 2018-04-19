const editorState = (reducer) => {

    const persistedState = {
        past: [],
        present: {
            blocks: [
                // {
                //     blockType: 'Grid',
                //     children: [
                //         {
                //
                //             blockType: 'Regular',
                //             flex: 12
                //         },
                //         {
                //             blockType: 'Regular',
                //             flex: 12
                //         }
                //     ]
                // },
                {
                    blockType: 'Grid',
                    children: [],
                },

                {
                    blockType: 'Grid',
                    children: [],
                },
            ]
        },
        future: [],
    };

    return (state = persistedState, action) => {
        const {past, present, future} = state;

        switch (action.type) {
            case 'UNDO': {
                const lastPast = past[past.length - 1];
                return {
                    ...state,
                    past: past.slice(0, past.length - 1),
                    present: lastPast || present,
                    future: lastPast? [...future, present] : future,
                };
            }
            case 'REDO': {
                const lastFuture = future[future.length - 1];
                return {
                    ...state,
                    past: lastFuture ? [...past, present] : past,
                    present: lastFuture || present,
                    future: future.slice(0, future.length - 1),
                }
            }
            default: {
                console.log(state);

                const newPresent = reducer(present, action);
                if (newPresent === present){
                    console.log('same');
                    return state;
                }else {
                    console.log('different', present);
                    return {
                        ...state,
                        past: [...past, {...present}],
                        present: newPresent,
                        future: [],
                    };
                }
            }
        }
    }
};

export default editorState;