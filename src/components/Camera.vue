<template>
  <div class="constrain-more">
   
    <div class="camera-frame">
      <video v-show="!imageCaptured" ref="video" class="full-width" autoplay />
      <canvas
        v-show="imageCaptured"
        ref="canvas"
        class="full-width"
        height="240"
      />
    </div>
    <div class="text-center">
      <button v-if="hasCameraSupport" @click="captureImage" size="lg" round>
        {{camera_caption}}
      </button>

     
    </div>
  </div>
</template>

<script>
export default {
 data() {
    return {
      
      camera_caption : "Take Photo",
      post: {
        id: 1,
        caption: "",
        location: "",
        photo: null,
        date: Date.now(),
      },
      imageCaptured: false,
      imageUpload: [],
      hasCameraSupport: true,
    };
  },
  methods: {
    
    initCamera() {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
        })
        .then((stream) => {
          this.$refs.video.srcObject = stream;
        })
        .catch((error) => {
          this.hasCameraSupport = false;
          console.log("no camera support");
        });
    },
    captureImage() {
      if (this.imageCaptured) {
           this.initCamera();
            this.imageCaptured = false;
            this.camera_caption = "take pricture"
      } else {
         this.camera_caption = "reset"
        let video = this.$refs.video;
        let canvas = this.$refs.canvas;
        canvas.width = video.getBoundingClientRect().width;
        canvas.height = video.getBoundingClientRect().height;
        let context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        this.imageCaptured = true;
        this.post.photo = this.dataURItoBlob(canvas.toDataURL());
        this.disableCamera();
      }
    },
    captureImageFallback(file) {
      this.post.photo = file;

      let canvas = this.$refs.canvas;
      let context = canvas.getContext("2d");

      var reader = new FileReader();
      reader.onload = (event) => {
        var img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);
          this.imageCaptured = true;
        };
        img.src = event.target.result;
      };
      console.log("file", file);
      reader.readAsDataURL(file);
    },
    disableCamera() {
      this.$refs.video.srcObject.getVideoTracks().forEach((track) => {
        track.stop();
      });
    },
    dataURItoBlob(dataURI) {
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
    },
  },
  mounted() {
    this.initCamera();
    // navigator.geolocation.getCurrentPosition((position) => {
    //   this.post.location = position.coords.latitude;
    //   console.log(position.coords.latitude);
    // }),
    //   (err) => {
    //     console.log(err), { timeout: 7000 };
    //   };
  },
  beforeDestroy() {
    if (this.hasCameraSupport) {
      this.disableCamera();
    }
  },
}
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