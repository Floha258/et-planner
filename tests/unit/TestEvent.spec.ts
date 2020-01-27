import { mount } from '@vue/test-utils';
import {Vue} from 'vue-property-decorator';
import {Veranstaltung} from "../../types/Veranstaltung";
import {Room} from "../../types/Room";
import {Person} from '../../types/Person';
import {Gender} from '../../types/Gender';
// @ts-ignore
import App from "../../src/App.vue";
// @ts-ignore
import NewEventModal from "../../src/components/modals/NewEventModal.vue";
import { createLocalVue } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

// create an extended `Vue` constructor
const localVue = createLocalVue()

let app : any;
let ev : any;
let evWrapper : any;

// install plugins as normal
beforeEach( () => {
    localVue.use(BootstrapVue)
    const appWrapper = mount(App,{localVue});
    app = appWrapper.vm;
    evWrapper = appWrapper.find(NewEventModal);
    ev = evWrapper.vm;
    evWrapper.vm.checkFormValidity = jest.fn(() => {return true});
});

test("ChangeEvent", async () => {
    app.$data.exportEvent.changeEventData("Weihnachtsfeier", new Date("2020-12-24"), "Mensa", [new Room("Test", 1, [])], [new Person(1, "Derek", "Sitzthier", Gender.Male,[], new Date("2020-12-24"), "Dr.", "derekimnetz@gmx.de", "Mag Fisch", 1, 1, 0)]);
    await Vue.nextTick();
    expect(app.$data.exportEvent).toStrictEqual(new Veranstaltung("Weihnachtsfeier", new Date("2020-12-24"), "Mensa", [new Room("Test", 1, [])], [], [new Person(1, "Derek", "Sitzthier", Gender.Male,[], new Date("2020-12-24"), "Dr.", "derekimnetz@gmx.de", "Mag Fisch", 1, 1, 0)]));
})

test("ChangeEventEmpty", async () => {
    app.$data.exportEvent.changeEventData();
    await Vue.nextTick();
    expect(app.$data.exportEvent.eventName).toStrictEqual("");
})

test("ChangeEventWithModal", async () => {
    ev.$data.evname = "Weihnachtsfeier";
    ev.$data.day = "24";
    ev.$data.month = "12";
    ev.$data.year = "2020";
    ev.handleOk();

    await Vue.nextTick();
    expect(app.$data.exportEvent).toStrictEqual(new Veranstaltung("Weihnachtsfeier 24.12.2020", new Date("2020-12-24"), "", [new Room("", 1, [])], [], []));
})

test("ResetModal", async () => {
    ev.$data.evname = "Weihnachtsfeier";
    ev.$data.day = "24";
    ev.$data.month = "12";
    ev.$data.year = "2020";
    ev.resetModal();

    await Vue.nextTick();
    expect(ev.$data.evname).toStrictEqual("");
    expect(ev.$data.day).toStrictEqual("");
    expect(ev.$data.month).toStrictEqual("");
    expect(ev.$data.year).toStrictEqual("");
})

test("InvalidForm", async () => {
    evWrapper.vm.checkFormValidity = jest.fn(() => {return false});
    ev.$data.evname = "Weihnachtsfeier";
    ev.$data.day = "24";
    ev.$data.month = "12";
    ev.$data.year = "2020";
    ev.handleOk();

    await Vue.nextTick();
    expect(app.$data.exportEvent.eventName).toStrictEqual("");
})