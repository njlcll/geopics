import { ref } from "vue";
import { projectStorage } from "../firebase/config";

const useStorage = (project) => {
  const storageError = ref(false);
  const url = ref(null);

  const upLoadImage = async (file) => {
    try {
      if (!project) {
        throw new UserException("No project specified");
      }
      const filePath = `test/${project}/${Date.now()}`;

      console.log(filePath);
      const storageRef = projectStorage.ref(filePath);
      storageError.value = false;

      try {
        const res = await storageRef.put(file);
        url.value = await res.ref.getDownloadURL();
      } catch (err) {
        console.log(err.message);
        storageError.value = err.message;
      }
    } catch (e) {
      console.log(e.message)
    }
  };

  return { url, storageError, upLoadImage };
};

export default useStorage;
