## Typescript tutorial TODO project from scratch.

A simple todo webapp with drag and drop functionality. the DOM is implemented using OOP rendering

OOP rendering is a way of rendering DOM nodes on creation of an object of particular type.
A separate generic abstract class is implemented which handles all the DOM rendering part. All the classes will extend this abstract class and implement class specific features in its own concrete class.

A seperate interfaces are declared which the draggable(source) and droppable(target) nodes will implement for drag and drop functionality

**What typescript features are used :**
1. Using interfaces to specify methods for drag and drop funtionality. later on the classes will implemen these interfaces.
2. Using enum's to categorise the todo items.
3. seperate classes for active and finished todo items
4. How to use HTML5 templates as initial starting point to render.
5. Using singleton design pattern to store state of the project. we can access this state from different places of code. any manipulation done from any part of code will affect on this singleton pattern.


and pretty many more things for future projects.

