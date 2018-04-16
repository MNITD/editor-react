/**
 * Created by bogdan on 26.03.18.
 */
import assert from 'assert';

import blocks from '../src/reducers/blocksReducer';


describe('Test reducers', () => {
    const init = [{id: 1, blockType: 'Text'}, {id: 2, blockType: 'Text'}];
    const expected = [{id: 1, blockType: 'Text'}, {id: 2, blockType: 'Text'}, {id: 3, blockType: 'Input'}]
    console.log(blocks.toString());
    it('should return new Array with new block', done => {
        const actual = blocks(init, {
            type: 'ADD_BLOCK',
            blockType: 'Input',
            id: 3
        });
        assert.deepEqual(expected, expected);
        done();
    });
});