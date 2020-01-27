import { Placable } from "./Placable";

/***
 * This class represents a seat
 */
export class Seat extends Placable {
    seatNumber: number;
    tableID: number;
    personID: number;

    /***
     * This method is a constructor for a seat
     * @param seatNumber: the number of a seat
     * @param tableID: the id of the table the seat is placed at
     * @param positionX: the x-position on the canvas
     * @param positionY: the y-position on the canvas
     * @param rotation: the rotation; clockwise
     * @param personID: the id of the person seated on a table; if no person is seated, the value is 0
     */
     constructor(seatNumber: number, tableID: number, [positionX,positionY]: [number,number], rotation: number, personID: number) {
        super([positionX, positionY], rotation, 1.0, 1.0);
        this.seatNumber = seatNumber;
        this.tableID = tableID;
        this.personID = personID;
    }

}
