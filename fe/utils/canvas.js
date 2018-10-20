import { randomColor, luminance } from './color.js';

// TODO: use svg dataURL
export function transformTextToImage(text, { width = 512, height = 512 } = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const background = randomColor();
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = `rgb(${background.join(',')})`;
  ctx.fillRect(0, 0, width, height);

  ctx.textBaseline = 'middle';

  ctx.font = `${height}px sans-serif`;
  ctx.fillStyle = luminance(...background) < 0.4 ? '#ffffff55' : '#00000055';

  [...String(text)].forEach((char) => {
    ctx.save();
    const textMetrics = ctx.measureText(char);
    const transform = {
      rotate: (Math.random() - 0.5) * 45,
      x: width / 2 + textMetrics.width,
      y: height / 2,
    };
    const {
      a, b, c, d, e, f,
    } = new DOMMatrix(
      `rotate(${transform.rotate}deg) translate(${transform.x}px, ${transform.y}px)`,
    );
    ctx.transform(a, b, c, d, e, f);
    ctx.fillText(char, (width - textMetrics.width) / 2 - transform.x, height / 2 - transform.y);
    ctx.restore();
  });

  return canvas.toDataURL();
}

export const a = 1;
