import { mount } from '@vue/test-utils';
import {Component, Vue} from 'vue-property-decorator';
// @ts-ignore
import Playground from "../../src/components/Playground.vue";
// @ts-ignore
import App from "../../src/App.vue";
import { RectangularTable } from '../../types/RectangularTable';
import { CircularTable } from '../../types/CircularTable';
import { createLocalVue } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faMars, faVenus, faTransgender, faEdit, faTrashAlt, faUserPlus, faSortAmountUpAlt, faSortAmountDownAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// create an extended `Vue` constructor
let localVue = createLocalVue();

// install plugins as normal
localVue.use(BootstrapVue);

library.add(faMars, faVenus, faTransgender, faEdit, faTrashAlt, faUserPlus, faSortAmountUpAlt, faSortAmountDownAlt);
localVue.component('font-awesome-icon', FontAwesomeIcon);

let pg : any;
let app : any;
let pgWrapper : any;
let appWrapper : any;

beforeEach(() => {
    appWrapper = mount(App,{localVue});
    app = appWrapper.vm;
    pgWrapper = appWrapper.find(Playground);
    pg = pgWrapper.vm;
})

// Tests AddPerson

test("AddRectTable", async () => {
    pg.paintNewRectTable(200,200,200,200);
    await Vue.nextTick();

    expect(app.$data.exportEvent.rooms[0].tables).toStrictEqual([new RectangularTable([], 1, 0, [250, 250], 0, 200, 200, "")]);
})

// sadly I have to check for both tables because I can't access global variables (like tableList). This would require refactoring the global methods and parameters and putting them inside the component

test("AddCircTable", async () => {
    pg.paintNewRoundTable(200,200,200,200);
    await Vue.nextTick();

    expect(app.$data.exportEvent.rooms[0].tables).toStrictEqual([new RectangularTable([], 1, 0, [250, 250], 0, 200, 200, ""), new CircularTable([], 2, 0, [250, 250], 0, 200, 200, "")]);
})