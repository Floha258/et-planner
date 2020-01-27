/* eslint-disable */
import {Table} from "./Table";
import {Seat} from "./Seat";
import {Direction} from "./Direction";
import {TableShape} from "./TableShape";
const OFFSET = 40;
const SEAT_DISTANCE = 100;
const DISTANCE_TO_TABLE = 30;

/***
 * This class represents a rectangular table and is a prototype of Table.
 */
export class RectangularTable extends Table {
     seatMap: Map<Direction, (Seat | undefined)[]> = new Map();
     furthestX:number = 0;
     furthestY:number = 0;


     /***
      * A constructor for a rectangular table
      * @param seats: the seats of the table
      * @param tableID: the id of the table
      * @param roomID: the id of the room in which the table is located
      * @param positionX: the x-position on the canvas
      * @param positionY: the y-position on the canvas
      * @param rotation: the rotation of the table, clockwise
      * @param scaleX: the size in x direction
      * @param scaleY: the size in y direction
      * @param name: the name of the table (e.g VIP-table)
      */
     constructor(seats: Seat[], tableID: number, roomID: number, [positionX, positionY]: [number, number], rotation: number, scaleX: number, scaleY: number, name: string) {
          super(seats, tableID, roomID, [positionX, positionY], rotation, scaleX, scaleY, name);
          this.seatMap.set(Direction.Up, []);
          this.seatMap.set(Direction.Down, []);
          this.seatMap.set(Direction.Left, []);
          this.seatMap.set(Direction.Right, []);
     }


     /***
      This method repositions the seats.
      If no direction is given, nothing will be done
      */
     repositionSeats() {
          var upperRow = this.seatMap.get(Direction.Up);
          var lowerRow = this.seatMap.get(Direction.Down);
          var leftRow = this.seatMap.get(Direction.Left);
          var rightRow = this.seatMap.get(Direction.Right);
         
          // @ts-ignore
          for (var index = 0; index < upperRow.length; index++) {
               this.repositionSeat(Direction.Up, index);
          }
          // @ts-ignore
          for (index = 0; index < lowerRow.length; index++) {
               this.repositionSeat(Direction.Down, index);
          }
          // @ts-ignore
          for (index = 0; index < leftRow.length; index++) {
               this.repositionSeat(Direction.Left, index);
          }
          // @ts-ignore
          for (index = 0; index < rightRow.length; index++) {
               this.repositionSeat(Direction.Right, index);
          }
     }

     /***
      This method repositions one seat according to the given direction and the
      position.
      */
     repositionSeat(direction: Direction, index: number) {
          var leftX = this.position[0];
          var rightX = this.scaleX + this.position[0];
          var upY = this.position[1];
          var downY = this.scaleY + this.position[1];
          var seatrow = this.seatMap.get(direction);

          // @ts-ignore
          var seat = seatrow[index];
          if (seat == undefined) {
               return;
          }
          switch (direction) {
               case Direction.Up: {
                    // adding + 10 to align the seats correctly
                    seat.position[0] = index * SEAT_DISTANCE - this.scaleX/2 + OFFSET + 10;
                    seat.position[1] = -this.scaleY/2 - DISTANCE_TO_TABLE;
                    break;
               }
               case Direction.Down: {
                    seat.position[0] = index * SEAT_DISTANCE - this.scaleX/2 + OFFSET + 10;
                    seat.position[1] = this.scaleY/2 + DISTANCE_TO_TABLE;
                    break;
               }
               case Direction.Left: {
                    seat.position[0] = -this.scaleX/2 - DISTANCE_TO_TABLE;
                    seat.position[1] = index * SEAT_DISTANCE - this.scaleY/2 + OFFSET + 10;
                    break;
               }
               case Direction.Right: {
                    seat.position[0] = this.scaleX/2 + DISTANCE_TO_TABLE;
                    seat.position[1] = index * SEAT_DISTANCE - this.scaleY/2 + OFFSET + 10;
                    break;
               }
          }
     }

     /***
      This method returns possible locations of the seats
      */
     getPossibleSeatLocations() {
          var seatLocations: [number, number][] = new Array();
          var upperRow = this.seatMap.get(Direction.Up);
          var lowerRow = this.seatMap.get(Direction.Down);
          var leftRow = this.seatMap.get(Direction.Left);
          var rightRow = this.seatMap.get(Direction.Right);
          if (upperRow == undefined) {
               return [];
          }
          if (lowerRow == undefined) {
               return [];
          }
          if (leftRow == undefined) {
               return [];
          }
          if (rightRow == undefined) {
               return [];
          }

          var c = 0;
          for (var i = 0; i * 100 + OFFSET < this.scaleX; ++i) {
               if (i > upperRow.length || upperRow[i] == undefined) {
                    seatLocations[c] = [-this.scaleX/2 + OFFSET + SEAT_DISTANCE * i, -this.scaleY/2 - 40];
                    c++;
               }
               if (i > lowerRow.length || lowerRow[i] == undefined) {
                    seatLocations[c] = [-this.scaleX/2 + OFFSET + SEAT_DISTANCE * i, this.scaleY/2 + 20];
                    c++;
               }
          }
          for (i = 0; i * 100 + OFFSET < this.scaleY; ++i) {
               if (i > leftRow.length || leftRow[i] == undefined) {
                    seatLocations[c] = [-this.scaleX/2 - 40, -this.scaleY/2 + OFFSET + SEAT_DISTANCE * i];
                    c++;
               }
               if (i > rightRow.length || rightRow[i] == undefined) {
                    seatLocations[c] = [this.scaleX/2 + 20, -this.scaleY/2 + OFFSET + SEAT_DISTANCE * i];
                    c++;
               }
          }
          return seatLocations;
     }

     /***
      * This method adds a Seat to a table according to the direction and the position
      * @param direction
      * @param position
      * @param seat
      */
     addSeat(direction: Direction, index: number, seat: Seat) {
          this.seats.push(seat);
          var upperRow = this.seatMap.get(Direction.Up);
          var lowerRow = this.seatMap.get(Direction.Down);
          var leftRow = this.seatMap.get(Direction.Left);
          var rightRow = this.seatMap.get(Direction.Right);
          switch (direction) {
               case Direction.Up: {
                    while (upperRow.length <= index) {
                         upperRow.push(undefined);
                         lowerRow.push(undefined);
                    }
                    this.furthestX = Math.max(index, this.furthestX);
                    break;
               }
               case Direction.Down: {
                    while (lowerRow.length <= index) {
                         lowerRow.push(undefined);
                         upperRow.push(undefined);
                    }
                    this.furthestX = Math.max(index, this.furthestX);
                    break;
               }
               case Direction.Left: {
                    while (leftRow.length <= index) {
                         leftRow.push(undefined);
                         rightRow.push(undefined);
                    }
                    this.furthestY = Math.max(index, this.furthestY);
                    break;
               }
               case Direction.Right: {
                    while (rightRow.length <= index) {
                         rightRow.push(undefined);
                         leftRow.push(undefined);
                    }
                    this.furthestY = Math.max(index, this.furthestY);
                    break;
               }
          }
          var seatrow: Seat[] = this.seatMap.get(direction);
          if (index < seatrow.length) {
               seatrow[index] = seat;
          }
     }

     findFurthestSeat(seatrow:Seat[]):number {
          for (var i:number = seatrow.length - 1; i >= 0; i--) {
               if (seatrow[i] != undefined) {
                    return i;
               }
          }
          return 0;
     }


     findFurthestX() {
          this.furthestX = Math.max(this.findFurthestSeat(this.seatMap.get(Direction.Up)), this.findFurthestSeat(this.seatMap.get(Direction.Down)));
     }

     findFurthestY() {
          this.furthestY = Math.max(this.findFurthestSeat(this.seatMap.get(Direction.Left)), this.findFurthestSeat(this.seatMap.get(Direction.Right)));
     }

     /***
      * TODO: comments
      * @param direction
      * @param position
      */
     removeSeat(direction: Direction, index: number) {
          var seatrow = this.seatMap.get(direction);
          if (seatrow == undefined) {
               return;
          }
          var seat = seatrow[index];
          if (seat == undefined) {
               return;
          }
          
          this.seats.splice(this.seats.indexOf(seat), 1);
          
          this.seatMap.get(direction)[index] = undefined;
          switch (direction) {
               case Direction.Up: {
                    this.findFurthestX();
                    break;
               }
               case Direction.Down: {
                    this.findFurthestX();
                    break;
               }
               case Direction.Left: {
                    this.findFurthestY();
                    break;
               }
               case Direction.Right: {
                    this.findFurthestY();
                    break;
               }
          }
          //return seat;
     }

     deleteSeat(seat: Seat){
          let id = seat.seatNumber;

          for (let [key, value] of this.seatMap.entries()) {
               console.log(key, value, seat);
               value.forEach((s) => {
                    if (s)
                         console.log(id, s.seatNumber);
                    if (s && id === s.seatNumber){
                         this.removeSeat(key, this.seatMap.get(key).indexOf(seat));
                    }
               });
          }
     }

     /*
     This method return the shape of the table (TableShape.Circular)
     */
     getShape(): TableShape {
          return TableShape.Rectangular;


     }
}

