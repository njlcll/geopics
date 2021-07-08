import { ref } from "vue";
import { projectAuth } from "../firebase/config";

const error = ref(null);
const signup = async (email, password, displayName) => {
  error.value = null;
  try {
    const res = await projectAuth.createUserWithEmailAndPassword(email, password);
    if (!res) {
      throw new Error("Sign up not successful");
    } else {
      //  console.log(res.user)
      res.updateProfile({ displayName: displayName });
      error.value = null;
      console.log("user signed up");
      return res;
    }
  } catch (err) {
    error.value = err.message;
    console.log(error.value);
  }
};

const useSignup = () => {
  return { error, signup };
};

export default useSignup;
