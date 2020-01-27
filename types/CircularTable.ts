import { Table } from "./Table";
import { Seat } from "./Seat";
import {TableShape} from "./TableShape";

/***
 * A class which implements a circular table
 */

export class CircularTable extends Table {

    /***
     * A constructor for a circular table
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
    constructor(seats: Seat[], tableID: number, roomID: number, [positionX, positionY]: [number, number], rotation: number,
                scaleX: number, scaleY: number, name: string) {

        super(seats, tableID, roomID, [positionX, positionY], rotation, scaleX, scaleY, name);

    }

    seatAmount: number = 0;


    /*
     This method returns possible locations of the seats
     */
    getPossibleSeatLocations() {
        if (this.seatAmount >= this.scaleX / 10) {
            return [];
        }
        var locations: [number, number][] = new Array();
        locations.push([-10, -10]);
        return locations;
    }

    /***
     * This method repositions the seats of the table accordingly if the size of the table gets changed or the table gets rotated
     *
     */
    repositionSeats() {
        for (var i: number = 0; i < this.seatAmount; i++) {
            var seat = this.seats[i];
            var angle = (360 / (this.seatAmount)) * i * 2 * Math.PI / 360;
            seat.position = [(this.scaleX + 30) * Math.cos(angle), (this.scaleX + 30) * Math.sin(angle)];
        }
    }


    /***
     * This method adds a seat to the table
     * @param seat: the seat to be added
     */
    addSeat(seat: Seat) {
        this.seats.push(seat);
        this.seatAmount++;
        this.repositionSeats();
    }

     
    /***
     * This method remove a seat from the table
     * @param seat: the seat to be removed
     */
    removeSeat(seat: Seat){
        let id = seat.seatNumber;
        for (let i = 0; i< this.seats.length; i++) { 
            if (id == this.seats[i].seatNumber){
            //console.log(id, this.seats[i].seatNumber)
            this.seats.splice(i, 1);
            this.seatAmount--;
            }
        }       
    }

    /*
    This method return the shape of the table (TableShape.Circular)
    */
    getShape() {
        return TableShape.Circular;


    }
}
