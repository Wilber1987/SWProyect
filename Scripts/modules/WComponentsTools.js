function DisplayAcordeon(value, SectionId, size = null) {
    console.log(value)
    if (size == null) {
      size = "500px";
    }
    // var ventanaM = document.getElementById(idModal);
    var acc = document.getElementsByClassName("GroupFormAcordeon");
    for (var i = 0; i < acc.length; i++) {
      ventanaM = acc[i];  
      if (ventanaM.id != SectionId) {
        //  if (ventanaM.style.height != "300px") {
        ventanaM.style.transition = "all ease 1s";
        ventanaM.style.height = "0px";
        //ventanaM.style.overflow = "scroll";
      } else {
        ventanaM.style.transition = "all ease 1s";
        ventanaM.style.height = size;
        //ventanaM.style.oveflow = "hidden";
      }
    }
  }