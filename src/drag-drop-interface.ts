// Lets talk about what is a namespace.
// namespace is a pure typescript feature. There is not equivalent to interface in javascript.
// consider namespace as a seperate world, where we can store interfaces, classes, const and every other type in and expose
// them to outside world using export keyword.

// We can define names/contents/definitions in namespace in different files, but the name of the namespace should be same.

// we are renaming DDInterface to App because the name of the namespace should be same for all namespace's
namespace App{

    export interface Draggable{

        dragStartHandler(event: DragEvent): void;
        dragEndHandler(event: DragEvent): void;
    }
      
    export interface DragTarget{

    // dragEnterHandler(event: DragEvent): void;
        dragOverHandler(event: DragEvent): void;
        dragLeaveHandler(event: DragEvent): void;
        dropHandler(event: DragEvent): void;
    }
}