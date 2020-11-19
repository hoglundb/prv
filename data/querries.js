

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
      console.log(subjectArea.majorOptions)
     subjectArea.majorOptions.forEach(function(op){
       console.log(op.name)
         majorOptions.push(op.name)
     })
   }
  });

  return majorOptions;
}



module.exports = {

   getSubjectAreas: getSubjectAreas,
   getMajorOptions: getMajorOptions
}
