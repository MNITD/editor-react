export const recalculatePath = ({width, d}) => {
    const tokens = d.split(' ');
    const max = tokens.reduce((max, item) => {
            if (+item > max) return +item;
            return max;
        },
        0);
    // console.log(width, max);
    let isEven = true;
    const diff =  width - max;
    return tokens.map(token => {
        let comma = '';
        if(token.slice(-1) === ',') comma = ',';
        else if (isNaN(+token)) return token;

        isEven = !isEven;
        if(!isEven && parseFloat(token) > 10)  return (parseFloat(token) + diff) + comma ;
        return token;

    }).reduce((acc, token) => acc + ' ' + token);
};

export const updateShadowRoot = (elem) => {
    if (elem.shadowRoot){
        elem.shadowRoot.querySelector('.overlay').children[0].style.width = '100%';
        const {width} = elem.getBoundingClientRect();
        if(width < 50) return;
        const pathElem = elem.shadowRoot.querySelector('.overlay').children[0].children[0];
        const d = pathElem.getAttribute('d');
        pathElem.setAttribute('d', recalculatePath({width, d}));
    }
};