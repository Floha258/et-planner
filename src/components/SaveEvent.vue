<template>
    <div class="saveevent">
        <b-button variant="light" v-on:click="initiateSaveEvent">
            Veranstaltung speichern
        </b-button>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import {Seat} from "../../types/Seat";
    import {Room} from "../../types/Room";
    import {Person} from "../../types/Person";
    import {Table} from "../../types/Table";
    import {Group} from "../../types/Group";
    import {Veranstaltung} from "../../types/Veranstaltung";

    @Component({
    })
    export default class SaveEvent extends Vue {

        event: Veranstaltung | undefined;//initializing dummy event
        exportstring: String = "";

        @Prop({default: function () {
            return;
            }}) saveProp : Veranstaltung | undefined;

        @Watch('saveProp', {deep: true})
        onSavePropChanged(newVal: Veranstaltung) {
            this.event = newVal;
        }

        /***
         * This method sets up a dummy event for export
         */
        setEventUp(): Veranstaltung{

            /*var date = new Date(2019, 12, 20);
            var date1 = new Date(1943, 2, 23);
            var date2 = new Date(1972, 7, 8);
            var members: Array<number> = [1,2];
            var groupid = 1;
            var groupname = "VIP";
            var group = new Group(groupid, members, groupname);
            var groups: Array<Group> = [group];
            var guest1 = new Person(1, "Derek", "Sitzthier", Gender.Male, [1], date1, "Dr.",  "MarinaN@gmx.de", "Mag Fisch", 2, 1, 0);
            var guest2 = new Person(2, "Marina", "Nebenderek", Gender.Female, [1], date2, "",  "derekimnetz@gmx.de", "Mag Karotten", 1, 1, 0);
            var seat1 = new Seat(1, 1, [5,5], 0, 1);
            var seat2 = new Seat(2, 1, [10,5], 0, 2);
            var seatlist = [seat1, seat2];
            //seatmap.set(Direction.Up, seat1);
            //seatmap.set(Direction.Down, seat2);
            var table = new RectangularTable(seatlist, 1, 1, [10, 10], 0, 1, 1, "Tisch");
            var rooms = new Room("Speisesaal", 1, [table]);
            var event = new Veranstaltung("Weihnachtsfeier", date, "Mensa", [rooms], groups, [guest1, guest2]);*/
            return new Veranstaltung("", new Date(), "", [], [], []);
        }

        initiateSaveEvent(){
            if (!this.event) {
                this.event = this.setEventUp();
            }
            let event = this.event;
            this.saveEvent(event);
        }

        /***
         * This method saves an event as a JSON-file. The data is extracted from App.
         */
        saveEvent(event : Veranstaltung): void{
            let filename = "export";
            let eventname = event.eventName;
            let date = JSON.parse(JSON.stringify(event.date, undefined, 4));
            var place = event.place;
            var rooms = JSON.parse(this.roomsToJson(event.rooms)); //otherwise weird behaviour, dont touch; it works
            var groups = JSON.parse(this.groupsToJson(event.groups));
            var persons = JSON.parse(this.guestsToJson(event.persons));
            var obj = {
                eventname: eventname, date: date, place: place, rooms: rooms,
                groups: groups, guests: persons
            };
            var exportstring = JSON.stringify(obj, undefined , "\t");
            const blob = new Blob([exportstring], {type: 'json'})
            const e = document.createEvent('MouseEvents'), a = document.createElement('a');
            a.download = filename + ".json";
            a.href = window.URL.createObjectURL(blob);
            a.dataset.downloadurl = ['json', a.download, a.href].join(':');
            e.initEvent('click');
            a.dispatchEvent(e);
            this.exportstring = exportstring;
        }

        /***
         * This method transforms a list of Rooms to a single JSON object
         * @param rooms
         */
        roomsToJson(rooms: Room[]) : string{

            let roomlist = [];

            if (rooms && rooms != []) {
                rooms.forEach(room => {
                        roomlist.push({
                            roomname: room.roomName,
                            roomid: room.roomID,
                            tables: JSON.parse(this.tablesToJson(room.tables))
                        });

                    }
                );
            }
            var string = JSON.stringify(roomlist, undefined, 4)
            return string;
        }

        /***
         * This method transforms a list of Tables to a single JSON object
         * @param tables
         */
        tablesToJson(tables: Table[]): string{
            let tablelist = [];
            if (tables && tables != []) {
                tables.forEach(table => {
                    tablelist.push({
                        tableid: table.tableID,
                        shape: table.getShape(),
                        tablename: table.name,
                        roomid: table.roomId,
                        positionx: table.position[0],
                        positiony: table.position[1],
                        rotation: table.rotation,
                        scalex: table.scaleX,
                        scaley: table.scaleY,
                        seats: JSON.parse(this.seatsToJson(table.seats))
                    });
                });
            }
            return JSON.stringify(tablelist, undefined, 4);
        }

        /***
         * This method transforms a list of Seats to a single JSON object
         * @param seats
         */
        seatsToJson(seats: Seat[]): string{
            let seatlist  = [];
            if (seats && seats != []) {
                seats.forEach(seat => {
                    seatlist.push({
                        seatnumber: seat.seatNumber, tableid: seat.tableID, positionx: seat.position[0],
                        positiony: seat.position[1], rotation: seat.rotation, personid: seat.personID
                    })
                });
            }
            var string = JSON.stringify(seatlist, undefined, 4);
            return string;
        }

        /***
         * This method transforms a list of Groups to a single JSON object
         * @param groups
         */
        groupsToJson(groups: Group[] | undefined): string{
            var grouplist = [];
            if (groups && groups != []) {
                groups.forEach(group => {
                    grouplist.push({
                        groupname: group.groupname,
                        groupid: group.groupID,
                        members: JSON.parse(this.guestsToJson(group.members))
                    });
                });
            }
            var string = JSON.stringify(grouplist, undefined, 4);
            return string;
        }

        /***
         * This method transforms a list of Persons to a single JSON object
         * @param persons
         */
        guestsToJson(persons: Person[] | undefined): string{
            let personlist = [];
            if (persons && persons != []) {
                persons.forEach(person => {
                    personlist.push({
                        id: person.id,
                        firstname: person.firstname,
                        lastname: person.lastname,
                        birthdate: person.birthdate,
                        seatid: person.seatID,
                        groupids: JSON.parse(JSON.stringify(person.groups)),
                        gender: person.gender,
                        title: person.title,
                        email: person.email,
                        comments: person.comments,
                        attendance: person.attendance
                    })
                });
            }
            var string = JSON.stringify(personlist, undefined, 4);
            return string;
        }

    }
</script>

<style scoped>

</style>