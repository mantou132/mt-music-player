// 便于 vscode 高亮
export const html = (str) => {
  const tempEle = document.createElement('template');
  tempEle.innerHTML = str;
  return tempEle;
};

export const placeholder = 1;
