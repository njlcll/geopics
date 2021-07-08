import { ref } from "vue";
import { projectAuth } from "../firebase/config";

const error = ref(null);
const login = async (email, password) => {
  error.value = null;
  try {
    const res = await projectAuth.signInWithEmailAndPassword(email, password);
    if (!res) {
      throw new Error("Sign up not successful");
    } else {
      //  console.log(res.user)
      
      error.value = null;
      console.log("user logged in");
      return res;
    }
  } catch (err) {
    error.value = err.message;
    console.log(error.value);
  }
};

const useLogin= () => {
  return { error, login };
};

export default useLogin;