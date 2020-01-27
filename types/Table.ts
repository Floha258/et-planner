import { Placable } from "./Placable";
import { Seat } from "./Seat";
import { Direction } from "./Direction";
import { TableShape } from "./TableShape";


/***
 * This class represents a table which can be placed on the canvas
 */
export abstract class Table extends Placable {
    seats: Seat[];
    seatnumber: number; //number of seats the table has
    tableID: number;
    roomId: number;
    name: string;

    /***
     * Constructor for the table
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
    constructor(seats: Seat[], tableID: number, roomID: number, [positionX, positionY]: [number, number],
                rotation: number, scaleX: number, scaleY: number, name: string) {
        super([positionX, positionY], rotation, scaleX, scaleY);

        this.seats = seats;
        this.seatnumber = 0;
        this.tableID = tableID;
        this.roomId = roomID;
        this.name = name;

    }

    abstract getShape(): TableShape;

    abstract getPossibleSeatLocations(): [number, number][];

    public abstract repositionSeats(): void;

    public getTableID() {
        return this.tableID;
    }

}