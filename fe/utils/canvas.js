import { randomRGBColor, luminance, hslToRGB } from './color.js';

export function createCanvas(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export function transformTextToSVG(text) {
  const range = [[0, 1], [0.2, 0.7], [0.3, 0.6]];
  const backgroundHSL = randomRGBColor().map((e, i) => {
    const total = e / 255;
    return range[i][0] + total * (range[i][1] - range[i][0]);
  });
  const backgroundRGB = hslToRGB(...backgroundHSL);
  const background = `rgb(${backgroundRGB.join(',')})`;
  const color = luminance(...backgroundRGB) < 0.2 ? '#ffffff44' : '#00000044';
  const getTranslate = () => Math.random() / 5;
  const getRotate = () => (Math.random() - 0.5) * 45;

  const strs = [...String(text)].map(
    char => `<text
      x="50%"
      y="50%"
      dominant-baseline="middle"
      text-anchor="middle"
      transform="translate(${getTranslate()}, ${getTranslate()}) rotate(${getRotate()})"
    >${char}</text>`,
  );
  return `data:image/svg+xml,${encodeURIComponent(`<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1">
      <style>
        :root {
          background: ${background};
          fill: ${color};
          font: 1px sans-serif;
        }
      </style>
      ${strs.join('')}
    </svg>`)}`;
}

export async function transformSVGDataURLToBitmap(
  dataUrl,
  { width = 512, height = 512 } = {},
) {
  const img = new Image();
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  img.src = dataUrl;
  await new Promise(resolve => {
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      resolve();
    };
  });
  return canvas.toDataURL();
}

export const blobToDataURL = blob => {
  const reader = new FileReader();
  return new Promise(resolve => {
    reader.addEventListener(
      'load',
      () => {
        resolve(reader.result);
      },
      false,
    );

    reader.readAsDataURL(blob);
  });
};

export const compressionImg = async (
  { img = new Image(), file },
  limit,
  option,
) => {
  const canvas = document.createElement('canvas');
  try {
    if (!img.naturalWidth) {
      img.src = await blobToDataURL(file);
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
    }
    const rate = Math.min(
      limit.filesize ? Math.sqrt(limit.filesize / file.size) : 1,
      limit.size ? limit.size.width / img.naturalWidth : 1,
      limit.size ? limit.size.height / img.naturalHeight : 1,
    );
    if (rate >= 1) return Promise.resolve(file);
    canvas.width = img.naturalWidth * rate;
    canvas.height = img.naturalHeight * rate;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    if (option && option.output === 'dataUrl')
      return Promise.resolve(canvas.toDataURL());
    return new Promise(resolve =>
      canvas.toBlob(blob => {
        resolve(
          new File([blob], file.name, {
            type: blob.type,
          }),
        );
      }, file.type),
    );
  } catch (err) {
    throw new Error('compressionImg error');
  }
};
