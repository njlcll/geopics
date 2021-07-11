import { ref } from "vue";
import { projectStorage } from "../firebase/config";
const useStorage = () => {
  const error = ref(null);
  const url = ref(null);
  const filePath = ref(null);

  const upLoadImage = async (file) => {
    filePath.value = `test/fn/${Date.now()}`;
    const storageRef = projectStorage.ref(filePath.value);

    try {
      const res = await storageRef.put(file);
      url.value = await res.ref.getDownloadURL();
    } catch (err) {
      console.log(err.message);
      error.value = err.message;
    }
  };

  return { url, error, upLoadImage };
};

export default useStorage;
