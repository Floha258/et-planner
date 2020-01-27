import { iEvent } from "./iEvent";
import { Room } from "./Room";
import { Person } from "./Person";
import { Group } from "./Group";

/***
This class represents an event for which the seating plan can be created
*/
export class Veranstaltung implements iEvent{
    eventName: string;    
    date: Date;
    place: string;
    rooms: Room[];
    groups?: Group[];
    persons?: Person[];

    public constructor(eventName: string, date: Date, place: string, rooms: Room[], groups: Group[] = [], persons: Person[] = []){
        this.eventName = eventName;
        this.date = date;
        this.place = place;
        this.rooms = rooms;
        this.groups = groups;
        this.persons = persons;
    }

    /*
    Allows to change the data of an event
    */
    /***
     *
     * @param eventName: the name of the event
     * @param date: the date of when the event will occur
     * @param place: the location of the event
     * @param rooms: the rooms in which the event will be held
     * @param persons: the attending guests
     */
    public changeEventData(eventName?: string, date?: Date, place?: string, rooms?: Room[], persons?: Person[]){
        if (eventName) {
            this.eventName = eventName;
        }
        if (date) {
            this.date = date;
        }
        if (place) {
            this.place = place;
        }
        if (rooms) {
            this.rooms = rooms;
        }
        if(persons){
            this.persons = persons;
        }
    }

    
}