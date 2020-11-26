

const LAYOUT_TYPES = {
   COURSE_PROGRESSION:"course progression",
   COURSE_PROGRESSION2:"course progression2",
   HIERARCHICAL:"hierarchical",
   KAMADA_KAWAI: "kamada kawai",
}


const modes = {
    SUBJECT_AREA: 'subjectArea',
    MAJOR: 'program',
    COURSE: 'course',
}

var currentNetworkType = modes.SUBJECT_AREA;
var currentNetworkLayout = LAYOUT_TYPES.HIERARCHICAL;

//call the main function when the page first loads
document.addEventListener("load", main());

//entry point for the script
async function main(){
  $(document).ready(function(){
    $.migrateMute = true;
  })

  addEventListeners();
  await buildSubjectAreaDropdown();
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
    if($(this).text() == "Program"){
      //  $(this).prop("disabled", true)
      //    $(this).css("background", "lightGrey")
    }
  });
}

function buildLegend(){

   var legendBlueprint = document.getElementById("legend");
   var legend = legendBlueprint.cloneNode(true)
   legend.style.display="inline"
   document.getElementById("myNetwork").prepend(legend)

}


function checkboxClick(e){
   var checkBoxes = document.getElementsByClassName("myCheck");
   var text = "";
   var count = 0;
   var num = 0;
   for(var i in checkBoxes){
     count++;
     if(count > 5) break;
     if( document.getElementById("myCheck" + count.toString()).checked ){
       var val = document.getElementById("myCheckText" + count.toString()).innerText
       var b = checkBoxes[i];
       text += val + "; "
       num++;
     }

   }
   if(num > 0){
     text = text.slice(0, -2);
   }
   else if (num == 0){
     text = "--None Selected--"
   }
   if(num >= 5) text = "All"
   document.getElementById("defaultCourseLevelOption").innerText = text

   //rebuild the network based on the new selection
   generateNetwork();
}


//add event listeners for dropdown changes and stuff
async function addEventListeners(){

  //clicking anywhere will close the custom checkbox
  document.addEventListener("click", function(e){
      if(e.target.className != "myLabel" && e.target.id != "checkArea1" && e.target.id != "checkboxes" && e.target.id != "checkboxesSection1" && e.target.className != "myCheck"){

        if(expanded){
          showCheckboxes();
        }
      }

  });

  document.getElementById("searchButton").addEventListener("click", async function(e){
      var val = document.getElementById("courseSearchInput").value;
      courseSearchAction(val);
  });

  document.getElementById("courseSearchInput").addEventListener("keyup", async function(e){
     if(e.keyCode == 13){
       var val = document.getElementById("courseSearchInput").value;
       courseSearchAction(val);
     }

  });

  //event listener for the subjectAreaDropdown
  document.getElementById("networkTypeDropdown").addEventListener("change",  async function(e){

          var ref = document.getElementById("majorOptionDropdownSection");
           if(e.target.value == "courseOption"){
             ref.style.display = "none";
             document.getElementById("courseDropdownArea").style.display = "block";
             document.getElementById("courseDepthDropdownArea").style.display = "block"
             await buildCoursesDropdown();
             currentNetworkType =  modes.COURSE;
             generateNetwork();
          }
          else if(e.target.value == "subjectAreaOption"){
             currentNetworkType = modes.SUBJECT_AREA
             document.getElementById("courseDropdownArea").style.display = "none";
             document.getElementById("courseDepthDropdownArea").style.display = "none"
             ref.style.display = "none";
               generateNetwork()
          }

          else if(e.target.value == "programOption"){
            await buildMajorOptionDropdown();
            currentNetworkType = modes.MAJOR;
            document.getElementById("courseDropdownArea").style.display = "none";
            document.getElementById("courseDepthDropdownArea").style.display = "none"
            ref.style.display = "block"
            generateNetwork()
          }

    })

  document.getElementById("majorOptionsDropdown").addEventListener("change", async function(e){
      generateNetwork();
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

  //event listener for when the layout dropdown is changed
  document.getElementById("layoutDropdown").addEventListener("change", function(e){
      var selectedLayout = $("#layoutDropdown").find(":selected").val();
      if(selectedLayout == LAYOUT_TYPES.COURSE_PROGRESSION){
        currentNetworkLayout = LAYOUT_TYPES.COURSE_PROGRESSION;
      }
      else if(selectedLayout == LAYOUT_TYPES.COURSE_PROGRESSION2){
        currentNetworkLayout = LAYOUT_TYPES.COURSE_PROGRESSION2;
      }
      else if(selectedLayout == LAYOUT_TYPES.HIERARCHICAL){
        currentNetworkLayout = LAYOUT_TYPES.HIERARCHICAL;
      }
      else{
        currentNetworkLayout = LAYOUT_TYPES.KAMADA_KAWAI;
      }
      generateNetwork();
  });

}


//generates the network based on the courses selected in the courseSelectionDropdown.
async function generateNetwork(){
    var subjectArea =  $('#subjectAreaDropdown').find(":selected").text();
    if(currentNetworkType == modes.SUBJECT_AREA){
        var data = await getSubjectAreaNetworkDataAjax(subjectArea);
        await  buildVisNetwork(data, subjectArea)
    }

    else if(currentNetworkType == modes.MAJOR){
       var selectedMajorOption = $("#majorOptionsDropdown").find(":selected").text();
       var data = await getMajorOptionNetworkDataAjax(subjectArea, selectedMajorOption);
       buildVisNetwork(data, subjectArea)
    }

    else if(currentNetworkType == modes.COURSE){
      var courseSelection = $("#courseSelectionDropdown").find(":selected").text();
      var data = await getNetworkForCourseAjax(subjectArea, courseSelection);
      await buildVisNetwork(data, subjectArea)
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
    var data = await getSubjectAreaCoursesListAjax(subjectArea);
    /* var currentNetworkType = $('#networkTypeDropdown').find(":selected").text();
     //reference the dropdown and remove previous non-default values
     var dropdownRef = $("#courseSelectionDropdown")
     dropdownRef.find("option:gt(0)").remove();

     //get the dropdown data depending on the other dropdown selections
     var data = null;

     if(currentNetworkType == "Subject Area"){
        var data = await getSubjectAreaCoursesListAjax(subjectArea);
     }
     else if(currentNetworkType == "Major"){
        var majorOption = _defaultMajorOption;
        if(!majorOption){
           majorOption = $("#majorOptionsDropdown").find(":selected").text()
        }
         data = await getMajorOptionCoursesListAjax(subjectArea, majorOption);
     }*/
     var dropdownRef = $("#courseSelectionDropdown")
     dropdownRef.find("option:gt(0)").remove();

     //get the dropdown data depending on the other dropdown selections
  if(!data || !data.courses) {
    return console.error("Major option courses for dropdown not found");

  }
     //build the dropdown
     $.each(data.courses, function(val, text){
       dropdownRef.append(
         $('<option></option>').val(text.name).html(text.name)
       );
     });
     dropdownRef.val(data.courses[0].name)
}



//biulds the subjectArea dropdown drom the ajax response
async function buildSubjectAreaDropdown(){
  var data = await getSubjectAreasAjax();
  $.each(data.subjectAreas, function(val, text){
       var dropdownRef = $("#subjectAreaDropdown");
       dropdownRef.append(
       $('<option></option>').val(text.name).html(text.name)
       );
  });
  //set the default to the first item
  $("#subjectAreaDropdown").val(data.subjectAreas[0].name)
}


//builds the major options dropdown list
async function buildMajorOptionDropdown(){
  //remove old items in the dropdown list
  var selectList = $("#majorOptionsDropdown");
  selectList.find("option:gt(0)").remove();

  var dropdownSelection = $('#subjectAreaDropdown').find(":selected").text();
  var data = await getMajorOptionsAjax(dropdownSelection);
  const promise = new Promise(async (resolve, reject) => {
     $.each(data.majorOptions, function(val, text){
         var dropdownRef = $("#majorOptionsDropdown");
         dropdownRef.append(
         $('<option></option>').val(text.name).html(text.name)
         );
    });
     selectList.val(data.majorOptions[1].name);
     await resolve();
  })

   promise.then((value)=>{

      //  buildCoursesDropdown(data.majorOptions[1].name)
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


//makes an ajax call to the server to get the data for the course in the specified subject area
 function getCourseDataAjax(_subjectArea, _courseName){
  var url = "networkForCourse" + "?subjectArea=" + _subjectArea + "&course=" + _courseName;
  return $.ajax({
    url: url,
    success: function (data) {
       return data
    },
    async: false
   });
}


function getSubjectAreaCoursesListAjax(subjectArea){
   return $.get("subjectAreaCoursesList" + "?subjectArea=" + subjectArea, function(data){});
}


function getMajorOptionCoursesListAjax(_subjectArea, _majorOption){
  return $.get("majorOptionCoursesList" + "?subjectArea=" + _subjectArea + "&majorOption=" + _majorOption, function(data){});
}


function getMajorOptionNetworkDataAjax(_subjectArea, _majorOption){
  return $.get("majorOptionNetworkData" + "?" + "subjectArea=" + _subjectArea + "&" + "majorOption=" + _majorOption)
}


function getNetworkForCourseAjax(_subjectArea, _courseName){



  return $.get("networkForCourse" + "?subjectArea=" + _subjectArea + "&course=" + _courseName);
}


var expanded = false;

function showCheckboxes() {
  var checkboxes = document.getElementById("checkboxes");
  if (!expanded) {
    checkboxes.style.display = "block";
    expanded = true;
  } else {
    checkboxes.style.display = "none";
    expanded = false;
  }
}
