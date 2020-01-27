import { IPlacable } from "./iPlacable";
import { Direction } from "./Direction";

/***
 * A class which is the core of every object which can be placed on the canvas
 */
export class Placable implements IPlacable {

    position: [number, number];
    rotation: number;
    scaleX: number;
    scaleY: number;


    /***
     * A constructor for a placable
     * @param position: the position of the placable with x and y position on the canvas
     * @param rotation: the clockwise rotation of the placable
     * @param scaleX: the size of the placeble in x-direction
     * @param scaleY: the size of the placable in y-direction
     */
    constructor(position: [number, number], rotation: number, scaleX: number, scaleY: number) {
        this.position = position;
        this.rotation = rotation;
        this.scaleX = scaleX;
        this.scaleY = scaleY;
    }

    rotate(angle: number) {
    }

    place(position: [number, number]) {
        //test if object can be placed at position
        //TODO:

        //place object
        this.position[0] = position[0];
        this.position[1] = position[1];
    }

    scale(scaleX: number, scaleY: number) {
        //test if scaled object can be placed
        //TODO:

        //scale the object
        //TODO:

        this.scaleX = scaleX;
        this.scaleY = scaleY;
        throw new Error("Method not implemented.");


    }
}
