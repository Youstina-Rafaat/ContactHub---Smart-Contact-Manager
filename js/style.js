var fullNameInput=document.getElementById("fn")
var PhoneInput=document.getElementById("number")
var emailInput=document.getElementById("email")
var addressInput=document.getElementById("address")
var groupInput=document.getElementById("group")
var notesInput=document.getElementById("messageText")
var favoriteInput=document.getElementById("checkDefault")
var emergencyInput=document.getElementById("checkChecked")
var imageInput=document.getElementById("person-image")
var searchInput=document.getElementById("searchInput")
var favoriteCount =0
var emergencyCount =0
var newImage=document.getElementById("previewImage")
var userName=document.getElementById("user-name")
var userIcon=document.getElementById("user")
var btnSave=document.getElementById("saveBtn")
var btnSend=document.getElementById("sendBtn")
var details=[]
function closeModal(){
  const myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('messageModal'));
  myModal.hide();
  clear()
  btnSave.classList.add("d-none")
  btnSend.classList.remove("d-none")
}
if(localStorage.getItem("details")){
    details=JSON.parse(localStorage.getItem("details"))
}
displayPerson()
function addPerson(){
      var repeatNumber=false
    for (var i=0;i<details.length;i++){
      if(details[i].phone==PhoneInput.value){
        repeatNumber=true
      }
    }
  if(validName()&&validNumber()&&validEmail()&&!repeatNumber){
    var newPerson={
        image:imageInput.files[0]?`./images/${imageInput.files[0].name}`:null,
        currentColor:imageInput.files[0]?null:color(),
        name:fullNameInput.value ,
        phone:PhoneInput.value ,
        email:emailInput.value ,
        address:addressInput.value ,
        group:groupInput.value ,
        notes:notesInput.value ,
        favorite:favoriteInput.checked ,
        emergency:emergencyInput.checked
    }
    details.push(newPerson)
    clear()
    closeModal()
    displayPerson()
    localStorage.setItem("details",JSON.stringify(details))
    displayEmergency()
    displayFavorite()
    Swal.fire({
  title: "Added!",
   text: "Contact has been added successfully.",
  icon: "success",
  draggable: true,
  showConfirmButton: false,
  timer: 1500
});
    count()
  }else {
    if(!validName()){
      Swal.fire({
  icon: "error",
  title: "Missing Name",
  text: "Please enter a name for the contact!",
});
  }else if(!validNumber()||repeatNumber){
      Swal.fire({
  icon: "error",
  title: "Invalid Phone",
  text: "Please enter a valid Egyptian phone number (e.g., 01012345678 or +201012345678)",
});
  }else if(!validEmail()){
      Swal.fire({
  icon: "error",
  title: "Invalid Email",
  text: "Please enter a valid email address",
});
  }
}
}
function displayPerson(){
  var textSearch=searchInput.value
  var box=""
  for(var i=0;i<details.length;i++){
    if(details[i].name.toLowerCase().trim().includes(textSearch.toLowerCase().trim())||details[i].phone.trim().includes(textSearch.trim())||details[i].email.toLowerCase().trim().includes(textSearch.toLowerCase().trim())){

        var groupName=""
        if(details[i].group=="1"){ groupName="family" }
        else if(details[i].group=="2"){ groupName="friends" }
        else if(details[i].group=="3"){ groupName="work" }
        else if(details[i].group=="4"){ groupName="school" }
        else if(details[i].group=="5"){ groupName="other" }
        var emailPerson=""
        if(details[i].email){
          emailPerson=details[i].email
        }
        var addressPerson=""
          if(details[i].address){
          addressPerson=details[i].address
        }
        box+=`
                  <div class="col-12 col-md-6">
              <div class="card rounded-4">
                <div class="card-top bg-white rounded-4">
                <div class="d-flex">
                  <div class="image position-relative">
                    ${details[i].image 
                      ? `<img src="${details[i].image}" alt="${details[i].name}" class="w-100">` 
                      : `<div class="d-flex justify-content-center align-items-center text-white color" style="background-image:${details[i].currentColor}">${personName(details[i].name)}</div>`
                    }
                    ${details[i].favorite?`
                      <span class="fav-label position-absolute d-inline-flex justify-content-center align-items-center rounded-circle text-white"><i class="fa-solid fa-star"></i></span>`:""}
                    ${details[i].emergency?`
                      <span class="emergency-label position-absolute d-inline-flex justify-content-center align-items-center rounded-circle text-white"> <i class="fa-solid fa-heart-pulse"></i> </span>`:""}
                  </div>
                  <div>
                    <h3>${details[i].name}<h3>
                    <div class="d-flex gap-2">
                      <div class="icon-phone rounded-3 d-flex justify-content-center align-items-center">
                        <i class="fa-solid fa-phone "></i>
                      </div>
                      <div>
                        <p class="phone-number">${details[i].phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
                ${emailPerson ?`
                <div class="d-flex">
                  <div class="icon icon-envelope rounded-3 d-flex justify-content-center align-items-center">
                    <i class="fa-solid fa-envelope "></i>
                  </div>
                  <div>
                     <p class="info">${details[i].email}</p> 
                  </div>
                </div>`: ""}
                ${addressPerson ? `
                <div class="d-flex ">
                  <div class="icon icon-location rounded-3 d-flex justify-content-center align-items-center">
                    <i class="fa-solid fa-location-dot"></i>
                  </div>
                  <div>
                    <p class="info">${details[i].address}</p>
                  </div>
                </div>` : ""}
                <div class="labels">
                  ${groupName ? `<span class="px-2 py-1 rounded-2 label-${groupName} text-capitalize">${groupName}</span>` : ""}
                  <span class="px-2 py-1 rounded-2 label-emergency text-capitalize"><i class="fa-solid fa-heart-pulse me-1"></i>Emergency</span>
                </div>

</div>
<div class="d-flex card-bottom rounded-bottom-4">
                  <div>
                    <a href="tel:${details[i].phone}" onclick="showLabel()" class="d-inline-flex justify-content-center align-items-center icon-card-phone rounded-3">
                      <i class="fa-solid fa-phone"></i>
                    </a>
                    ${details[i].email ?
                      `<a href="mailto:${details[i].email}" class="d-inline-flex justify-content-center align-items-center icon-card-email rounded-3">
                      <i class="fa-solid fa-envelope"></i>
                    </a>`:""}
                  </div>
                  <div class="ms-auto">
                    <button class="btn rounded-3 px-0 border-0 ${details[i].favorite ? "btn-star-fav":"  btn-fav"} " onclick="favorite(${i})">
                      <i class="fa-regular fa-star ${details[i].favorite ? "d-none" : "fav-star d-block"}" ></i>
                      <i class="fa-solid fa-star ${details[i].favorite ? "fav-icon d-block" : "d-none"}" ></i>
                    </button>
                    <button class="btn rounded-3 px-0 border-0 ${details[i].emergency ? "btn-heart-emergency":" btn-emergency"} " onclick="emergency(${i})">
                      <i class="fa-regular fa-heart ${details[i].emergency ? "d-none" : "d-block "}" ></i>
                      <i class="fa-solid fa-heart-pulse  ${details[i].emergency ? "d-block" : "d-none"}" ></i>
                    </button>
                    <button class="btn rounded-3 btn-update px-0 border-0" type="button" class="btn btn-update rounded-4" data-bs-toggle="modal" onclick="update(${i})"  data-bs-target="#messageModal">
                      <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn rounded-3 btn-delete px-0 mx-0 border-0" onclick="deleteAlert(${i})">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
        `
    }
  }

  if(box == ""){
    box = `
            <div class="col-12 d-flex flex-column justify-content-center align-items-center py-5 my-5 px-0">
              <div class="icon-no-contant d-flex justify-content-center align-items-center rounded-4 mb-3">
                <i class="fa-solid fa-address-book d-flex justify-content-center align-items-center"></i>
              </div>
              <div class="text-center" >
                <p class="no-contant mb-1">No contacts found</p>
                <p class="get-start m-0">Click "Add Contact" to get started</p>
              </div>
            </div>
    `
  }

  document.getElementById("data").innerHTML=box
}
function image(){
  if(imageInput.files[0]){
    newImage.src =`./images/${imageInput.files[0].name}`
    newImage.classList.remove("d-none")
    userIcon.classList.add("d-none")
  }
}
function color(){
var starColor=["oklch(64.5% .246 16.439)","oklch(71.5% .143 215.221)","oklch(66.7% .295 322.15)","oklch(76.9% .188 70.08)","oklch(60.6% .25 292.717)","oklch(62.3% .214 259.815)"]
var endColor=["oklch(59.2% .249 .584)","oklch(54.6% .245 262.881)","oklch(59.2% .249 .584)","oklch(64.6% .222 41.116)","oklch(55.8% .288 302.321)","oklch(54.6% .245 262.881)"]
var index=Math.floor(Math.random()*starColor.length)
var firstColor=starColor[index]
var secondColor=endColor[index]
return `linear-gradient(to bottom right,${firstColor},${secondColor});`
}
function clear(){
    addressInput.value=""
    emailInput.value=""
    emergencyInput.checked=""
    favoriteInput.checked=""
    groupInput.value=""
    fullNameInput.value=""
    notesInput.value=""
    PhoneInput.value=""
    imageInput.value=""
    newImage.src =""
   newImage.classList.add("d-none")
    userIcon.classList.remove("d-none")
    userName.classList.add("d-none")
}
function personName(name){
  var nameParts = name.trim().split(" ")
  var firstCharacter = nameParts[0].charAt(0).toUpperCase()
  if(nameParts[1]){
    firstCharacter += nameParts[1].charAt(0).toUpperCase()
  }
  return firstCharacter
}
var saveIndex=0
function update(updateIndex){
    saveIndex=updateIndex
    var person=details[updateIndex]
    addressInput.value=person.address
    emailInput.value=person.email
    emergencyInput.checked=person.emergency
    favoriteInput.checked=person.favorite
    groupInput.value=person.group
    fullNameInput.value=person.name
    notesInput.value=person.notes
    PhoneInput.value=person.phone

    if(person.image){
      newImage.src=person.image
      newImage.classList.remove("d-none")
      userIcon.classList.add("d-none")
      userName.classList.add("d-none")
    }else{
      userName.innerHTML = personName(person.name)
      userName.classList.remove("d-none")
      userIcon.classList.add("d-none")
      newImage.classList.add("d-none")
    }

    btnSave.classList.remove("d-none")
    btnSend.classList.add("d-none")
}
function save(){
    var newPerson={
        image: imageInput.files[0] ? `./images/${imageInput.files[0].name}` : details[saveIndex].image,
        currentColor: imageInput.files[0] ? null : details[saveIndex].currentColor,
        name:fullNameInput.value ,
        phone:PhoneInput.value ,
        email:emailInput.value ,
        address:addressInput.value ,
        group:groupInput.value ,
        notes:notesInput.value ,
        favorite:favoriteInput.checked ,
        emergency:emergencyInput.checked
    }

    details.splice(saveIndex,1,newPerson)
    clear()
    closeModal()
    displayPerson()
    localStorage.setItem("details",JSON.stringify(details))
    displayFavorite()
    displayEmergency()
    btnSave.classList.add("d-none")
    btnSend.classList.remove("d-none")

    Swal.fire({
      title: "Update!",
      text: "Contact has been updated successfully.",
      icon: "success",
      draggable: true,
      showConfirmButton: false,
      timer: 1500
    });
}
function deleteAlert(index){
  Swal.fire({
  title: "Delete Contact",
  text: "Are you sure you want to delete Gloria Skinner? This action cannot be undone.",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#d33",
  cancelButtonColor: "#6b7280",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
    if (result.isConfirmed) {
    deletePerson(index)
    Swal.fire({
    title: "Delete!",
    text: "Contact has been deleted.",
    icon: "success",
    showCancelButton: false,
    showConfirmButton: false,
    timer: 1500
    });
    }
});

}
function deletePerson(deleteIndex){
  details.splice(deleteIndex,1)
  displayPerson()
  localStorage.setItem("details",JSON.stringify(details))
  displayFavorite()
  displayEmergency()
  count()
}
function favorite(favIndex){
   details[favIndex].favorite= !details[favIndex].favorite
    localStorage.setItem("details", JSON.stringify(details))
     displayFavorite()
     displayPerson()
}
function displayFavorite(){
      count()
    var fav = ""
    for(var i = 0; i < details.length; i++){
        if(details[i].favorite){
            fav += `
            <div class="item d-flex rounded-4">
              <div>
                ${details[i].image 
                      ? `<img src="${details[i].image}" alt="${details[i].name}">` 
                      : `<div class="d-flex justify-content-center align-items-center text-white color-fav" style="background-image:${details[i].currentColor}">${personName(details[i].name)}</div>`
                    }
              </div>
              <div class="favorite-contant">
                <h4 class="m-0">${details[i].name}</h4>
                <p class="m-0">${details[i].phone}</p>
              </div>
              <div class="icon rounded-2 d-flex align-items-center justify-content-center mt-1">
              <a href="tel:${details[i].phone}">
              <i class="fa-solid fa-phone"></i>
              </a>
              </div>
            </div>
            `
        }
    
  }
  if(favoriteCount==0){
      fav=`
        <div class="no-favorite text-center">
          <p class="m-0">No favorites yet</p>
        </div> 
      `
    }
    document.getElementById("favorite-bottom").innerHTML = fav
}
displayFavorite()
function emergency(emergencyIndex){
    details[emergencyIndex].emergency = !details[emergencyIndex].emergency
    localStorage.setItem("details", JSON.stringify(details))
    displayEmergency()
    displayPerson()
}
function displayEmergency(){
  count()
    var emergencyBox= ""
    for(var i = 0; i < details.length; i++){
        if(details[i].emergency){
            emergencyBox+= `
            <div class="item d-flex rounded-4">
              <div>
                ${details[i].image 
                      ? `<img src="${details[i].image}" alt="${details[i].name}">` 
                      : `<div class="d-flex justify-content-center align-items-center text-white color-emergency" style="background-image:${details[i].currentColor}">${personName(details[i].name)}</div>`
                    }
              </div>
              <div class="emergency-contant">
                <h4 class="m-0">${details[i].name}</h4>
                <p class="m-0">${details[i].phone}</p>
              </div>
              <div class="icon rounded-2 d-flex align-items-center justify-content-center mt-1">
              <a href="tel:${details[i].phone}">
              <i class="fa-solid fa-phone"></i>
              </a>
              </div>
            </div>
            `
            
        }
    }
    if(emergencyCount == 0){
        emergencyBox = `
        <div class="no-emergency text-center">
          <p class="m-0">No emergency contacts</p>
        </div>
        `
    }
    document.getElementById("emergency-bottom").innerHTML = emergencyBox
}
displayEmergency()
function validName(){
  var regexName=/^[A-Za-z][A-Za-z ]{2,50}$/
  var nameText=fullNameInput.value
  if(regexName.test(nameText)){
    document.getElementById("error-name").classList.add("d-none")
    return true
  }else{
    document.getElementById("error-name").classList.remove("d-none")
    return false
  }
}
function validNumber(){
  var regexNumber=/^\+?2?01(0|1|2|5)\d{8}$/
  var numberText=PhoneInput.value
  if(regexNumber.test(numberText)){
    document.getElementById("error-number").classList.add("d-none")
    return true
  }else{
    document.getElementById("error-number").classList.remove("d-none")
    return false
  }
}
function validEmail(){
  var regexEmail=/^([^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+)?$/
  var emailText=emailInput.value
  if(regexEmail.test(emailText)){
    document.getElementById("error-email").classList.add("d-none")
    return true
  }else{
    document.getElementById("error-email").classList.remove("d-none")
    return false
  }
}
function count(){
favoriteCount=0
emergencyCount=0
for(var i=0; i<details.length; i++){
  if(details[i].favorite){
    favoriteCount++
  }
  if(details[i].emergency){
    emergencyCount++
  }
}
  var countBox=`
  <div class="col-md-4 col-6">
        <div class="d-flex count rounded-4 bg-white">
          <div class="icon icon-users">
<i class="fa-solid fa-users d-flex justify-content-center align-items-center text-white"></i>
          </div>
          <div>
            <p class="m-0 head text-uppercase">Total</p>
            <p class="m-0 count-number" id="count-number">${details.length}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-6">
        <div class="d-flex count rounded-4 bg-white">
          <div class="icon icon-star">
<i class="fa-solid fa-star d-flex justify-content-center align-items-center text-white"></i>
          </div>
          <div>
            <p class="m-0 head text-uppercase">Favorites</p>
            <p class="m-0 count-number">${favoriteCount}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-6">
        <div class="d-flex count rounded-4 bg-white">
          <div class="icon icon-heart">
<i class="fa-solid fa-heart-pulse d-flex justify-content-center align-items-center text-white"></i>
          </div>
          <div>
            <p class="m-0 head text-uppercase">Emergency</p>
            <p class="m-0 count-number">${emergencyCount}</p>
          </div>
        </div>
      </div>
  `
  document.getElementById("count").innerHTML=countBox

  var contentBox=`
  <h2 class="mb-0">All Contacts</h2>
  <p class="desc mb-0 mt-1">Manage and organize your ${details.length} contacts</p>
  `
  document.getElementById("content").innerHTML=contentBox
}
count()
