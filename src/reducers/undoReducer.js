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
                return {
                    ...state,
                    past: past.slice(0, past.length - 1),
                    present: past[past.length - 1],
                    future: [...future, present],
                };
            }
            case 'REDO': {
                return {
                    ...state,
                    past: [...past, present],
                    present: future[future.length - 1],
                    future: future.slice(0, past.length - 1),
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