import { Gender } from "./Gender";

/***
 * A class which represents a person
 */
export class Person {
  id: number;
  firstname: string;
  lastname: string;
  birthdate?: Date;
  seatID?: number;
  tableID?: number;
  groups?: number[];
  gender: Gender;
  title?: string;
  email?: string;
  comments?: string;
  attendance?: number;
  seated: boolean;


    /***
     * A constructor for a person
     * @param id: the id of the person
     * @param firstname: the firstname of the person
     * @param lastname: the lastname of the person
     * @param gender: the gender of the person (male, female, divers)
     * @param groups: the groups the person is part of (0 if not part of a group) TODO: check if true
     * @param birthdate: the date the person was born
     * @param title: the title of the person (e.g. "Dr." or "Mr. President"
     * @param email: the email-address of the person
     * @param comments: additional information about the person
     * @param seatID: the id of the seat the person is seated at (0 if not seated)
     * @param tableID: the id of the table the person is placed at (0 if not seated)
     * @param attendance: the id of another person accompanying the person to the event
     */
  constructor(id: number,
              firstname: string, lastname: string, gender : Gender, groups: number[] = [], 
              birthdate? : Date, title? : string, email? : string,
              comments? : string, seatID? : number, tableID? : number,
              attendance? : number) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.birthdate = birthdate;
    this.seatID = seatID;
    this.tableID = tableID;
    this.groups = groups;
    this.gender = gender;
    this.title = title;
    this.email = email;
    this.comments = comments;
    this.attendance = attendance;
    this.seated = false;
  }

  /***
   * This method saves the assignment of a person to a group in the person
   * @param id: the id of the group
   */
  public addGroup(id: number) {
      if(this.groups)
      this.groups.push(id);
  }

}