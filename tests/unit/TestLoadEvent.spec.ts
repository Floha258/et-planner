import {createLocalVue, mount} from '@vue/test-utils';
import {Person} from "../../types/Person";
import BootstrapVue from 'bootstrap-vue';
import {Gender} from "../../types/Gender";
import {Group} from "../../types/Group";
import {Seat} from "../../types/Seat";
import {Veranstaltung} from "../../types/Veranstaltung";
import {Room} from "../../types/Room";
// @ts-ignore
import App from "@/App.vue";
// @ts-ignore
import LoadEvent from "@/components/LoadEvent.vue";
import {Vue} from "vue-property-decorator";
import {CircularTable} from "../../types/CircularTable";
import {RectangularTable} from "../../types/RectangularTable";
// @ts-ignore
import SaveEvent from "@/components/SaveEvent.vue";

// create an extended `Vue` constructor
const localVue = createLocalVue()

// install plugins as normal
localVue.use(BootstrapVue)

//string of the json to be loaded
const json = '{\n' +
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
    '\t\t\t\t\t"shape": 0,\n' +
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
    '\t\t\t\t\t"birthdate": null,\n' +
    '\t\t\t\t\t"groupids": [\n' +
    '\t\t\t\t\t\t0\n' +
    '\t\t\t\t\t],\n' +
    '\t\t\t\t\t"gender": "male",\n' +
    '\t\t\t\t\t"title": "",\n' +
    '\t\t\t\t\t"email": "",\n' +
    '\t\t\t\t\t"comments": "",\n' +
    '\t\t\t\t\t"seated": false\n' +
    '\t\t\t\t}\n' +
    '\t\t\t]\n' +
    '\t\t}\n' +
    '\t],\n' +
    '\t"guests": [\n' +
    '\t\t{\n' +
    '\t\t\t"firstname": "Flo",\n' +
    '\t\t\t"lastname": "Ha",\n' +
    '\t\t\t"id": 1,\n' +
    '\t\t\t"birthdate": null,\n' +
    '\t\t\t"groupids": [\n' +
    '\t\t\t\t0\n' +
    '\t\t\t],\n' +
    '\t\t\t"gender": "male",\n' +
    '\t\t\t"title": "",\n' +
    '\t\t\t"email": "",\n' +
    '\t\t\t"comments": ""\n' +
    '\t\t}\n' +
    '\t]\n' +
    '}';

const myjson = '{\n' +
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
    '\t\t\t\t\t"shape": 0,\n' +
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
    '\t\t\t\t\t"gender": 0,\n' +
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
    '\t\t\t"gender": 0,\n' +
    '\t\t\t"title": "",\n' +
    '\t\t\t"email": "",\n' +
    '\t\t\t"comments": "",\n' +
    '\t\t\t"attendance": 0\n' +
    '\t\t}\n' +
    '\t]\n' +
    '}';
const myjsonWithFemaleGuest = '{\n' +
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
    '\t\t\t\t\t"shape": 0,\n' +
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
const myjsonWithDiversGuest = '{\n' +
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
    '\t\t\t\t\t"shape": 0,\n' +
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
    '\t\t\t\t\t"gender": 2,\n' +
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
    '\t\t\t"gender": 2,\n' +
    '\t\t\t"title": "",\n' +
    '\t\t\t"email": "",\n' +
    '\t\t\t"comments": "",\n' +
    '\t\t\t"attendance": 0\n' +
    '\t\t}\n' +
    '\t]\n' +
    '}';

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
    '\t\t\t\t\t"gender": 0,\n' +
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
    '\t\t\t"gender": 0,\n' +
    '\t\t\t"title": "",\n' +
    '\t\t\t"email": "",\n' +
    '\t\t\t"comments": "",\n' +
    '\t\t\t"attendance": 0\n' +
    '\t\t}\n' +
    '\t]\n' +
    '}';

const birthdate = new Date('01-01-1970');
const guest = new Person(1, "Flo", "Ha", Gender.Male, [0], birthdate, "", "", "", 0, 0, 0);
const guestfemale = new Person(1, "Flo", "Ha", Gender.Female, [0], birthdate, "", "", "", 0, 0, 0);
const guestdivers = new Person(1, "Flo", "Ha", Gender.Divers, [0], birthdate, "", "", "", 0, 0, 0);
const group = new Group(0, [guest], "FD");
const groupfemale = new Group(0, [guestfemale], "FD");
const groupdivers = new Group(0, [guestdivers], "FD");
const seat = new Seat(1, 2, [80, 0], 0, 0);
const table = new CircularTable([seat], 2, 0, [-51, -51], 0, 50, 50, "");
const tablerectangular = new RectangularTable([seat], 2, 0, [-51, -51], 0, 50, 50, "");
const room = new Room("", 1, [table]);
const roomwithrectangulartable = new Room("", 1, [tablerectangular]);
const date = new Date("2020-01-16T17:41:42.474Z");
const event = new Veranstaltung("", date, "", [room], [group], [guest]);
const eventwithrectangulartable = new Veranstaltung("", date, "", [roomwithrectangulartable], [group], [guest]);
const eventwithfemale = new Veranstaltung("", date, "", [room], [groupfemale], [guestfemale]);
const eventwithdivers = new Veranstaltung("", date, "", [room], [groupdivers], [guestdivers]);

let load: any;
let app: any;
let save: any;

beforeEach( () => {
    const appWrapper = mount(App, {localVue});
    app = appWrapper.vm;
    const loadWrapper = appWrapper.find(LoadEvent);
    load = loadWrapper.vm;
    const saveWrapper = appWrapper.find(SaveEvent);
    save = saveWrapper.vm;
    window.URL.createObjectURL = jest.fn(() => {return "Test"});
});

test("LoadEventWithBirthdateNotSet",  async () => {
    load.parse(json);
    await Vue.nextTick();
    expect(app.$data.importEvent).toStrictEqual(event);
});

test("LoadEventWithBirthdate",  async () => {
    load.parse(myjson);
    await Vue.nextTick();
    expect(app.$data.importEvent).toStrictEqual(event);
});

test("LoadEventWithFemale",  async () => {
    load.parse(myjsonWithFemaleGuest);
    await Vue.nextTick();
    expect(app.$data.importEvent).toStrictEqual(eventwithfemale);
});
test("LoadEventWithDivers",  async () => {
    load.parse(myjsonWithDiversGuest);
    await Vue.nextTick();
    expect(app.$data.importEvent).toStrictEqual(eventwithdivers);
});
test("LoadEventWithRectangularTable",  async () => {
    load.parse(myjsonWithRectangularTable);
    await Vue.nextTick();
    expect(app.$data.importEvent).toStrictEqual(eventwithrectangulartable);
});

test("LoadThenSaveEventTogether",  async () => {
    load.parse(myjson);
    await Vue.nextTick();
    let loadedevent: Veranstaltung = app.$data.importEvent;
    await Vue.nextTick();
    await Vue.nextTick();
    save.saveEvent(loadedevent);
    await Vue.nextTick();
    expect(save.$data.exportstring).toStrictEqual(myjson);
});