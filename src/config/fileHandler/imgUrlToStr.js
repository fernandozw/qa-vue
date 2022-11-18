const getBase64Image = img => {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, img.width, img.height);
  let ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase();
  if (ext === 'jpg') {
    ext = 'jpeg'; // 这个地方是由于如果是jpg, 他会识别成image/png
  }
  const dataURL = canvas.toDataURL('image/' + ext);
  return dataURL;
};
export const imageToBase64 = imgUrl => {
  // 使用promise.resolve返回image.onload处理结果
  return new Promise(resolve => {
    const image = new Image();
    image.setAttribute('crossOrigin', 'anonymous'); // 解决跨域问题
    image.src = imgUrl;
    image.onload = function() {
      resolve(getBase64Image(image));
    };
  });
};
