//call the main function when the page first loads
document.addEventListener("load", main());

//entry point for the script
async function main(){

  addEventListeners();
  buildSubjectAreaDropdown();
}


//add event listeners for dropdown changes and stuff
function addEventListeners(){

  //event listener for the subjectAreaDropdown
  document.getElementById("networkTypeDropdown").addEventListener("change", function(e){
      var ref = document.getElementById("majorOptionDropdownSection");
      if(e.target.value == "subjectAreaOption"){
         ref.style.display = "none";
      }
      else{
        buildMajorOptionDropdown();
        ref.style.display = "block"
      }
  });
}


//biulds the subjectArea dropdown drom the ajax response
async function buildSubjectAreaDropdown(){
  var data = await getSubjectAreasAjax()
  $.each(data.subjectAreas, function(val, text){
       var dropdownRef = $("#subjectAreaDropdown");
       dropdownRef.append(
       $('<option></option>').val(text).html(text)
       );
  });
  //set the default to the first item
  $("#subjectAreaDropdown").val(data.subjectAreas[0])
}


//builds the major options dropdown list
async function buildMajorOptionDropdown(){
  //remove old items in the dropdown list
  var selectList = $("#majorOptionsDropdown");
  selectList.find("option:gt(0)").remove();

  var dropdownSelection = $('#subjectAreaDropdown').find(":selected").text();
  var majorOptions = await getMajorOptionsAjax(dropdownSelection);
  $.each(majorOptions.majorOptions, function(val, text){
       var dropdownRef = $("#majorOptionsDropdown");
       dropdownRef.append(
       $('<option></option>').val(text).html(text)
       );
  });
}


//makes an ajax request to the server to retirieve the list of subject areas
function getSubjectAreasAjax(){
  return $.get( "subjectAreas", function( data ) {});
}


//makes an ajax requrest to the server tor etrive the list of major options for the selected subject area
function getMajorOptionsAjax(subjectArea){
  console.log(subjectArea)
    return $.get("majorOptions" + "?subjectArea=" + subjectArea, function(data){});
}
