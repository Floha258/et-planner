import {createLocalVue, mount} from '@vue/test-utils';
import {Vue} from 'vue-property-decorator';
import {Person} from "../../types/Person";

// @ts-ignore
import GuestlistImport from "../../src/components/GuestlistImport.vue";
// @ts-ignore
import NavBar from "../../src/components/NavBar.vue";
// @ts-ignore
import App from "../../src/App.vue";
import {Group} from '../../types/Group';
import BootstrapVue from 'bootstrap-vue';
import {library} from '@fortawesome/fontawesome-svg-core';
import {
    faEdit,
    faMars,
    faSortAmountDownAlt,
    faSortAmountUpAlt,
    faTransgender,
    faTrashAlt,
    faUserPlus,
    faVenus
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {Gender} from "../../types/Gender";

// create an extended `Vue` constructor
const localVue = createLocalVue()

// install plugins as normal
localVue.use(BootstrapVue)

library.add(faMars, faVenus, faTransgender, faEdit, faTrashAlt, faUserPlus, faSortAmountUpAlt, faSortAmountDownAlt);
localVue.component('font-awesome-icon', FontAwesomeIcon);

const g = new Group(1, [], "Avengers");

const p1 = new Person(1, "Peter", "Parker", Gender.Male, [1], new Date("2020-12-24"), "Spiderman", "avengers@gmail.com", "Mag Ironman", 0, 0, 0);
g.addPerson(p1);
const p2 = new Person(2, "Tony", "Stark", Gender.Male, [1], new Date("2020-01-21"), "Ironman", "avengers@gmail.com", "Zynisch", 0, 0, 0);
g.addPerson(p2);
const p3 = new Person(3, "Steven", "Strange", Gender.Male, [1], new Date("2020-02-28"), "Dr.", "avengers@gmail.com", "Stur", 0, 0, 0);
g.addPerson(p3);

const g2 = new Group(1, [], "Groupname");
const p4 = new Person(1, "A", "a", Gender.Male, [1], new Date("2020-02-28"), "", "", "", 0, 0, 0);
const p5 = new Person(2, "B", "b", Gender.Male, [1], new Date("2020-02-28"), "", "", "", 0, 0, 0);
const p6 = new Person(3, "C", "c", Gender.Male, [1], new Date("2020-02-28"), "", "", "", 0, 0, 0);
const p7 = new Person(4, "D", "d", Gender.Male, [1], new Date("2020-02-28"), "", "", "", 0, 0, 0);
const p8 = new Person(5, "E", "e", Gender.Female, [1], new Date("2020-02-28"), "", "", "", 0, 0, 0);
const p9 = new Person(6, "F", "f", Gender.Female, [1], new Date("2020-02-28"), "", "", "", 0, 0, 0);
const p10 = new Person(7, "G", "g", Gender.Female, [1], new Date("2020-02-28"), "", "", "", 0, 0, 0);
const p11 = new Person(8, "H", "h", Gender.Female, [1], new Date("2020-02-28"), "", "", "", 0, 0, 0);
const p12 = new Person(9, "I", "i", Gender.Divers, [1], new Date("2020-02-28"), "", "", "", 0, 0, 0);
const p13 = new Person(10, "J", "j", Gender.Divers, [1], new Date("2020-02-28"), "", "", "", 0, 0, 0);
g2.addPerson(p4);
g2.addPerson(p5);
g2.addPerson(p6);
g2.addPerson(p7);
g2.addPerson(p8);
g2.addPerson(p9);
g2.addPerson(p10);
g2.addPerson(p11);
g2.addPerson(p12);
g2.addPerson(p13);

const g3 = new Group(1, [], "NeueGruppe");
const p14 = new Person(1, "A", "a", Gender.Male, [1], new Date("2020-02-28"), "", "", "", 0, 0, 0);
g3.addPerson(p14);

const g4 = new Group(1, [], "");
const p15 = new Person(1, "A", "a", Gender.Male, [1], new Date("2020-02-28"), "", "", "", 0, 0, 0);
g4.addPerson(p15);

let nav : any;
let imp : any;

beforeEach(() => {
    const appWrapper = mount(App,{localVue});
    const navWrapper = appWrapper.find(NavBar);
    nav = navWrapper.vm;
    const importWrapper = appWrapper.find(GuestlistImport);
    imp = importWrapper.vm;
})

test("ImportEmptyGuestList", async () => {
    imp.parse("");
    await Vue.nextTick();
    expect(nav.$data.impGuests).toStrictEqual([]);
})

test("ImportGuestList", async () => {
    imp.parse("firstname;lastname;gender;groups;birthdate;title;email;comments\nPeter;Parker;male;Avengers;2020-12-24;Spiderman;avengers@gmail.com;Mag Ironman\nTony;Stark;male;Avengers;2020-01-21;Ironman;avengers@gmail.com;Zynisch\nSteven;Strange;male;Avengers;2020-02-28;Dr.;avengers@gmail.com;Stur");
    await Vue.nextTick();
    expect(nav.$data.impGuests).toStrictEqual([p1,p2,p3]);
    expect(nav.$data.groups).toStrictEqual([g]);
})

test("ImportGuestListAllCases", async () => {
    imp.parse(
        "firstname;lastname;gender;groups;birthdate;title;email;comments\n" +
        "A;a;male;Groupname;2020-02-28;;;\n" +
        "B;b;Male;Groupname;2020-02-28;;;\n" +
        "C;c;man;Groupname;2020-02-28;;;\n" +
        "D;d;Man;Groupname;2020-02-28;;;\n" +
        "E;e;female;Groupname;2020-02-28;;;\n" +
        "F;f;Female;Groupname;2020-02-28;;;\n" +
        "G;g;woman;Groupname;2020-02-28;;;\n" +
        "H;h;Woman;Groupname;2020-02-28;;;\n" +
        "I;i;HansPeter;Groupname;2020-02-28;;;\n" +
        "J;j;;Groupname;2020-02-28;;;"
    );
    await Vue.nextTick();
    expect(nav.$data.impGuests).toStrictEqual([p4, p5, p6, p7, p8, p9, p10, p11, p12, p13]);
    expect(nav.$data.groups).toStrictEqual([g2]);
})

test("ImportGuestListNewGroup", async () => {
    imp.parse(
        "firstname;lastname;gender;groups;birthdate;title;email;comments\n" +
        "A;a;male;NeueGruppe;2020-02-28;;;"
    );
    await Vue.nextTick();
    expect(nav.$data.impGuests).toStrictEqual([p14]);
    expect(nav.$data.groups).toStrictEqual([g3]);
})

test("ImportGuestListNoGroup", async () => {
    imp.parse(
        "firstname;lastname;gender;groups;birthdate;title;email;comments\n" +
        "A;a;male;;2020-02-28;;;"
    );
    await Vue.nextTick();
    expect(nav.$data.impGuests).toStrictEqual([p15]);
    expect(nav.$data.groups).toStrictEqual([g4]);
})