<template>
    <b-modal id="add-person" size="lg" ref="modal" title="Bitte geben Sie die Daten der Person ein." @show="resetModal()" @hidden="resetModal()" @ok="handleSubmit()">
        <b-form ref="form">
            <b-form-row>
                <!-- Titel input -->
                <b-col>
                    <b-form-group label="Titel:" label-for="title-input">
                        <b-form-input id="title-input" v-model="title"></b-form-input>
                    </b-form-group>
                </b-col>

                <!-- Name input -->
                <b-col>
                    <b-form-group label="Vorname:" label-for="firstname-input" invalid-feedback="Name is required">
                        <b-form-input id="firstname-input" v-model="firstname" required></b-form-input>
                    </b-form-group>
                </b-col>
                <b-col>
                    <b-form-group label="Nachname:" label-for="lastname-input" invalid-feedback="Name is required">
                        <b-form-input id="lastname-input" v-model="lastname" required></b-form-input>
                    </b-form-group>
                </b-col>
            </b-form-row>
            <b-form-row>
                <!-- Gender input -->
                <b-col>
                    <b-form-group label="Geschlecht:" label-for="gender-input">
                        <b-form-select id="gender-input" v-model="gender" :options="genderOptions"></b-form-select>
                    </b-form-group>
                </b-col>

                <!-- Date input -->
                <b-col>
                    <b-form-group label="Geburtsdatum:" label-for="birthdate-input">
                        <b-input-group>
                            <b-form-select id="day-input" v-model="day" :options="dayOptions"></b-form-select>
                            <b-form-select id="month-input" v-model="month" :options="monthOptions"></b-form-select>
                            <b-form-select id="year-input" v-model="year" :options="yearOptions"></b-form-select>
                        </b-input-group>
                    </b-form-group>
                </b-col>
            </b-form-row>
            <b-form-row>
                <!-- Group input -->
                <b-col>
                    <b-form-group label="Gruppe:" label-for="group-input">
                        <b-form-input id="group-input" v-model="group"></b-form-input>
                    </b-form-group>
                </b-col>

                <!-- Email input -->
                <b-col>
                    <b-form-group label="Email:" label-for="email-input">
                        <b-form-input id="email-input" v-model="email"></b-form-input>
                    </b-form-group>
                </b-col>
            </b-form-row>
            <b-form-group label="Kommentare:" label-for="comments-input">
                <b-form-textarea id="comments-input" v-model="comments"></b-form-textarea>
            </b-form-group>
        </b-form>
    </b-modal>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    import { Person } from '../../../../types/Person';
    import { Group } from '../../../../types/Group';
    import { Gender } from '../../../../types/Gender';

    export default {
        name: 'AddPersonModal',
        props: {
            manGuests: {},
            impGuests: {},
            groups: {}  
        },
        data: function () {
            return {
                genderOptions: [{ value: Gender.Male, text: 'Mann' },{ value: Gender.Female, text: 'Frau' },{ value: Gender.Divers, text: 'Divers' }],
                dayOptions: [],
                monthOptions: [],
                yearOptions: [],
                gender: Gender.Male,
                group: "",
                title: "",
                firstname: "",
                lastname: "",
                email: "",
                day: "",
                month: "",
                year: "",
                comments: "",
            }
        },
        created: function () {
            // get date options
            for (let i = 1; i < 32; i++) {
                if (i < 10) {
                    // @ts-ignore
                    this.dayOptions.push('0' + i.toString(10));
                }
                else {
                    // @ts-ignore
                    this.dayOptions.push(i.toString(10));
                }
                
            }
            for (let i = 1; i < 13; i++) {
                if (i < 10) {
                    // @ts-ignore
                    this.monthOptions.push('0' + i.toString(10));
                }
                else {
                    // @ts-ignore
                    this.monthOptions.push(i.toString(10));
                }    
            }
            var today = new Date();
            var todayYear = today.getFullYear();
            // @ts-ignore
            for (let i = 1900; i <= parseInt(todayYear, 10); i++) {
                // @ts-ignore
                this.yearOptions.push(i.toString(10));
            }
        },
        methods: {

            /**
             *  Saves the new Person
             */

            handleSubmit() {
                // Exit when the form isn't valid
                if (!this.checkFormValidity()) {
                    return;
                }
                // new guest
                var maxGuestID = 0;
                // @ts-ignore
                for (let i = 0; i < this.impGuests.length; i++) {
                    // @ts-ignore
                    if (this.impGuests[i].id > maxGuestID) {
                        // @ts-ignore
                        maxGuestID = this.impGuests[i].id;
                    }
                }
                // @ts-ignore
                for (let i = 0; i < this.manGuests.length; i++) {
                    // @ts-ignore
                    if (this.manGuests[i].id > maxGuestID) {
                        // @ts-ignore
                        maxGuestID = this.manGuests[i].id;
                    }
                }
                // @ts-ignore
                var p = new Person(++maxGuestID, this.firstname, this.lastname, this.gender, [], new Date(this.year + '-' + this.month + '-' + this.day), this.title, this.email, this.comments, 0, 0, 0);
                // @ts-ignore
                this.guestId++;
                // add group
                var found = false;
                var maxGroupID = 0;
                // @ts-ignore
                for (let i = 0; i < this.groups.length; i++) {
                    // @ts-ignore
                    if (this.groups[i].groupID > maxGroupID) {
                        // @ts-ignore
                        maxGroupID = this.groups[i].groupID;
                    }
                    // @ts-ignore
                    if (this.groups[i].groupname == this.group) {
                        // @ts-ignore
                        this.groups[i].addPerson(p);
                        // @ts-ignore
                        p.addGroup(this.groups[i].groupID);
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    // @ts-ignore
                    var g = new Group(++maxGroupID, [], this.group);
                    g.addPerson(p);
                    p.addGroup(g.groupID);
                    // @ts-ignore
                    this.groups.push(g);
                }
                // @ts-ignore
                this.manGuests.push(p);
            },

            /**
             *  Checks the validity of the form
             */

            checkFormValidity() {
                // @ts-ignore
                const valid = this.$refs.form.checkValidity();
                // @ts-ignore
                this.state = valid ? 'valid' : 'invalid';
                return valid;
            },

            /**
             *  Clears and resets all fields of the modal
             */

            resetModal() {
                // @ts-ignore
                this.firstname = '';
                // @ts-ignore
                this.lastname = '';
                // @ts-ignore
                this.title = '';
                // @ts-ignore
                this.email = '';
                // @ts-ignore
                this.comments = '';
                // @ts-ignore
                this.gender = Gender.Male;
                // @ts-ignore
                this.day = '';
                // @ts-ignore
                this.month = '';
                // @ts-ignore
                this.year = '';
                // @ts-ignore
                this.group = '';
                // @ts-ignore
                this.state = null;
            }           
        }
    };
</script>