import {RectangularTable} from "../../types/RectangularTable";
import {Component, Vue} from 'vue-property-decorator';
// @ts-ignore
import { createLocalVue } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import { Seat } from '../../types/Seat';
import 'jspdf-autotable';
// @ts-ignore
import LoadEvent from "@/components/LoadEvent.vue";
import {CircularTable} from "../../types/CircularTable";
import {Direction} from "../../types/Direction";

// create an extended `Vue` constructor
const localVue = createLocalVue()
// install plugins as normal
localVue.use(BootstrapVue)

let app: any;
let rect: any;
let circ: any;

beforeEach(() => {
})

test("RemoveSeatCircularTable", async () => {
	let seat1 = new Seat(1, 1, [150,100-15], 0, 0);
	let table = new CircularTable([], 1, 1, [200, 200], 0, 100, 100, "Tisch");
	table.addSeat(seat1);
	let tableafterseatdelete = new CircularTable([], 1, 1, [200, 200], 0, 100, 100, "Tisch");
	table.removeSeat(seat1);
	await Vue.nextTick();
	expect(table).toStrictEqual(tableafterseatdelete);
})

test("RemoveSeatRectangularTable", async () => {
	let seat1 = new Seat(1, 1, [150,100-15], 0, 0);
	let table = new RectangularTable([], 1, 1, [200, 200], 0, 100, 100, "Tisch");
	table.addSeat(Direction.Up, 0, seat1);
	let tableafterseatdelete = new RectangularTable([], 1, 1, [200, 200], 0, 100, 100, "Tisch");
	tableafterseatdelete.seatMap.set(Direction.Up, [undefined]);
	tableafterseatdelete.seatMap.set(Direction.Down, [undefined]);
	table.deleteSeat(seat1);
	await Vue.nextTick();
	expect(table).toStrictEqual(tableafterseatdelete);
})