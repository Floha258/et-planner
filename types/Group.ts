import { Person } from "./Person";
/***
This class represents a group with a name. Multiple persons can be members of a group. Each person can be members of several groups.
*/
export class Group {
    groupID: number;
    members: Person[];
    groupname: string;


    /***
     * A constructor for a group
     * @param groupID: the id of the group
     * @param members: the members of the group
     * @param groupname: the name of the group
     */
  constructor(groupID: number, members: Person[], groupname: string) {
      this.groupID = groupID;
      this.members = members;
      this.groupname = groupname;

  }


    /***
     * Adds a person to the group
     * @param person: the person to be added
     */
  public addPerson(person: Person){

    //Check if person already in the group
    var personalreadyingroup = false;
    for(var i = 0; i < this.members.length; i++){
      if(person.id==this.members[i].id){
        personalreadyingroup = true;
        break;
      }
    }
    if(personalreadyingroup){
      //Throw some error
      //TODO:
    }else{
      this.members.push(person);
    }
  }

}
