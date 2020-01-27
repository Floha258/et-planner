import { mount } from '@vue/test-utils';
import {Component, Vue} from 'vue-property-decorator';
import {Veranstaltung} from "../../types/Veranstaltung";
import {Person} from "../../types/Person";
// @ts-ignore
import App from "../../src/App.vue";
import { createLocalVue } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
// @ts-ignore
import Export from "../../src/components/Export.vue";
import { Room} from "../../types/Room";
import { Gender} from "../../types/Gender";
import { Group } from '../../types/Group';
import { RectangularTable } from '../../types/RectangularTable';
import { Seat } from '../../types/Seat';
import 'jspdf-autotable';
// @ts-ignore
import LoadEvent from "@/components/LoadEvent.vue";
import {CircularTable} from "../../types/CircularTable";

// create an extended `Vue` constructor
const localVue = createLocalVue()

// install plugins as normal
localVue.use(BootstrapVue)

const g = new Group(1, [], "Avengers");

const p1 = new Person(1, "Peter", "Parker", Gender.Male, [1], new Date("2020-12-24"), "Spiderman", "avengers@gmail.com", "Mag Ironman", 1, 1, 0);
g.addPerson(p1);
const p2 = new Person(2, "Tony", "Stark", Gender.Male, [1], new Date("2020-01-21"), "Ironman", "avengers@gmail.com", "Zynisch", 2, 1, 0);
g.addPerson(p2);
const p3 = new Person(3, "Steven", "Strange", Gender.Male, [1], new Date("2020-02-28"), "Dr.", "avengers@gmail.com", "Stur", 0, 0, 0);
g.addPerson(p3);

const myjsonWithRectangularTable = '{\n' +
    '\t"eventname": "",\n' +
    '\t"date": "2020-01-16T17:41:42.474Z",\n' +
    '\t"place": "",\n' +
    '\t"rooms": [\n' +
    '\t\t{\n' +
    '\t\t\t"roomname": "",\n' +
    '\t\t\t"roomid": 1,\n' +
    '\t\t\t"tables": [\n' +
    '\t\t\t\t{\n' +
    '\t\t\t\t\t"tableid": 2,\n' +
    '\t\t\t\t\t"shape": 1,\n' +
    '\t\t\t\t\t"tablename": "",\n' +
    '\t\t\t\t\t"roomid": 0,\n' +
    '\t\t\t\t\t"positionx": -51,\n' +
    '\t\t\t\t\t"positiony": -51,\n' +
    '\t\t\t\t\t"rotation": 0,\n' +
    '\t\t\t\t\t"scalex": 50,\n' +
    '\t\t\t\t\t"scaley": 50,\n' +
    '\t\t\t\t\t"seats": [\n' +
    '\t\t\t\t\t\t{\n' +
    '\t\t\t\t\t\t\t"seatnumber": 1,\n' +
    '\t\t\t\t\t\t\t"tableid": 2,\n' +
    '\t\t\t\t\t\t\t"positionx": 80,\n' +
    '\t\t\t\t\t\t\t"positiony": 0,\n' +
    '\t\t\t\t\t\t\t"rotation": 0,\n' +
    '\t\t\t\t\t\t\t"personid": 0\n' +
    '\t\t\t\t\t\t}\n' +
    '\t\t\t\t\t]\n' +
    '\t\t\t\t}\n' +
    '\t\t\t]\n' +
    '\t\t}\n' +
    '\t],\n' +
    '\t"groups": [\n' +
    '\t\t{\n' +
    '\t\t\t"groupname": "FD",\n' +
    '\t\t\t"groupid": 0,\n' +
    '\t\t\t"members": [\n' +
    '\t\t\t\t{\n' +
    '\t\t\t\t\t"id": 1,\n' +
    '\t\t\t\t\t"firstname": "Flo",\n' +
    '\t\t\t\t\t"lastname": "Ha",\n' +
    '\t\t\t\t\t"birthdate": "1969-12-31T23:00:00.000Z",\n' +
    '\t\t\t\t\t"seatid": 0,\n' +
    '\t\t\t\t\t"groupids": [\n' +
    '\t\t\t\t\t\t0\n' +
    '\t\t\t\t\t],\n' +
    '\t\t\t\t\t"gender": 1,\n' +
    '\t\t\t\t\t"title": "",\n' +
    '\t\t\t\t\t"email": "",\n' +
    '\t\t\t\t\t"comments": "",\n' +
    '\t\t\t\t\t"attendance": 0\n' +
    '\t\t\t\t}\n' +
    '\t\t\t]\n' +
    '\t\t}\n' +
    '\t],\n' +
    '\t"guests": [\n' +
    '\t\t{\n' +
    '\t\t\t"id": 1,\n' +
    '\t\t\t"firstname": "Flo",\n' +
    '\t\t\t"lastname": "Ha",\n' +
    '\t\t\t"birthdate": "1969-12-31T23:00:00.000Z",\n' +
    '\t\t\t"seatid": 0,\n' +
    '\t\t\t"groupids": [\n' +
    '\t\t\t\t0\n' +
    '\t\t\t],\n' +
    '\t\t\t"gender": 1,\n' +
    '\t\t\t"title": "",\n' +
    '\t\t\t"email": "",\n' +
    '\t\t\t"comments": "",\n' +
    '\t\t\t"attendance": 0\n' +
    '\t\t}\n' +
    '\t]\n' +
    '}';

let guest1 = new Person(1, "aPositionVorname1", "aPositionNachname1", Gender.Male,[], new Date("2020-01-26"), "Dr.", "derekimnetz@gmx.de", "Mag Fisch", 1, 1, 0);
let guest2 = new Person(2, "bPositionVorname2", "cPositionNachname3", Gender.Female,[], new Date("2020-02-27"), "", "MarinaN@gmx.de", "", 2, 1, 0);
let guest3 = new Person(3, "cPositionVorname3", "bPositionNachname2", Gender.Divers,[], new Date("2020-03-28"), "", "hansiballurpilz@karlsberg.de", "Gartenzwerg", 3, 2, 0);
let guest4 = new Person(4, "cPositionVorname3", "aPositionNachname1", Gender.Divers,[], new Date("2020-03-28"), "Mr.", "hansiballurpasdasilz@karlsberg.de", "Gartenzwerg mit nem Buckel", 0, 0, 0);
let seat1 = new Seat(1, 1, [150,100-15], 0, 1);
let seat2 = new Seat(2, 1, [150,200+15], 0, 2);
let seat3 = new Seat(1, 1, [150,200+15], 0, 3);
let seat4 = new Seat(1, 1, [150,200+15], 0, 4);
let table1 = new RectangularTable([seat1, seat2], 1, 1, [200, 200], 0, 100, 100, "Tisch1");
let table2 = new RectangularTable([seat3], 2, 1, [800, 800], 0, 100, 100, "Tisch2");
let group = new Group(1, [guest1, guest2], "Gruppe 1");
let room1 = new Room("Speisesaal", 1, [table1, table2]);
let myEvent = new Veranstaltung("", new Date("2019-12-20"), "Mensa", [room1], [group], [guest1, guest4, guest2, guest3]);

let guest5 = new Person(1, "Derek", "Sitzthier", Gender.Male,[], new Date("2020-01-26"), "Dr.", "derekimnetz@gmx.de", "Mag Fisch", 1, 1, 0);
let guest6 = new Person(2, "Marina", "Nebenderek", Gender.Female,[], new Date("2020-02-27"), "", "MarinaN@gmx.de", "", 2, 1, 0);
let guest7 = new Person(3, "Hansi", "Ballurpilz", Gender.Divers,[], new Date("2020-03-28"), "", "hansiballurpilz@karlsberg.de", "Gartenzwerg", 0, 0, 0);
let seat5 = new Seat(1, 1, [150,100-15], 0, 1);
let seat6 = new Seat(2, 1, [150,200+15], 0, 2);
let table3 = new RectangularTable([seat5, seat6], 1, 1, [200, 200], 0, 100, 100, "Tisch");
var group2 = new Group(1, [guest5, guest6], "Gruppe 1");
let rooms1 = new Room("Speisesaal", 1, [table3]);
let event2 = new Veranstaltung("Frühlingsfeier", new Date("2019-12-20"), "Mensa", [rooms1], [group2], [guest5, guest6, guest7]);

const birthdate = new Date('01-01-1970');
const guestfemale = new Person(1, "Flo", "Ha", Gender.Female, [0], birthdate, "", "", "", 0, 0, 0);
const group3 = new Group(0, [guestfemale], "FD");
const seat = new Seat(1, 2, [80, 0], 0, 0);
const tablerectangular = new RectangularTable([seat], 2, 0, [-51, -51], 0, 50, 50, "");
const roomwithrectangulartable = new Room("", 1, [tablerectangular]);
const date = new Date("2020-01-16T17:41:42.474Z");
const eventwithrectangulartable = new Veranstaltung("", date, "", [roomwithrectangulartable], [group3], [guestfemale]);

let appCSV : any;
let newExpCSV: any;
let expCSV: any;

let app : any;
let exp : any;
let load:any;
let newExp: any;
let newExportWrapper: any;

beforeEach(() => {
    const appWrapper = mount(App,{localVue});
    const exportWrapper = appWrapper.find(Export);
    exp = exportWrapper.vm;
    app = appWrapper.vm;
    const newExportWrapper = appWrapper.find(Export);
    this.newExportWrapper = newExportWrapper;
    newExportWrapper.setProps({exportProp: myEvent});

    const loadWrapper = appWrapper.find(LoadEvent);
    load = loadWrapper.vm;


    const appWrapperCSV = mount(App,{localVue});
    const exportWrapperCSV = appWrapperCSV.find(Export);
    expCSV = exportWrapperCSV.vm;
    appCSV = appWrapperCSV.vm;
    const newExportWrapperCSV = appWrapperCSV.find(Export);
    newExportWrapperCSV.setProps({exportProp: event2});
    newExpCSV = exportWrapperCSV.vm;

    newExp = exportWrapper.vm;
    window.URL.createObjectURL = jest.fn(() => {return "Test"});
})

test("ExportCSVEmptyGuestList", async () => {
    let seat1 = new Seat(1, 1, [150,100-15], 0, 0);
    let seat2 = new Seat(2, 1, [150,200+15], 0, 0);
    let table = new RectangularTable([seat1, seat2], 1, 1, [200, 200], 0, 100, 100, "Tisch");
    let rooms = new Room("Speisesaal", 1, [table]);
    let noPersonEvent = new Veranstaltung("Weihnachtsfeier", new Date("2019-12-20"), "Mensa", [rooms], [], []);
    //exp.$data = emptyEvent;

    exp.downloadCSV(noPersonEvent);
    await Vue.nextTick();
    expect(exp.$data.exportstring).toStrictEqual("Achtung, es wurden keine Gäste der Veranstaltung hinzugefügt");
})

test("ExportCSVEmptyGuestList", async () => {
    let emptyEvent = null;
    //exp.$data = emptyEvent;

    exp.downloadCSV(emptyEvent);
    await Vue.nextTick();
    expect(exp.$data.exportstring).toStrictEqual("Achtung, Veranstaltung ist nicht korrekt angelegt");
})

test("ExportCSVGuestListWith3Guests", async () => {
    let guest1 = new Person(1, "Derek", "Sitzthier", Gender.Male,[], new Date("2020-01-26"), "Dr.", "derekimnetz@gmx.de", "Mag Fisch", 1, 1, 0);
    let guest2 = new Person(2, "Marina", "Nebenderek", Gender.Female,[], new Date("2020-02-27"), "", "MarinaN@gmx.de", "", 2, 1, 0);
    let guest3 = new Person(3, "Hansi", "Ballurpilz", Gender.Divers,[], new Date("2020-03-28"), "", "hansiballurpilz@karlsberg.de", "Gartenzwerg", 0, 0, 0);
    let seat1 = new Seat(1, 1, [150,100-15], 0, 1);
    let seat2 = new Seat(2, 1, [150,200+15], 0, 2);
    let table = new RectangularTable([seat1, seat2], 1, 1, [200, 200], 0, 100, 100, "Tisch");
    var group = new Group(1, [guest1, guest2], "Gruppe 1");
    let rooms = new Room("Speisesaal", 1, [table]);
    let event = new Veranstaltung("Frühlingsfeier", new Date("2019-12-20"), "Mensa", [rooms], [group], [guest1, guest2, guest3]);
    await Vue.nextTick();

    exp.downloadCSV(event);
    //console.log(exp.$data.exportstring);
    await Vue.nextTick();
    expect(exp.$data.exportstring).toStrictEqual("Titel;Vorname;Nachname;Geburtsdatum;Raum;Tisch;Sitznummer\n"
        + "Dr.;Derek;Sitzthier;2020-1-26;Speisesaal;1;1\n"
        + ";Marina;Nebenderek;2020-2-27;Speisesaal;1;2\n"
        + ";Hansi;Ballurpilz;2020-3-28;Speisesaal;0;0\n");
})

test("ExportPDFEmptyGuestList", async () => {
    let seat1 = new Seat(1, 1, [150,100-15], 0, 0);
    let seat2 = new Seat(2, 1, [150,200+15], 0, 0);
    let table = new RectangularTable([seat1, seat2], 1, 1, [200, 200], 0, 100, 100, "Tisch");
    let rooms = new Room("Speisesaal", 1, [table]);
    let noPersonEvent = new Veranstaltung("Weihnachtsfeier", new Date("2019-12-20"), "Mensa", [rooms], [], []);
    exp.downloadPDF(noPersonEvent);
    await Vue.nextTick();
    expect(exp.$data.exportstring).toStrictEqual("Achtung, es wurden keine Gäste der Veranstaltung hinzugefügt");


})
test("ExportPDFEmptyEvent", async () => {
    let emptyEvent = null;
    exp.downloadPDF(emptyEvent);
    await Vue.nextTick();
    expect(exp.$data.exportstring).toStrictEqual("Achtung, Veranstaltung ist nicht korrekt angelegt");
})

test("ExportPDFEventHasNoName", async () => {
    let guest1 = new Person(1, "aPositionVorname1", "aPositionNachname1", Gender.Male,[], new Date("2020-01-26"), "Dr.", "derekimnetz@gmx.de", "Mag Fisch", 1, 1, 0);
    let guest2 = new Person(2, "bPositionVorname2", "cPositionNachname3", Gender.Female,[], new Date("2020-02-27"), "", "MarinaN@gmx.de", "", 2, 1, 0);
    let guest3 = new Person(3, "cPositionVorname3", "bPositionNachname2", Gender.Divers,[], new Date("2020-03-28"), "", "hansiballurpilz@karlsberg.de", "Gartenzwerg", 3, 2, 0);
    let guest4 = new Person(4, "cPositionVorname3", "aPositionNachname1", Gender.Divers,[], new Date("2020-03-28"), "Mr.", "hansiballurpasdasilz@karlsberg.de", "Gartenzwerg mit nem Buckel", 0, 0, 0);
    let seat1 = new Seat(1, 1, [150,100-15], 0, 1);
    let seat2 = new Seat(2, 1, [150,200+15], 0, 2);
    let seat3 = new Seat(1, 1, [150,200+15], 0, 3);
    let seat4 = new Seat(1, 1, [150,200+15], 0, 4);
    let table1 = new RectangularTable([seat1, seat2], 1, 1, [200, 200], 0, 100, 100, "Tisch1");
    let table2 = new RectangularTable([seat3], 2, 1, [800, 800], 0, 100, 100, "Tisch2");
    let group = new Group(1, [guest1, guest2], "Gruppe 1");
    let room1 = new Room("Speisesaal", 1, [table1, table2]);
    let event = new Veranstaltung("", new Date("2019-12-20"), "Mensa", [room1], [group], [guest1, guest4, guest2, guest3]);

    exp.downloadPDF(event);
    await Vue.nextTick();

    expect(exp.$data.exportstring).toStrictEqual(
        "sorted by name\n" +
        "Dr. aPositionVorname1 aPositionNachname1,1,1\n" + //guest1
        "Mr. cPositionVorname3 aPositionNachname1,0,0\n" + //guest4
        " cPositionVorname3 bPositionNachname2,2,3\n" + //guest3
        " bPositionVorname2 cPositionNachname3,1,2\n" + //guest2

        "sorted by table\n" +
        "Mr. cPositionVorname3 aPositionNachname1,0,0\n" + //guest4
        "Dr. aPositionVorname1 aPositionNachname1,1,1\n" + //guest1
        " bPositionVorname2 cPositionNachname3,1,2\n" + //guest2
        " cPositionVorname3 bPositionNachname2,2,3\n" //guest3
    );

    expect(exp.$data.filename).toStrictEqual("Event hat keinen Namen!");
})

test("ExportPDFGuestListWithGuests", async () => {
    let guest1 = new Person(1, "aPositionVorname1", "aPositionNachname1", Gender.Male,[], new Date("2020-01-26"), "Dr.", "derekimnetz@gmx.de", "Mag Fisch", 1, 1, 0);
    let guest2 = new Person(2, "bPositionVorname2", "cPositionNachname3", Gender.Female,[], new Date("2020-02-27"), "", "MarinaN@gmx.de", "", 2, 1, 0);
    let guest3 = new Person(3, "cPositionVorname3", "bPositionNachname2", Gender.Divers,[], new Date("2020-03-28"), "", "hansiballurpilz@karlsberg.de", "Gartenzwerg", 3, 2, 0);
    let guest4 = new Person(4, "cPositionVorname3", "aPositionNachname1", Gender.Divers,[], new Date("2020-03-28"), "Mr.", "hansiballurpasdasilz@karlsberg.de", "Gartenzwerg mit nem Buckel", 0, 0, 0);
    let seat1 = new Seat(1, 1, [150,100-15], 0, 1);
    let seat2 = new Seat(2, 1, [150,200+15], 0, 2);
    let seat3 = new Seat(1, 1, [150,200+15], 0, 3);
    let seat4 = new Seat(1, 1, [150,200+15], 0, 4);
    let table1 = new RectangularTable([seat1, seat2], 1, 1, [200, 200], 0, 100, 100, "Tisch1");
    let table2 = new RectangularTable([seat3], 2, 1, [800, 800], 0, 100, 100, "Tisch2");
    var group = new Group(1, [guest1, guest2], "Gruppe 1");
    let room1 = new Room("Speisesaal", 1, [table1, table2]);
    let event = new Veranstaltung("Frühlingsfeier", new Date("2019-12-20"), "Mensa", [room1], [group], [guest1, guest4, guest2, guest3]);

    exp.downloadPDF(event);
    await Vue.nextTick();

    expect(exp.$data.exportstring).toStrictEqual(
        "sorted by name\n" +
        "Dr. aPositionVorname1 aPositionNachname1,1,1\n" + //guest1
        "Mr. cPositionVorname3 aPositionNachname1,0,0\n" + //guest4
        " cPositionVorname3 bPositionNachname2,2,3\n" + //guest3
        " bPositionVorname2 cPositionNachname3,1,2\n" + //guest2

        "sorted by table\n" +
        "Mr. cPositionVorname3 aPositionNachname1,0,0\n" + //guest4
        "Dr. aPositionVorname1 aPositionNachname1,1,1\n" + //guest1
        " bPositionVorname2 cPositionNachname3,1,2\n" + //guest2
        " cPositionVorname3 bPositionNachname2,2,3\n" //guest3
    );
})


test("ExportPDFGuestListWithGuestsPropsSet", async () => {
    newExp.initiateDownloadPDF();
    //this.newExportWrapper.find('b-dropdown-item').trigger('click');
    await Vue.nextTick();

    //console.log(exp.$data.event);

    expect(exp.$data.exportstring).toStrictEqual(
        "sorted by name\n" +
        "Dr. aPositionVorname1 aPositionNachname1,1,1\n" + //guest1
        "Mr. cPositionVorname3 aPositionNachname1,0,0\n" + //guest4
        " cPositionVorname3 bPositionNachname2,2,3\n" + //guest3
        " bPositionVorname2 cPositionNachname3,1,2\n" + //guest2

        "sorted by table\n" +
        "Mr. cPositionVorname3 aPositionNachname1,0,0\n" + //guest4
        "Dr. aPositionVorname1 aPositionNachname1,1,1\n" + //guest1
        " bPositionVorname2 cPositionNachname3,1,2\n" + //guest2
        " cPositionVorname3 bPositionNachname2,2,3\n" //guest3
    );
})

test("ExportCSVGuestListWithGuestsPropsSet", async () => {
    newExpCSV.initiateDownloadCSV();
    await Vue.nextTick();
    expect(newExpCSV.$data.exportstring).toStrictEqual("Titel;Vorname;Nachname;Geburtsdatum;Raum;Tisch;Sitznummer\n"
        + "Dr.;Derek;Sitzthier;2020-1-26;Speisesaal;1;1\n"
        + ";Marina;Nebenderek;2020-2-27;Speisesaal;1;2\n"
        + ";Hansi;Ballurpilz;2020-3-28;Speisesaal;0;0\n");
})

test("LoadEventWithRectangularTableAndExportIt",  async () => {
    load.parse(myjsonWithRectangularTable);
    await Vue.nextTick();
    //expect(app.$data.importEvent).toStrictEqual(eventwithrectangulartable);

    newExp.initiateDownloadPDF();
    //this.newExportWrapper.find('b-dropdown-item').trigger('click');
    await Vue.nextTick();

    //console.log(exp.$data.event);

    expect(exp.$data.exportstring).toStrictEqual(
        "sorted by name\n" +
        " Flo Ha,0,0\n" + //guestfemale

        "sorted by table\n" +
        " Flo Ha,0,0\n" //guestfemale
    );


});



