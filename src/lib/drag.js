/**
 * Created by bogdan on 28.03.18.
 */
import {fromEvent} from 'most';

const mouseup = fromEvent('mouseup', document);
const mousemove = fromEvent('mousemove', document);

const create = (draggable, {onDrag, dragStart, dragEnd, dragPredicate}) => {
    const mousedown = fromEvent('mousedown', draggable);

    const moveDraggable = (elem, {left, top}) => {
        const translate = /translate.*?\)/g;
        const newTranslate =  `translate(${left}px, ${top}px)`;
        const oldTransform = elem.style.transform;
        elem.style.transform = oldTransform.indexOf('translate') !== -1 ?
            oldTransform.replace(translate, newTranslate): ''+newTranslate;
    };

    const dragging = mousedown
        .filter(dragPredicate)
        .map(({clientX, clientY}) => [clientX, clientY])
        .chain(([startX, startY]) => {
            const startLeft = parseInt(draggable.style.left, 10) || 0;
            const startTop = parseInt(draggable.style.top, 10) || 0;

            const mappingmove = mousemove
                .take(1)
                .tap((event)=>dragStart(draggable, event))
                .concat(mousemove.skip(1))
                .tap(mm => mm.preventDefault()) // prevent text selecting
                .map(({clientX, clientY}) => ({
                        left: startLeft + clientX - startX,
                        top: startTop + clientY - startY
                    })
                );
            const mouseupLast = mouseup
                .map(({clientX, clientY}) => [clientX, clientY])
                .map(([endX, endY]) => (startX - endX + startY - endY) !== 0 ? dragEnd(draggable): '');

            return mappingmove.until(mouseupLast);
        });

    return dragging
        .tap(pos => {moveDraggable(draggable, pos)})
        .subscribe({
            next(pos) {onDrag(draggable, pos)}
        })
};
const drag = () => (
    {
        create
    }
);

export default drag;
export {create};