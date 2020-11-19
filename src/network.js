document.addEventListener("load", main());

//entry point for
async function main(){

  addEventListeners();
  buildSubjectAreaDropdown();

}


function addEventListeners(){
  document.getElementById("networkTypeDropdown").addEventListener("change", function(e){
      var ref = document.getElementById("majorOptionDropdownSection");
      if(e.target.value == "subjectAreaOption"){
         ref.style.display = "none";
      }
      else{
        ref.style.display = "block"
      }
  });
}


async function buildSubjectAreaDropdown(){
  var subjectAreas = await getSubjectAreasAjax()
  console.log(subjectAreas)
}


async function getSubjectAreasAjax(){
  return $.get( "subjectAreas", function( data ) {

});
}
