import { ref, setBlockTracking } from "vue";



const setproject = (project) => {
  
  localStorage.setItem("group",project)
};

const getProject = () => {
  console.log("gettinf local");

  let project = localStorage.getItem("group");
  console.log(project, "p")

  if (!project) {   
    project = "Demo";
  }

  setproject(project);
  return project
};

export { setproject, getProject };
