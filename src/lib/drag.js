/**
 * Created by bogdan on 28.03.18.
 */
import {fromEvent} from 'most';

const mouseup = fromEvent('mouseup', document);
const mousemove = fromEvent('mousemove', document);

const create = (draggable, {onDrag, dragStart, dragEnd, dragPredicate}) => {
    const mousedown = fromEvent('mousedown', draggable);
    const moveDraggable = (elem, pos) => {
        elem.style.top = `${pos.top}px`;
        elem.style.left = `${pos.left}px`;
    };

    const dragging = mousedown
        .takeWhile(dragPredicate)
        .map(({clientX, clientY}) => [clientX + window.scrollX, clientY + window.scrollY])
        .chain(([startX, startY]) => {
            const startLeft = parseInt(draggable.style.left, 10) || 0;
            const startTop = parseInt(draggable.style.top, 10) || 0;

            const mappingmove = mousemove
                .take(1)
                .tap((pos)=>dragStart(draggable, pos))
                .concat(mousemove.skip(1))
                .tap(mm => mm.preventDefault()) // prevent text selecting
                .map(({clientX, clientY}) => ({
                        left: startLeft + clientX - startX,
                        top: startTop + clientY - startY
                    })
                );
            const mouseupLast = mouseup
                .map(({clientX, clientY}) => [clientX + window.scrollX, clientY + window.scrollY])
                .map(([endX, endY]) => (startX - endX + startY - endY) !== 0 ? dragEnd(draggable): '');

            return mappingmove.until(mouseupLast);
        });

    dragging
        .tap(pos => {moveDraggable(draggable, pos)})
        .observe((pos) => onDrag(draggable, pos))
};
const drag = () => (
    {
        create
    }
);

export default drag;
export {create};