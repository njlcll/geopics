

const setproject = (group) => {
  localStorage.setItem("group", group);
}

const getProject = () => {
    let group = localStorage.getItem("group");  
    if (!group) {
      group = "Demo";
      setproject(group) ;
    }
    return group;
  };

  export {setproject, getProject }
