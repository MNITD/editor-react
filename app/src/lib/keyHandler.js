import {fromEvent} from 'most';

const keydown = fromEvent('keydown', document);
const keyup = fromEvent('keyup', document);

const ctrldown = keydown.filter(event => event.key === 'Control');
const ctrlup = keyup.filter(event => event.key === 'Control');
const shiftdown = keydown.filter(event => event.key === 'Shift');
const zdown = keydown.filter(event => event.key.toLowerCase() === 'z');
const zup = keyup.filter(event => event.key.toLowerCase() === 'z');
const ydown = keydown.filter(event => event.key.toLowerCase() === 'y');
const yup = keyup.filter(event => event.key.toLowerCase() === 'y');


// const redo = ctrldown.take(1).chain(() => ydown.take(1).chain(() => yup));
// const undo = ctrldown.take(1).chain(() => zdown.take(1).chain(() => zup));

const redo = keydown
    .merge(keyup)
    .filter(event => event.type === 'keydown' || (event.type === 'keyup' && (event.key === 'Control' || event.key === 'Shift')))
    .scan(({protoPrev, prev, current}, event) => {
        if (event.type === 'keyup') return {}; // Control or Shift is up
        if (protoPrev && protoPrev.key === 'Control' && prev.key === 'Shift' && current.key.toLowerCase() === 'z' && event.key.toLowerCase() === 'z') return {
            protoPrev,
            current,
            prev
        }; // only z is up
        return {current: event, prev: current, protoPrev: prev}
    }, {})
    .filter(({protoPrev, prev, current}) => protoPrev && protoPrev.key === 'Control' && prev.key === 'Shift' && current.key.toLowerCase() === 'z');

const undo = keydown
    .merge(keyup)
    .filter(event => event.type === 'keydown' || (event.type === 'keyup' && event.key === 'Control'))
    .scan(({prev, current}, event) => {
        if (event.type === 'keyup') return {}; // Control is up
        if (prev && prev.key === 'Control' && current.key.toLowerCase() === 'z' && event.key.toLowerCase() === 'z') return {
            current,
            prev
        }; // only z is up
        return {current: event, prev: current}
    }, {})
    .filter(({prev, current}) => prev && current.key.toLowerCase() === 'z' && prev.key === 'Control');

export default ({undoState, redoState}) => {
    undo.observe(() => {
        console.log('undo');
        undoState()
    });
    redo.observe(() => {
        console.log('redo');
        redoState()
    });
}