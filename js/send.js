let tired = false;
var audio = new Audio('alarm.mp3');

function getBase64Image(img) {

  var canvas = document.getElementById("canvas");
  canvas.width = img.videoWidth/4;
  canvas.height = img.videoHeight/4;

  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, img.videoWidth, img.videoHeight, 0, 0, canvas.width, canvas.height);

  var dataURL = canvas.toDataURL("image/png");

  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

var image;

// video.addEventListener('timeupdate', updateFrame, false);
setInterval(updateFrame, 100);

function updateFrame() {

image = document.getElementById('videoInput');

var photo = getBase64Image(image);

fetch( 'http://localhost:8080/api/upload', {

      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({
        photo: photo
      })
})
.then((response) => response.json())
.then((responseJson) => {
})
.catch((error) => {
  console.log(error)
  postSubmit(["Oops, something Went Wrong."]);
});

fetch( 'http://localhost:8080/getStatus', {

    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({
      asdf: "asdf"
    })
})
.then((response) => response.json())
.then((responseJson) => {
tired = responseJson.status;
})
.catch((error) => {
console.log(error)
postSubmit(["Oops, something Went Wrong."]);
});

if (tired === true) {
audio.play();
} else {
audio.pause();
audio.currentTime = 0;
}

}
