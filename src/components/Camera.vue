<template>
  <div class="constrain-more">
    <div class="camera-frame">
      <video
        v-show="!imageCaptured"
        ref="myVideo"
        class="full-width"
        autoplay
      />
      <canvas
        v-show="imageCaptured"
        ref="canvas"
        class="full-width"
        height="240"
      />
    </div>
    <div class="text-center">
      <button v-if="hasCameraSupport" @click="captureImage" size="lg" round>
        {{ camera_caption }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { onMounted, onBeforeUnmount } from "vue";

export default {
  setup(props, context) {
    const camera_caption = ref("Take Photo");
    const post = {
      id: 1,
      caption: "",
      location: "",
      photo: null,
      date: Date.now(),
    };
    const imageCaptured = ref(false);
    //const imageUpload = [];
    const hasCameraSupport = ref(true);
    const myVideo = ref(null);
    const canvas = ref(null);

    

    const initCamera = () => {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
        })
        .then((stream) => {
          myVideo.value.srcObject = stream;
        })
        .catch((error) => {
          hasCameraSupport.value = false;
          console.log("no camera support");
        });
    };
    const captureImage = () => {

      let upload = imageCaptured.value

      if (imageCaptured.value) {
        initCamera();

        imageCaptured.value = false;
        camera_caption.value = "take pricture";
        upload = imageCaptured.value
      } else {
        camera_caption.value = "reset";
        let video = myVideo.value;
        let myCanvas = canvas.value;
        myCanvas.width = video.getBoundingClientRect().width;
        myCanvas.height = video.getBoundingClientRect().height;
        let context = myCanvas.getContext("2d");
        context.drawImage(video, 0, 0, myCanvas.width, myCanvas.height);
        imageCaptured.value = true;
        post.photo = dataURItoBlob(myCanvas.toDataURL());
        upload = imageCaptured.value
        disableCamera();
        // upload();
      }
      if(upload){
        context.emit("photoClick", post.photo);
        //console.log('emitting photoClick')
      }
    };

    // const upload = async () => {
    //   console.log(post.photo);
    //   await upLoadImage(post.photo);
    //   console.log("image uploaded ", url.value, error.value);
    // };

    // const captureImageFallback = (file) => {
    //   post.photo = file;

    //   let canvas = $refs.canvas;
    //   let context = canvas.getContext("2d");

    //   var reader = new FileReader();
    //   reader.onload = (event) => {
    //     var img = new Image();
    //     img.onload = () => {
    //       canvas.width = img.width;
    //       canvas.height = img.height;
    //       context.drawImage(img, 0, 0);
    //       imageCaptured.value = true;
    //     };
    //     img.src = event.target.result;
    //   };
    //   console.log("file", file);
    //   reader.readAsDataURL(file);
    // };

    const disableCamera = () => {
      myVideo.value.srcObject.getVideoTracks().forEach((track) => {
        track.stop();
      });
    };
    const dataURItoBlob = (dataURI) => {
      // convert base64 to raw binary data held in a string
      // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
      var byteString = atob(dataURI.split(",")[1]);

      // separate out the mime component
      var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

      // write the bytes of the string to an ArrayBuffer
      var ab = new ArrayBuffer(byteString.length);

      // create a view into the buffer
      var ia = new Uint8Array(ab);

      // set the bytes of the buffer to the correct values
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      // write the ArrayBuffer to a blob, and you're done
      var blob = new Blob([ab], { type: mimeString });
      return blob;
    };

    onMounted(() => {
      initCamera();
      // navigator.geolocation.getCurrentPosition((position) => {
      //   this.post.location = position.coords.latitude;
      //   console.log(position.coords.latitude);
      // }),
      //   (err) => {
      //     console.log(err), { timeout: 7000 };
      //   };
    }),
      onBeforeUnmount(() => {
        if (hasCameraSupport.value) {
          disableCamera();
        }
      });

    return {
      camera_caption,
      imageCaptured,
      hasCameraSupport,
      captureImage,
      myVideo,
      canvas,
    };
  },
  methods: {},
};
</script>

<style>
.camera-frame {
  border: 2px solid;
  border-radius: 10px;
}
.constrain {
  max-width: 975px;
  margin: 0 auto;
}

.constrain-more {
  max-width: 600px;
  margin: 0 auto;
}
</style>