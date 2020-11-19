


async function getSubjectAreas(dbo){
  var queryResult = await _getSubjectAreasHelper(dbo);
  var subjectAreas = []
  queryResult.subjectAreas.forEach(function(subjectArea){
     subjectAreas.push(subjectArea);
  });
  return subjectAreas;
}

function _getSubjectAreasHelper(dbo){
  return dbo.collection("courses").findOne({}).then(result => result)
}

module.exports = {

   getSubjectAreas: getSubjectAreas
}
