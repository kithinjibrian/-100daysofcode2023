export default function loadImage(e) {
    return new Promise((resolve, reject) => {
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = (event) => {
          var image = new Image();
          image.onload = () => {
            resolve(image);
          };
          image.onerror = (error) => {
            reject(error);
          };
          image.src = event.target.result;
        };
        reader.readAsDataURL(file);
      });
  }
  