<template>
    <b-modal :id="'delete-person' + this.guest.id" size="lg" ref="modal" title="Sind Sie sicher, dass Sie diese Person löschen wollen?" @ok="handleDelete()">
        <b-form ref="form">
            <b-form-row>
                <!-- Titel input -->
                <b-col>
                    <b-form-group label="Titel:" label-for="title-input">
                        <b-form-input id="title-input" v-model="guest.title" :disabled="true"></b-form-input>
                    </b-form-group>
                </b-col>

                <!-- Name input -->
                <b-col>
                    <b-form-group label="Vorname:" label-for="firstname-input">
                        <b-form-input id="firstname-input" v-model="guest.firstname" :disabled="true"></b-form-input>
                    </b-form-group>
                </b-col>
                <b-col>
                    <b-form-group label="Nachname:" label-for="lastname-input">
                        <b-form-input id="lastname-input" v-model="guest.lastname" :disabled="true"></b-form-input>
                    </b-form-group>
                </b-col>
            </b-form-row>
            <b-form-row>
                <!-- Gender input -->
                <b-col>
                    <b-form-group label="Geschlecht:" label-for="gender-input">
                        <b-form-select id="gender-input" v-model="guest.gender" :options="genderOptions" :disabled="true"></b-form-select>
                    </b-form-group>
                </b-col>

                <!-- Date input -->
                <b-col>
                    <b-form-group label="Geburtsdatum:" label-for="birthdate-input">
                        <b-input-group>
                            <b-form-select id="day-input" v-model="day" :options="dayOptions" :disabled="true"></b-form-select>
                            <b-form-select id="month-input" v-model="month" :options="monthOptions" :disabled="true"></b-form-select>
                            <b-form-select id="year-input" v-model="year" :options="yearOptions" :disabled="true"></b-form-select>
                        </b-input-group>
                    </b-form-group>
                </b-col>
            </b-form-row>
            <b-form-row>
                <!-- Group input -->
                <b-col>
                    <b-form-group label="Gruppe:" label-for="group-input">
                        <b-form-input id="group-input" v-model="group" :disabled="true"></b-form-input>
                    </b-form-group>
                </b-col>

                <!-- Email input -->
                <b-col>
                    <b-form-group label="Email:" label-for="email-input">
                        <b-form-input id="email-input" v-model="guest.email" :disabled="true"></b-form-input>
                    </b-form-group>
                </b-col>
            </b-form-row>
            <b-form-group label="Kommentare:" label-for="comments-input">
                <b-form-textarea id="comments-input" v-model="guest.comments" :disabled="true"></b-form-textarea>
            </b-form-group>
        </b-form>
    </b-modal>
</template>

<script>
    import { Component, Prop, Vue } from 'vue-property-decorator';

    import { Person } from '../../../../types/Person';
    import { Gender } from '../../../../types/Gender';

    export default {
        name: 'DeletePersonModal',
        props: {
            guest: {
                type: Person
            },
            impGuests: {},
            manGuests: {},
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
                day: "",
                month: "",
                year: "",
            }
        },
        created: function () {
            // get date options
            for (let i = 1; i < 32; i++) {
                if (i < 10) {
                    this.dayOptions.push('0' + i.toString(10));
                }
                else {
                    this.dayOptions.push(i.toString(10));
                }
            }
            for (let i = 1; i < 13; i++) {
                if (i < 10) {
                    this.monthOptions.push('0' + i.toString(10));
                }
                else {
                    this.monthOptions.push(i.toString(10));
                }    
            }
            var today = new Date();
            var todayYear = today.getFullYear();
            for (let i = 1900; i <= parseInt(todayYear, 10); i++) {
                this.yearOptions.push(i.toString(10));
            }

            // get group
            for (let i = 0; i < this.groups.length; i++) {
                for (let j = 0; j < this.guest.groups.length; j++) {
                    if (this.groups[i].groupID == this.guest.groups[j]) {
                        if (this.group != "") {
                            this.group += ',';
                        }
                        this.group += this.groups[i].groupname;
                    }
                }
            }

            // get field values
            this.day = this.guest.birthdate.getDate().toString(10);
            if (this.day.length < 2) {
                this.day = '0' + this.day;
            }
            this.month = (this.guest.birthdate.getMonth() + 1).toString(10);
            if (this.month.length < 2) {
                this.month = '0' + this.month;
            }
            this.year = this.guest.birthdate.getFullYear().toString(10);
        },
        methods: {

            /**
             *  Deletes the Person and removes him from all groups
             */

            handleDelete() {
                //delete the respective person
                let index = this.impGuests.indexOf(this.guest, 0);
                if (index > -1) {
                    this.impGuests.splice(index, 1);
                }
                index = this.manGuests.indexOf(this.guest, 0);
                if (index > -1) {
                    this.manGuests.splice(index, 1);
                }
                for (let i = 0; i < this.groups.length; i++) {
                    index = this.groups[i].members.indexOf(this.guest, 0);
                    if (index > -1) {
                        this.groups[i].members.splice(index, 1);
                    }
                    if (this.groups[i].members.length == 0) {
                        this.groups.splice(i, 1);
                    }
                }
            }         
        }
    };
</script>