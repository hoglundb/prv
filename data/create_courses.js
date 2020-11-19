//A script to create the database JSON object for the list of courses and their prereqs

const Imports = require("./prereq_data_structure.js");

var prereqCreator = new Imports.PrereqCreator();
var organization = new Imports.Organization("oregon state university");

var mathSubjectArea = new Imports.SubjectArea("Mathematics");

//add math courses/prereqs to the math subject area
var rootNode = AddMathCourses();

organization.addSubjectArea(mathSubjectArea);
prereqCreator.addOrganization(organization)

//console.log(JSON.stringify(prereqCreator));
//console.log(organization.subjectAreas[0].courses)

function AddMathCourses(){
  var courseName = "Mth 065";
  var courseTitle = "ELEMENTARY ALGEBRA";
  var prereqs = [];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, courseTitle, ""));

  var courseName = "Mth 095";
  var courseTitle = "INTERMEDIATE ALGEBRA";
  var prereqs = ["Mth 065"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, courseTitle, ""));

  var courseName = "Mth 102";
  var courseTitle = "ALGEBRAIC FOUNDATIONS";
  var prereqs = [];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, courseTitle, ""));

  var courseName = "Mth 103";
  var courseTitle = "ALGEBRAIC REASONING";
  var prereqs = ["Mth 065"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName,  courseTitle,""));

  var courseName = "Mth 105";
  var courseTitle = "INTRODUCTION TO CONTEMPORARY MATHEMATICS";
  var prereqs = [];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, courseTitle, ""));

  var courseName = "MTH 111";
  var prereqs = ["MTH 095,Mth 111"];
  var courseTitle = "COLLEGE ALGEBRA";
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, courseTitle, ""));

  var courseName = "MTH 112";
  var prereqs = ["MTH 111"];
  var courseTitle = "ELEMENTARY FUNCTIONS";
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName,  courseTitle,""));

  var courseName = "MTH 199";
  var courseTitle = "SPECIAL TOPICS";
  var prereqs = [];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 211";
  var courseTitle = "FOUNDATIONS OF ELEMENTARY MATHEMATICS";
  var prereqs = ["MTH 095,MTH 103,MTH 111, MTH 112"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 212";
  var courseTitle = "FOUNDATIONS OF ELEMENTARY MATHEMATICS";
  var prereqs = ["MTH 211"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 227";
  var courseTitle = "CALCULUS AND PROBABILITY FOR THE LIFE SCIENCES";
  var prereqs = ["MTH 112"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 228";
  var courseTitle = "CALCULUS AND PROBABILTITY FOR THE LIFE SCIENCES II";
  var prereqs = ["MTH 227"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 231";
  var courseTitle = "ELEMENTS OF DISCRETE MATHEMATICS";
  var prereqs = ["MTH 111"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 241";
  var courseTitle = "CALCULUS FOR MANAGEMENT AND SOCIAL SCIENCE";
  var prereqs = ["MTH 111"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 245";
  var courseTitle = "MATHEMATICS FOR MANAGEMENT, LIFE, AND SOCIAL SCIENCES";
  var prereqs = ["MTH 111"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 251";
  var courseTitle = "DIFFERENTIAL CALCULUS";
  var prereqs = ["MTH 112"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 252";
  var courseTitle = "INTEGRAL CALCULUS";
  var prereqs = ["MTH 251"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 253";
  var courseTitle = "INFINITE SERIES AND SEQUENCES";
  var prereqs = ["MTH 252"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 254";
  var courseTitle = "VECTOR CALCULUS";
  var prereqs = ["MTH 252"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 255";
  var courseTitle = "VECTOR CALCULUS II";
  var prereqs = ["MTH 254"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 256";
  var courseTitle = "APPLIED DIFFERENTIAL EQUATIONS";
  var prereqs = ["MTH 254"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 264";
  var courseTitle = "INTRODUCTION TO MATRIX ALGEBRA";
  var prereqs = ["MTH 252"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 265";
  var courseTitle = "INTRODUCTION TO SERIES";
  var prereqs = ["MTH 252"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 299";
  var courseTitle = "SPECIAL TOPICS";
  var prereqs = [];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH MTH 306";
  var courseTitle = "MATRIX AND POWER SERIES METHODS";
  var prereqs = ["MTH 252"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 311";
  var courseTitle = "ADVANCED CALCULUS";
  var prereqs = ["MTH 254", "MTH 355"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 312";
  var courseTitle = "ADVANCED CALCULUS II";
  var prereqs = ["MTH 311"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 321";
  var courseTitle = "INTRODUCTORY APPLICATIONS OF MATHEMATICAL SOFTWARE";
  var prereqs = ["MTH 341,MTH 264,MTH 306"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 323";
  var courseTitle = "MATHEMATICAL MODELING";
  var prereqs = ["MTH 256","MTH 341"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 333";
  var courseTitle = "FUNDAMENTAL CONCEPTS OF TOPOLOGY";
  var prereqs = ["MTH 341,MTH 355"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 338";
  var courseTitle = "NON-EUCLIDEAN GEOMETRY";
  var prereqs = ["MTH 341"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 341";
  var courseTitle = "LINEAR ALGEBRA I";
  var prereqs = ["MTH 254"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 342";
  var courseTitle = "LINEAR ALGEBRA II";
  var prereqs = ["MTH 341"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));


  var courseName = "MTH 343";
  var courseTitle = "INTRODUCTION TO MODERN ALGEBRA";
  var prereqs = ["MTH 341","MTH 355"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  //special case (a or b or (c and d))
  var courseName = "MTH 351";
  var courseTitle = "INTRODUCTION TO NUMERICAL ANALYSIS";
  SpecialCase1(courseName, courseTitle, "", "MTH 253","MTH 306","MTH 264","MTH 265");


  var courseName = "MTH 355";
  var courseTitle = "DISCRETE MATHEMATICS";
  var prereqs = ["MTH 253"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 361";
  var courseTitle = "INTRODUCTION TO PROBABILITY";
  var prereqs = ["MTH 253,MTH 306,MTH 265"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 390";
  var courseTitle = "FOUNDATIONS OF ELEMENTARY MATHEMATICS";
  var prereqs = ["MTH 211","MTH 212"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 411";
  var courseTitle = "REAL ANALYSIS";
  var prereqs = ["MTH 312","MTH 341"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 412";
  var courseTitle = "REAL ANALYSIS";
  var prereqs = ["MTH 411"]; //MISSING UPPER DIVISION
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 413";
  var courseTitle = "REAL ANALYSIS";
  var prereqs = ["MTH 412"]; //MISSING UPPER DIVISION
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 419";
  var courseTitle = "MULTIVARIABLE ADVANCED CALCULUS";
  var prereqs = ["MTH 312"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 420";
  var courseTitle = "MODELS AND METHODS OF APPLIED MATHEMATICS";
  var prereqs = ["MTH 256","MTH 341"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 427";
  var courseTitle = "INTRODUCTION TO MATHEMATICAL BIOLOGY";
  var prereqs = ["MTH 256","MTH 341"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH ";
  var courseTitle = "";
  var prereqs = [];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 428";
  var courseTitle = "STOCHASTIC ELEMENTS IN MATHEMATICAL BIOLOGY";
  var prereqs = ["MTH 341","MTH 361,MTH 463"]; //MISSING UPPER DIVISION
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 430";
  var courseTitle = "METRIC SPACES AND TOPOLOGY";
  var prereqs = ["MTH 311"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 434";
  var courseTitle = "INTRODUCTION TO DIFFERENTIAL GEOMETRY";
  var prereqs = ["MTH 255", "MTH 342"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 435";
  var courseTitle = "DIFFERENTIAL GEOMETRY";
  var prereqs = ["MTH 434"]; //MISSING UPPER DIVISION
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 437";
  var courseTitle = "GENERAL RELATIVITY";
  var prereqs = ["MTH 434"]; //MISSING UPPER DIVISION
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 440";
  var courseTitle = "COMPUTATIONAL NUMBER THEORY";
  var prereqs = ["MTH 231,MTH 343,MTH 355"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 441";
  var courseTitle = "APPLIED AND COMPUTATIONAL ALGEBRA";
  var prereqs = ["MTH 343","MTH 342,MTH 440"]; //MISSING UPPER DIVISION
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 442";
  var courseTitle = "APPLIED AND COMPUTATIONAL ALGEBRA";
  var prereqs = ["MTH 441"]; //MISSING UPPER DIVISION
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 443";
  var courseTitle = "ABSTRACT LINEAR ALGEBRA";
  var prereqs = ["MTH 342,MTH 343"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 451";
  var courseTitle = "NUMERICAL LINEAR ALGEBRA";
  var prereqs = ["MTH 341"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  //Special case of the form (a & (b or c or d) & (e or f))
  var courseName = "MTH 452";
  var courseTitle = "NUMERICAL SOLUTION OF ORDINARY DIFFERENTIAL EQUATIONS";
  SpecialCase2(courseName, courseTitle, "", "MTH 256" , "MTH 306", "MTH 341", "MTH 264", "MTH 253", "MTH 265");

  var courseName = "MTH 453";
  var courseTitle = "NUMERICAL SOLUTION OF PARTIAL DIFFERENTIAL EQUATIONS";
  var prereqs = ["MTH 452"]; //MISSING UPPER DIVISION
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 463";
  var courseTitle = "PROBABILITY I";
  var prereqs = ["MTH 311"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 464";
  var courseTitle = "PROBABILITY II";
  var prereqs = ["MTH 463","MTH 341"]; //MISSING UPPER DIVISION
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 465";
  var courseTitle = "PROBABILITY III";
  var prereqs = ["MTH 464"]; //MISSING UPPER DIVISION;
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 467";
  var courseTitle = "ACTUARIAL MATHEMATICS";
  var prereqs = ["MTH 463"]; //MISSING ST 421!!!!
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 480";
  var courseTitle = "SYSTEMS OF ORDINARY DIFFERENTIAL EQUATIONS";
  var prereqs = ["MTH 256","MTH 341"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

 //SKIPPED BECUASE OF AMIGUITY
  var courseName = "MTH 481";
  var courseTitle = "APPLIED ORDINARY DIFFERENTIAL EQUATIONS";
  var prereqs = [];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 482";
  var courseTitle = "APPLIED PARTIAL DIFFERENTIAL EQUATIONS";
  var prereqs = ["MTH 480,MTH 481"]; //MISSING UPPER DIVISION
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 483";
  var courseTitle = "COMPLEX VARIABLES";
  var prereqs = ["MTH 256","MTH 253,MTH 306,MTH 265"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 490";
  var courseTitle = "INTENSIVE SUMMER RESEARCH IN MATHEMATICS";
  var prereqs = [];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 491";
  var courseTitle = "ALGEBRA AND GEOMETRIC TRANSFORMATIONS";
  var prereqs = ["MTH 341"];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 492";
  var courseTitle = "ALGEBRA AND GEOMETRIC TRANSFORMATIONS";
  var prereqs = ["MTH 491"]; //MISSING UPPER DIVISION
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH ";
  var courseTitle = "ALGEBRA AND GEOMETRIC TRANSFORMATIONS";
  var prereqs = ["MTH 492"]; //MISSING UPPER DIVISION
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

  var courseName = "MTH 499";
  var courseTitle = "SPECIAL TOPICS";
  var prereqs = [];
  mathSubjectArea.addCourseWithPrereqs(CreateGenericCourse(prereqs, courseName, ""));

}


function SpecialCase2(courseName, courseTitle, courseDescription, a, b, c, d, e, f){
  var rootNode = new Imports.Course(courseName, courseTitle, courseDescription);

  var aNode = new Imports.Node(a);
  var bNode = new Imports.Node(b);
  var cNode = new Imports.Node(c);
  var dNode = new Imports.Node(d);
  var eNode = new Imports.Node(c);
  var fNode = new Imports.Node(d);

  var orSet1 = new Imports.Node();
  orSet1.addConnection(new Imports.Connection(b, true));
  orSet1.addConnection(new Imports.Connection(c, true));
  orSet1.addConnection(new Imports.Connection(d, true));

  var orSet2 = new Imports.Node();
  orSet2.addConnection(new Imports.Connection(e, true));
  orSet2.addConnection(new Imports.Connection(f, true));

  var fromRoot = new Imports.Node();
  fromRoot.addConnection(new Imports.Connection(aNode, false));
  fromRoot.addConnection(new Imports.Connection(orSet1, false));
  fromRoot.addConnection(new Imports.Connection(orSet2, false));

  rootNode.root.addConnection(new Imports.Connection(fromRoot, false));

}


//handles the relationship (a or b or (c & d))
function SpecialCase1(courseName, courseTitle, courseDescription, a, b, c, d){
    var rootNode = new Imports.Course(courseName, courseTitle, courseDescription);

    var aNode = new Imports.Node(a);
    var bNode = new Imports.Node(b);
    var cNode = new Imports.Node(c);
    var dNode = new Imports.Node(d);

    var dcBranchNode = new Imports.Node();
    var toD = new Imports.Connection(dNode, false);
    var toC = new Imports.Connection(cNode, false);
    dcBranchNode.addConnection(toD);
    dcBranchNode.addConnection(toC);

    var orBranchNode = new Imports.Node();
    var toA = new Imports.Connection(aNode, true);
    var toB = new Imports.Connection(bNode, true);
    orBranchNode.addConnection(toA)
    orBranchNode.addConnection(toB);

    var toDC = new Imports.Connection(dcBranchNode, true);
    orBranchNode.addConnection(toDC);

    var fromRootNode = new Imports.Node();
    var fromRootConnection = new Imports.Connection(orBranchNode, false);
    fromRootNode.addConnection(fromRootConnection);
    rootNode.root.addConnection(fromRootConnection);

}

function printJson(text){
    console.log(JSON.stringify(text));
}
//course that dont have nested prereq options. Or options are comma seperated
function CreateGenericCourse(prereqsList, courseName, courseTitle, courseDescription){

  //the root node of the course prereq heirarchy that this course
  var rootNode = new Imports.Course(courseName, courseTitle, courseDescription)

   for(var key in prereqsList){

     //split appart any optional prereqs into an array
     var p  = prereqsList[key].split(',');

     //if we have a set of optional prereqs (only one of which is required)
     if(p.length > 1){
           for(var k in p){
             var connectedNode = new Imports.Node(p[k]);
             var connection = new Imports.Connection(connectedNode, true)
             rootNode.root.addConnection(connection);
           }
     }

     //if we this is just a single required prereq
     else if(p.length == 1){
       var connectedNode = new Imports.Node(p[0]);
       var connection = new Imports.Connection(connectedNode, true)
       rootNode.root.addConnection(connection);
     }
   }

   return rootNode;
}

//prereqCreator.printNodes();
