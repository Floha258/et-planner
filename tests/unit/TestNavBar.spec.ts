import { mount } from '@vue/test-utils';
import {Component, Vue} from 'vue-property-decorator';

import {Veranstaltung} from "../../types/Veranstaltung";
import {Person} from "../../types/Person";

// @ts-ignore
import AddPersonModal from "../../src/components/modals/person/AddPersonModal.vue";
// @ts-ignore
import DeletePersonModal from "../../src/components/modals/person/DeletePersonModal.vue";
// @ts-ignore
import EditPersonModal from "../../src/components/modals/person/EditPersonModal.vue";
// @ts-ignore
import NavBar from "../../src/components/NavBar.vue";
// @ts-ignore
import App from "../../src/App.vue";
import { Group } from '../../types/Group';
import { Gender } from '../../types/Gender';
import { createLocalVue } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faMars, faVenus, faTransgender, faEdit, faTrashAlt, faUserPlus, faSortAmountUpAlt, faSortAmountDownAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// create an extended `Vue` constructor
const localVue = createLocalVue();

// install plugins as normal
localVue.use(BootstrapVue);

library.add(faMars, faVenus, faTransgender, faEdit, faTrashAlt, faUserPlus, faSortAmountUpAlt, faSortAmountDownAlt);
localVue.component('font-awesome-icon', FontAwesomeIcon);

const g1 = new Group(1, [], "Avengers");
const g2 = new Group(1, [], "Avengers");

const p1 = new Person(1, "Peter", "Parker", Gender.Male, [1], new Date("2010-12-24"), "Spiderman", "avengers@gmail.com", "Mag Spinnen", 0, 0, 0);
g1.addPerson(p1);
g2.addPerson(p1);
const p2 = new Person(2, "Tony", "Stark", Gender.Female, [1], new Date("2010-01-21"), "Ironman", "avengers@gmail.com", "Zynisch", 0, 0, 0);
g2.addPerson(p2);
const p3 = new Person(3, "Steven", "Strange", Gender.Divers, [1], new Date("2010-02-28"), "Dr.", "avengers@gmail.com", "Stur", 0, 0, 0);
g2.addPerson(p3);

let nav : any;
let navWrapper : any;
let add : any;
let addWrapper : any;

beforeEach(() => {
    const appWrapper = mount(App,{localVue});
    navWrapper = appWrapper.find(NavBar);
    nav = navWrapper.vm;
    addWrapper = navWrapper.find(AddPersonModal);
    add = addWrapper.vm;
    addWrapper.vm.checkFormValidity = jest.fn(() => {return true});
    nav.$data.sortingOption = "lastname";
    nav.$data.sortAscending = true;
    nav.$data.filter = "";
    nav.$data.filterSeated = false;
})

// Tests AddPerson

test("AddPerson", async () => {
    add.$data.firstname = "Peter";
    add.$data.lastname = "Parker";
    add.$data.title = "Spiderman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Mag Spinnen";
    add.$data.day = "24";
    add.$data.month = "12";
    add.$data.year = "2010";
    add.$data.gender = Gender.Male;
    add.handleSubmit();

    await Vue.nextTick();
    expect(nav.$data.manGuests).toStrictEqual([p1]);
    expect(nav.$data.guests).toStrictEqual([p1]);
    expect(nav.$data.groups).toStrictEqual([g1]);
})

test("AddPersonWithExistingGroup", async () => {
    add.$data.firstname = "Peter";
    add.$data.lastname = "Parker";
    add.$data.title = "Spiderman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Mag Spinnen";
    add.$data.day = "24";
    add.$data.month = "12";
    add.$data.year = "2010";
    add.$data.gender = Gender.Male;
    add.handleSubmit();

    add.$data.firstname = "Tony";
    add.$data.lastname = "Stark";
    add.$data.title = "Ironman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Zynisch";
    add.$data.day = "21";
    add.$data.month = "01";
    add.$data.year = "2010";
    add.$data.gender = Gender.Female;
    add.handleSubmit();

    add.$data.firstname = "Steven";
    add.$data.lastname = "Strange";
    add.$data.title = "Dr.";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Stur";
    add.$data.day = "28";
    add.$data.month = "02";
    add.$data.year = "2010";
    add.$data.gender = Gender.Divers;
    add.handleSubmit();

    await Vue.nextTick();
    expect(nav.$data.manGuests).toStrictEqual([p1,p2,p3]);
    expect(nav.$data.guests).toStrictEqual([p1,p2,p3]);
    expect(nav.$data.groups).toStrictEqual([g2]);
})

test("ResetAddPerson", async () => {
    add.$data.firstname = "Peter";
    add.$data.lastname = "Parker";
    add.$data.title = "Spiderman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Mag Spinnen";
    add.$data.day = "24";
    add.$data.month = "12";
    add.$data.year = "2010";
    add.$data.gender = Gender.Female;
    add.resetModal();

    await Vue.nextTick();
    expect(add.$data.firstname).toStrictEqual("");
    expect(add.$data.lastname).toStrictEqual("");
    expect(add.$data.title).toStrictEqual("");
    expect(add.$data.group).toStrictEqual("");
    expect(add.$data.email).toStrictEqual("");
    expect(add.$data.comments).toStrictEqual("");
    expect(add.$data.day).toStrictEqual("");
    expect(add.$data.month).toStrictEqual("");
    expect(add.$data.year).toStrictEqual("");
    expect(add.$data.gender).toStrictEqual(Gender.Male);
})

test("InvalidFormAddPerson", async () => {
    addWrapper.vm.checkFormValidity = jest.fn(() => {return false});

    add.$data.firstname = "Peter";
    add.$data.lastname = "Parker";
    add.$data.title = "Spiderman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Mag Spinnen";
    add.$data.day = "24";
    add.$data.month = "12";
    add.$data.year = "2010";
    add.$data.gender = Gender.Male;
    add.handleSubmit();

    await Vue.nextTick();
    expect(nav.$data.manGuests).toStrictEqual([]);
    expect(nav.$data.guests).toStrictEqual([]);
    expect(nav.$data.groups).toStrictEqual([]);
})

// Tests Sort

test("SortLastnameDESC", async () => {
    nav.$data.sortingOption = "lastname";
    nav.$data.sortAscending = false;

    add.$data.firstname = "Peter";
    add.$data.lastname = "Parker";
    add.$data.title = "Spiderman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Mag Spinnen";
    add.$data.day = "24";
    add.$data.month = "12";
    add.$data.year = "2010";
    add.$data.gender = Gender.Male;
    add.handleSubmit();

    add.$data.firstname = "Tony";
    add.$data.lastname = "Stark";
    add.$data.title = "Ironman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Zynisch";
    add.$data.day = "21";
    add.$data.month = "01";
    add.$data.year = "2010";
    add.$data.gender = Gender.Female;
    add.handleSubmit();

    add.$data.firstname = "Steven";
    add.$data.lastname = "Strange";
    add.$data.title = "Dr.";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Stur";
    add.$data.day = "28";
    add.$data.month = "02";
    add.$data.year = "2010";
    add.$data.gender = Gender.Divers;
    add.handleSubmit();

    await Vue.nextTick();
    expect(nav.$data.guests).toStrictEqual([p3,p2,p1]);
    expect(nav.$data.groups).toStrictEqual([new Group(1, [p3,p2,p1], "Avengers")]);
})

test("SortLastnameASC", async () => {
    nav.$data.sortingOption = "lastname";
    nav.$data.sortAscending = true;

    add.$data.firstname = "Peter";
    add.$data.lastname = "Parker";
    add.$data.title = "Spiderman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Mag Spinnen";
    add.$data.day = "24";
    add.$data.month = "12";
    add.$data.year = "2010";
    add.$data.gender = Gender.Male;
    add.handleSubmit();

    add.$data.firstname = "Tony";
    add.$data.lastname = "Stark";
    add.$data.title = "Ironman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Zynisch";
    add.$data.day = "21";
    add.$data.month = "01";
    add.$data.year = "2010";
    add.$data.gender = Gender.Female;
    add.handleSubmit();

    add.$data.firstname = "Steven";
    add.$data.lastname = "Strange";
    add.$data.title = "Dr.";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Stur";
    add.$data.day = "28";
    add.$data.month = "02";
    add.$data.year = "2010";
    add.$data.gender = Gender.Divers;
    add.handleSubmit();

    await Vue.nextTick();
    expect(nav.$data.guests).toStrictEqual([p1,p2,p3]);
    expect(nav.$data.groups).toStrictEqual([g2]);
})

test("SortFirstnameDESC", async () => {
    nav.$data.sortingOption = "firstname";
    nav.$data.sortAscending = false;

    add.$data.firstname = "Peter";
    add.$data.lastname = "Parker";
    add.$data.title = "Spiderman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Mag Spinnen";
    add.$data.day = "24";
    add.$data.month = "12";
    add.$data.year = "2010";
    add.$data.gender = Gender.Male;
    add.handleSubmit();

    add.$data.firstname = "Tony";
    add.$data.lastname = "Stark";
    add.$data.title = "Ironman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Zynisch";
    add.$data.day = "21";
    add.$data.month = "01";
    add.$data.year = "2010";
    add.$data.gender = Gender.Female;
    add.handleSubmit();

    add.$data.firstname = "Steven";
    add.$data.lastname = "Strange";
    add.$data.title = "Dr.";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Stur";
    add.$data.day = "28";
    add.$data.month = "02";
    add.$data.year = "2010";
    add.$data.gender = Gender.Divers;
    add.handleSubmit();

    await Vue.nextTick();
    expect(nav.$data.guests).toStrictEqual([p2,p3,p1]);
    expect(nav.$data.groups).toStrictEqual([new Group(1, [p2,p3,p1], "Avengers")]);
})

test("SortFirstnameASC", async () => {
    nav.$data.sortingOption = "firstname";
    nav.$data.sortAscending = true;

    add.$data.firstname = "Peter";
    add.$data.lastname = "Parker";
    add.$data.title = "Spiderman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Mag Spinnen";
    add.$data.day = "24";
    add.$data.month = "12";
    add.$data.year = "2010";
    add.$data.gender = Gender.Male;
    add.handleSubmit();

    add.$data.firstname = "Tony";
    add.$data.lastname = "Stark";
    add.$data.title = "Ironman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Zynisch";
    add.$data.day = "21";
    add.$data.month = "01";
    add.$data.year = "2010";
    add.$data.gender = Gender.Female;
    add.handleSubmit();

    add.$data.firstname = "Steven";
    add.$data.lastname = "Strange";
    add.$data.title = "Dr.";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Stur";
    add.$data.day = "28";
    add.$data.month = "02";
    add.$data.year = "2010";
    add.$data.gender = Gender.Divers;
    add.handleSubmit();

    await Vue.nextTick();
    expect(nav.$data.guests).toStrictEqual([p1,p3,p2]);
    expect(nav.$data.groups).toStrictEqual([new Group(1, [p1,p3,p2], "Avengers")]);
})

test("SortAgeDESC", async () => {
    nav.$data.sortingOption = "age";
    nav.$data.sortAscending = false;

    add.$data.firstname = "Peter";
    add.$data.lastname = "Parker";
    add.$data.title = "Spiderman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Mag Spinnen";
    add.$data.day = "24";
    add.$data.month = "12";
    add.$data.year = "2010";
    add.$data.gender = Gender.Male;
    add.handleSubmit();

    add.$data.firstname = "Tony";
    add.$data.lastname = "Stark";
    add.$data.title = "Ironman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Zynisch";
    add.$data.day = "21";
    add.$data.month = "01";
    add.$data.year = "2010";
    add.$data.gender = Gender.Female;
    add.handleSubmit();

    add.$data.firstname = "Steven";
    add.$data.lastname = "Strange";
    add.$data.title = "Dr.";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Stur";
    add.$data.day = "28";
    add.$data.month = "02";
    add.$data.year = "2010";
    add.$data.gender = Gender.Divers;
    add.handleSubmit();

    await Vue.nextTick();
    expect(nav.$data.guests).toStrictEqual([p1,p3,p2]);
    expect(nav.$data.groups).toStrictEqual([new Group(1, [p1,p3,p2], "Avengers")]);
})

test("SortAgeASC", async () => {
    nav.$data.sortingOption = "age";
    nav.$data.sortAscending = true;

    add.$data.firstname = "Peter";
    add.$data.lastname = "Parker";
    add.$data.title = "Spiderman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Mag Spinnen";
    add.$data.day = "24";
    add.$data.month = "12";
    add.$data.year = "2010";
    add.$data.gender = Gender.Male;
    add.handleSubmit();

    add.$data.firstname = "Tony";
    add.$data.lastname = "Stark";
    add.$data.title = "Ironman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Zynisch";
    add.$data.day = "21";
    add.$data.month = "01";
    add.$data.year = "2010";
    add.$data.gender = Gender.Female;
    add.handleSubmit();

    add.$data.firstname = "Steven";
    add.$data.lastname = "Strange";
    add.$data.title = "Dr.";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Stur";
    add.$data.day = "28";
    add.$data.month = "02";
    add.$data.year = "2010";
    add.$data.gender = Gender.Divers;
    add.handleSubmit();

    await Vue.nextTick();
    expect(nav.$data.guests).toStrictEqual([p2,p3,p1]);
    expect(nav.$data.groups).toStrictEqual([new Group(1, [p2,p3,p1], "Avengers")]);
})

test("SortGenderDESC", async () => {
    nav.$data.sortingOption = "gender";
    nav.$data.sortAscending = false;

    add.$data.firstname = "Peter";
    add.$data.lastname = "Parker";
    add.$data.title = "Spiderman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Mag Spinnen";
    add.$data.day = "24";
    add.$data.month = "12";
    add.$data.year = "2010";
    add.$data.gender = Gender.Male;
    add.handleSubmit();

    add.$data.firstname = "Tony";
    add.$data.lastname = "Stark";
    add.$data.title = "Ironman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Zynisch";
    add.$data.day = "21";
    add.$data.month = "01";
    add.$data.year = "2010";
    add.$data.gender = Gender.Female;
    add.handleSubmit();

    add.$data.firstname = "Steven";
    add.$data.lastname = "Strange";
    add.$data.title = "Dr.";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Stur";
    add.$data.day = "28";
    add.$data.month = "02";
    add.$data.year = "2010";
    add.$data.gender = Gender.Divers;
    add.handleSubmit();

    await Vue.nextTick();
    expect(nav.$data.guests).toStrictEqual([p3,p2,p1]);
    expect(nav.$data.groups).toStrictEqual([new Group(1, [p3,p2,p1], "Avengers")]);
})

test("SortGenderASC", async () => {
    nav.$data.sortingOption = "gender";
    nav.$data.sortAscending = true;

    add.$data.firstname = "Peter";
    add.$data.lastname = "Parker";
    add.$data.title = "Spiderman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Mag Spinnen";
    add.$data.day = "24";
    add.$data.month = "12";
    add.$data.year = "2010";
    add.$data.gender = Gender.Male;
    add.handleSubmit();

    add.$data.firstname = "Tony";
    add.$data.lastname = "Stark";
    add.$data.title = "Ironman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Zynisch";
    add.$data.day = "21";
    add.$data.month = "01";
    add.$data.year = "2010";
    add.$data.gender = Gender.Female;
    add.handleSubmit();

    add.$data.firstname = "Steven";
    add.$data.lastname = "Strange";
    add.$data.title = "Dr.";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Stur";
    add.$data.day = "28";
    add.$data.month = "02";
    add.$data.year = "2010";
    add.$data.gender = Gender.Divers;
    add.handleSubmit();

    await Vue.nextTick();
    expect(nav.$data.guests).toStrictEqual([p1,p2,p3]);
    expect(nav.$data.groups).toStrictEqual([new Group(1, [p1,p2,p3], "Avengers")]);
})

test("SortDirection", async () => {
    nav.$data.sortingOption = "lastname";
    nav.$data.sortAscending = true;

    add.$data.firstname = "Peter";
    add.$data.lastname = "Parker";
    add.$data.title = "Spiderman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Mag Spinnen";
    add.$data.day = "24";
    add.$data.month = "12";
    add.$data.year = "2010";
    add.$data.gender = Gender.Male;
    add.handleSubmit();

    add.$data.firstname = "Tony";
    add.$data.lastname = "Stark";
    add.$data.title = "Ironman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Zynisch";
    add.$data.day = "21";
    add.$data.month = "01";
    add.$data.year = "2010";
    add.$data.gender = Gender.Female;
    add.handleSubmit();

    add.$data.firstname = "Steven";
    add.$data.lastname = "Strange";
    add.$data.title = "Dr.";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Stur";
    add.$data.day = "28";
    add.$data.month = "02";
    add.$data.year = "2010";
    add.$data.gender = Gender.Divers;
    add.handleSubmit();

    nav.changeSortDirection();

    await Vue.nextTick();
    expect(nav.$data.sortAscending).toStrictEqual(false);
    expect(nav.$data.guests).toStrictEqual([p3,p2,p1]);
    expect(nav.$data.groups).toStrictEqual([new Group(1, [p3,p2,p1], "Avengers")]);
})

// Filter Tests

test("EmptyFilter", async () => {
    nav.$data.filter = "";
    nav.$data.filterSeated = "false";

    add.$data.firstname = "Peter";
    add.$data.lastname = "Parker";
    add.$data.title = "Spiderman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Mag Spinnen";
    add.$data.day = "24";
    add.$data.month = "12";
    add.$data.year = "2010";
    add.$data.gender = Gender.Male;
    add.handleSubmit();

    add.$data.firstname = "Tony";
    add.$data.lastname = "Stark";
    add.$data.title = "Ironman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Zynisch";
    add.$data.day = "21";
    add.$data.month = "01";
    add.$data.year = "2010";
    add.$data.gender = Gender.Female;
    add.handleSubmit();

    add.$data.firstname = "Steven";
    add.$data.lastname = "Strange";
    add.$data.title = "Dr.";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Stur";
    add.$data.day = "28";
    add.$data.month = "02";
    add.$data.year = "2010";
    add.$data.gender = Gender.Divers;
    add.handleSubmit();

    await Vue.nextTick();
    expect(nav.filteredGroups).toStrictEqual([g2]);
})

test("Filter", async () => {
    nav.$data.filter = "Peter";
    nav.$data.filterSeated = "false";

    add.$data.firstname = "Peter";
    add.$data.lastname = "Parker";
    add.$data.title = "Spiderman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Mag Spinnen";
    add.$data.day = "24";
    add.$data.month = "12";
    add.$data.year = "2010";
    add.$data.gender = Gender.Male;
    add.handleSubmit();

    add.$data.firstname = "Tony";
    add.$data.lastname = "Stark";
    add.$data.title = "Ironman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Zynisch";
    add.$data.day = "21";
    add.$data.month = "01";
    add.$data.year = "2010";
    add.$data.gender = Gender.Female;
    add.handleSubmit();

    add.$data.firstname = "Steven";
    add.$data.lastname = "Strange";
    add.$data.title = "Dr.";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Stur";
    add.$data.day = "28";
    add.$data.month = "02";
    add.$data.year = "2010";
    add.$data.gender = Gender.Divers;
    add.handleSubmit();

    await Vue.nextTick();
    expect(nav.filteredGroups).toStrictEqual([g1]);
})

test("FilterSubstring", async () => {
    nav.$data.filter = "ete";
    nav.$data.filterSeated = "false";

    add.$data.firstname = "Peter";
    add.$data.lastname = "Parker";
    add.$data.title = "Spiderman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Mag Spinnen";
    add.$data.day = "24";
    add.$data.month = "12";
    add.$data.year = "2010";
    add.$data.gender = Gender.Male;
    add.handleSubmit();

    add.$data.firstname = "Tony";
    add.$data.lastname = "Stark";
    add.$data.title = "Ironman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Zynisch";
    add.$data.day = "21";
    add.$data.month = "01";
    add.$data.year = "2010";
    add.$data.gender = Gender.Female;
    add.handleSubmit();

    add.$data.firstname = "Steven";
    add.$data.lastname = "Strange";
    add.$data.title = "Dr.";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Stur";
    add.$data.day = "28";
    add.$data.month = "02";
    add.$data.year = "2010";
    add.$data.gender = Gender.Divers;
    add.handleSubmit();

    await Vue.nextTick();
    expect(nav.filteredGroups).toStrictEqual([g1]);
})

test("FilterLowerCase", async () => {
    nav.$data.filter = "peter";
    nav.$data.filterSeated = "false";

    add.$data.firstname = "Peter";
    add.$data.lastname = "Parker";
    add.$data.title = "Spiderman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Mag Spinnen";
    add.$data.day = "24";
    add.$data.month = "12";
    add.$data.year = "2010";
    add.$data.gender = Gender.Male;
    add.handleSubmit();

    add.$data.firstname = "Tony";
    add.$data.lastname = "Stark";
    add.$data.title = "Ironman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Zynisch";
    add.$data.day = "21";
    add.$data.month = "01";
    add.$data.year = "2010";
    add.$data.gender = Gender.Female;
    add.handleSubmit();

    add.$data.firstname = "Steven";
    add.$data.lastname = "Strange";
    add.$data.title = "Dr.";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Stur";
    add.$data.day = "28";
    add.$data.month = "02";
    add.$data.year = "2010";
    add.$data.gender = Gender.Divers;
    add.handleSubmit();

    await Vue.nextTick();
    expect(nav.filteredGroups).toStrictEqual([g1]);
})

test("FilterUpperCase", async () => {
    nav.$data.filter = "PETER";
    nav.$data.filterSeated = "false";

    add.$data.firstname = "Peter";
    add.$data.lastname = "Parker";
    add.$data.title = "Spiderman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Mag Spinnen";
    add.$data.day = "24";
    add.$data.month = "12";
    add.$data.year = "2010";
    add.$data.gender = Gender.Male;
    add.handleSubmit();

    add.$data.firstname = "Tony";
    add.$data.lastname = "Stark";
    add.$data.title = "Ironman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Zynisch";
    add.$data.day = "21";
    add.$data.month = "01";
    add.$data.year = "2010";
    add.$data.gender = Gender.Female;
    add.handleSubmit();

    add.$data.firstname = "Steven";
    add.$data.lastname = "Strange";
    add.$data.title = "Dr.";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Stur";
    add.$data.day = "28";
    add.$data.month = "02";
    add.$data.year = "2010";
    add.$data.gender = Gender.Divers;
    add.handleSubmit();

    await Vue.nextTick();
    expect(nav.filteredGroups).toStrictEqual([g1]);
})

test("FilterSeated", async () => {
    nav.$data.filter = "";
    nav.$data.filterSeated = "true";

    add.$data.firstname = "Peter";
    add.$data.lastname = "Parker";
    add.$data.title = "Spiderman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Mag Spinnen";
    add.$data.day = "24";
    add.$data.month = "12";
    add.$data.year = "2010";
    add.$data.gender = Gender.Male;
    add.handleSubmit();

    add.$data.firstname = "Tony";
    add.$data.lastname = "Stark";
    add.$data.title = "Ironman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Zynisch";
    add.$data.day = "21";
    add.$data.month = "01";
    add.$data.year = "2010";
    add.$data.gender = Gender.Female;
    add.handleSubmit();

    add.$data.firstname = "Steven";
    add.$data.lastname = "Strange";
    add.$data.title = "Dr.";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Stur";
    add.$data.day = "28";
    add.$data.month = "02";
    add.$data.year = "2010";
    add.$data.gender = Gender.Divers;
    add.handleSubmit();

    await Vue.nextTick();

    nav.$data.manGuests[0].seated = true;

    expect(nav.filteredGroups).toStrictEqual([new Group(1, [p2,p3], "Avengers")]);
})

test("SortGroups", async () => {
    nav.$data.filter = "";
    nav.$data.filterSeated = "false";

    add.$data.firstname = "Peter";
    add.$data.lastname = "Parker";
    add.$data.title = "Spiderman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Mag Spinnen";
    add.$data.day = "24";
    add.$data.month = "12";
    add.$data.year = "2010";
    add.$data.gender = Gender.Male;
    add.handleSubmit();

    add.$data.firstname = "Steven";
    add.$data.lastname = "Strange";
    add.$data.title = "Dr.";
    add.$data.group = "Magician";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Stur";
    add.$data.day = "28";
    add.$data.month = "02";
    add.$data.year = "2010";
    add.$data.gender = Gender.Divers;
    add.handleSubmit();

    add.$data.firstname = "Tony";
    add.$data.lastname = "Stark";
    add.$data.title = "Ironman";
    add.$data.group = "CEO";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Zynisch";
    add.$data.day = "21";
    add.$data.month = "01";
    add.$data.year = "2010";
    add.$data.gender = Gender.Female;
    add.handleSubmit(); 

    await Vue.nextTick();

    let p4 = new Person(3, "Tony", "Stark", Gender.Female, [3], new Date("2010-01-21"), "Ironman", "avengers@gmail.com", "Zynisch", 0, 0, 0);
    let p5 = new Person(2, "Steven", "Strange", Gender.Divers, [2], new Date("2010-02-28"), "Dr.", "avengers@gmail.com", "Stur", 0, 0, 0);
    expect(nav.filteredGroups).toStrictEqual([new Group(1, [p1], "Avengers"), new Group(3, [p4], "CEO"), new Group(2, [p5], "Magician")]);
})

// Test DeletePerson

test("DelManPerson", async () => {
    add.$data.firstname = "Peter";
    add.$data.lastname = "Parker";
    add.$data.title = "Spiderman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Mag Spinnen";
    add.$data.day = "24";
    add.$data.month = "12";
    add.$data.year = "2010";
    add.$data.gender = Gender.Male;
    add.handleSubmit();

    await Vue.nextTick();

    let deleteWrapper = navWrapper.find(DeletePersonModal);
    let del = deleteWrapper.vm;

    del.handleDelete();

    await Vue.nextTick();
    expect(nav.$data.manGuests).toStrictEqual([]);
    expect(nav.$data.guests).toStrictEqual([]);
    expect(nav.$data.groups).toStrictEqual([]);
})

test("DelImpPerson", async () => {
    addWrapper.setProps({guests: nav.$data.impGuests});

    add.$data.firstname = "Peter";
    add.$data.lastname = "Parker";
    add.$data.title = "Spiderman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Mag Spinnen";
    add.$data.day = "24";
    add.$data.month = "12";
    add.$data.year = "2010";
    add.$data.gender = Gender.Male;
    add.handleSubmit();

    await Vue.nextTick();

    let deleteWrapper = navWrapper.find(DeletePersonModal);
    let del = deleteWrapper.vm;

    del.handleDelete();

    await Vue.nextTick();
    expect(nav.$data.manGuests).toStrictEqual([]);
    expect(nav.$data.guests).toStrictEqual([]);
    expect(nav.$data.groups).toStrictEqual([]);
})

// Test EditPerson

test("EditPerson", async () => {
    add.$data.firstname = "Peter";
    add.$data.lastname = "Parker";
    add.$data.title = "Spiderman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Mag Spinnen";
    add.$data.day = "24";
    add.$data.month = "12";
    add.$data.year = "2010";
    add.$data.gender = Gender.Male;
    add.handleSubmit();

    await Vue.nextTick();

    let editWrapper = navWrapper.find(EditPersonModal);
    let edit = editWrapper.vm;

    editWrapper.vm.checkFormValidity = jest.fn(() => {return true});

    edit.$data.firstname = "Tony";
    edit.$data.lastname = "Stark";
    edit.$data.title = "Ironman";
    edit.$data.group = "CEO";
    edit.$data.email = "stark@gmail.com";
    edit.$data.comments = "Zynisch";
    edit.$data.day = "21";
    edit.$data.month = "01";
    edit.$data.year = "2010";
    edit.$data.gender = Gender.Female;
    edit.handleEdit();

    await Vue.nextTick();

    let p4 = new Person(1, "Tony", "Stark", Gender.Female, [1], new Date("2010-01-21"), "Ironman", "stark@gmail.com", "Zynisch", 0, 0, 0);

    expect(nav.$data.manGuests).toStrictEqual([p4]);
    expect(nav.$data.guests).toStrictEqual([p4]);
    expect(nav.$data.groups).toStrictEqual([new Group(1, [p4], 'CEO')]);
})

test("EditPersontoExistingGroup", async () => {
    add.$data.firstname = "Peter";
    add.$data.lastname = "Parker";
    add.$data.title = "Spiderman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Mag Spinnen";
    add.$data.day = "24";
    add.$data.month = "12";
    add.$data.year = "2010";
    add.$data.gender = Gender.Male;
    add.handleSubmit();

    add.$data.firstname = "Steven";
    add.$data.lastname = "Strange";
    add.$data.title = "Dr.";
    add.$data.group = "CEO";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Stur";
    add.$data.day = "28";
    add.$data.month = "02";
    add.$data.year = "2010";
    add.$data.gender = Gender.Divers;
    add.handleSubmit();

    await Vue.nextTick();

    let editWrapper = navWrapper.find(EditPersonModal);
    let edit = editWrapper.vm;

    editWrapper.vm.checkFormValidity = jest.fn(() => {return true});

    edit.$data.firstname = "Tony";
    edit.$data.lastname = "Stark";
    edit.$data.title = "Ironman";
    edit.$data.group = "CEO";
    edit.$data.email = "stark@gmail.com";
    edit.$data.comments = "Zynisch";
    edit.$data.day = "21";
    edit.$data.month = "01";
    edit.$data.year = "2010";
    edit.$data.gender = Gender.Female;
    edit.handleEdit();

    await Vue.nextTick();

    let p4 = new Person(1, "Tony", "Stark", Gender.Female, [2], new Date("2010-01-21"), "Ironman", "stark@gmail.com", "Zynisch", 0, 0, 0);
    let p5 = new Person(2, "Steven", "Strange", Gender.Divers, [2], new Date("2010-02-28"), "Dr.", "avengers@gmail.com", "Stur", 0, 0, 0);

    expect(nav.$data.manGuests).toStrictEqual([p4, p5]);
    expect(nav.$data.guests).toStrictEqual([p4, p5]);
    expect(nav.$data.groups).toStrictEqual([new Group(2, [p4, p5], 'CEO')]);
})

test("EditPersonInvalid", async () => {
    add.$data.firstname = "Peter";
    add.$data.lastname = "Parker";
    add.$data.title = "Spiderman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Mag Spinnen";
    add.$data.day = "24";
    add.$data.month = "12";
    add.$data.year = "2010";
    add.$data.gender = Gender.Male;
    add.handleSubmit();

    await Vue.nextTick();

    let editWrapper = navWrapper.find(EditPersonModal);
    let edit = editWrapper.vm;

    editWrapper.vm.checkFormValidity = jest.fn(() => {return false});

    edit.$data.firstname = "Tony";
    edit.$data.lastname = "Stark";
    edit.$data.title = "Ironman";
    edit.$data.group = "CEO";
    edit.$data.email = "stark@gmail.com";
    edit.$data.comments = "Zynisch";
    edit.$data.day = "21";
    edit.$data.month = "01";
    edit.$data.year = "2010";
    edit.$data.gender = Gender.Female;
    edit.handleEdit();

    await Vue.nextTick();

    expect(nav.$data.manGuests).toStrictEqual([p1]);
    expect(nav.$data.guests).toStrictEqual([p1]);
    expect(nav.$data.groups).toStrictEqual([g1]);
})

test("ResetEditPerson", async () => {
    add.$data.firstname = "Peter";
    add.$data.lastname = "Parker";
    add.$data.title = "Spiderman";
    add.$data.group = "Avengers";
    add.$data.email = "avengers@gmail.com";
    add.$data.comments = "Mag Spinnen";
    add.$data.day = "24";
    add.$data.month = "12";
    add.$data.year = "2010";
    add.$data.gender = Gender.Male;
    add.handleSubmit();

    await Vue.nextTick();

    let editWrapper = navWrapper.find(EditPersonModal);
    let edit = editWrapper.vm;

    editWrapper.vm.checkFormValidity = jest.fn(() => {return false});

    edit.$data.firstname = "Tony";
    edit.$data.lastname = "Stark";
    edit.$data.title = "Ironman";
    edit.$data.group = "CEO";
    edit.$data.email = "stark@gmail.com";
    edit.$data.comments = "Zynisch";
    edit.$data.day = "21";
    edit.$data.month = "01";
    edit.$data.year = "2010";
    edit.$data.gender = Gender.Female;
    edit.resetModal();

    await Vue.nextTick();

    expect(edit.$data.firstname).toStrictEqual("Peter");
    expect(edit.$data.lastname).toStrictEqual("Parker");
    expect(edit.$data.title).toStrictEqual("Spiderman");
    expect(edit.$data.group).toStrictEqual("Avengers");
    expect(edit.$data.email).toStrictEqual("avengers@gmail.com");
    expect(edit.$data.comments).toStrictEqual("Mag Spinnen");
    expect(edit.$data.day).toStrictEqual("24");
    expect(edit.$data.month).toStrictEqual("12");
    expect(edit.$data.year).toStrictEqual("2010");
    expect(edit.$data.gender).toStrictEqual(Gender.Male);
})

