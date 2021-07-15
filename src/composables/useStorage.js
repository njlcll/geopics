import { ref } from "vue";
import { projectStorage } from "../firebase/config";
const useStorage = () => {
  const storageError = ref(false);
  const url = ref(null);
  const filePath = ref(null);

  const upLoadImage = async (file) => {
    filePath.value = `test/fn/${Date.now()}`;
    const storageRef = projectStorage.ref(filePath.value);
    storageError.value = false

    try {
      const res = await storageRef.put(file);
      url.value = await res.ref.getDownloadURL();
      
    } catch (err) {
      console.log(err.message);
      storageError.value = err.message;
    }
  };

  return { url, storageError, upLoadImage };
};

export default useStorage;
