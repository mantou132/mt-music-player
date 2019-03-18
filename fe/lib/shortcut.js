// https://css-tricks.com/snippets/javascript/javascript-keycodes/
const keyMap = {
  8: 'backspace',
  9: 'tab',
  13: 'enter',
  27: 'esc',
  32: 'space',
  33: 'pageup',
  34: 'pagedown',
  35: 'end',
  36: 'home',
  37: 'left', // arrow
  38: 'up', // arrow
  39: 'right', // arrow
  40: 'down', // arrow
  45: 'insert',
  46: 'delete',
  48: '0',
  49: '1',
  50: '2',
  51: '3',
  52: '4',
  53: '5',
  54: '6',
  55: '7',
  56: '8',
  57: '9',
  96: 'n0',
  97: 'n1',
  98: 'n2',
  99: 'n3',
  100: 'n4',
  101: 'n5',
  102: 'n6',
  103: 'n7',
  104: 'n8',
  105: 'n9',
  65: 'a',
  66: 'b',
  67: 'c',
  68: 'd',
  69: 'e',
  70: 'f',
  71: 'g',
  72: 'h',
  73: 'i',
  74: 'j',
  75: 'k',
  76: 'l',
  77: 'm',
  78: 'n',
  79: 'o',
  80: 'p',
  81: 'q',
  82: 'r',
  83: 's',
  84: 't',
  85: 'u',
  86: 'v',
  87: 'w',
  88: 'x',
  89: 'y',
  90: 'z',
  112: 'f1',
  113: 'f2',
  114: 'f3',
  115: 'f4',
  116: 'f5',
  117: 'f6',
  118: 'f7',
  119: 'f8',
  120: 'f9',
  121: 'f10',
  122: 'f11',
  123: 'f12',
};
/**
 * @param {MouseEvent} event
 */
const generateShortcutWithEvent = event => {
  const { altKey, shiftKey, ctrlKey, metaKey, keyCode } = event;
  const shortcut = [
    altKey && 'alt',
    shiftKey && 'shift',
    ctrlKey && 'ctrl', // macOS 下是否需要自动转 meta ？
    metaKey && 'meta',
    keyMap[keyCode],
  ]
    .filter(e => e)
    .sort()
    .join('+');
  return shortcut;
};

/**
 * 判断一个键盘事件是否符合某些快捷键
 * @param {KeyboardEvent} event
 * @param {string[]} rest 支持的多个快捷键
 * @return {boolean}
 * @example
 * shortcut(e, 'enter', 'space'); // 同时支持 'enter' 和 'space'
 */
export default function(event, ...rest) {
  if (!event) return false;
  const eShortcut = generateShortcutWithEvent(event);
  for (const shortcut of rest) {
    const aShortcut = shortcut
      .split('+')
      .sort()
      .join('+');
    if (eShortcut === aShortcut) {
      // event.stopPropagation(); 不能阻止冒泡，react 将需要他将事件来绑定到元素
      event.preventDefault();
      return true; // 提前结束循环
    }
  }
  return false;
}
