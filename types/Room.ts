import { Table} from "./Table";

/***
 * This class represents a room
 */
export class Room {
    roomName: string;
    roomID: number;
    tables: Table[];


    /***
     * A constructor for a room
     * @param roomName: the name of the room
     * @param roomID: the id of the room
     * @param tables: the tables which are placed inside the room
     */
    constructor(roomName: string, roomID: number, tables: Table[]) {
        this.roomName = roomName;
        this.roomID = roomID;
        this.tables = tables;
    }

}
