class PrereqCreator {

  constructor(){
    this.subjectAreas = [];
  }


  addSubjectArea(_subjectArea){
    this.subjectAreas.push(_subjectArea);
  }



}

class Organization{
  constructor(_name){
    this.subjectAreas = [];
    this.name = null;
    if(_name) this.name = _name;
  }

  addSubjectArea(_subjectArea){
    this.subjectAreas.push(_subjectArea);
  }
}

class SubjectArea{
  constructor(_name, _abrev, _isSelectable){
    this.name = null;
    this.abreviation = _abrev;
    this.isSelectable = _isSelectable;
    this.courses = [];
    this.majorOptions = [];
    if(_name) this.name = _name;
  }

  addCourseWithPrereqs(_course){
     this.courses.push(_course);
  }

  addMajorOption(_majorOption){
    this.majorOptions.push(_majorOption);
  }
}

class MajorOption{
  constructor(_name){
      this.name = _name;
      this.categories = [];
  }

  addCategory(_section){
    this.categories.push(_section);
  }
}

class MajorOptionCategory{
  constructor(_sectionName, _courses, _numberRequired){
     this.name = _sectionName;
     this.courses = _courses;
     this.numberRequired = _numberRequired;
  }
}

//represents a course in the prereq heirarchy. A course will either be a root course, or will be a prereq for the root.
class Course{

  //init the name, description for the course
  constructor(_name, _title, _description, _subjectArea) {
      this.subjectArea = _subjectArea;
      this.name = _name;
      this.title = _title;
      this.description = _description;
      this.root = new RootNode()
  }
}

class RootNode{
   constructor(){
     this.connections = [];
     this.hasChildren = false;
   }

   addConnection(_connection){
     this.connections.push(_connection)
     this.hasChildren = true;
   }
}


//Represents a node in the prereq heirarchy for a course. Nodes can optionally have courses attached to them and 1-way connections to other nodes
class Node{

  //init the course (if present) and the connections to other nodes
  constructor(_courseName) {
     this.connections = [];
     this.hasChildren = false;
     this.hasCourse = false;
     this.course = null
     if(_courseName){
       this.course = _courseName;
       this.hasCourse = true;
     }
  }

  //adds a connection to this nodes list of connections
  addConnection(connection){
      this.connections.push(connection);
      this.hasChildren = true;
  }

}


//represents a 1-way connection to a node. Connection is either dashed or solid depending on if the prereq is an "and" or "or" in the heirarchy
class Connection{

  //init the isDashed property and endPointNode object that this connection connects to
  constructor(_endpointNode, _isDashed) {
    this.endpointNode = _endpointNode;
    this.isDashed = _isDashed;
  }
}

module.exports.PrereqCreator = PrereqCreator;
module.exports.Course = Course;
module.exports.Connection = Connection;
module.exports.Node = Node;
module.exports.SubjectArea = SubjectArea;
module.exports.Organization = Organization;
module.exports.MajorOption = MajorOption;
module.exports.MajorOptionCategory = MajorOptionCategory;
