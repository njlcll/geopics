import { ref } from "vue";
import { projectStorage } from "../firebase/config";
const useStorage = () => {
  const error = ref(null);
  const url = ref(null);
  const filePath = ref(null);

  const upLoadImage = async (file) => {
    filePath = `test/fn/`;
    const storageRef = projectStorage.ref(filePath.value);

    try {
        const res = await storageRef.put(file)
        file.value = res.ref.getDownloadURL()
    } catch (err) {
        console.log(err.message)
        error.value = err.message
    }
  };

  return { url, filePath, error, upLoadImage };
};

export default useStorage;
