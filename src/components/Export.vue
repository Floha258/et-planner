<template>
    <div class="export">
        <b-dropdown-item v-on:click="initiateDownloadPDF()">
            Tischzuweisung exportieren (PDF)
        </b-dropdown-item>
        <b-dropdown-item v-on:click="initiateDownloadCSV()">
            Tischzuweisung exportieren (CSV)
        </b-dropdown-item>
    </div>

</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import jsPDF from 'jspdf';
    import { Veranstaltung } from "../../types/Veranstaltung";
    import { Person} from "../../types/Person";
    import 'jspdf-autotable';
    import { Table } from 'types/Table';
    import Konva from 'konva';

    @Component ({})
    export default class Export extends Vue {

        event: Veranstaltung | undefined = undefined;
        eventtables: Table[] | undefined = undefined;
        canvas: Konva.Stage | undefined = undefined;
        exportstring: string = "";
        bodyarraynamesorted: (string | number | undefined)[][] = [];
        bodyarrayseatsorted: (string | number | undefined)[][] = [];
        filename: string = "";

        @Prop({default: function () {
                return;
            }}) exportProp : Veranstaltung | undefined;


        @Watch('exportProp',  {deep: true})
        onExportPropChanged(newVal) {
            this.event = newVal.details ? newVal.details : newVal;
        }

        /***
         * This method initiates the download as a PDF-file
         * */
        initiateDownloadPDF(){
            let event;
            event = this.event;
            this.downloadPDF(event);
        }

        /***
         * This method performs all necessary actions to export the current guestlist as a PDF file.
         * */
        downloadPDF(event: Veranstaltung) : void {

            //assume we got an Event "event" as parameter as we require a full event to correctly export all data
            let filename = "";
            let doc = new jsPDF(); //makes a new PDF
            let bodyarraynamesorted = [];
            let bodyarrayseatsorted = [];
            this.exportstring = "";
            if(event){
                filename = event.eventName;
                if(event.persons && event.persons.length >= 1) {
                    this.sortListByName(event.persons);
                    this.exportstring = this.exportstring + "sorted by name\n";
                    for (let i = 0; i < event.persons.length; i++) {
                        let title, firstname, lastname, tablenumber, seatnumber;
                        if(event.persons) {
                            title = event.persons[i].title;
                            firstname = event.persons[i].firstname;
                            lastname = event.persons[i].lastname;
                            tablenumber = event.persons[i].tableID;
                            seatnumber = event.persons[i].seatID;
                            let name = title + " " + firstname + " " + lastname;
                            let row = [name, tablenumber];
                            bodyarraynamesorted.push(row);
                            this.exportstring = this.exportstring + name + "," + tablenumber + "," + seatnumber + "\n";
                        }
                    }
                    this.sortListByTable(event.persons);
                    this.exportstring = this.exportstring + "sorted by table\n";
                    for (let i = 0; i < event.persons.length; i++) {
                        let title, firstname, lastname, tablenumber, seatnumber;
                        if(event.persons) {
                            title = event.persons[i].title;
                            firstname = event.persons[i].firstname;
                            lastname = event.persons[i].lastname;
                            tablenumber = event.persons[i].tableID;
                            seatnumber = event.persons[i].seatID;
                            let name = title + " " + firstname + " " + lastname;
                            let row = [name, tablenumber];
                            bodyarrayseatsorted.push(row);
                            this.exportstring = this.exportstring + name + "," + tablenumber + "," + seatnumber + "\n";
                        }
                    }
                }else{
                    this.exportstring = "Achtung, es wurden keine Gäste der Veranstaltung hinzugefügt";
                    filename = filename + "Keine Gäste";
                }
            }else{
                this.exportstring = "Achtung, Veranstaltung ist nicht korrekt angelegt";
                filename = filename + "Veranstaltung nicht angelegt";
            }
            this.bodyarraynamesorted = bodyarraynamesorted;
            this.bodyarrayseatsorted = bodyarrayseatsorted;
            doc.text("Tischzuweisung: " + filename, 10, 10);
            // @ts-ignore
            doc.autoTable({
                head: [['Name', 'Tisch']],
                body: bodyarraynamesorted
            });

            // @ts-ignore
            doc.autoTable({
                head: [['Name', 'Tisch']],
                body: bodyarrayseatsorted
            });

            if(filename === ""){
                filename = "Event hat keinen Namen!";
            }
            this.filename = filename;
            doc.save(filename + '.pdf');
        }

        /***
         * This method initiates the download as a CSV-file
         * */
        initiateDownloadCSV(){
            let event;
            event = this.event;
            this.downloadCSV(event);
        }

        /***
         * Exports the master data of the guests including the table assignment as a CSV-file, e.g. for use in excel.
         */
        downloadCSV(event: Veranstaltung) : void {
            this.exportstring = "";

            //assume we got an Event "event" as parameter as we require a full event to correctly export all data
            if (event) {
                var exportstring = "";
                var filename = "";
                filename = event.eventName;
                const doc = new jsPDF(); //makes a new PDF
                if (event && event.persons && event.persons.length > 0) {
                    exportstring = exportstring + "Titel;Vorname;Nachname;Geburtsdatum;Raum;Tisch;Sitznummer\n";
                    doc.text("Titel;Vorname;Nachname;Geburtsdatum;Raum;Tisch;Sitznummer", 10, 10);
                    var roomname = event.rooms[0].roomName;
                    if (event && event.persons) {
                        for (var i = 0; i < event.persons.length; i++) {
                            var title, firstname, lastname, birthdate, tablenumber, seatnumber;
                            if (event.persons) {
                                title = event.persons[i].title;
                                firstname = event.persons[i].firstname;
                                lastname = event.persons[i].lastname;
                                birthdate = event.persons[i].birthdate;
                                if (birthdate) {
                                    var birthdatestring = birthdate.getFullYear() + "-" + (birthdate.getMonth() + 1) + "-" + birthdate.getDate();
                                    tablenumber = event.persons[i].tableID;
                                    seatnumber = event.persons[i].seatID;
                                    exportstring = exportstring + title + ";" + firstname + ";" + lastname + ";" + birthdatestring + ";" + roomname + ";" + tablenumber + ";" + seatnumber + "\n";
                                }
                            }
                        }
                    }
                }else{
                    exportstring = "Achtung, es wurden keine Gäste der Veranstaltung hinzugefügt";
                }
            }else{
                exportstring = "Achtung, Veranstaltung ist nicht korrekt angelegt";
            }

            const blob = new Blob([exportstring], {type: 'csv'})
            const e = document.createEvent('MouseEvents'), a = document.createElement('a');
            this.filename = filename;
            a.download = filename + ".csv";
            a.href = window.URL.createObjectURL(blob);
            a.dataset.downloadurl = ['csv', a.download, a.href].join(':');
            e.initEvent('click');
            a.dispatchEvent(e);
            this.exportstring = exportstring;
        }

        /***
         * This method is an equals procedure for strings
         * @param a
         * @param b
         * @return an indicator that tells if a is bigger, smaller or equals to b
         */
        sortByValue(a: string, b: string) : number {
            if (a > b) {
                return 1;
            }
            else if (b > a) {
                return -1;
            }

            return 0;
        }

        /***
         * This method sorts a list of persons by their name (first the lastname, then the firstname)
         * @param list
         */
        sortListByName(list: Person[]){
            list.sort((a, b) => {
                let val = this.sortByValue(a.lastname, b.lastname);
                if (val == 0) {
                    val = this.sortByValue(a.firstname, b.firstname);
                }
                return val;
            });
        }

        /***
         * This method sorts  a list of persons by their table
         * @param list
         */
        sortListByTable(list: Person[]){
            list.sort((a : Person, b: Person) => {
                let aTablename : string = a.tableID.toString();
                let bTablename : string = b.tableID.toString();
                let val = this.sortByValue(aTablename, bTablename);
                if (val == 0) {val = this.sortByValue(a.seatID.toString(), b.seatID.toString());
                }
                return val;
            });
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
