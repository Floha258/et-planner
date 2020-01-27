<template>
    <b-modal :id="'edit-person' + this.guest.id" size="lg" @hidden="resetModal()" @ok="handleEdit(guest)">
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

<script>
    import { Component, Prop, Vue } from 'vue-property-decorator';

    import { Person } from '../../../../types/Person';
    import { Gender } from '../../../../types/Gender';
    import { Group } from '../../../../types/Group';

    export default {
        name: 'EditPersonModal',
        props: {
            guest: {
                type: Person,
            },
            groups: {},
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
                comments: ""
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
            this.firstname = this.guest.firstname;
            this.lastname = this.guest.lastname;
            this.gender = this.guest.gender;
            this.title = this.guest.title;
            this.email = this.guest.email;
            this.comments = this.guest.comments;
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
             *  Saves and applies the edited data
             */

            handleEdit() {
                // Exit when the form isn't valid
                if (!this.checkFormValidity()) {
                    return;
                }
                // edit selected Person
                this.guest.firstname = this.firstname;
                this.guest.lastname = this.lastname;
                this.guest.title = this.title;
                this.guest.birthdate = new Date(this.year + '-' + this.month + '-' + this.day);
                this.guest.comments = this.comments;
                this.guest.email = this.email;
                this.guest.gender = this.gender;

                // remove Person from all groups
                for (let i = 0; i < this.groups.length; i++) {
                    let index = this.groups[i].members.indexOf(this.guest, 0);
                    if (index > -1) {
                        this.groups[i].members.splice(index, 1);
                    }
                    if (this.groups[i].members.length == 0) {
                        this.groups.splice(i, 1);
                    }
                }

                this.guest.groups = [];

                // add Person to new groups
                var found = false;
                var maxID = 0;
                for (let i = 0; i < this.groups.length; i++) { 
                    if (this.groups[i].groupID > maxID) {
                        maxID = this.groups[i].groupID;
                    }  
                    if (this.groups[i].groupname == this.group) {
                        this.groups[i].addPerson(this.guest);
                        this.guest.addGroup(this.groups[i].groupID);
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    var g = new Group(++maxID, [], this.group);
                    g.addPerson(this.guest);
                    this.guest.addGroup(g.groupID);
                    this.groups.push(g);
                }

            },

            /**
             *  checks the validity of the form
             */

            checkFormValidity() {
                const valid = this.$refs.form.checkValidity();
                this.state = valid ? 'valid' : 'invalid';
                return valid;
            },


            /**
             *  Resets the Modal to the original guest data
             */

            resetModal() {
                // get field values
                this.firstname = this.guest.firstname;
                this.lastname = this.guest.lastname;
                this.gender = this.guest.gender;
                this.title = this.guest.title;
                this.email = this.guest.email;
                this.comments = this.guest.comments;
                this.day = this.guest.birthdate.getDate().toString(10);
                if (this.day.length < 2) {
                    this.day = '0' + this.day;
                }
                this.month = (this.guest.birthdate.getMonth() + 1).toString(10);
                if (this.month.length < 2) {
                    this.month = '0' + this.month;
                }
                this.year = this.guest.birthdate.getFullYear().toString(10);

                // get group
                this.group = '';
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

                this.state = null;
            }           
        }
    };
</script>