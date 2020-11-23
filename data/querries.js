

//querries the list of subject area names
async function getSubjectAreas(dbo){
  var queryResult = await _getSubjectAreasHelper(dbo);
  var subjectAreas = []
  queryResult.subjectAreas.forEach(function(subjectArea){
     subjectAreas.push(subjectArea.name);
  });
  return subjectAreas;
}

function _getSubjectAreasHelper(dbo){
  return dbo.collection("courses").findOne({}).then(result => result)
}

//querries the list of major options for the specified subject area
async function getMajorOptions(dbo, _subjectArea){
  var queryResult = await _getSubjectAreasHelper(dbo);
  var majorOptions = [];
  queryResult.subjectAreas.forEach(function(subjectArea){
   if(subjectArea.name == _subjectArea){
     subjectArea.majorOptions.forEach(function(op){
         majorOptions.push(op.name)
     })
   }
  });

  return majorOptions;
}


//querries for the network data for the specified subject area
async function getSubjectAreaNetworkData(_dbo, _subjectArea){
     var queryResult = await _getSubjectAreasHelper(_dbo);
     var courses = null;
     queryResult.subjectAreas.forEach(function(subjectArea){
      if(subjectArea.name == _subjectArea){
        courses = subjectArea.courses;
      }
    });
    return courses;
}


async function getMajorOptionNetworkData(_dbo, _subjectArea, _majorOption){
   var queryResult = await _getSubjectAreasHelper(_dbo);
   var data = null;
   queryResult.subjectAreas.forEach(function(subjectArea){
      if(subjectArea.name == _subjectArea){
        subjectArea.majorOptions.forEach(function(majorOption){
          if(majorOption.name == _majorOption){
            data = majorOption;
          }
        })
      }
   });
   return data;
}


//querries for the network data for the specific course within the specified subject area
async function getNetworkForCourse(_dbo, _subjectArea, _courseName){
    var queryResult = await _getSubjectAreasHelper(_dbo);
    var courses = [];
    queryResult.subjectAreas.forEach(function(subjectArea){
      if(subjectArea.name == _subjectArea){
        subjectArea.courses.forEach(function(course){
           if(course.name == _courseName){
              courses.push(course);
           }
        });
      }
    });
    return courses;
}


//returns a list of course names for the specified subject area
async function getSubjectAreaCoursesList(_dbo, _subjectArea){
   var queryResult = await _getSubjectAreasHelper(_dbo);
   var courses = [];
   queryResult.subjectAreas.forEach(function(subjectArea){
       if(subjectArea.name == _subjectArea){
           subjectArea.courses.forEach(function(course){
               courses.push(course.name);
           });
       }
   });
   return courses;
}


//get the list of all courses in the specified subject area and major option. Query all defined categories within the major option
async function getMajorOptionCoursesList(_dbo, _subjectArea, _majorOption){
  var queryResult = await _getSubjectAreasHelper(_dbo);
  var courses = [];
  queryResult.subjectAreas.forEach(function(subjectArea){
    if(subjectArea.name == _subjectArea){
        subjectArea.majorOptions.forEach(function(majorOption){
          if(majorOption.name == _majorOption){
            majorOption.categories.forEach(function(category){
              category.courses.forEach(function(course){
                courses.push(course);
              })
            })
          }
        })
    }
  })
  return courses;
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
