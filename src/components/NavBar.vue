<template>
    <div id="navbar" class="sidenav">
        <div>
            <b-card no-body>
                <b-tabs card justified>
                    <b-tab title="Gäste" active>
                        <!-- Add a new person -->
                        <div>
                            <!-- Add a new person -->
                            <b-button type="button" id="add-button" variant="outline-primary" data-toggle="tooltip" title="Erstellt eine neue Person." v-b-modal.add-person><font-awesome-icon class="add-user-icon" :icon="['fas', 'user-plus']" size="2x"/></b-button>
                            <!-- Sorting options -->
                            <b-input-group size="sm">
                                <b-form-checkbox id="filter-seated-checkbox" v-model="filterSeated" name="filter-seated-checkbox">Nur nicht-platzierte Personen anzeigen</b-form-checkbox>
                            </b-input-group>
                            <b-input-group size="sm">
                                <b-input-group-prepend>
                                    <b-button v-if="!sortAscending" v-on:click="changeSortDirection" data-toggle="tooltip" title="Ändert die Sortierrichtung." id="sort-button" variant="outline-primary"><font-awesome-icon class="sort-icon" :icon="['fas', 'sort-amount-up-alt']" size="lg"/></b-button>
                                    <b-button v-else v-on:click="changeSortDirection" data-toggle="tooltip" title="Ändert die Sortierrichtung." id="sort-button" variant="outline-primary"><font-awesome-icon class="sort-icon" :icon="['fas', 'sort-amount-down-alt']" size="lg"/></b-button>
                                </b-input-group-prepend>
                                <b-form-select v-on:change="sortGuests" class="sort-controls" data-toggle="tooltip" title="Ändert das Sortierkriterium." id="sorting-input" v-model="sortingOption" :options="sortingOptions"></b-form-select>
                                <b-form-input id="filter-input" v-model="filter" placeholder="Suche..."></b-form-input>
                            </b-input-group>

                            <!-- Modal to add a person -->
                            <add-person-modal :manGuests="manGuests" :impGuests="impGuests" :groups="groups"></add-person-modal>

                        </div>

                        <!-- for every guest, show it in the navbar on the left side -->
                        <div class="guestlist">
                            <div id="group-item" v-for="group in filteredGroups" v-bind:key="group.groupID">
                                <div v-if="group.groupname!=''" class="group">
                                    <b>{{group.groupname}}:</b>
                                </div>
                                <table class="table guestlist">
                                    <tr id="guest-item" v-for="guest in group.members" v-bind:key="guest.id" v-on:dragstart="dragPerson($event, guest)" draggable="true">
                                    
                                        <!-- Modal to edit a person -->
                                        <edit-person-modal :guest="guest" :groups="groups"></edit-person-modal>

                                        <!-- Modal to delete a person -->
                                        <delete-person-modal :impGuests="impGuests" :manGuests="manGuests" :guest="guest" :groups="groups"></delete-person-modal>

                                        <th scope="col">
                                            <font-awesome-icon v-if="guest.gender==gender.Female" class="gender-female" :icon="['fas', 'venus']" size="2x"/>
                                            <font-awesome-icon v-if="guest.gender==gender.Male" class="gender-male" :icon="['fas', 'mars']" size="2x"/>
                                            <font-awesome-icon v-if="guest.gender==gender.Divers" class="gender-other" :icon="['fas', 'transgender']" size="2x"/>
                                        </th>
                                        <th class="name" :id="'tooltip-lastname' + guest.id" scope="col">
                                            {{ guest.lastname }}
                                        </th>
                                        <b-tooltip :target="'tooltip-lastname' + guest.id" triggers="hover">
                                            {{ guest.lastname }}
                                        </b-tooltip>
                                        <th class="name" :id="'tooltip-firstname' + guest.id" scope="col">
                                            {{ guest.firstname }}
                                        </th>
                                        <b-tooltip :target="'tooltip-firstname' + guest.id" triggers="hover">
                                            {{ guest.firstname }}
                                        </b-tooltip>
                                        <th data-toggle="tooltip" title="Person editieren" scope="col">
                                            <font-awesome-icon v-b-modal="'edit-person' + guest.id" class="edit-icon" :icon="['fas', 'edit']"/>
                                        </th>
                                        <th data-toggle="tooltip" title="Person löschen"  scope="col">
                                            <font-awesome-icon v-b-modal="'delete-person' + guest.id" class="delete-icon" :icon="['fas', 'trash-alt']"/>
                                        </th>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </b-tab>
                    <b-tab title="Tische">
                        <div id="rectangleTableSlot" class="tablepreview">
                            <div id="rectangleTable" class="shape" draggable="true" v-on:dragstart="dragTable($event)">
                                
                            </div>
                        </div>
                        <div id="circularTableSlot" class="tablepreview">
                            <div id="roundTable"  draggable="true" class="shape" v-on:dragstart="dragTable($event)">
                                
                            </div>
                        </div>
                    </b-tab>
                </b-tabs>
             </b-card>
        </div>
    </div>

</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import { Person } from '../../types/Person';
import { Group } from '../../types/Group';
import { Gender } from '../../types/Gender';
// @ts-ignore
import  * as vClickOutside from 'v-click-outside';
Vue.use(vClickOutside);

import EditPersonModal from "@/components/modals/person/EditPersonModal.vue";
import DeletePersonModal from "@/components/modals/person/DeletePersonModal.vue";
import AddPersonModal from "@/components/modals/person/AddPersonModal.vue";

@Component({
    name: 'NavBar',
    components: {
        EditPersonModal,
        DeletePersonModal,
        AddPersonModal
    }
})
export default class NavBar extends Vue {
    showGuests: boolean = true;
    manGuests: Person[] = [];
    impGuests: Person[] = [];
    guests: Person[] = [];
    sortAscending: boolean = true;
    sortingOption: String = "lastname";
    sortingOptions = [
        { value: "lastname", text: "Nachname" },
        { value: "firstname", text: "Vorname" },
        { value: "age", text: "Alter" },
        { value: "gender", text: "Geschlecht" },
    ];
    groups: Group[] = [];
    gender = Gender;
    filter: String = "";
    filterSeated = false;

    @Prop({default : function () {
        return [];
        }}) guestsProp : Person[] | undefined;

    @Prop({default : function () {
            return [];
        }}) groupsProp : Group[] | undefined;

    @Watch('guestsProp')
    onGuestsPropChanged(newVal : Person[]) {
        this.impGuests = [];
        newVal.forEach(guest => {
            this.impGuests.push(guest);
        });
    }

    @Watch('groupsProp')
    onGroupsPropChanged(newVal : Group[]) {
        newVal.forEach(group => {
            this.groups.push(group);
        });
    }

    /**
     * Watches for changes in "impGuests" and updates "guests"
     */

    @Watch('impGuests', {deep: true})
    onImpGuestChanged() {
        this.onGuestChanged();
    }

    /**
     * Watches for changes in "manGuests" and updates "guests"
     */

    @Watch('manGuests', {deep: true})
    onManGuestChanged() {
        this.onGuestChanged();
    }

    /**
     * Watches for changes in the search bar and updates "guests"
     */

    @Watch('filter')
    onFilterChanged() {
        this.onGuestChanged();
    }

    /**
     * Watches for changes in the seated toggle and updates "guests"
     */

    @Watch('filterSeated')
    onFilterSeatedChanged() {
        this.onGuestChanged();
    }

    /**
     * Updates guest list by first merging impGuests and manGuests and then filtering and sorting the result
     */

    onGuestChanged() {
        this.guests = this.impGuests.concat(this.manGuests);
        this.sortGuests();
        this.$emit('new-guests', {guests: this.guests, groups: this.groups});
    }

    /**
     * Filters the displayed members of each group depending on the search bar and the seated-toggle
     * 
     * @return sorted and filtered list of groups
     */

    get filteredGroups() {
        let res = [];
        
        let re = new RegExp(this.filter.toLowerCase());
        for (let i = 0; i < this.groups.length; i++) {
            let g = new Group(this.groups[i].groupID, [], this.groups[i].groupname);
            for (let j = 0; j < this.groups[i].members.length; j++) { 
                if ((this.filter == "" || this.groups[i].members[j].firstname.toLowerCase().search(re) > -1 || this.groups[i].members[j].lastname.toLowerCase().search(re) > -1) && (!this.filterSeated || !this.groups[i].members[j].seated)) {
                    g.members.push(this.groups[i].members[j]);
                }
            }
            if (g.members.length > 0) {
                res.push(g);
            }
        }

        res.sort((a, b) => {
                    return this.sortByValue(a.groupname , b.groupname);
                });
        return res;
    }

    /**
     * Helper compare function for strings.
     * 
     * @param a first string
     * @param b second string
     * 
     * @result 1 for a > b, -1 for a < b and 0 for a = b
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

    /**
     * Helper compare function for dates.
     * 
     * @param a first date
     * @param b second date
     * 
     * @result 1 for a > b, -1 for a < b and 0 for a = b
     */

    sortByDate(a: Date, b: Date) : number {
        if (a > b) {
            return 1;
        }
        else if (b > a) {
            return -1;
        }
        return 0;
    }

    /**
     * Helper function to sort a list of Persons. 
     * Depending on "sortAscending", the list is sorted ascending or descending.
     * Depending on "sortingOptions", the list is sorted after firstname, lastname, age or gender.
     * 
     * @param list list of persons
     */

    sortList(list: Person[]) {
        if (this.sortAscending) {
            if (this.sortingOption == "lastname") {
                list.sort((a, b) => {
                    let val = this.sortByValue(a.lastname , b.lastname);
                    if (val == 0) {
                        val = this.sortByValue(a.firstname, b.firstname);
                    }
                    return val;
                });
            }
            else if (this.sortingOption == "firstname") {
                list.sort((a, b) => {
                    let val = this.sortByValue(a.firstname , b.firstname);
                    if (val == 0) {
                        val = this.sortByValue(a.lastname, b.lastname);
                    }
                    return val;
                });
            }
            else if (this.sortingOption == "gender") {
                list.sort((a, b) => {
                    // @ts-ignore
                    return this.sortByValue(a.gender, b.gender)
                });
            }
            else if (this.sortingOption == "age") {
                list.sort((a, b) => {
                    return this.sortByDate(a.birthdate, b.birthdate)
                });
            }
        }
        else {
            if (this.sortingOption == "lastname") {
                list.sort((b, a) => {
                    let val = this.sortByValue(a.lastname , b.lastname);
                    if (val == 0) {
                        val = this.sortByValue(a.firstname, b.firstname);
                    }
                    return val;
                });
            }
            else if (this.sortingOption == "firstname") {
                list.sort((b, a) => {
                    let val = this.sortByValue(a.firstname , b.firstname);
                    if (val == 0) {
                        val = this.sortByValue(a.lastname, b.lastname);
                    }
                    return val;
                });
            }
            else if (this.sortingOption == "gender") {
                list.sort((b, a) => {
                    // @ts-ignore
                    return this.sortByValue(a.gender, b.gender)
                });
            }
            else if (this.sortingOption == "age") {
                list.sort((b, a) => {
                    return this.sortByDate(a.birthdate, b.birthdate)
                });
            }
        }
    }

    /**
     * Changes the sorting direction.
     */

    changeSortDirection() {
        this.sortAscending = !this.sortAscending;
        this.sortGuests();
    }

    /**
     * Sorts the guestlist and the member lists of all groups.
     */

    sortGuests() { 
        this.sortList(this.guests);
        this.groups.forEach(group => {
            this.sortList(group.members);
        })
        this.$forceUpdate();
    }

    /**
     * Called, when user starts to drag a table-preview
     */

    dragTable(ev) {
        ev.dataTransfer.setData("tableShape", ev.target.id);

        var table = document.getElementById(ev.target.id);
        var rect = table.getBoundingClientRect();

        ev.dataTransfer.setData("offsetX",  (ev.pageX - rect.left).toString());
        ev.dataTransfer.setData("offsetY", (ev.pageY - rect.top).toString());
    }

    /**
     * Called, when user starts to drag a guest from the guestlist
     */

    dragPerson(ev, guest) {
        ev.dataTransfer.setData("person-id", guest.id);
        ev.dataTransfer.setData("person-firstname", guest.firstname);
        ev.dataTransfer.setData("person-lastname", guest.lastname);
        ev.dataTransfer.setData("person-gender", guest.gender);
    }
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.sidenav {
    height: 90%;
    width: 25%;
    position: fixed;
    z-index: 1;
    top: 10%;
    left: 0;
    background-color: white;
    overflow-x: hidden;
    overflow-y: scroll;
}


.tablepreview{
    height: 100px;
    width: 100px;

    align-content: center;
    align-items: center;
    align-self: center;
    vertical-align: center;

    position: relative;
    background-color: rgb(255, 255, 255);
    
    text-align: left;

    margin-top: 10%;
    left: 30%;
    
}

.shape{

    height: 80%;
    width: 80%;

    float: right;

    background-color: burlywood;
    position: relative;

    cursor:grab;

    top: 10%;
    right: 10%;
}

.gender-male {
    color: deepskyblue;
}

.gender-female {
    color: hotpink;
}

.gender-other {
    color: purple;
}

.edit-icon {
    color: green;
}

.delete-icon {
    color: red;
}

#roundTable{
    border-radius: 50%;
}

.tabelement {
    background-color: inherit;
    color: rgb(48, 43, 43);
    padding: 22px 16px;
    width: 50%;
    outline: none;
    text-align: center;
    cursor: pointer;
    transition: 0.3s;  
}

#add-button {
    padding: 10px;
    margin-bottom: 16px;
    height: 60px;
    width: 60px;
    text-align: center;
    cursor: pointer;
    transition: 0.3s;
}

#guest-item {
    font-size: 13px;
}

.guestlist {
  table-layout:fixed;
}

.name {
  width: 35%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}

.group {
    float: left;
    text-align: left;
    padding-top: 10px;
}

</style>
