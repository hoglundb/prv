

//querries the list of subject area names
async function getSubjectAreas(_dbo){

  //fields to exclude in the selection query
  var projection = {_id:0, abreviation:0}

  //return a promise to select the list of subject areas
  return _dbo.collection("osu_subject_areas").find({}).project(projection).toArray().then(result=>result)
}


function _getSubjectAreasHelper(dbo){
  return dbo.collection("courses").findOne({}).then(result => result)
}


//querries the list of major options for the specified subject area
async function getMajorOptions(_dbo, _subjectArea){
  var projection = {"majorOptions.categories":0,_id:0,name:0,abreviation:0}
  return _dbo.collection("osu_subject_areas").find({name:_subjectArea}).project(projection).toArray().then(result => result[0].majorOptions);
}


//querries for the network data for the specified subject area
async function getSubjectAreaNetworkData(_dbo, _subjectArea){
   return _dbo.collection("osu_courses").find({subjectArea:_subjectArea}).toArray().then(result => result);
}


function _getMajorOptionNetworkData(_dbo, _subjectArea, _majorOption){
  var projection = {_id:0, "majorOptions.abreviation":0}
  return _dbo.collection("osu_subject_areas").find({"majorOptions.name":_majorOption}).project(projection).toArray().then(result => result[0].majorOptions);
}


async function getMajorOptionNetworkData(_dbo, _subjectArea, _majorOption){

   var subjectAreaData = await _getMajorOptionNetworkData(_dbo, _subjectArea, _majorOption);
   var foo = await foobar(subjectAreaData, _subjectArea, _majorOption);
   var goo = await goobar(foo, _dbo, _subjectArea, _majorOption);
   var returnData = null;

  return goo;

}


async function goobar(foo, _dbo, _subjectArea, _majorOption){
  var goo = foo;
  for(var f in foo){
    var item = foo[f];
    var courses = item.courses;

    item.courses =  await _getCoursesInList(_dbo, _subjectArea, courses);

  }
  return goo
}


async function foobar(subjectAreaData, _subjectArea, _majorOption){
  var returnData = null;
  for(var key in subjectAreaData){
    var majorOptions = subjectAreaData[key];
    if(majorOptions.name == _majorOption) {
      returnData = majorOptions;
    }
 }
 return returnData.categories;
}


function _getCoursesInList(_dbo, _subjectArea, _arr){
  var query ={ name : { $in : _arr}}
  var projection = {_id:0}
  return _dbo.collection("osu_courses").find(query).project(projection).toArray().then(result => result)

}


//returns the data for the course with the specified name
function _getCourseData(_dbo, _subjectArea, _majorOption, _courseName){

const query = {subjectAreas:{name:/./}};
var res = _dbo.collection("courses").findOne(query).then(result => result);

//  return dbo.collection("courses").findOne({}).then(result => result)
return res;
}


//querries for the network data for the specific course within the specified subject area
async function getNetworkForCourse(_dbo, _subjectArea, _courseName){
    return _dbo.collection("osu_courses").find({subjectArea:_subjectArea, name:_courseName}).toArray().then(result => result)
}


//returns a list of course names for the specified subject area
async function getSubjectAreaCoursesList(_dbo, _subjectArea){
 var projection = {root:0, title:0, _id:0, subjectArea:0};
  return _dbo.collection("osu_courses").find({subjectArea:_subjectArea}).project(projection).toArray().then(result => result);
}



function _getCoursesForMajorOption(_dbo, _subjectArea, _majorOption){
    return _dbo.collection("osu_subject_areas").findOne({name:_subjectArea, "majorOptions.name":_majorOption}).then(result=>result);
}

//get the list of all courses in the specified subject area and major option. Query all defined categories within the major option
async function getMajorOptionCoursesList(_dbo, _subjectArea, _majorOption){
  var coursesArr = [];
  var majorOptions = await _getCoursesForMajorOption(_dbo, _subjectArea, _majorOption);
  for(var key in majorOptions){
    var mo = majorOptions[key];
    for(var k2 in mo){
      var cat = mo[k2].categories;
      for(var k3 in cat){
        var courses = cat[k3].courses;
        for(var c in courses){
          var courseName = courses[c];
           coursesArr.push({name:courseName})
        }
      }

    }

  }

return coursesArr;

}


module.exports = {
   getSubjectAreas: getSubjectAreas,
   getSubjectAreaNetworkData: getSubjectAreaNetworkData,
   getMajorOptionNetworkData:getMajorOptionNetworkData,
   getNetworkForCourse: getNetworkForCourse,
   getMajorOptions: getMajorOptions,
   getSubjectAreaCoursesList: getSubjectAreaCoursesList,
   getMajorOptionCoursesList:getMajorOptionCoursesList
}
