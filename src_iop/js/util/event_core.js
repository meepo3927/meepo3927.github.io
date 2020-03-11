
const logicTextMap = {
    and: '&&',
    or: '||'
};
const getLogicText = (t) => {
    return logicTextMap[t] || logicTextMap.and;
};
exports.getLogicText = getLogicText;
let getRelationOption = () => {
    return {
        left: false,
        right: false,
        logic: 'and',
        view: {
            left: '',
            right: ''
        }
    };
};
exports.getRelationOption = getRelationOption;
exports.getDefaultRule = () => {
    return {
        relation: getRelationOption(),
        config: {
            atomId: '',
            calcPrincId: '',
            princArg: []
        }
    };
};
exports.highlightQuotes = (list) => {
    var level = 1;
    var leftCount = 1;
    var arr = [];
    list.forEach((r, index) => {
        // let r = rule.relation;
        if (r.right) {
            level--;
            r.view.right = 'count-' + (arr.pop() || 0);
        } else {
            r.view.right = '';
        }
        // 先右, 再处理左
        if (r.left) {
            level++;
            r.view.left = 'count-' + leftCount;
            // 左括号 入栈
            arr.push(leftCount++);
        } else {
            r.view.left = '';
        }
    });
    return arr;
};

exports.getFormula = (list, nameFunc, lastRelation) => {
    let f = '';
    let hasQuote = true;
    if (list.length <= 2) {
        hasQuote = false;
    }
    list.forEach((relation, i) => {
        if (hasQuote && relation.right) {
            f += ')';
        }
        if (i > 0) {
            f += getLogicText(relation.logic);
        }

        if (hasQuote && relation.left) {
            f += '(';
        }

        f += nameFunc(i);
    });

    if (hasQuote && lastRelation.right) {
        f += ')';
    }

    return f;
};
const LETTER_REG = /^[a-zA-Z]+$/;
const NUMBER_REG = /^[0-9]+$/;
const logicCharMap = {
    '|': 'or',
    '&': 'and'
};
let isLogicChar = (c) => {
    for (let i in logicCharMap) {
        if (i === c) {
            return true;
        }
    }
    return false;
};
let isQuoteChar = (c) => {
    return (c === '(') || (c === ')');
};
let getQuoteBool = (c) => {
    let o = {};
    if (c === '(') {
        o.left = true;
    } else if (c === ')') {
        o.right = true;
    }
    return o;
};
exports.parseFormula = (formula) => {
    let map = {};
    if (!formula) {
        return map;
    }
    let len = formula.length;
    for (let i = 0; i < len; i++) {
        let c = formula.charAt(i);

        // 字母
        if (LETTER_REG.test(c)) {
            let evtId = c;
            let prevIndex = i - 1;
            let j = i + 1;
            while (NUMBER_REG.test(formula.charAt(j))) {
                evtId += formula.charAt(j);
                j++;
                i++;
            }
            let relation = {};
            while(prevIndex >= 0) {
                let prevChar = formula.charAt(prevIndex);
                if (NUMBER_REG.test(prevChar) || LETTER_REG.test(prevChar)) {
                    break;
                }
                if (prevChar === '(') {
                    relation.left = true;
                } else if (prevChar === ')') {
                    relation.right = true;
                } else if (isLogicChar(prevChar)) {
                    relation.logic = logicCharMap[prevChar];
                }
                prevIndex--;
            }

            map[evtId] = relation;
        }
    }

    if (formula.charAt(len - 1) === ')') {
        map.lastRight = true;
    }
    return map;
};

exports.checkBracket = (formula) => {
    if (!formula) {
        return true;
    }
    let left = 0;
    let right = 0;
    for (let i = 0 ; i < formula.length; i++) {
        let c = formula[i];
        if (c === '(') left++;
        if (c === ')') right++;
        if (right > left) {
            return false;
        }

    }
    if (left === right) {
        return true;
    }
    return false;
};
