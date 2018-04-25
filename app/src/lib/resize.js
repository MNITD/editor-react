import {fromEvent} from 'most';
import drag from "./drag";

const mouseup = fromEvent('mouseup', document);

const create = (resizable, {onResize, resizeStart, resizeEnd, resizePredicate, ready}) => {
    const mousemove = fromEvent('mousemove', resizable);
    const mousedown = fromEvent('mousedown', resizable);

    const filterCursor = ({clientX, clientY}) => {
        const {left, right} = resizable.getBoundingClientRect();
        const offset = 12;
        return (clientX <= left + offset) || (clientX >= right - offset);
    };

    const resizing = mousemove
        // .takeWhile(resizePredicate)
        .filter(resizePredicate)
        .tap(() => {
            resizable.style.cursor = 'initial';
            ready(false);
        })
        .filter(filterCursor)
        .tap(() => {
            resizable.style.cursor = 'ew-resize';
            ready(true);
        })
        .concatMap(() => {
            return mousedown
                .filter(filterCursor)
                .takeWhile(resizePredicate)
                .chain(() => {
                    return mousemove
                        .take(1)
                        .tap((pos) => resizeStart(resizable, pos))
                        .concat(mousemove.skip(1))
                        .tap(mm => mm.preventDefault()) // prevent text selecting
                        .until(mouseup.tap((pos) => {
                            resizeEnd(resizable, pos)
                        }));
                });
        });

    return resizing
        .subscribe({
            next(pos) {
                onResize(resizable, pos)
            }
        })

};

export {create};