



const modes = {
    SUBJECT_AREA: 'subjectArea',
    MAJOR: 'major'
}

var networkType = modes.SUBJECT_AREA;

//call the main function when the page first loads
document.addEventListener("load", main());

//entry point for the script
async function main(){
  $(document).ready(function(){
    $.migrateMute = true;
  })

  addEventListeners();
  await buildSubjectAreaDropdown();
  await buildCoursesDropdown(null);
  await generateNetwork();
  await tmpDisableDropdownOptions();
}


function tmpDisableDropdownOptions(){

  $("#subjectAreaDropdown option").each(function()
  {
    if($(this).val() == "Computer Science" || $(this).val() == "Business"){
        $(this).prop("disabled", true)
          $(this).css("background", "lightGrey")
    }
  });

  $("#networkTypeDropdown option").each(function()
  {
    if($(this).text() == "Major"){
        $(this).prop("disabled", true)
          $(this).css("background", "lightGrey")
    }
  });
}

function buildLegend(){

   var legendBlueprint = document.getElementById("legend");
   var legend = legendBlueprint.cloneNode(true)
   legend.style.display="inline"
   document.getElementById("myNetwork").prepend(legend)

}

//add event listeners for dropdown changes and stuff
async function addEventListeners(){

  //event listener for the subjectAreaDropdown
  document.getElementById("networkTypeDropdown").addEventListener("change", async function(e){

          var ref = document.getElementById("majorOptionDropdownSection");
          if(e.target.value == "subjectAreaOption"){
             networkType = modes.SUBJECT_AREA
             ref.style.display = "none";
          }
          else{
            buildMajorOptionDropdown();
            networkType = modes.MAJOR;
            ref.style.display = "block"
          }
          await buildCoursesDropdown();
    })

  document.getElementById("majorOptionsDropdown").addEventListener("change", async function(e){
        buildCoursesDropdown();
   });

  //action for the subjectAreaDropdown
  document.getElementById("subjectAreaDropdown").addEventListener("change", function(e){
         buildMajorOptionDropdown();
  });

  //action when the gernate button is clicked
 document.getElementById("generateButton").addEventListener("click", function(e){
      if(validateDropdownSelections()){
              generateNetwork();
      }
  });

  //event listener for the course selection dropdown. Re-generate the network when this changes
  document.getElementById("courseSelectionDropdown").addEventListener("change", function(e){
      generateNetwork();
  });


}


//generates the network based on the courses selected in the courseSelectionDropdown.
async function generateNetwork(){
    var courseSelection = $("#courseSelectionDropdown").find(":selected").text();
    var subjectArea =  $('#subjectAreaDropdown').find(":selected").text();
    if(networkType == modes.SUBJECT_AREA){
      if(courseSelection == "All"){
        var data = await getSubjectAreaNetworkDataAjax(subjectArea);
      }
      else{
        var data = await getNetworkForCourseAjax(subjectArea, courseSelection);
      }

    await  buildVisNetwork(data, subjectArea)

    }
    await buildLegend();
}



//TODO
function validateDropdownSelections(){
  return true;
}


//builds the dropdown list for the courses. Depends on networkType, subjectArea, and major option
async function buildCoursesDropdown(_defaultMajorOption){
     var subjectArea =  $('#subjectAreaDropdown').find(":selected").text();
     var networkType = $('#networkTypeDropdown').find(":selected").text();
     //reference the dropdown and remove previous non-default values
     var dropdownRef = $("#courseSelectionDropdown")
     dropdownRef.find("option:gt(0)").remove();

     //get the dropdown data depending on the other dropdown selections
     var data = null;

     if(networkType == "Subject Area"){
        var data = await getSubjectAreaCoursesListAjax(subjectArea);
     }
     else if(networkType == "Major"){
        var majorOption = _defaultMajorOption;
        if(!majorOption){
           majorOption = $("#majorOptionsDropdown").find(":selected").text()
        }
         data = await getMajorOptionCoursesListAjax(subjectArea, majorOption);
     }
  if(!data || !data.courses) {
    return console.error("Major option courses for dropdown not found");

  }
     //build the dropdown
     $.each(data.courses, function(val, text){
       dropdownRef.append(
         $('<option></option>').val(text).html(text)
       );
     });
     dropdownRef.val("All")
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

  const promise = new Promise(async (resolve, reject) => {

     $.each(majorOptions.majorOptions, function(val, text){
         var dropdownRef = $("#majorOptionsDropdown");
         dropdownRef.append(
         $('<option></option>').val(text).html(text)
         );
    });
     selectList.val(majorOptions.majorOptions[1]);
     await resolve();
  })

   promise.then((value)=>{

        buildCoursesDropdown(majorOptions.majorOptions[1])
   })

}


//makes an ajax request to the server to retirieve the list of subject areas
function getSubjectAreasAjax(){
  return $.get( "subjectAreas", function( data ) {});
}


//makes an ajax requrest to the server tor etrive the list of major options for the selected subject area
function getMajorOptionsAjax(subjectArea){

    return $.get("majorOptions" + "?subjectArea=" + subjectArea, function(data){});
}


function getSubjectAreaNetworkDataAjax(subjectArea){
       return $.get("subjectAreaNetworkData" + "?subjectArea=" + subjectArea, function(data){});
}


function getSubjectAreaCoursesListAjax(subjectArea){
   return $.get("subjectAreaCoursesList" + "?subjectArea=" + subjectArea, function(data){});
}


function getMajorOptionCoursesListAjax(_subjectArea, _majorOption){
  return $.get("majorOptionCoursesList" + "?subjectArea=" + _subjectArea + "&majorOption=" + _majorOption, function(data){});
}


function getNetworkForCourseAjax(_subjectArea, _courseName){



  return $.get("networkForCourse" + "?subjectArea=" + _subjectArea + "&course=" + _courseName);
}
