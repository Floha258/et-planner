/***
This interface describes all objects that can be placed on a canvas
*/
export interface IPlacable {
    position: [number, number];
    rotation: number;
    scaleX: number;
    scaleY: number;
}
