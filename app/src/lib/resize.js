import {fromEvent} from 'most';
import drag from "./drag";

const mouseup = fromEvent('mouseup', document);

const create = (resizable, {onResize, resizeStart, resizeEnd, resizePredicate, resizeReady}) => {
    const mousemove = fromEvent('mousemove', document);
    const mousemoveRezisable = fromEvent('mousemove', resizable);
    const mousedown = fromEvent('mousedown', resizable);

    const filterCursor = ({clientX, clientY}) => {
        const {left, right} = resizable.getBoundingClientRect();
        const offset = 12;
        return (clientX <= left + offset) || (clientX >= right - offset);
    };

    const resizing = mousemoveRezisable
        .filter(resizePredicate)
        .tap(() => {
            resizable.style.cursor = 'initial';
            resizeReady(false);
        })
        .filter(filterCursor)
        .tap(() => {
            resizable.style.cursor = 'ew-resize';
            resizeReady(true);
        })
        .concatMap(() => {
            return mousedown
                .filter(resizePredicate)
                .filter(filterCursor)
                .chain(() => {
                    return mousemove
                        .take(1)
                        .tap(( {clientX, clientY}) => resizeStart(resizable, {x: clientX, y: clientY}))
                        .concat(mousemove.skip(1))
                        .tap(mm => mm.preventDefault()) // prevent text selecting
                        .until(mouseup.tap((pos) => {
                            resizeEnd(resizable, pos)
                        }))
                        // .filter(filterCursor)
                        .scan(({x, y}, {clientX, clientY}) => {
                            const {left, width} = resizable.getBoundingClientRect();
                            const side = clientX <= left + width / 2 ? 'left' : 'right';
                            if (x && clientX < x) return {direction: -1, x: clientX, y: clientY, side};
                            if (x && clientX > x) return {direction: 1, x: clientX, y: clientY, side};
                            return {direction: 0, x: clientX, y: clientY, side}
                        }, {}) //{x: 0, y: 0, direction: 0}
                })

        });

    return resizing
        .subscribe({
            next(pos) {
                console.log(pos);
                onResize(resizable, pos)
            }
        })

};

export {create};