export function mergeObject(obj1, obj2, newObject) {
  const wrap = newObject || obj1;
  const keys = new Set(Object.keys(obj1).concat(Object.keys(obj2)));
  keys.forEach((key) => {
    if (!(key in obj1)) {
      wrap[key] = obj2[key];
    } else if (!(key in obj2)) {
      wrap[key] = obj1[key];
    } else if (obj2[key] && obj2[key].constructor === Object) {
      wrap[key] = mergeObject(obj1[key], obj2[key]);
    } else {
      wrap[key] = obj2[key];
    }
  });

  return wrap;
}

export function toQuerystring(obj) {
  const query = new URLSearchParams();
  const keys = Object.keys(obj);
  keys.forEach((key) => {
    query.append(key, obj[key]);
  });
  return query.toString();
}

export function isEqual(obj, objNext, option = {}) {
  if (!obj || !objNext) {
    if (obj !== objNext) {
      return false;
    }
    return true;
  }
  const ignores = option.ignores || [];
  const keys1 = Object.keys(obj);
  const keys2 = Object.keys(objNext);
  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let i = 0; i < keys1.length; i += 1) {
    const key = keys1[i];
    if (!ignores.includes(key)) {
      if (obj[key] && typeof obj[key] === 'object') {
        if (!isEqual(obj[key], objNext[key], option)) {
          return false;
        }
      } else if (obj[key] !== objNext[key]) {
        return false;
      }
    }
  }
  return true;
}
