import {Gender} from "../../types/Gender";
<template>
    <div id="GuestListImport">
        <b-dropdown-item id="guestimportbutton" size="lg" v-b-modal.import-list>Gästeliste Laden
            <b-modal id="import-list" title="Bitte wählen Sie Ihre Datei aus.">
               <input id="fileInput" ref="fileInput" type="file" accept=".csv" v-on:change="readFile">
            </b-modal>
        </b-dropdown-item>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {Person} from "../../types/Person";

    import * as papa from "papaparse";
    import {Gender} from "../../types/Gender";
    import {Group} from "../../types/Group";

    @Component({})

    export default class GuestlistImport extends Vue {

        csv: any[] = []; //parsed CSV

        indexCounter : number = 1; //counter for index of guests, could probably be local, but not sure yet
        groupIndexCounter : number = 1;

        guests : Person[] = []; //initalizing the guest as empty array
        groups : Group[] = [];//the property groups on the instance refers to all groups that were already created
        emptyGroup : Group | undefined;

        /**
         * reads a file uploaded by the user
         * @param event The Upload event triggered by the user
         */
        readFile(event: any) {
            let all_files = event.target.files;
            if (all_files.length === 0) {
                alert('Error : No file selected');
                return;
            }
            all_files.forEach((file: any) => {
                const reader = new FileReader();
                reader.readAsText(file);//read every uploaded file
                reader.onload = e => {
                    // @ts-ignore
                    this.parse(e.target.result.toString());//and give it to the parser
                }
            })
        }

        /**
         * parses the csv and creates respective guests of it
         * @param csv the csv that gets parsed
         */
        parse(csv : string) {
            let res = papa.parse(csv, { delimiter: ';', header: true}); //parse the csv
            this.csv = res.data; //store the results in csv
            this.csv.forEach (guest => {
                //make a new person for every person in the csv
                let gender : Gender;
                if (guest.gender) {
                    switch (guest.gender) {
                        case "male":
                        case "Male":
                        case "Man":
                        case "man":
                            gender = Gender.Male;
                            break;
                        case "female":
                        case "Female":
                        case "Woman":
                        case "woman":
                            gender = Gender.Female;
                            break;
                        default:
                            gender = Gender.Divers;
                    }
                } else {
                    gender = Gender.Divers;
                }
                let attendance : number = 0;
                if (guest.attendance) {
                    //this.guests.find(); implement check on if the specified attendance is already in the array
                }
                let groups : Group[]  = [];//don't confuse with this.groups, the variable groups refers to all groups the current guest is in
                if (guest.groups) {
                    //find existing groups
                    let groupnames: string[] = guest.groups.split(',');
                    let exGroups = this.findExistingGroups(groupnames);
                    groups = exGroups.groups;
                    groupnames = exGroups.groupnames;
                    //create new groups
                    this.createNewGroups(groupnames).forEach( group => {
                        groups.push(group);
                    });//Arrays.concat does not work, so i have to write my own concat function
                } else {//if guest is not part of any group, add it to empty group
                    if (!this.emptyGroup) {//if empty group is undefined, create it
                        this.emptyGroup = new Group(this.groupIndexCounter, [], "");
                        this.groupIndexCounter++;
                        this.groups.push(this.emptyGroup);
                    }
                    groups.push(this.emptyGroup);
                }
                let groupIndexes : number[] = [];
                groups.forEach( group => {groupIndexes.push(group.groupID)});
                let newGuest = new Person(this.indexCounter, guest.firstname, guest.lastname, gender, groupIndexes,
                    guest.birthdate ? new Date(guest.birthdate) : new Date(),
                    guest.title ? guest.title : "",
                    guest.email ? guest.email : guest.email,
                    guest.comments ? guest.comments : "",
                    0,0, attendance);//and store them in the array
                this.guests.push(newGuest);
                this.indexCounter++;//update the counter for the index
                groups.forEach( group => {
                    group.addPerson(newGuest);
                });
            });
            this.$emit("imported-guests", {guests: this.guests, groups: this.groups});//send event to navbar that guests are imported
        }

        /**
         * if groups already exists don't create a new one, but memorize them so the guest can be added to them
         * @param groupnames
         */
        findExistingGroups(groupnames : string[]) {
            let groups : Group[] = [];
            this.groups.forEach( group => {
                groupnames.forEach(name => {
                    if (group.groupname === name) {//if group already exists, memorize it for later
                        groups.push(group);
                        groupnames.splice(groupnames.indexOf(name, 0));
                    }
                })
            });
            //groups the guest will be added to later and groupnames of groups that still need be created
            return {groups: groups, groupnames: groupnames};
        }

        /**
         * Create new groups
         * @param groupnames an array of all groupnames for which a group still needs to be created
         */
        createNewGroups(groupnames : string[]) {
            let groups : Group[] = [];
            groupnames.forEach( name => {
                let group = new Group(this.groupIndexCounter, [], name);
                this.groups.push(group);
                groups.push(group);
                this.groupIndexCounter++;
            });
            return groups;
        }
    }
</script>

<style>

</style>
