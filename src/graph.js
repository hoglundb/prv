//some global variables
let visNodes =  null;
let visEdges = null;
let visData = null;
let visNetwork = null;
let container = null;
let options = null;
var branchNodeCount = 0;

//a crap ton of constants for drawing the vis network
const NODE_TYPES = {
  COURSE:{NAME:'course', SIZE:18, HIGHLIGHT_SIZE:21, SELECTED_SIZE:26, COLOR:"#80CDFF", HIGHLIGHT_COLOR:"#B4DFFC", SELECTED_COLOR:"#B4DFFC"},
  PREREQ:{NAME:'prereq', SIZE:18, HIGHLIGHT_SIZE:21, SELECTED_SIZE:26, COLOR:"#C4C4C4", HIGHLIGHT_COLOR:"#E4E4E4", SELECTED_COLOR:"#E4E4E4"},
  BRANCH:{NAME:'branch', SIZE:7, HIGHLIGHT_SIZE:12, COLOR:"black", HIGHLIGHT_COLOR:"black", SELECTED_COLOR:"black"},
}

var nodeSizeInc = 0;

const PREREQ_HIGHLIGHT_COLOR = "#DEDEDE"

const SORT_METHOD = "directed";
const NODE_SPACING = 130;
const TREE_SPACING = 100;
const LEVEL_SEPARATION = 100;

const EDGE_COLOR = "grey";
const EDGE_WIDTH = .2;

const EDGE_HIGHLIGHTED_COLOR = "#F94CFF";
const EDGE_HIGHLIGHTED_WIDTH = 4

class MajorOptions{


  constructor(){
      this.count = 0;
      this.options = [];
      this.colors =          ["#E973FF", "#51C0FF", "#62EF67", "#EF9356", "#20B2AA", "#D2691E", "#837BF3", "red"];
      this.highlightColors = ["#F2AEFF",  "#97D9FF", "#9AF69E", "#F2B288", "#5EB6B3", "#D19B72", "#B3AEEC", "red"];
      this.coursesColorsHash = [];
      this.courseHighlightColorsHash = [];
  }

  addOption(_option){

      var courses = [];
      for(var op in _option.courses){
        courses.push(_option.courses[op].name);
        this.coursesColorsHash[_option.courses[op].name] = this.colors[this.count]
        this.courseHighlightColorsHash[_option.courses[op].name] = this.highlightColors[this.count]
      }

      this.options.push(new MajorOption(_option.name, _option.numberRequired, this.colors[this.count], this.count, courses))
      this.count++;
  }

  getMajorOption(_name){
    for(var key in this.options){
      if(this.options[key].name == _name){
        return this.options[key];
      }
    }
    return null;
  }



  getCourseHighlightColor(_name){
    return this.courseHighlightColorsHash[_name]
  }


 getMajorOptionById(_id){
   for(var key in this.options){
     if(this.options[key].id == _id){
       return this.options[key];
     }
   }
   return null;
 }

 getColorForCourse(_name){
    return this.coursesColorsHash[_name]
 }

}

class MajorOption{
   constructor(_name, _numberRequired, _color, _id, _courses){
     this.id = _id;
     this.name = _name;
     this.numberRequired = _numberRequired;
     this.color = _color;
     this.courses = _courses
   }
}
var majorOptions = null;




function _addMajorOptionToTable(text1, text2, ovalColor){
  var domRef = document.getElementById("majorOptionsSection");
  var item = document.createElement("div");
  item.style.fontWeight = "bold";
  item.style.marginLeft = "1%";
  item.innerText = text1;

  var oval = document.getElementById("myOval").cloneNode(true);
  oval.style.display = "block";
  oval.style.marginRight = "2%"
  oval.style.backgroundColor =  ovalColor
  var dis = document.createElement("div");
  dis.style.marginLeft = "1%";
  dis.innerText = text2


  domRef.appendChild(oval)
  domRef.appendChild(item)

  domRef.appendChild(dis);

  domRef.appendChild(document.createElement("br"))

}


function _addMajorOptionToHtmlTable(option, index){
   majorOptions.addOption(option);
   _addMajorOptionToTable(option.name + ":", "(Select " + option.numberRequired + " of these)",  majorOptions.getMajorOptionById(index).color)


}


//builds the vis network for the MajorOption network type
function buildVisMajorOptionNetwork(data, _subjectArea){
      data = data.data
      visNodes = new vis.DataSet();
      visEdges = new vis.DataSet();
      majorOptions = new MajorOptions();

      //add the corses for each category
      var index = 0;
      for(var d in data){
         _addMajorOptionToHtmlTable(data[d], index++);
      }
      _addMajorOptionToTable("Prereq (not required)", "", NODE_TYPES.PREREQ.COLOR);

      //add the corses for each category
      for(var d in data){
         for(var c in data[d].courses){
           _addCourseToVisNetwork(data[d].courses[c]);
         }
      }

      //add prereq courses and edges
      for(var d in data){
         for(var c in data[d].courses){
           _addVisChildNodes(data[d].courses[c], _subjectArea);
         }
      }


      visData = {nodes:visNodes, edges:visEdges}

      //compute custom layout for large networks. Use default Kamada Kawai for smaller networks
      computeLayout()

      //render the network
      visNetwork = new vis.Network(document.getElementById("myNetwork"), visData, _getVisOptions())

      //add event listenders for the vis network
      visAddEventListeners();

}


//builds the vis network for the subjectArea netowrk type
function buildVisSubjectAreaNetwork(courses, _subjectArea){
  visNodes = new vis.DataSet();
  visEdges = new vis.DataSet();

  courses.courses.forEach(function(course){
       _addCourseToVisNetwork(course);
  });

   courses.courses.forEach( function(course){
    _addVisChildNodes(course, _subjectArea)
  });

  visData = {nodes:visNodes, edges:visEdges}

  //compute custom layout for large networks. Use default Kamada Kawai for smaller networks
  computeLayout()

  //render the network
  visNetwork = new vis.Network(document.getElementById("myNetwork"), visData, _getVisOptions())

  //add event listenders for the vis network
  visAddEventListeners();
}


//adds connected prereq nodes and their connections to the network being built
function _addVisChildNodes(course,_subjectArea){

        var prereqRoot = course.root.connections;
         recurseNode(course.root, course.name, _subjectArea);
         prereqRoot.forEach(function(endPoint){
        var endpointNode = endPoint.endpointNode;
        });
}


//adds a course node to the vis network that is being built
function _addCourseToVisNetwork(course){
  var color = NODE_TYPES.COURSE.COLOR;
  if(currentNetworkType == modes.MAJOR){
    color = majorOptions.getColorForCourse(course.name);
  }
  if(isCourseInNetwork(course.name)) {
    return;
  }
  var node = {
    id:course.name,
    title:course.title,
    name:course.name,
    label:course.name,
    description:course.description,
    font:{size:NODE_TYPES.COURSE.SIZE + nodeSizeInc},
    type:NODE_TYPES.COURSE.NAME,
    color:color,
    isHighlighted:false,
    isSelected:false,
    chosen:false,
  }
  visNodes.add(node);
}


//returns the json struct for the layout options to tell vis how to draw the network
function _getVisOptions(){
  return {
   layout:getNetworkLayoutOptions(),
   edges: {
           smooth: true,
           arrows: { from: true },
           color: {
                     color:EDGE_COLOR
                 },
          width:EDGE_WIDTH
         },

         physics:{
            enabled: false, //don't want this looking like jello
         },
 }
}


//Called from network.js to build the visNetwork. Builds either the Major Options network or the SubjectArea network
 function buildVisNetwork(courses, _subjectArea){
   //reset the label area
 document.getElementById("majorOptionsSection").innerHTML = "";
 zoomControler = new ZoomControler();

 if(currentNetworkType == modes.SUBJECT_AREA){
    _addMajorOptionToTable("Subject Area Courses", "", NODE_TYPES.COURSE.COLOR);
    _addMajorOptionToTable("Non-Subject Area Courses ", "", NODE_TYPES.PREREQ.COLOR);
    buildVisSubjectAreaNetwork(courses, _subjectArea);
 }

 else if(currentNetworkType == modes.MAJOR){
   buildVisMajorOptionNetwork(courses, _subjectArea);
 }

 else if(currentNetworkType == modes.COURSE){
   _addMajorOptionToTable("Searched Course", "", NODE_TYPES.COURSE.COLOR);
   _addMajorOptionToTable("Course Prereqs", "", NODE_TYPES.PREREQ.COLOR);
   buildVisSubjectAreaNetwork(courses, _subjectArea)
 }

 var corusesList = getListOfCoursesInNetwork();
 autocomplete(document.getElementById("courseSearchInput"), corusesList)

}


function getListOfCoursesInNetwork(){

    var nodes =  {data: visData.nodes._data};
    var courseNames = [];
    for(var n in nodes.data){

      var node = nodes.data[n]
      if(node && node.font){
        if(node.type != NODE_TYPES.BRANCH.NAME){
          courseNames.push(node.name);
        }
      }
    }
    return courseNames
}


//returns the layout json structure for vis to determine the layout algorithem to use
function getNetworkLayoutOptions(){
  var layout = {};
  if(currentNetworkLayout == LAYOUT_TYPES.HIERARCHICAL){
     layout = {
        hierarchical: {
        sortMethod:  SORT_METHOD,
        nodeSpacing: NODE_SPACING,
       treeSpacing: TREE_SPACING,
        levelSeparation: LEVEL_SEPARATION,
     //direction: DIRECTION,
       }
    }
  }
  return layout;
}


class ZoomControler{
   constructor(){
     this.zoomAmount = 0;
     this.maxZoom = 4;
     this.minZoom = -10;
     this.nodeSizeInc = .3;
     this.dir = 1;
   }

   visZoomEvent(e){
       if(e.direction == "+"){
         this.dir = 1;
       }
       else{
         this.dir = -1;
       }

       this.zoomAmount += this.dir
       if(this.zoomAmount > this.maxZoom && this.dir == 1){
          visAdjustNodeSizes(this.dir * this.nodeSizeInc);
       }
       else if(this.zoomAmount >= this.maxZoom && this.dir == -1){
          visAdjustNodeSizes(this.nodeSizeInc * this.dir);
       }

   }
}


//adjusts all the node sizes in the vis network by the specified size increment
function visAdjustNodeSizes(increment){

  if(visNetwork == null || visNodes == null){
    console.error("vis network has not been initailized");
  }

  var nodes =  {data: visData.nodes._data};
  var updateData = [];
  for(var n in nodes.data){

    var node = nodes.data[n]
    if(node && node.font)
   var updateJson = {id:node.id,font:{size:node.font.size - increment}}
   updateData.push(updateJson);
  }
  visNodes.update(updateData)

}


var zoomControler = null;

 //add event listeners for clicking on nodes in the vis network
 function visAddEventListeners(){

   visNetwork.on("zoom", async function(e){
      zoomControler.visZoomEvent(e);
   });

  //click event for nodes in the network. This highlights the node and it's prereqs
  visNetwork.on("click", async function(e){

    //unselect any nodes/edges
    await setVisToDefault();

   if(e == undefined || e.nodes == undefined || e.nodes[0] == undefined) {
     return;
   }

   visOnNodeClick(visNodes.get(e.nodes[0]));

  });


  //double clicking a node performs the same action as searching for it in the course selection dropdown
  visNetwork.on("doubleClick", function(e){

    //ignore clicks not on nodes
   if(e == undefined || e.nodes == undefined || e.nodes[0] == undefined) {
     return;
   }

   visOnNodeDoubleClick(visNodes.get(e.nodes[0]));
 });
}


//called when a node in the vis network is clicked
async function visOnNodeClick(clickedNode){


  //skip non course nodes for now...
  if(clickedNode.type != NODE_TYPES.COURSE.NAME) return;

   //highlight the clicked node
   var color = "red";
   if(currentNetworkType == modes.SUBJECT_AREA || currentNetworkType == modes.COURSE){
     color = NODE_TYPES.COURSE.SELECTED_COLOR;
     if(clickedNode.isPrereq){
        color = NODE_TYPES.PREREQ.SELECTED_COLOR;
     }
   }
   if(currentNetworkType == modes.MAJOR){
     if(clickedNode.isPrereq == true){
        color =PREREQ_HIGHLIGHT_COLOR;
     }
     else{
       color = majorOptions.getCourseHighlightColor(clickedNode.name);
     }
   }
    visNodes.update({
     id:clickedNode.id,
     font:{size:getNodeSelectedSizeFromType(clickedNode.type) + nodeSizeInc},
     isSelected:true,
     color:color,
    });

   //highlight nodes that are in the prereq subjectwork of the clicked node
   var subNetwork = getPrereqSubNetwork(clickedNode, true);
   for(var key in subNetwork){
     var nodeToUpdate = subNetwork[key];
     var color = "red";
     if(currentNetworkType == modes.SUBJECT_AREA || currentNetworkType == modes.COURSE){
         color = NODE_TYPES.COURSE.SELECTED_COLOR;
         if(nodeToUpdate.isPrereq){
             color = NODE_TYPES.PREREQ.SELECTED_COLOR;
         }
         else if(nodeToUpdate.type == NODE_TYPES.BRANCH.NAME){
           color = NODE_TYPES.BRANCH.COLOR
         }
     }
     if(currentNetworkType == modes.MAJOR){
       if(nodeToUpdate.isPrereq == true){
          color = NODE_TYPES.PREREQ.HIGHLIGHT_COLOR;
       }
       else{
         color = majorOptions.getCourseHighlightColor(nodeToUpdate.name);
       }
     }
     var highlightSize = await getNodeHighlightSizeFromType(nodeToUpdate.type);
     visNodes.update({
        id:nodeToUpdate.id,
        font:{size:highlightSize + nodeSizeInc},
        isHighlighted:true,
        color:color,
     });
   }
}


//called when a node in the vis network is double clicked
async function visOnNodeDoubleClick(clickedNode){
  if(clickedNode.type == NODE_TYPES.BRANCH.NAME) return;

 if(!clickedNode.name.includes("MTH")){
    alert("Non-Math courses have not been implemented yet!");
    return;
 }

  currentNetworkType = modes.COURSE;
  await buildCoursesDropdown()
  $("#courseSelectionDropdown").val(clickedNode.id);
  document.getElementById("networkTypeDropdown").value = "courseOption"
  document.getElementById("courseDropdownArea").style.display = "block";
  document.getElementById("majorOptionDropdownSection").style.display = "none"
  await generateNetwork();
}


//returns the highlight size for the node of the given type
function getNodeHighlightSizeFromType(nodeType){
  return  _getNodeTypeEnum(nodeType).HIGHLIGHT_SIZE + nodeSizeInc;
}


function getNodeSelectedSizeFromType(nodeType){
  return _getNodeTypeEnum(nodeType).SELECTED_SIZE;
}


//returns the highlight color for the node of the given type
function getNodeHighlightColorFromType(nodeType){
  return  _getNodeTypeEnum(nodeType).HIGHLIGHT_COLOR;
}


//returns the color for the node of th given type
function getNodeColorFromType(nodeType){
  return  _getNodeTypeEnum(nodeType).COLOR;
}


//returns the regular node size based on the node type
function getNodeSizeFromType(nodeType){
  return  _getNodeTypeEnum(nodeType).SIZE + nodeSizeInc;
}


//A helper function to return the node type enumeration (as defined in the global constants section) based on its name
function _getNodeTypeEnum(nodeType){
  if(nodeType == NODE_TYPES.COURSE.NAME){
     return NODE_TYPES.COURSE;
  }
  else if(nodeType == NODE_TYPES.BRANCH.NAME){
     return NODE_TYPES.BRANCH;
  }
  else if(nodeType == NODE_TYPES.PREREQ.NAME){
     return NODE_TYPES.PREREQ;
  }
}


//returns the list of edges in the prereq subnetwor
async function getPrereqSubNetworkEdges(nodes){
  var edges = [];
   for(var n1 in nodes){
      var node1 = nodes[n1];
      for(var n2 in nodes){
        var node2 = nodes[n2];
        if(node1.id == node2.id) continue;
        var e = await getEdgeInNetwork(node1.id, node2.id);

        if(e != null){
          edges.push(e)
        }
      }
   }
   return edges;

}


//returns the list of node ids in the prereq network of the specified node
function getPrereqSubNetwork(rootNode){

    var nodes = [];
    visEdges.forEach(function(edge){
        if(edge.from == rootNode.id){
          var connectedNode = getVisNodeById(edge.to)
           highlightEdge(edge);
           nodes.push(connectedNode);
           if(connectedNode.type == NODE_TYPES.BRANCH.NAME){
             nodes = nodes.concat( getPrereqSubNetwork(connectedNode))
           }
        }
    });
    return nodes;

}


//highlights the specified edge in the vis network
function highlightEdge(edge){
   edge.width = EDGE_HIGHLIGHTED_WIDTH;
   edge.color.color = EDGE_HIGHLIGHTED_COLOR;
   edge.isHighlighted = true;
   visEdges.update(edge)
}


//resets any selected/highlighted items in the vis network. Called before click events on the vis network
function setVisToDefault(){
    visNodes.forEach(function(node){
          if(node.isHighlighted || node.isSelected){

            var color = getNodeColorFromType(node.type)
            if(currentNetworkType == modes.MAJOR){
              color = majorOptions.getColorForCourse(node.name);
            }
            if(node.isPrereq == true){
              color = NODE_TYPES.PREREQ.COLOR
            }

            visNodes.update({
               id:node.id,
               font:{size:getNodeSizeFromType(node.type) + nodeSizeInc},
               isHighlighted:false,
               isSelected:false,
               color: color,
            });
          }

    })

    visEdges.forEach(function(edge){
      if(edge.isHighlighted){
         edge.width = EDGE_WIDTH;
         edge.color.color = EDGE_COLOR;
         edge.isHighlighted = false;
         visEdges.update(edge);

      }
    })
}


//recurses throught the network data structure to build the vis network
 function recurseNode(node, name, _subjectArea){

    var newNodeName = "prev_" + name;
    if(node.hasChildren){
        var connectionIndex = 0;
        node.connections.forEach(function(connection){
        newNodeName   += "_" + connectionIndex++
             //if the prereq is already in the network
             if(connection.endpointNode.hasCourse){

                //the prereq course node that we are going to add (may not already be in the network)
                var courseToAdd = null;

                 //if the course is not already in the network, then we need to retrieve it from the server and then add it to the network
                 if(isCourseInNetwork(connection.endpointNode.course) == false){

                  var res =  getCourseDataAjax(_subjectArea, connection.endpointNode.course);
                  courseData = JSON.parse(res.responseText)
                        if(courseData.courses.length == 0){
                          console.error("Error: course '" + connection.endpointNode.course + "' not in the database");
                          return;
                        }
                        else{
                          courseToAdd = courseData.courses[0];
                            var nodeToAdd = {
                              id:courseToAdd.name,
                              title:courseToAdd.title,
                              name:courseToAdd.name,
                              label:courseToAdd.name,
                              description:courseToAdd.description,
                              font:{size:NODE_TYPES.PREREQ.SIZE + nodeSizeInc},
                              color:NODE_TYPES.PREREQ.COLOR,
                              type:NODE_TYPES.COURSE.NAME,
                              isHighlighted:false,
                              isSelected:false,
                              isPrereq:true,
                              chosen:false,
                            }
                            visNodes.add(nodeToAdd);

                        }
                  }

                   let newEdge = {
                      from: name,
                      to: connection.endpointNode.course,
                      dashes:connection.isDashed,
                      chosen:false, //want to control what happens to edges when a node is selected
                      width:EDGE_WIDTH,
                      color: {
                        color: EDGE_COLOR,
                      },
                      isHighlighted:false,
                   }
                  visEdges.add(newEdge)
             }
             //connection is to a branching node
             else{

               //add the branch node
               var newNode = {
                 id:newNodeName,
                 color:NODE_TYPES.BRANCH.COLOR,
                 type:NODE_TYPES.BRANCH.NAME,
                 font:{size:NODE_TYPES.BRANCH.SIZE + nodeSizeInc, color:NODE_TYPES.BRANCH.COLOR},
                 label:'00',
                 isHighlighted:false,
                 isSelected:false,
                 chosen:false,
               }

              visNodes.add(newNode);
               //add the edge to the branch node
              let edge = {
                from:name,
                to:newNodeName,
                dashes:connection.isDashed,
                chosen:false,
                width:1,
                isHighlighted:false,
                color: {
                  color: EDGE_COLOR,
                },
              }
             visEdges.add(edge)
               if(connection.endpointNode.hasChildren){

                 recurseNode(connection.endpointNode, newNodeName, _subjectArea);
               }
             }
               branchNodeCount++
        });
    }

}


//returns true if the specified course is in the vis network
function isCourseInNetwork(courseId){
  var result = false;
  visNodes.forEach(function(node){

    if(node.id == courseId ){
      result = true;
    }

  });
  return result;
}


//returns the edge (if it exists) in the vis network from node e1 to node e2
function getEdgeInNetwork(e1, e2){
  var edgeResult = null;
  visEdges.forEach(function(edge){
     if((edge.to == e1 && edge.from == e2) || (edge.to == e2 && edge.from == e1)){
       edgeResult = edge;
     }
  });
  return edgeResult
}


//computes the x,y coordinates for the vis network
function computeLayout(){
  if(visNodes == null){
    return console.error("Cannot compute layout for null visDataset");
  }

  if(currentNetworkLayout == LAYOUT_TYPES.COURSE_PROGRESSION){
    computeCourseProgessionLayout();
  }
  else if(currentNetworkLayout == LAYOUT_TYPES.HIERARCHICAL){
    computeHierarchicalLayout();
  }

}


//
function computeHierarchicalLayout(){
    let nodesDataset = visData.nodes._data;
    for(var key in nodesDataset){
      n = nodesDataset[key]
      if(n.type == NODE_TYPES.BRANCH.NAME){

        var fromNode = getCourseNodePointingToBranchNode(n.id);
        visNodes.update({id:n.id, x:0,y:0});
      }
    }
}


//computes the x,y coordinates in the vis network for the course progression layout type
function computeCourseProgessionLayout(){
  //node spacing increments
  var dx = 167;
  var dy = 126;
  var curX = 0;
  var xStart = 0;
  var curY = 0;
  var rowCount = 0;
  let nodesDataset = visData.nodes._data;
  var nodes = [];

  //create a tmp set of course nodes to conpute coordinates for
  for(var key in nodesDataset){
    var n = nodesDataset[key];
    if(n.type== "course"){
      var level =  _getPostfix(n.id);
      n.level = Math.ceil(level/100)*100 - 100
      var foo = n;
      nodes.push(foo);
    }
  }

  //sort courses high to low
  nodes.sort(function(a, b) {
    var textA = _getPostfix(a.id);
    var textB = _getPostfix(b.id);
    return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
  }).reverse();
  //assign x,y positions based on course id and level
  curLevel = nodes[0].level;
  nodes.forEach(function(n){

  if(rowCount > 9){
  //  if(curLevel != n.level){
      curY += dy;
      curX= xStart;
      rowCount = 0
    }

    n.x = curX;
    n.y = curY;

    curX += dx;
    rowCount++;
    curLevel = n.level;
  });


  //position the branch nodes based on their connections
  var brachNodes = [];
  for(var key in nodesDataset){
      var n = nodesDataset[key];
      if(n.type != "course"){
        var connections = getConnectedCourseNodes(n.id, NODE_TYPES.COURSE.NAME);
        var xPos = 0;
        var yPos = 0;
        for(var key in connections){
            var con = connections[key];
            xPos += con.x;
        }
        var fromNode = getCourseNodePointingToBranchNode(n.id);
        n.x = xPos / connections.length
        n.y = fromNode.y - .5 * dy
      }
    }
}


//finds the course node connecting to this branch node. Need to recurse to back trach to a non-branch node
function getCourseNodePointingToBranchNode(_nodeId){

  var nodeId = null;
  visEdges.forEach(function(edge){
    if(edge.to == _nodeId){
      nodeId = edge.from;
    }
  });

  var foundNode = getVisNodeById(nodeId);
  if(foundNode.type == NODE_TYPES.BRANCH.NAME){
    return getCourseNodePointingToBranchNode(foundNode.id)
  }
  else return foundNode
}


//returns the list of nodes in the Vis data structure with edges connected to the node with the specified id
function getConnectedCourseNodes(nodeId, nodeType){
 var connections = [];
 let edgesDataset = visData.edges._data;
 for(var key  in edgesDataset){
   var e = edgesDataset[key];
   if(e.from == nodeId){
     var n = getVisNodeById(e.to)
     if(n.type == nodeType){
        connections.push(n)
     }
   }
   else if(e.to == nodeId){
      var n = getVisNodeById(e.from)
      if(n.type == "course"){
         connections.push(n)
      }
   }
 }
 return connections;
}


//returns the node in the vis network with the specified id
function getVisNodeById(nodeId){
    let nodesDataset = visData.nodes._data;
    for(var key in nodesDataset){
      if(nodesDataset[key].id == nodeId){
        return nodesDataset[key];
      }
    }
    return null;
}


//returns the edge in the vis network for the from-to id's specified
function getVisEdgeByIds(fromId, toId){
  let edges = visData.edges._data;
  for(var key  in edges){
     if(edges[key].to == toId && edges[key].from == fromId){
       return edges[key];
     }
  }
  return null;
}


//returns the post fix for a course. For example "CS 212" will return "212"
function _getPostfix(courseName){
  return courseName.split(" ")[1];
}


//simulates a vis click event on the node when it is selected in the search. Also center the graph at that node
async function courseSearchAction(val){

  if(visNetwork == null) return;

  await setVisToDefault();
  var clickedNode = await getVisNodeById(val)
  if(!clickedNode) {
    alert("Course not found!");
    return;
  }
  visOnNodeClick(clickedNode);
  var coords = visNetwork.getPositions()[clickedNode.name];
  visNetwork.moveTo({
  position: {x:coords.x, y:coords.y}
  });

  //update the node text font so it looks like it was clicked on
  visData.nodes.update({id:clickedNode.id})

}


function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
              courseSearchAction(inp.value);
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}
