import { ref } from "vue";
import { projectStorage } from "../firebase/config";


const useStorage = (project) => {
  const storageError = ref(false);
  const url = ref(null);
 

  
  const upLoadImage = async (file) => {

    
    const filePath = `test/${project}/${Date.now()}`;

    console.log(filePath)
    const storageRef = projectStorage.ref(filePath);
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
