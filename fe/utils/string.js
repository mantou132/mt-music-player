export function capitalize(str) {
  return str.replace(/^\w/, match => match.toUpperCase());
}

export function kebabCase(str) {
  return str.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
}

export function htmlClass(obj) {
  return Object.keys(obj).reduce((p, key) => {
    if (!obj[key]) return p;
    return `${p}${p ? ' ' : ''}${kebabCase(key)}`;
  }, '');
}

export function htmlStyle(obj) {
  return Object.keys(obj).reduce((p, key) => {
    return `${p}${kebabCase(key)}: ${obj[key]};`;
  }, '');
}
