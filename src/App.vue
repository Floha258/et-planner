<template>
  <div id="app">
     <!-- main Navigation bar -->
     <b-navbar id="navbar" toggleable="lg" type="dark" variant="primary" fixed = 'top' >
        <!-- Name of the software -->
        <b-navbar-brand href="#">ET-Planner</b-navbar-brand>
         
        <!-- Event title -->
        <b-navbar-nav class="mx-auto">
            <b-nav-text href="#"><h2 id="EventTitle">{{exportEvent.eventName}}</h2></b-nav-text>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
           

            <!-- Button Event Speichern  -->
            <save-event :save-prop="exportEvent"/>
            <!-- Buttons of the navigation bar --> 
            <b-nav-item-dropdown text="Datei" right>
                <!-- Button Event bearbeiten erstellen  -->
                <b-dropdown-item v-b-modal.new-event>Veranstaltung editieren</b-dropdown-item>
                <!-- Button Gästeliste importieren -->
                <guestlist-import v-on:imported-guests="sendGuestsToNav"/>
                <!-- Button Event Laden  -->
                <load-event v-on:loaded-event="loadEvent"/>
                <!-- Button Tischzuweisung exportieren  -->
                <export
                        :exportProp="exportEvent"
                />
            </b-nav-item-dropdown>

            <!-- Modal Neues Event erstellen -->
            <new-event-modal :event="exportEvent"/>

        </b-navbar-nav>

    </b-navbar>

    <!-- Sidebar to shows the liste of person and tables -->
      <nav-bar
              :guestsProp="importEvent.persons"
              :groupsProp="importEvent.groups"
              v-on:new-guests="newGuests"
      />

    
    <!-- Canvas to drag table and create chaise and assign guest -->

      <Playground
              :eventProp="importEvent"
              v-on:new-table="newTable"
              v-on:placedPerson="assignPersonToSeat"
              v-on:removedPerson="removePersonFromSeat"
      />
  
  </div>
</template>

<script lang="ts">

    import {Component, Vue} from 'vue-property-decorator';
    import NavBar from "@/components/NavBar.vue";
    import Export from "@/components/Export.vue";
    import GuestlistImport from "@/components/GuestlistImport.vue";
    import Playground from "@/components/Playground.vue";
    import LoadEvent from "@/components/LoadEvent.vue";
    import SaveEvent from "@/components/SaveEvent.vue";
    import {Person} from "../types/Person";
    import { Veranstaltung } from "../types/Veranstaltung";
    import {Table} from "../types/Table";
    import {Room} from "../types/Room";
    import {Group} from "../types/Group";
    import NewEventModal from "@/components/modals/NewEventModal.vue";
    // @ts-ignore
    import * as deepEquals from "deep-equal";

    @Component({
      components: {
        Export,
        GuestlistImport,
        NavBar,
        LoadEvent,
        Playground,
        SaveEvent,
        NewEventModal
      },
    })


export default class App extends Vue {

  test: boolean = false;
  eventName: string = "";
  nameState : string | null = null;
  guests : Person[] = [];
  tables : Table[] = [];
  exportEvent : Veranstaltung  = new Veranstaltung("", new Date(), "", [new Room("", 1, [])], [], []);
  importEvent : Veranstaltung = new Veranstaltung("", new Date(), "", [new Room("", 1, [])], [], []);

  //---------Functions for the new event popup----------------


  checkFormValidity() {
      // @ts-ignore
      const valid = this.$refs.form.checkValidity();
      this.nameState = valid ? 'valid' : 'invalid';
      return valid;
  }

  resetModal() {
      this.eventName = '';
      this.nameState = null;
  }

        /**
         * Sets the responsible properties that will send the guests and groups to the Navbar
         * @param emittedEvent the event the function gets from the Guestlist Import
         */
  sendGuestsToNav (emittedEvent : { guests: Person[], groups: Group[] }) {
      this.importEvent.persons = emittedEvent.guests;
      this.importEvent.groups = emittedEvent.groups;
      return;
  }

        /**
         * Sets the responsible properties, that will send guests and groups to the navbar
         * as well as tables etc. to the Playground, so that it can load them
         * @param event the Event the function gets from LoadEvent
         */
  loadEvent (event: Veranstaltung) {
      this.importEvent = event;
      this.exportEvent = event;
      this.eventName = event.eventName;
      this.tables = event.rooms[0].tables;
  }

        /**
         * If any new tables are added to the playground/tables are edited, this function saves the for saving/export
         * @param event The updated table array
         */
  newTable(event: { details: Table[] }){
      this.exportEvent.rooms[0].tables = event.details;
  }

        /**
         * if any new guests in the navbar are registered, add them to the event, so that they can be exported
         * @param event The updated guests & groups array
         */
  newGuests(event: {guests: Person[], groups: Group[]}){
      if (!deepEquals(this.exportEvent.persons, event.guests)) {
          this.exportEvent.persons = event.guests;
      }
      if (!deepEquals(this.exportEvent.groups, event.groups)) {
          this.exportEvent.groups = event.groups;
      }
      if (!deepEquals(this.guests, event.guests)) {
          this.guests = event.guests;
      }
  }

  assignPersonToSeat(event: {id: number, seatId: number, tableId: number}){
      for (let i = 0; i < this.guests.length; i++) {
          if (this.guests[i].id == event.id) {
              this.guests[i].seated = true;
              this.guests[i].seatID = event.seatId;
              this.guests[i].tableID = event.tableId;
          }
      }
  }

  removePersonFromSeat(event: {id: number}){
      for (let i = 0; i < this.guests.length; i++) {
          if (this.guests[i].id == event.id) {
              this.guests[i].seated = false;
              this.guests[i].seatID = 0;
              this.guests[i].tableID = 0;
          }
      }
  }

}

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}



.navbar{
  text-align: center;
  background-color: rgb(44, 42, 42);
  height: 10%;
  

  }

#EventTitle {
    color: white;
}

</style>
