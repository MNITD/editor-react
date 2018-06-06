import {fromEvent} from 'most';

const mouseup = fromEvent('mouseup', document);
let resizeInAction = false;

const create = (resizable, {onResize, resizeStart, resizeEnd, resizePredicate, resizeReady}) => {
    const mousemove = fromEvent('mousemove', document);
    const mousemoveRezisable = fromEvent('mousemove', resizable);
    const mousedown = fromEvent('mousedown', resizable);

    const filterCursor = ({clientX}, offset = 12) => {
        const {left, right} = resizable.getBoundingClientRect();
        return (clientX <= left + offset) || (clientX >= right - offset);
    };

    const removeResizeLine = () => {
        if(resizeInAction) return;
        const resizeLine = document.querySelector('.resize-line');
        if (resizeLine) resizeLine.parentNode.removeChild(resizeLine);
    };

    const createResizeLine = (elem, {x}) => {
        if (document.querySelector('.resize-line')) return;
        const elemRect = elem.getBoundingClientRect();
        const resizeLine = document.createElement('div');
        resizeLine.classList.add('resize-line');
        resizeLine.style.height = `${elemRect.height}px`;
        resizeLine.style.top = `${elemRect.top}px`;
        resizeLine.style.left = `${x}px`;
        resizeLine.style.cursor = 'ew-resize';
        document.body.appendChild(resizeLine);
    };

    const resizing = mousemoveRezisable
        .filter(resizePredicate)
        .tap(() => {
            removeResizeLine();
            resizable.style.cursor = 'initial';
            resizeReady(false);
        })
        .filter(filterCursor)
        .tap(({clientX}, offset = 12) => {
            const {left, right} = resizable.getBoundingClientRect();
            if (clientX <= left + offset) createResizeLine(resizable, {x: left});
            if (clientX >= right - offset) createResizeLine(resizable, {x: right});

            // console.log('pos', pos);
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
                        .tap(()=>{ resizeInAction = true; })
                        .tap(({clientX, clientY}) => resizeStart(resizable, {x: clientX, y: clientY}))
                        .concat(mousemove.skip(1))
                        .tap(mm => mm.preventDefault()) // prevent text selecting
                        .until(mouseup.tap((pos) => {
                            resizeInAction = false;
                            resizeEnd(resizable, pos);
                        }))
                        // .filter(filterCursor)
                        .scan(({x, y}, {clientX, clientY}) => {
                            const {left, width} = resizable.getBoundingClientRect();
                            const side = clientX <= left + width / 2 ? 'left' : 'right';
                            if (x && clientX < x) return {direction: -1, x: clientX, y: clientY, side};
                            if (x && clientX > x) return {direction: 1, x: clientX, y: clientY, side};
                            return {direction: 0, x: clientX, y: clientY, side};
                        }, {}); //{x: 0, y: 0, direction: 0}
                });

        });

    return resizing
        .subscribe({
            next(pos) {
                console.log(pos);
                onResize(resizable, pos);
            },
        });

};

export {create};