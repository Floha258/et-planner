import {TableShape} from "../../types/TableShape";
<template>
    <div>
        <b-modal id="edit-table" ref="modal" title="Bitte geben Sie den Namen des Tisches ein." @show="resetModal()" @hidden="resetModal()" @ok="handleSubmit()">
            <b-form ref="form">
                <b-form-group label="Tischname:" label-for="name-input">
                    <b-form-input id="name-input" v-model="modalTableName"></b-form-input>
                </b-form-group>
            </b-form>
        </b-modal>
        <div id="canvas" v-on:drop="drop($event)" v-on:dragover="allowDrop($event)" :getCanvasProp="getCanvasEvent"></div>
    </div>
</template>

<script lang=ts>
    /* eslint-disable */

    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import Konva from 'konva';
    import {Group} from 'konva/types/Group';
    import {RectangularTable} from "../../types/RectangularTable";
    import {CircularTable} from "../../types/CircularTable";
    import {Table} from "../../types/Table";
    import {Seat} from "../../types/Seat";
    import {Circle} from 'konva/types/shapes/Circle';
    import {TableShape} from '../../types/TableShape';
    import {Veranstaltung} from "../../types/Veranstaltung";
    import {Person} from "../../types/Person";
    import {Direction} from '../../types/Direction';
    import {Gender} from '../../types/Gender';
    import {Shape} from 'konva/types/Shape';

    /*******Global Variable of the Component**********/

// Dimension of the playground
var canvasWidth = 1920;
var canvasHeight = 1080;


var initialized:boolean = false;  // to initialize the konva:stage of the playground. it will be setted to true after the initialization
var ContextMenuUnique: boolean = false; // condition for opening the contextmenu on stage. if a contextmenu is open, this variable will be set to true, and any others contextmenu can't be opened



var tableList:Map<Group, Table> = new Map<Group, Table>();
var tableNames:Map<Table, Konva.Text> = new Map<Table, Konva.Text>();
var seatList:Map<Konva.Circle, [Seat, Konva.Text]> = new Map<Circle, [Seat, Konva.Text]>();
var roomID = 0;
var tableIDCounter:number = 1;
var seatIDCounter:number = 1;




// Konva variables
var stage:Konva.Stage;             // the Stage of the Playground
var layer = new Konva.Layer();     // the layer of the stage
var RotationTransformer = new Konva.Transformer(); // the transformer to rotate the group of table and seats

// constant size of the table, seats and buttons
const DEFAULT_TABLE_SIZE = 100;  // table size
const SEAT_SIZE = 20;  // seat size
const SEAT_SPACING = 300; // size of the seat space beside the table
const BUTTON_RADIUS = 10; // size of the green buttons to create seats and of the scale transformer buttons


// the 4 corners of the scale transformer 

//corner up left
var cornUpLeft = new Konva.Rect({
    x:-50,
    y:-50,
    width: BUTTON_RADIUS,
    height: BUTTON_RADIUS,
    stroke:'black',
    draggable:true,
  });

//corner up left
var cornDownLeft = new Konva.Rect({
    x:-50,
    y:-50,
    width: BUTTON_RADIUS,
    height: BUTTON_RADIUS,
    stroke:'black',
    draggable:true,
  });

//corner up left
var cornUpRight = new Konva.Rect({
    x:-50,
    y:-50,
    width: BUTTON_RADIUS,
    height: BUTTON_RADIUS,
    stroke:'black',
    draggable:true,
  });

//corner up left
var cornDownRight = new Konva.Rect({
    x:-50,
    y:-50,
    width: BUTTON_RADIUS,
    height: BUTTON_RADIUS,
    stroke:'black',
    draggable:true,
  });


// Adding of the 4 corners of the scale transformer to the layer of our konva:Stage
layer.add(cornDownRight);
layer.add(cornUpRight);
layer.add(cornDownLeft);
layer.add(cornUpLeft);


/********* important help functions of the components ********************************/



/**  
 * The function returns all table of the map tablelist.
 * */
function getAllTables():Table[] {
                    var tableArray = new Array;
                    tableList.forEach(function (table) {
                        tableArray.push(table);
                    });
                    return tableArray;
}




/**  
 * The function  create a  scale  transformer to scale a Table.
 * @param group   the table with or without seats (Konva:Group)
 * */
function placeTransformer(group:Group) {
                        var graphTable = findGraphTable(group);
                        var table = tableList.get(group);
                        if (table == undefined) {
                            return;
                        }
                        var posX = graphTable.x();
                        var width = graphTable.width();
                        var posY = graphTable.y();
                        var height = graphTable.height();
                        if (table.getShape() == TableShape.Circular) {
                            posX -= width/2;
                            posY -= width/2;
                        }                                           
                        cornUpLeft.x(posX -5);
                        cornUpLeft.y(posY - 5);
                        cornDownLeft.x(posX - 5);
                        cornDownLeft.y(posY + height - 5);
                        cornUpRight.x(posX + width - 5);
                        cornUpRight.y(posY - 5);
                        cornDownRight.x(posX - 5 + width);
                        cornDownRight.y(posY - 5 + height);
                        group.add(cornUpLeft);
                        group.add(cornDownLeft);
                        group.add(cornUpRight);
                        group.add(cornDownRight);
                        cornUpLeft.removeEventListener('dragmove');
                        cornDownLeft.removeEventListener('dragmove');
                        cornDownRight.removeEventListener('dragmove');
                        cornUpRight.removeEventListener('dragmove');                      
                        if (table.getShape() == TableShape.Rectangular) {
                            cornUpLeft.on('dragmove', function (e) {
                                movingCornerBehaviourRect(cornUpLeft, true, true, table, group, cornUpRight, cornDownLeft);
                            });
                            cornDownLeft.on('dragmove', function (e) {
                                movingCornerBehaviourRect(cornDownLeft, false, true, table, group, cornDownRight, cornUpLeft);
                            });
                            cornDownRight.on('dragmove', function (e) {
                                movingCornerBehaviourRect(cornDownRight, false, false, table, group, cornDownLeft, cornUpRight);
                            });
                            cornUpRight.on('dragmove', function (e) {
                                movingCornerBehaviourRect(cornUpRight, true, false, table, group, cornUpLeft, cornDownRight);
                            });
                        } else {
                            cornUpLeft.on('dragmove', function (e) {
                                movingCornerBehaviourCirc(cornUpLeft, true, true, table, group, cornUpRight, cornDownLeft);
                            });
                            cornDownLeft.on('dragmove', function (e) {
                                movingCornerBehaviourCirc(cornDownLeft, false, true, table, group, cornDownRight, cornUpLeft);
                            });
                            cornDownRight.on('dragmove', function (e) {
                                movingCornerBehaviourCirc(cornDownRight, false, false, table, group, cornDownLeft, cornUpRight);
                            });
                            cornUpRight.on('dragmove', function (e) {
                                movingCornerBehaviourCirc(cornUpRight, true, false, table, group, cornUpLeft, cornDownRight);
                            });
                        }
                      
                        layer.draw();
}




/**  
 * This function   will be called, when a round table will be scaled.
 * @param corner    (Konva:rect) is a corner of the scale transformer, at which the scaling will be started.   
 * @param up        is a boolean which helps to find out, if the corner position on the table is up or down.  
 * @param left      is a boolean which helps to find out, if the corner position on the table is left or rigth. 
 * @param table     The table ( Table ) to scale. 
 * @param group     the table with or without seats (Konva:Group) to scale on the canvas.
 * @param cornerX   (Konva:rect) this corner of the scale transformer which has the same X-Position with the startcorner and also move by scaling.
 * @param cornerY   (Konva:rect) this corner of the scale transformer which has the same Y-Position with the startcorner and also move by scaling.
 * */
function movingCornerBehaviourCirc(corner:Konva.Rect, up:boolean, left:boolean, table:Table, group:Group, cornerX:Konva.Rect, cornerY:Konva.Rect) {
                                  var minimumRadius = 50;
                                  var newRadius = table.scaleX;
                                  var xFactor = 1;
                                  var yFactor = 1;
                                  if (left) {
                                      xFactor = -1;
                                  }
                                  if (up) {
                                      yFactor = -1;
                                  }                                 
                                 if (newRadius == minimumRadius && corner.y() * yFactor < minimumRadius) {
                                      corner.y(yFactor * minimumRadius - 5);
                                  }
                                  if (newRadius == minimumRadius && corner.x() * xFactor < minimumRadius) {
                                      corner.x(xFactor * minimumRadius - 5);
                                  }
                                  var eq = (Math.abs(corner.y()) + Math.abs( corner.x())) / 2;
                                  corner.x(eq * xFactor);
                                  corner.y(eq * yFactor);                                  
                                  //Move the other corners along
                                  cornerY.x(corner.x());
                                  cornerX.y(corner.y());
                                  var rescale = false;
                                  if (corner.x() * xFactor >= newRadius + minimumRadius) {
                                      rescale = true;
                                      newRadius = newRadius + minimumRadius;
                                  }
                                  if (corner.x() * xFactor < newRadius - minimumRadius) {
                                      rescale = true;
                                      newRadius = newRadius - minimumRadius;
                                  }
                                  if (rescale) {
                                      var graphTable = findGraphTable(group);
                                      // @ts-ignore
                                      graphTable.radius(newRadius);
                                      table.scaleX = newRadius;
                                      table.scaleY = newRadius;
                                      placeTransformer(group);
                                      addSeatButtons(group, findGraphTable(group) as Shape);
                                  }
}




/**  
 * This function will be called, when a rectangular table will be scaled.
 * @param corner    (Konva:rect) is a corner of the scale transformer, at which the scaling will be started.   
 * @param up        is a boolean which helps to find out, if the corner position on the table is up or down.  
 * @param left      is a boolean which helps to find out, if the corner position on the table is left or rigth. 
 * @param table     The table ( Table ) to scale. 
 * @param group     the table with or without seats (Konva:Group) to scale on the canvas.
 * @param cornerX   (Konva:rect) this corner of the scale transformer which has the same X-Position with the startcorner and also move by scaling.
 * @param cornerY   (Konva:rect) this corner of the scale transformer which has the same Y-Position with the startcorner and also move by scaling.
 * */
function movingCornerBehaviourRect(corner:Konva.Rect, up:boolean, left:boolean, table:Table, group:Group, cornerX:Konva.Rect, cornerY:Konva.Rect) {
                                  var minimumScale = 100;
                                  if (table.getShape() == TableShape.Circular) {
                                      minimumScale = 50;
                                  }
                                  var newScaleX = table.scaleX;
                                  var newScaleY = table.scaleY;
                                  var xFactor = 1;
                                  var yFactor = 1;
                                  if (left) {
                                      xFactor = -1;
                                  }
                                  if (up) {
                                      yFactor = -1;
                                  }
                                  if (newScaleY <= minimumScale && corner.y() * yFactor - 5 < minimumScale/2) {
                                      corner.y(yFactor * minimumScale/2 - 5);
                                  }
                                  if (newScaleX <= minimumScale && corner.x() * xFactor - 5 < minimumScale/2) {
                                      corner.x(xFactor * minimumScale/2 - 5);
                                  }
                                  cornerY.x(corner.x());
                                  cornerX.y(corner.y());
                                  var rescale = false;
                                  var factor = 1;
                                  if (corner.x() * xFactor > newScaleX / 2 + minimumScale) {
                                      factor = Math.floor((corner.x() * xFactor - newScaleX / 2) / minimumScale);
                                      newScaleX = newScaleX + minimumScale * factor;
                                      rescale = true;
                                  }
                                  if (corner.y() * yFactor > newScaleY / 2 + minimumScale) {
                                      factor = Math.floor((corner.y() * yFactor - newScaleY / 2) / minimumScale);
                                      newScaleY = newScaleY + minimumScale * factor;
                                      rescale = true;
                                  }
                                  if (corner.x() * xFactor < newScaleX / 2 - minimumScale) {
                                      factor = Math.floor((newScaleX / 2 - corner.x() * xFactor) / minimumScale);
                                      newScaleX = Math.max(newScaleX - minimumScale * factor, minimumScale);
                                      rescale = true;
                                  }
                                  if (corner.y() * yFactor < newScaleY / 2 - minimumScale) {
                                      factor = Math.floor((newScaleY / 2 - corner.y() * yFactor) / minimumScale);
                                      newScaleY = Math.max(newScaleY - minimumScale * factor, minimumScale);
                                      rescale = true;
                                  }
                                  if (rescale) {
                                      if (up) {
                                          if (left) {
                                              scaleTableUpLeft(newScaleX, newScaleY, group);
                                          } else {
                                              scaleTableUpRight(newScaleX, newScaleY, group);
                                          }
                                      } else {
                                          if (left) {
                                              scaleTableDownLeft(newScaleX, newScaleY, group);
                                          } else {
                                              scaleTableDownRight(newScaleX, newScaleY, group);
                                          }
                                      }
                                      placeTransformer(group);
                                  }
  }




/**  
 * The function  removes the scale transformer 
 * */
function removeTransformer() {
                          cornDownRight.remove();
                          cornUpRight.remove();
                          cornDownLeft.remove();
                          cornUpLeft.remove();
                          layer.draw();
}




/**  
 * The function  searchs a shape with the name 'table' from a Konva:Group and returns it.
 * Here the Konva:Group is a Table with or without seats.
 * @param group  the table (Konva:Group) .
 * */
function findGraphTable(group:Group):Konva.Node {
                      var graphTable:Konva.Node;
                      group.children.each(function(child) {
                        if (child.hasName('table')) {
                          graphTable = child ;
                          return;
                        }
                      });
                      return graphTable;
}




/**  
 * The function   updates the position of a table by scale from the corner up left of the table.
 * @param scaleX     the x-coordinate of the scaled position of the pointer.   
 * @param scaleY     the y-coordinate of the scaled position of the pointer.  
 * @param group      the table with or without seats (Konva:Group) which is scaled.
 * */
function scaleTableUpLeft(scaleX:number, scaleY:number, group:Group) {
                        scaleTable(scaleX, scaleY, group, -1, -1);
}



/**  
 * The function   updates the position of a table by scale from the corner down left of the table.
 * @param scaleX     the x-coordinate of the scaled position of the pointer.   
 * @param scaleY     the y-coordinate of the scaled position of the pointer.  
 * @param group      the table with or without seats (Konva:Group) which is scaled.
 * */
function scaleTableDownLeft(scaleX:number, scaleY:number, group:Group) {
                            scaleTable(scaleX, scaleY, group, 1, -1);
}



/**  
 * The function   updates the position of a table by scale from the corner up rigth of the table.
 * @param scaleX     the x-coordinate of the scaled position of the pointer.   
 * @param scaleY     the y-coordinate of the scaled position of the pointer.  
 * @param group      the table with or without seats (Konva:Group) which is scaled.
 * */
function scaleTableUpRight(scaleX:number, scaleY:number, group:Group) {
                            scaleTable(scaleX, scaleY, group, -1, 1);
}



/**  
 * The function   updates the position of a table by scale from the corner down rigth of the table.
 * @param scaleX     the x-coordinate of the scaled position of the pointer.   
 * @param scaleY     the y-coordinate of the scaled position of the pointer.  
 * @param group      the table with or without seats (Konva:Group) which is scaled.
 * */
function scaleTableDownRight(scaleX:number, scaleY:number, group:Group) {
                              scaleTable(scaleX, scaleY, group, 1, 1);
}




/**  
 * The function   updates the position a table by scaling.
 * @param scaleX     the x-coordinate of the scaled position of the pointer.   
 * @param scaleY     the y-coordinate of the scaled position of the pointer.  
 * @param group      the table with or without seats (Konva:Group) which is scaled.
 * @param moveDown   the size of the move by scaling down.
 * @param moveRight  the size of the move by scaling right.
 * */
function scaleTable(scaleX:number, scaleY:number, group:Group, moveDown:number, moveRight:number) {
    
                  var graphTable = findGraphTable(group);
                  var table: RectangularTable = tableList.get(group) as RectangularTable;     

                  var angle = Math.PI * 2 * (table.rotation % 360) / 360;
                  var sin = Math.sin(angle);
                  var cos = Math.cos(angle);
                  
                  group.x(group.x() + (scaleX/2 - table.scaleX/2) * moveRight * cos + (scaleY/2 - table.scaleY/2) * -moveDown * sin);
                  group.y(group.y() + (scaleY/2 - table.scaleY/2) * moveDown * cos + (scaleX/2 - table.scaleX/2) * moveRight * sin);
                  
                  graphTable.x(-scaleX/2);
                  graphTable.y(-scaleY/2);

                  graphTable.width(scaleX);
                  graphTable.height(scaleY);

                  table.scaleX = scaleX;
                  table.scaleY = scaleY;

                  while ((table.scaleX / 100) - 1 < table.furthestX) {
                    var seatA = table.removeSeat(Direction.Up, table.furthestX);
                    var seatB = table.removeSeat(Direction.Down, table.furthestX);
                    group.children.each(function (child) {
                      if (child.hasName("seat")) {
                        // @ts-ignore
                        if (seatA != undefined && seatA.position[0] == child.x()) {
                          child.remove();
                          // @ts-ignore
                          seatList.delete(child);
                        }
                        // @ts-ignore
                        if (seatB != undefined && seatB.position[0] == child.x()) {
                          child.remove();
                          // @ts-ignore
                          seatList.delete(child);
                        }
                      }
                    });
                  }
                  while ((table.scaleY / 100) - 1 < table.furthestY) {
                    seatA = table.removeSeat(Direction.Left, table.furthestY);
                    seatB = table.removeSeat(Direction.Right, table.furthestY);
                    group.children.each(function (child) {
                      if (child.hasName("seat")) {
                        // @ts-ignore
                        if (seatA != undefined && seatA.position[1] == child.y()) {
                          child.remove();
                          // @ts-ignore
                          seatList.delete(child);
                        }
                        // @ts-ignore
                        if (seatB != undefined && seatB.position[1] == child.y()) {
                          child.remove();
                          // @ts-ignore
                          seatList.delete(child);
                        }
                      }
                    });
                  }

                  removeAddSeatButtons();
                  // @ts-ignore
                  addSeatButtons(group, graphTable);
                
}


/**  
 * The function repositions the seats of a table.
 * @param group  the table (Konva:Group)  at which the seats will be repositioned.
 * */
function repositionSeats(group:Konva.Group) {
                      group.children.each(function (graphSeat) {
                                    if (graphSeat.name() != 'seat') {
                                        return;
                                    }
                                    var seat = seatList.get(graphSeat as Circle )[0];
                                    var text = seatList.get(graphSeat as Circle)[1];
                                    graphSeat.setPosition({x:seat.position[0], y:seat.position[1]});
                                    text.setPosition({x:seat.position[0] - 150, y:seat.position[1] - 30});
                                });
}




/**  
 * The function adds seat buttons to all possible positions of the table where a seat
 * can be added according to a fixed seat size and table size and seat space.
 * @param group        the table (Konva:Group) to which the seat buttons will be added
 * @param targetTable  the table to which the new seat will be added
 * */
function addSeatButtons(group:Group, targetTable:Konva.Shape) {
                      var table = tableList.get(group);

                      var graphTableRect = targetTable.getClientRect({});

                      if(table){
                          if (table.getShape() == TableShape.Rectangular || table.getShape() == TableShape.Circular) {                           
                                  table.repositionSeats();
                                  repositionSeats(group);
                                  var locations = table.getPossibleSeatLocations();
                                  for (var i = 0; i < locations.length; i++) {
                                      paintAddSeatButton(locations[i][0], locations[i][1], group);
                                  }
                          }

                      }else{
                          //throw some error
                      }

                      layer.draw();
}




/**  
 * The function  removes the seat buttons from a table
 * */
function removeAddSeatButtons() {
                            layer.children.each(function(group){
                              var buttonsLeft = true;
                                
                              while(buttonsLeft) {
                                buttonsLeft = false;
                                group.children.each(function(child) {
                                  if (child.name() == 'addSeatButton') {
                                    child.remove();
                                    buttonsLeft = true;
                                  }
                                });
                              }
                              
                            });
                            layer.draw();
}




/**  
 * The function   paints a green seat button, which help to add seat to a table by clicking on it.
 * @param posX    the x-coordinate of the position at which the seat button will be painted.   
 * @param posY    the y-coordinate of the position at which the seat button will be painted.  
 * @param group   the table (Konva:Group) at which the seat button will be drawn.
 * */ 
function paintAddSeatButton(posX: number, posY: number, group: Group) {
                          const radius = 10;
                          var seatButton = new Konva.Circle({
                              x: posX + radius,
                              y: posY + radius,
                              radius: radius,
                              fill: 'green',
                              draggable: false,
                              stroke: 'black',
                              name: 'addSeatButton',
                          });

                          seatButton.on('click', function(e){
                              var obj = e.target;                       
                              paintNewSeat(seatButton.x(), seatButton.y(), group);                                 
                              obj.remove();                                                          
                              layer.draw();
                          });
                          
                          var table = tableList.get(group);
                          if (table.getShape() == TableShape.Circular) {
                            var graphTable = findGraphTable(group);
                              seatButton.on('click', function(e) {
                                  // @ts-ignore
                                addSeatButtons(group, findGraphTable(group));
                              });
                          }
                          group.add(seatButton);
                          stage.draw();

}



/**  
 * The function   drawns a seat by creating konva:Text and Konva:Circle. If a person is assigned to the
 * seat, the seat change the color according to the gender of the person
 * @param posX    the x-coordinate of the position at which the seat will be drawn.   
 * @param posY    the y-coordinate of the position at which the seat will be drawn.  
 * @param group   the table (Konva:Group) at which the seat will be drawn.
 * @param seat    the seat to drawn.
 * @param person  the person to assign to the seat.
 * */
function drawSeat(posX:number, posY:number, group:Group, seat:Seat, person:Person | undefined) {
                  var radius = 30;
                  var seatName = new Konva.Text({
                      x : posX - 150,
                      y : posY - 30,
                      text : (person == null) ? '' : person.firstname + ' ' + person.lastname,
                      name : "seatName",
                      fontSize: 18,
                      fontFamily: 'Calibri',
                      fill: 'black',
                      width: 300,
                      padding: 20,
                      align: 'center',
                      draggable: false,
                  });
                  var color = 'grey';
                  if (person) {
                      if (person.gender === Gender.Male) {
                        color = 'teal';
                      }
                      else if (person.gender === Gender.Female) {
                        color = 'pink';
                      }
                      else if (person.gender === Gender.Divers) {
                        color = "purple";
                      }
                  }
                  var graphSeat = new Konva.Circle({
                      radius: radius,
                      x: posX,
                      y: posY,
                      fill: color,
                      draggable: false,
                      stroke: 'rgba(0,0,0,0.8)',
                      name: 'seat',
                  });
                            
                  var table = tableList.get(group);
                  addSeatToTable(table, posX, posY, seat);
                  group.add(graphSeat);
                  group.add(seatName);
                  seatList.set(graphSeat, [seat, seatName]);
                  stage.draw();
                  return group;
}




/**  
 * The function   paints a new Seat by clicking on the seat button.
 * @param posX   the x-coordinate of the position at which the seat will be painted.   
 * @param posY   the y-coordinate of the position at which the seat will be painted. 
 * @param group  the table to which the new seat will be added
 * */
function paintNewSeat(posX: number, posY: number, group: Group) { 
                    var table = tableList.get(group);
                    var seat = new Seat(seatIDCounter, table.tableID, [posX, posY], 0, 0);
                    seatIDCounter++;                    
                    drawSeat(posX, posY, group, seat, null);
}




// to determine Seat Position on the Stage
function determineSeatPosition(seatposition:number, tableStart:number):number {
                              var position = seatposition - tableStart;
                              return Math.floor(position/100);
}




/**  
 * The function   determines through the position of the seat in relation to the table,
 *  where the seat has to be stored in the table
 * @param table the table to which a seat must be added.
 * @param posX  the x-coordinate of the position of the seat in relation to the table.   
 * @param posY  the y-coordinate of the position of the seat in relation to the table. 
 * @param Seat  the seat to add
 * */ 
function addSeatToTable(table:Table, posX:number, posY:number, seat:Seat) {
                      switch(table.getShape()) {
                              case TableShape.Rectangular:{
                                    var rectTable:RectangularTable = table as RectangularTable;
                                    var upY = rectTable.position[1];
                                    var downY = rectTable.position[1] + rectTable.scaleY;
                                    var rightX = rectTable.position[0] + rectTable.scaleX;
                                    var leftX = rectTable.position[0];
                                    var direction = Direction.Up;

                                    posX = rectTable.position[0] + rectTable.scaleX/2 + posX;
                                    posY = rectTable.position[1] + rectTable.scaleY/2 + posY;
                                    var position = determineSeatPosition(posX, leftX);
                                    if (posX > rightX) {
                                        direction = Direction.Right;
                                        position = determineSeatPosition(posY, upY);
                                    } else 
                                    if (posX < leftX) {
                                        direction = Direction.Left;
                                        position = determineSeatPosition(posY, upY);
                                    } else
                                    if (posY > downY) {
                                        direction = Direction.Down;
                                        position = determineSeatPosition(posX, leftX);
                                    }                                
                                    rectTable.addSeat(direction, position, seat);
                                    break;
                              }
                              case TableShape.Circular:{
                                    var circTable:CircularTable = table as CircularTable;
                                    circTable.addSeat(seat);
                                    break;
                              }
                      
                      }
  
}


/***
 *  The function 'grouphide(grp)' hides a context a contextMenu when it will be called .
 *  @param grp  is a Konva:Group which  representiert  the  group  of  the   button of
 *  the contextmenu. This function is called both in the functions contextMenuButtons1 &
 *  contextMenuButtons2 
 * */
function grouphide(grp: Group){
                  grp.hide();
                  ContextMenuUnique = false;
                  layer.draw();
}



/**
 * idk why but apparently this function needs to be global
 * @param data the dataURL
 * @param name the name for the exported image
 * */
function downloadURI(data : string, name : string) {
    let link = document.createElement('a');
    link.download = name;
    link.href = data;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}




/***************main Vue class of the component *************************************** */

//Needs to be called once to set up the canvas

    @Component({})

export default class Playground extends Vue{

  modalTableName: string = "";
  modalTable: Table | undefined = undefined;
  rotate = false; //boolean to determine whether rotation is currently on or not

 

  @Prop({ default: function () {
        return new Veranstaltung("", new Date(), "", []);
  }}) eventProp : Veranstaltung | undefined = undefined;

  @Watch('eventProp', {deep: false})
    onEventPropChanged(newEvent:Veranstaltung) {
      if (!initialized){
          this.init();
      }
      if (newEvent.rooms[0].tables.length === 0){
          return;
      }
      this.clearCanvas();
      var tables = newEvent.rooms[0].tables;
      var people = newEvent.persons;
      tables.forEach((table) => {
          this.loadTable(table, people);
      });
   }

  handleSubmit() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
          return;
      }
      this.modalTable.name = this.modalTableName;
      tableNames.get(this.modalTable).text(this.modalTableName);
      layer.draw();
  }



  checkFormValidity() {
      // @ts-ignore
      const valid = this.$refs.form.checkValidity();
      // @ts-ignore
      this.state = valid ? 'valid' : 'invalid';
      return valid;
  }



  //code from https://konvajs.org/docs/data_and_serialization/High-Quality-Export.html
  download(){
      if (!initialized){
          this.init();
      }
      stage.toDataURL({callback:
              function(dataURL) {
                  downloadURI(dataURL, 'stage.png');
              }
      });
  }



 //
  resetModal() {
      // @ts-ignore
      this.state = null;
  }     


  /**
  * this function is called,when dragging something over the canvas
  * @param ev  event
  * */
  allowDrop(ev) {
          ev.preventDefault();
  }



  /**
  * this function is called, when something is dropped over the canvas
  * @param ev  dropped event. this event can be a Person or a Table
  * */
  drop(ev) {
          ev.preventDefault();
          if (!initialized) {
            this.init();
          }
          var x = ev.clientX;
          var y = ev.clientY;
          var canv = document.getElementById("canvas");
          var rect = canv.getBoundingClientRect();
          if (ev.dataTransfer.getData("person-id") != "") {
              layer.children.each((group) => {
                  group.children.each((child) => {
                      if(child.hasName('seat')) {
                          var boundingbox = child.getClientRect({});
                          if (boundingbox.x < x - rect.left && boundingbox.x + boundingbox.width > x - rect.left && boundingbox.y < y - rect.top && boundingbox.y + boundingbox.height > y -rect.top) {
                              var seatPlusText = seatList.get(child as Circle);
                              var seatText:Konva.Text | undefined = seatPlusText[1];
                              var seat:Seat | undefined = seatPlusText[0];
                              var personID = ev.dataTransfer.getData("person-id");
                              if (seatText == undefined || seat == undefined) {
                                  return;
                              }
                              for (let [seatGraph, seatData] of seatList) {
                                var s = seatData[0];
                                if (s.personID == personID) {
                                    this.$emit("removedPerson", {id: s.personID});
                                    s.personID = 0;
                                    seatData[1].text("");
                                    seatGraph.fill("grey");
                                }
                              }
                              seat.personID = personID;
                              this.$emit("placedPerson", {id: personID, seatId: seat.seatNumber, tableId: seat.tableID});
                              seatText.text(ev.dataTransfer.getData("person-firstname") + " " + ev.dataTransfer.getData("person-lastname"));
                              if ( ev.dataTransfer.getData("person-gender") == Gender.Male){
                                  (child as Circle).fill('teal');
                              }
                              else if (ev.dataTransfer.getData("person-gender") == Gender.Female){
                                  (child as Circle).fill('pink');
                              }
                              else if (ev.dataTransfer.getData("person-gender") == Gender.Divers) {
                                  (child as Circle).fill('purple')
                              }
                              
                              layer.draw();
                          } 
                      }
                  });
              });
              return;
          }
            
          if (ev.dataTransfer.getData("tableShape") == "") {
              return;
          }             
          var offX = parseInt(ev.dataTransfer.getData("offsetX"), 10);
          var offY = parseInt(ev.dataTransfer.getData("offsetY"), 10);
          let scrollX = document.getElementById("canvas").scrollLeft;
          let scrollY = document.getElementById("canvas").scrollTop;
          /*for some reason this is the best position we can get the drawn table to the actual drop position
          * the magic number 50 in here is a certain offset that fixes it, we can't get it any closer with other numbers, so
          * that's why there is a random 50 that places the table*/
          let finalX = scrollX + x - offX - rect.left - 50;
          let finalY = scrollY + y - offY - rect.top;
          //var finalX = x - rect.left - offX;
          //var finalY =  y - rect.top - offY;
          if (ev.dataTransfer.getData("tableShape") == "rectangleTable") {
              this.paintNewRectTable(finalX, finalY, 100, 100);
          }
          if (ev.dataTransfer.getData("tableShape") == "roundTable") {
              this.paintNewRoundTable(finalX, finalY, 50);               
          }
              
          layer.draw();
  }

  /**
  * this function clears the canvas, by removing the Konva:layer from the Konva:Stage 
  * with a new empty layer 
  * */
  clearCanvas() {
          if (!initialized) {
              return;
          }
          layer.remove();
          layer = new Konva.Layer();
          stage.add(layer);
          layer.draw();
  }


// function of kevin
  loadTable(table:Table, people:Person[] | undefined) {
          if (!initialized) {
              this.init();
          }           
          var group:Group = this.drawTable(table.getShape(), table.position[0], table.position[1], table.name, table.scaleX, table.scaleY, table.rotation, table);
          tableIDCounter = Math.max(table.tableID + 1, tableIDCounter + 1);
          table.seats.forEach(function(seat) {
              let seatedperson;
              if (people != undefined && seat.personID != 0) {
                  for (var i = 0; i < people.length; i++) {
                      if (seat.personID == people[i].id) {
                          seatedperson = people[i];
                          break;
                      }
                   }
              }

              drawSeat(seat.position[0], seat.position[1], group, seat, seatedperson);    
               seatIDCounter = Math.max(seat.seatNumber + 1, seatIDCounter + 1);
          });
    
  }


  /**  
  * The function   drawns a table on the canvas by creating a konva:Group,a Konva:Text and a Konva:Rect or onva.Circle. 
  * @param shape    the shape of the table ( circular or rectangular). 
  * @param posX     the x-position of the dropped event ( Table form) on canvas.   
  * @param posY     the y-position of the dropped event ( Table form) on canvas.  
  * @param name     the name of the table
  * @param scaleX   the scaled x-position
  * @param scaleY   the scaled y-position
  * @param rotation the size of rotation
  * @param table    the new table object which is created
  * */
  drawTable(shape:TableShape, posX:number, posY:number, name:string, scaleX:number, scaleY:number, rotation:number, table:Table):Konva.Group {
          var group:Group = new Konva.Group({
              x:posX + 50,
              y:posY + 50,
              draggable:true,
              name: 'group' + tableIDCounter,
          });
          var tableName = new Konva.Text({
              x: -150,
              y: 0,
              text: name,
              fontSize: 18,
              fontFamily: 'Calibri',
              fill: '#555',
              width: 300,
              padding: 20,
              align: 'center',
              name: 'tableName',
          });
          var graphTable:Konva.Shape = new Konva.Shape();
          
          if (shape == TableShape.Rectangular) {
              graphTable = new Konva.Rect({
                  x: -scaleX/2,
                  y: -scaleY/2,
                  width: scaleX,
                  height: scaleY,
                  fill:  'white',              
                  stroke: 'black',
                  draggable: false,
                  name: 'table',
                  rotation: rotation,
              });
          }
          if (shape == TableShape.Circular) {
              graphTable = new Konva.Circle({
                  x:  0,
                  y:  0,
                  radius: scaleX,
                  fill: 'white',
                  stroke: 'black',
                  draggable: false,
                  name: 'table',
                  rotation: rotation,
              });
          }
          group.on('dragmove', function(e) {
              tableList.get(group).position = [group.x(), group.y()];
          });
          
          group.add(graphTable);
          group.add(tableName);
          layer.add(group);
          layer.draw();
          tableList.set(group, table);
          tableNames.set(table, tableName)
          tableIDCounter++;
          //rotateTable(group, rotation);
          this.sendTablesToApp();
          return group;
  }



  /**
   * when called sends the updated tablelist to App.vue to prepare for export
   **/
  sendTablesToApp() {
            //get all tables so they can be saved in the event
            let tablearray : Table[] = [];
            tableList.forEach((obj,key) => {
                obj.position[0] = key.x();
                obj.position[1] = key.y();
                tablearray.push(obj);
            });

            //sends the tables to the app so they can be saved for export
            this.$emit("new-table", {details: tablearray});
        }



  /**  
  * The function   paints a dropped table on the canvas and creates automaticaly a new round table object. 
  * @param posX     the x-position of the dropped round table form on canvas.   
  * @param posY     the y-position of the dropped round table form on canvas.  
  * @param radius   the radius of the round table
  * */
  paintNewRoundTable(posX: number, posY: number, radius: number) {
          var table:Table = new CircularTable([], tableIDCounter, roomID, [posX + radius, posY + radius], 0, radius, radius, "");
          var group = this.drawTable(TableShape.Circular, posX, posY, "", radius, radius, 0, table);
  }



  /**  
  * The function   paints a dropped table on the canvas and creates automaticaly a new rectangular table object. 
  * @param posX     the x-position of the dropped rectangular table form on canvas.   
  * @param posY     the y-position of the dropped rectangular table form on canvas.  
  * @param width    the width of the rectangular table
  * @param height   the height of the rectangular table
  * */
  paintNewRectTable(posX: number, posY: number, width: number, height: number) {
          var table:Table = new RectangularTable([], tableIDCounter, roomID, [posX, posY], 0, width, height, "");
          var group = this.drawTable(TableShape.Rectangular, posX, posY, "", width, height, 0, table);
  }



  /**
   * when called can placed scale transformer by clicking on the table or remove it by clicking on stage 
   **/ 
  scalableFunction(){   
          stage.on('click', function(e) {
              if (e.target == stage) {
                  removeAddSeatButtons();
                  removeTransformer();
              }                
              // do nothing if clicked NOT on our tables
              if (!e.target.hasName('table') && !e.target.hasName('tableName') && !e.target.hasName('seatName')) {             
                  return;
              }
              var group= e.target.parent;
              var targetTable = e.target;
              if (e.target.hasName('tableName') || e.target.hasName('seatName')) {
                  group.children.each(function (child) {
                  if (child.hasName('table')) {
                      // @ts-ignore
                      targetTable = child;
                      return;
                  }
                });
              }
              removeAddSeatButtons();
              removeTransformer();
              placeTransformer(group as unknown as Group);
              // @ts-ignore
              addSeatButtons(group as unknown as Group, targetTable);
              layer.draw();  
          });
  }



  /**
   * when called can open a context menu in order to apply different functions on tables and seats 
   **/
  ContextMenuOnStage() {
      stage.on('contextmenu', (e) => {
          // prevent default behavior
          e.evt.preventDefault();
          if (e.target === stage) {
              // if we are on empty place of the stage we will do nothing
              const posX: number = stage.pointerPos.x;
              const posY: number = stage.pointerPos.y;
              this.contextMenuOnStage(posX, posY, ContextMenuUnique);
          }

          var grp1 = e.target;
          if (e.target.name() == 'seatName' || e.target.name() == 'seat') {
              const poX: number = stage.pointerPos.x + 4;
              const poY: number = stage.pointerPos.y + 4;
              this.contextMenuButtonsOnSeat(grp1, poX, poY, ContextMenuUnique);
          }
          if (e.target.name() == 'tableName' || e.target.name() == 'table') {
              const poX: number = stage.pointerPos.x + 4;
              const poY: number = stage.pointerPos.y + 4;
              var grp = e.target.parent;
              this.contextMenuButtonsOnTable(grp, poX, poY, ContextMenuUnique);
          }

      });
  }

  /**  
  * by right clicking on table, this function will be called. the function creates a contextmenu with different
  * functions, which can be applied on the table 
  * @param even        the event on which the context menu is opened. 
  * @param posX        the x-position of the event   
  * @param posY        the y-position of the event   
  * @param condition   the condition for opening the contextmenu 
  * */
  contextMenuButtonsOnTable (even, posX:number, posY:number, condition:boolean) {
      if (!condition) {
          var menuData1 = {
              options: [
                  {id: 0, key: 'opt1', text: 'Tisch umbenennen      '},
                  {id: 1, key: 'opt2', text: !this.rotate ? 'Rotation   (Ein)              ' : 'Rotation   (Aus)             '},
                  {id: 2, key: 'opt3', text: 'Tisch löschen                 '}
              ]
          };
          ContextMenuUnique = true;
          var groupp = new Konva.Group({});
          var colors = ['white', 'gold'];
          menuData1.options.forEach(option => {
              if (option.key != 'opt1') {
                  var butt = groupp.getChildren((function (node) {
                      return node.getClassName() === 'Label';
                  }));
                  posY = posY + butt[0].height();
              }
              var button = new Konva.Label({
                  x: posX,
                  y: posY,
                  id: option.id,
                  width: 100,
                  height: 50,
                  opacity: 1
              });
              layer.add(button);
              button.add(new Konva.Tag({
                  fill: 'white',
                  lineJoin: 'round',
                  shadowColor: 'black',
                  shadowBlur: 10,
                  shadowOpacity: 0.5
              }));
              button.add(new Konva.Text({
                  text: option.text,
                  fontFamily: 'Calibri',
                  fontSize: 18,
                  padding: 5,
                  listening: false,
                  verticalAlign: 'middle',
                  fill: 'black'
              }));
              if (option.key === 'opt1') {
                  // function Tisch editieren
                  button.on('click', () => {
                      this.modalTable = tableList.get(even);
                      this.modalTableName = this.modalTable.name;
                      this.$bvModal.show('edit-table');
                      grouphide(groupp);
                  })
              }
              if (option.key === 'opt2') {
                  // rotation
                  if (!this.rotate) {//enable rotation
                      button.on('click', () => {
                          layer.add(RotationTransformer);
                          RotationTransformer.attachTo(even);
                          RotationTransformer.show();
                          grouphide(groupp);
                          this.rotate = true;
                      })
                  } else {
                      //disable rotation
                      button.on('click', () => {
                          RotationTransformer.hide();
                          grouphide(groupp);
                          this.rotate = false;
                      })
                  }
              }
              if (option.key == 'opt3') {
                  // function remove Table
                  button.on('click', () => {
                      this.removeTable(even);
                      RotationTransformer.hide();
                      grouphide(groupp);
                  })
              }
              groupp.add(button);
          });
          groupp.on('mouseleave', function () {
              grouphide(groupp);
          });
          stage.on('click', function () {
              grouphide(groupp);
          });
          layer.add(groupp);
          layer.draw();
          return groupp
      }
  }

 /**  
  * by right clicking on seat, this function will be called. the function creates a contextmenu with different
  * functions, which can be applied on the seats 
  * @param even        the event on which the context menu is opened. 
  * @param posX        the x-position of the event   
  * @param posY        the y-position of the event   
  * @param condition   the condition for opening the contextmenu 
  * */
 contextMenuButtonsOnSeat (even, posX:number, posY:number,condition:boolean) {
     if (!condition) {
         var menuData1 = {
             options: [
                 {key: 'opt1', text: 'Person entfernen'},
                 {key: 'opt2', text: 'Stuhl löschen       '},
             ]
         };
         ContextMenuUnique = true;
         var groupp = new Konva.Group({});
         for (var i = 0; i < 2; i = i + 1) {
             var option = menuData1.options[i];
             if (i != 0) {
                 var butt = groupp.getChildren((function (node) {
                     return node.getClassName() === 'Label';
                 }))
                 posY = posY + butt[0].height();
             }
             var button = new Konva.Label({
                 x: posX,
                 y: posY,
                 id: i,
                 width: 100,
                 height: 50,
                 opacity: 1
             });
             layer.add(button);
             button.add(new Konva.Tag({
                 fill: 'white',
                 lineJoin: 'round',
                 shadowColor: 'black',
                 shadowBlur: 10,
                 shadowOpacity: 0.5
             }));
             button.add(new Konva.Text({
                 text: option.text,
                 fontFamily: 'Calibri',
                 fontSize: 18,
                 padding: 5,
                 listening: false,
                 verticalAlign: 'middle',
                 fill: 'black'
             }));
             if (i == 0) {
                 // function Personen entfernen
                 button.on('click', () => {
                     this.PersoneOnChairRemove(even);
                     grouphide(groupp);
                 })
             }
             if (i == 1) {
                 // function remove chaise
                 button.on('click', () => {
                     this.removeChair(even);
                     grouphide(groupp);
                 })
             }
             groupp.add(button);
         }
         groupp.on('mouseleave', function () {
             grouphide(groupp);
         })
         stage.on('click', function () {
             grouphide(groupp);
         })
         layer.add(groupp);
         layer.draw();
         return groupp;
     }
 }


 /**
  * opens a contextmenu on the stage that lets you download a picture of the canvas
  * @param posX x-Position of the mouspointer
  * @param posY y-Position of the mouspointer
  * @param uniqueMenu true if another contexmneu is already open
  * */
 contextMenuOnStage(posX: number, posY: number, uniqueMenu: boolean) {
     if (uniqueMenu){
         return
     }
     let menu = {
         options: [
             {id: 0, text: 'Tischplan exportieren'}
         ]
     };
     ContextMenuUnique = true;
     let group = new Konva.Group();
     menu.options.forEach(option => {

         let button = new Konva.Label({
             x: posX,
             y: posY,
             id: option.id,
             width: 100,
             height: 50,
             opacity: 1
         });

         layer.add(button);
         button.add(new Konva.Tag({
             fill: 'white',
             lineJoin: 'round',
             shadowColor: 'black',
             shadowBlur: 10,
             shadowOpacity: 0.5
         }));

         button.add(new Konva.Text({
             text: option.text,
             fontFamily: 'Calibri',
             fontSize: 18,
             padding: 5,
             listening: false,
             verticalAlign: 'middle',
             fill: 'black'
         }));

         if (option.id === 0) {
             button.on("click", () => {
                 grouphide(group);//avoid the download button being exported as well
                 this.download();
             });
         }
         group.add(button);

         group.on('mouseleave', function () {
             grouphide(group);
         });

         stage.on('click', function () {
             grouphide(group);
         });

         layer.add(group);
         layer.draw();
         return group;

     });
 }



  
 /***  The function 'PersoneOnChairRemove(e)' removes a assigned person to a chair. 
      After removing the color of the chair becomes again gray.The argument (e) 
      of the function is a Konva:Shape. This function is called when you click on
      'Person entfernen' on the Interface */
 PersoneOnChairRemove(e) {    
                        var group = e.parent;
                        group.children.each((child) => {
                            if (child.hasName("seat")) {
                                if ( (child.x() == e.x() + 150) && (child.y() == e.y()+ 30)) {
                                    var seatPlusText = seatList.get(child);
                                    var seatText:Konva.Text | undefined = seatPlusText[1];
                                    var seat:Seat | undefined = seatPlusText[0];
                                    child.fill("grey");
                                    seatText.text('');
                                    this.$emit("removedPerson", {id: seat.personID});
                                    seat.personID = 0;
                                    layer.draw();
                                }
                            }
                        });
        
 }

 /**  
 * The function   removes  a  table with  his  chairs  from  the room also all assigned
 *  persons. This function is called when you click on 'Tisch löschen' on the Interface.
 * @param group  Konva:Group. is a group of table and seats.
 * */     
removeTable(group:Group) {
                    var table = tableList.get(group);
                    if (table == undefined) {
                        return;
                    }
                    tableList.delete(group);
                    while (group.children.length > 0) {
                        group.children.each((child) => {
                            if (child.hasName('seat')) {
                                this.$emit("removedPerson", {id: seatList.get(child as Circle)[0].personID});
                                seatList.delete(child as Circle );
                            }
                            child.remove();
                        });
                    }
                    group.remove();
                    removeAddSeatButtons();
                    removeTransformer();
                    layer.draw();
                    this.sendTablesToApp();
}

 /***  The function 'removeChair(e)' removes a chair from a table. It removes
      also automaticaly a Person who is assigned to this chair. The argument (e)
      of the function is a Konva:Shape.This function is called when you click on
      'Stühl löschen' on the Interface */
 removeChair(e) {
                var group = e.parent;
                this.PersoneOnChairRemove(e)
                group.children.each(function (child) {
                    if (child.hasName("seat")) {
                        if ( (child.x() == e.x() + 150) && (child.y() == e.y()+ 30)) {
                            let table = tableList.get(group);
                            switch (table.getShape()) {
                                case TableShape.Circular:
                                    let circTable = table as CircularTable;
                                    circTable.removeSeat(seatList.get(child)[0])
                                    break;
                                case TableShape.Rectangular:
                                    let rectTable = table as RectangularTable;
                                    rectTable.deleteSeat(seatList.get(child)[0]);
                                    break;
                            }
                            child.remove()
                            seatList.delete(child);
                            seatIDCounter--;
                        }       
                    }
                    
                    });
                layer.draw();
                this.sendTablesToApp();
 }


 /***  The function 'init()' initialize the playground by creating a new Konva:Stage. 
   It will be called, when a table is draged on the playground, particulary in the function
   drop(e).  */
  init() {       
        stage = new Konva.Stage({
            container: "canvas",
            width: canvasWidth,
            height: canvasHeight
        });
        stage.add(layer);
        layer.draw();
        initialized = true;
        this.ContextMenuOnStage();
        this.scalableFunction();
  }



}
</script>

<style>
#canvas{
  display: table-cell;
	height: 90%;
  width: 75%;
	vertical-align: top;
  text-align: center;
  position: fixed;
  z-index: 1;
  top: 10%;
  right: 0;
  overflow-y: scroll;
  overflow-x: scroll;
  background-color: rgb(219, 231, 235);
  }
</style>