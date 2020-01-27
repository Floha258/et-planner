import {Gender} from "../../types/Gender";
<template>
    <div class="loadevent">
        <b-dropdown-item v-b-modal.import-event>
            Veranstaltung laden
            <b-modal id="import-event" title="Bitte wählen Sie Ihre Datei aus." >
                <input id="fileInput" ref="fileInput" type="file" accept=".json" v-on:change="readFile">
            </b-modal>
        </b-dropdown-item>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {Seat} from "../../types/Seat";
    import {Room} from "../../types/Room";
    import {Person} from "../../types/Person";
    import {Table} from "../../types/Table";
    import {RectangularTable} from "../../types/RectangularTable";
    import {CircularTable} from "../../types/CircularTable"
    import {Group} from "../../types/Group";
    import {Gender} from "../../types/Gender";
    import {Veranstaltung} from "../../types/Veranstaltung";
    import {JSONevent} from "../../types/JSONevent";

    @Component({
    })

    export default class LoadEvent extends Vue {

        event: Veranstaltung = new Veranstaltung("", new Date(""),"",[]);//initalizing with dummy event so it's not undefined

        /***
         * reads an uploaded file by the user and snds it to the parser
         * @param event: the event that triggered the upload
         */
        readFile(event : any) : void {
            let file : File = event.target.files[0];
            const reader = new FileReader();
            reader.readAsText(file);

            reader.onload = e => {
                if (!e.target) {
                    return
                }
                // @ts-ignore
                this.parse(e.target.result.toString());
                return;
            }
        }

        /***
         * parses the given filecontent from readFile and creates the appropiate event
         * @param fileContent the text of the given file
         */
        parse (fileContent : string) : void {
            const json = JSON.parse(fileContent);
            let rooms : Room[] = [];
            if (json.rooms && json.rooms != []) {
                json.rooms.forEach((jsonRoom: any) => rooms.push(this.parseRooms(jsonRoom)));
            }
            let groups : Group[] = [];
            if (json.groups && json.groups != []) {
                json.groups.forEach((jsonGroup: any) => groups.push(this.parseGroups(jsonGroup)));
            }
            let guests : Person[] = [];
            if (json.guests && json.guests != []) {
                json.guests.forEach((jsonGuest: any) => guests.push(this.parseGuests(jsonGuest)));
            }
            this.event = new Veranstaltung(json.eventname, new Date(json.date), json.place, rooms, groups, guests);
            this.$emit('loaded-event', this.event);
            return;
        }

        /**
         * parses all entires of the room array of a json
         * @param jsonRoom the current room that's supposed to be parsed
         */
        parseRooms(jsonRoom) : Room {
            let tables : Table[] = [];
            jsonRoom.tables.forEach( (jsonTable : any ) => tables.push(this.parseTables(jsonTable)));
            let room : Room = new Room(jsonRoom.roomname, jsonRoom.roomid, tables);
            return room;
        }

        /**
         * parses all entires of the tables array of a json
         * @param jsonTable the current table that's supposed to be parsed
         */
        parseTables(jsonTable) : Table {
            let seats : Seat[] = [];
            jsonTable.seats.forEach( (jsonSeat : any ) => seats.push(this.parseSeats(jsonSeat)));
            switch (jsonTable.shape) {
                case (0):
                    // eslint-disable-next-line no-case-declarations
                    return new CircularTable(seats, jsonTable.tableid, jsonTable.roomid,
                        [jsonTable.positionx, jsonTable.positiony], jsonTable.rotation, jsonTable.scalex, jsonTable.scaley, jsonTable.tablename);
                case (1):
                    // eslint-disable-next-line no-case-declarations
                    return new RectangularTable(seats, jsonTable.tableid, jsonTable.roomid,
                        [jsonTable.positionx, jsonTable.positiony], jsonTable.rotation, jsonTable.scalex, jsonTable.scaley, jsonTable.tablename);
                default://this code should be unreachable
                    return new RectangularTable([], 0, 0, [ -1, -1], -1,
                        -1, -1, "");//i need to return something so i return a dummy table
            }
        }

        /**
         * parses the seats of a json
         * @param jsonSeat the seat that's supposed to be parsed
         */
        private parseSeats(jsonSeat) : Seat {
            let seat : Seat = new Seat(jsonSeat.seatnumber, jsonSeat.tableid, [jsonSeat.positionx, jsonSeat.positiony],
                jsonSeat.rotation, jsonSeat.personid);
            return seat;
        }

        /**
         * parses the groups of a json
         * @param jsonGroup the group that's supposed to be parsed
         */
        private parseGroups(jsonGroup) {
            let members = [];
            jsonGroup.members.forEach( member => { members.push(this.parseGuests(member))});
            let group = new Group(jsonGroup.groupid, members, jsonGroup.groupname);
            return group;
        }

        /**
         * pareses the guests of a json
         * @param jsonGuest the guests that's supposed to be parsed
         */
        private parseGuests(jsonGuest) {
            let gender = Gender.Male;
            if (jsonGuest.gender === 1) {
                gender = Gender.Female
            }
            if (jsonGuest.gender === 2) {
                gender = Gender.Divers;
            }
            let birthdate = jsonGuest.birthdate ? new Date(jsonGuest.birthdate) : new Date("01-01-1970");
            let seatid = jsonGuest.seatid ? jsonGuest.seatid : 0;
            let tableid = jsonGuest.tableid ? jsonGuest.tableid : 0;
            let attendance = jsonGuest.attendance ? jsonGuest.attendance : 0;
            let guest = new Person(jsonGuest.id, jsonGuest.firstname, jsonGuest.lastname, gender, jsonGuest.groupids,
                birthdate, jsonGuest.title, jsonGuest.email, jsonGuest.comments, seatid,
                tableid, attendance);
            return guest;
        }
    }
</script>

<style scoped>

</style>