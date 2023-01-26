const formatNum = (_num: number): number | string =>
    _num < 10 ? `0${_num}` : _num;



export {
    formatNum
}
