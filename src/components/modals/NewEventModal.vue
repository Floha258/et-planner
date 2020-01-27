<template>
    <!-- Modal Neues Event erstellen -->
    <b-modal id="new-event" ref="modal" title="Bitte geben Sie einen Namen für die Veranstaltung ein" @show="resetModal()" @hidden="resetModal()" @ok="handleOk()">
        <form ref="form">
            <b-form-group label="Name" label-for="evname-input" invalid-feedback="Name is required">
                <b-form-input id="eventname-input" v-model="evname" required></b-form-input>
            </b-form-group>
            <b-form-group label="Datum der Veranstaltung" label-for="date-input" title="Bitte geben Sie ein Datum für die Veranstaltung ein">
                <b-input-group>
                    <b-form-select id="day-input" v-model="day" :options="dayOptions"></b-form-select>
                    <b-form-select id="month-input" v-model="month" :options="monthOptions"></b-form-select>
                    <b-form-select id="year-input" v-model="year" :options="yearOptions"></b-form-select>
                </b-input-group>
            </b-form-group>
        </form>
    </b-modal>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import GuestlistImport from "@/components/GuestlistImport.vue";
    import { Veranstaltung } from "../../../types/Veranstaltung";

    @Component({
        components: {
            GuestlistImport
        }
    })

    export default class NewEventModal extends Vue {
        @Prop({default : undefined}) 
        event : Veranstaltung | undefined;

        created() {
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
            for (let i = 2000; i < 2100; i++) {
                // @ts-ignore
                this.yearOptions.push(i.toString(10));
            }
        }

        handleOk() {
            // Exit when the form isn't valid
            if (!this.checkFormValidity()) {
                return;
            }
            // @ts-ignore
            this.event.date = new Date(this.year + '-' + this.month + '-' + this.day);
            // @ts-ignore
            this.event.eventName = this.evname + ' ' + this.day + '.' + this.month + '.' + this.year;
            // @ts-ignore
            this.$emit("imported-guests", {guests: this.guests, groups: this.groups});
        }

        checkFormValidity() {
            // @ts-ignore
            const valid = this.$refs.form.checkValidity();
            // @ts-ignore
            this.state = valid ? 'valid' : 'invalid';
            return valid;
        }

        resetModal() {
            // @ts-ignore
            this.evname = '';
            // @ts-ignore
            this.day = '';
            // @ts-ignore
            this.month = '';
            // @ts-ignore
            this.year = '';
            // @ts-ignore
            this.guests = [];
            // @ts-ignore
            this.groups = [];
        }

        data() {
            return {
                evname : "",
                dayOptions : [],
                monthOptions : [],
                yearOptions : [],
                guests: [],
                groups: [],
                day : "",
                month : "",
                year: ""
            }
        }
    }
</script>

<style scoped>

</style>