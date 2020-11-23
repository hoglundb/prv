//some global variables
let visNodes =  null;
let visEdges = null;
let visData = null;
let visNetwork = null;
let container = null;
let options = null;
let nodesList = [];
var branchNodeCount = 0;

//a crap ton of constants for drawing the vis network
const nodeTypes = {
  COURSE:'course',
  PREREQ:'prereq',
  BRANCH:'branch'
}

const nodeSizes = {
   COURSE:18,
   PREREQ:18,
   BRANCH:7,
}

const nodeHighlightSizes = {
   COURSE:25,
   PREREQ:25,
   BRANCH:12,
}

const nodeColors = {
   BRANCH:"black",
   COURSE:"#80CDFF",
   PREREQ: "lightgray"
}

const selectedNodeColors = {
  BRANCH:"black",
  COURSE:"#FC8AFF",
  PREREQ: "lightgray"
}

const highlightedNodeColors = {
  BRANCH:"black",
  COURSE:"#BDE5FF",
  PREREQ: "lightgray"
}

const NODE_SPACING = 130;
const TREE_SPACING = 10;
const LEVEL_SEPARATION = 130;

const EDGE_COLOR = "grey";
const EDGE_WIDTH = .2;

const EDGE_HIGHLIGHTED_COLOR = "#F94CFF";
const EDGE_HIGHLIGHTED_WIDTH = 4



//builds the vis data structure by calling "recurseNode()" on each course in the network data structure
 function buildVisNetwork(courses, _subjectArea){

  visNodes = new vis.DataSet();

  //create the primary nodes
  courses.courses.forEach(function(course){

  var node = {
    id:course.name,
    title:course.title,
    name:course.name,
    label:course.name,
    description:course.description,
    font:{size:nodeSizes.COURSE},
    type:nodeTypes.COURSE,
    color:nodeColors.COURSE,
    isHighlighted:false,
    isSelected:false,
  }
  nodesList.push(node);
  visNodes.add(node);

  });



  //create the primary edges
  visEdges = new vis.DataSet();

   courses.courses.forEach( function(course){

      var prereqRoot = course.root.connections;
       recurseNode(course.root, course.name, _subjectArea);
       prereqRoot.forEach(function(endPoint){
      var endpointNode = endPoint.endpointNode;
      });
  });

   container = document.getElementById("myNetwork");


 options = {
  edges: {
          smooth: true,
          arrows: { to: true },
          color: {
                    color:EDGE_COLOR
                },
         width:EDGE_WIDTH
        },

        physics:{
           enabled: false, //don't want this looking like jello
        },
    /*   interaction:{hover:true},
        layout: { hierarchical: {
         sortMethod:  SORT_METHOD,
         nodeSpacing: NODE_SPACING,
       //  treeSpacing: TREE_SPACING,
     //    levelSeparation: LEVEL_SEPARATION,
     //    direction: DIRECTION,
   },}*/
}



visData = {
  nodes:visNodes,
  edges:visEdges
}

  //compute custom layout for large networks. Use default Kamada Kawai for smaller networks
  if(visNodes.length > 10){
      computeLayout()
  }

  //render the network
  visNetwork = new vis.Network(container, visData, options)

  //add event listenders for the vis network
  addVisEventListeners();
}


 function addVisEventListeners(){

  //click event for nodes in the network. This highlights the node and it's prereqs
  visNetwork.on("click", async function(e){

    //ignore clicks not on nodes
   if(e == undefined || e.nodes == undefined || e.nodes[0] == undefined) {
     return;
   }

   //unselect any nodes/edges
   await setVisToDefault();

   var clickedNode= visNodes.get(e.nodes[0]);

   //skip non course nodes for now...
   if(clickedNode.type != nodeTypes.COURSE) return;

    //highlight the clicked node
     visNodes.update({
      id:clickedNode.id,
      font:{size:getNodeHighlightSizeFromType(clickedNode.type)},
      isSelected:true,
      color:selectedNodeColors.COURSE,
     });

    //highlight nodes that are in the prereq subjectwork of the clicked node
    var subNetwork = getPrereqSubNetwork(clickedNode, true);
    for(var key in subNetwork){
      var nodeToUpdate = subNetwork[key];
      var highlightSize = await getNodeHighlightSizeFromType(nodeToUpdate.type);
      visNodes.update({
         id:nodeToUpdate.id,
         font:{size:highlightSize},
         isHighlighted:true,
         color:getNodeHighlightColorFromType(nodeToUpdate.type),
      });
    }
  });


  //double clicking a node performs the same action as searching for it in the course selection dropdown
  visNetwork.on("doubleClick", function(e){

    //ignore clicks not on nodes
   if(e == undefined || e.nodes == undefined || e.nodes[0] == undefined) {
     return;
   }


   var clickedNode= visNodes.get(e.nodes[0]);
   $("#courseSelectionDropdown").val(clickedNode.id);
   generateNetwork();
 });
}


//returns the highlighted node size based on the node type
function getNodeHighlightSizeFromType(nodeType){
  if(nodeType == nodeTypes.COURSE){
     return nodeHighlightSizes.COURSE;
  }
  else if(nodeType == nodeTypes.BRANCH){
     return nodeHighlightSizes.BRANCH;
  }
  else if(nodeType == nodeTypes.PREREQ){
     return nodeHighlightSizes.PREREQ;
  }
}


function getNodeHighlightColorFromType(nodeType){
  if(nodeType == nodeTypes.COURSE){
     return highlightedNodeColors.COURSE;
  }
  else if(nodeType == nodeTypes.BRANCH){
     return highlightedNodeColors.BRANCH;
  }
  else if(nodeType == nodeTypes.PREREQ){
     return highlightedNodeColors.PREREQ;
  }
}


function getNodeColorFromType(nodeType){
  if(nodeType == nodeTypes.COURSE){
     return nodeColors.COURSE;
  }
  else if(nodeType == nodeTypes.BRANCH){
     return nodeColors.BRANCH;
  }
  else if(nodeType == nodeTypes.PREREQ){
     return nodeColors.PREREQ;
  }
}


//returns the regular node size based on the node type
function getNodeSizeFromType(nodeType){
  if(nodeType == nodeTypes.COURSE){
     return nodeSizes.COURSE;
  }
  else if(nodeType == nodeTypes.BRANCH){
     return nodeSizes.BRANCH;
  }
  else if(nodeType == nodeTypes.PREREQ){
     return nodeSizes.PREREQ;
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
           if(connectedNode.type == nodeTypes.BRANCH){
             nodes = nodes.concat( getPrereqSubNetwork(connectedNode))
           }
        }
    });
    return nodes;

}


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
            visNodes.update({
               id:node.id,
               font:{size:getNodeSizeFromType(node.type)},
               isHighlighted:false,
               isSelected:false,
               color: getNodeColorFromType(node.type),
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
                            font:{size:nodeSizes.PREREQ},
                            color:nodeColors.PREREQ,
                            type:nodeTypes.COURSE,
                            isHighlighted:false,
                            isSelected:false,
                          }
                            nodesList.push(nodeToAdd);
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
                 color:nodeColors.BRANCH,
                 type:nodeTypes.BRANCH,
                 font:{size:nodeSizes.BRANCH, color:nodeColors.BRANCH},
                 label:'00',
                 isHighlighted:false,
                 isSelected:false,
               }

              visNodes.add(newNode);
              nodesList.push(newNode);
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


function getEdgeInNetwork(e1, e2){
  var edgeResult = null;
  visEdges.forEach(function(edge){
     if((edge.to == e1 && edge.from == e2) || (edge.to == e2 && edge.from == e1)){
       edgeResult = edge;
     }
  });
  return edgeResult
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


//computes the x,y coordinates for the vis network
function computeLayout(){
  if(visNodes == null){
    return console.error("Cannot compute layout for null visDataset");
  }

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
        var connections = getConnectedCourseNodes(n.id, nodeTypes.COURSE);
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
  if(foundNode.type == nodeTypes.BRANCH){
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
