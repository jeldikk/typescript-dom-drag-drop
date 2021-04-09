console.log("This is something big bro");

// Here we are using html5 templates to render form using javascript
// If you observe when no ProjectInputForm instance is create we see nothing on the webpage
// after creating an instance of ProjectInputForm
// working with templates using dom is a good practice to work with
// templates doesn't show any visual appearance on webpage instead they act of small piece of stubs that can be rendered using javascript

//What is OOP Rendering ??
// OOP Rendering is method of code architecture, where creation of an instance of class will result in a dom creation on webpage
// calling a method on these objects, will make changes in data or callbacks.

// How create a global state to store the data of the application.
// to do this, we use a singleton pattern to create a single instance of our global state( ProjectState class)

// In order to implement drag and drop
// We have many ways to do this, one is to assign drag and drop event to html tags and define those events
// In order to do this in typescript way, we start defining a interface for different role of elements ( draggable, dragTarget etc.,)


// DragEvent type is provided by typescript after enabling libraries in tsconfig.json
interface Draggable{
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

interface DragTarget{
  // dragEnterHandler(event: DragEvent): void;
  dragOverHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
}


// enum for specifying the project status, active or finished
enum ProjectStatus{
  Active,
  Finished
}

interface ProjectDetail{
  id: string;
  title: string;
  description: string;
  peopleCount: number;
  status?: ProjectStatus;
}

type Listener = (items: ProjectDetail[]) => void;


class ProjectState{

  private projects: ProjectDetail[]= [];
  private listeners: Listener[] = [];
  private static instance: ProjectState;

  private constructor(){

  }


  static getInstance(): ProjectState{
    if(this.instance){
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(project:ProjectDetail){
    this.projects.push({
      ...project,
      status: ProjectStatus.Active
    });

    this.updateListeners();
    //this code is moved to private method updateListeners
    // for(const listener of this.listeners){
    //   listener([...this.projects]);
    // }
  }

  moveProject(projectId: string, newStatus: ProjectStatus){
    const project = this.projects.find((p) => p.id === projectId);
    if(project){
      project.status = newStatus;
    }

    //update all listeners
    // for(const listener of this.listeners){
    //   listener([...this.projects])
    // }
    this.updateListeners();
  }

  private updateListeners(){
    console.log("update listeners called");
    for(const listener of this.listeners){
      listener([...this.projects])
    }
  }

  displayData(){
    console.log(`There are ${this.projects.length} Projects and ${this.listeners.length} registered listeners`)
  }

  addListener(listenerFn: Listener){
    this.listeners.push(listenerFn);
  }
}

// ProjectState.createInstance();
const projectState = ProjectState.getInstance();

//Validation model
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

//autobinder decorator we have learnt in decorators section
function autobinder(_0: any, _1: string, descriptor: PropertyDescriptor): PropertyDescriptor{
    const originalMethod = descriptor.value;

    return {
        enumerable: false,
        configurable: false,
        get(){
            return originalMethod.bind(this)
        }
    }
}


function validate(validateState: Validatable): boolean{
  // console.log(arguments)
  const {value, required, minLength, maxLength, min, max} = validateState;

  let isValid = true;

  if(required){
    // if(typeof value === 'string'){
    //   isValid = isValid && value.toString().length !== 0
    // }

    isValid = isValid && value.toString().length !== 0;
  }

  if(typeof value === 'string'){

    if(minLength){
      isValid = isValid && value.length >= minLength;
    }

    if(maxLength){
      isValid = isValid && value.length <= maxLength;
    }
  }

  if(typeof value === 'number'){
    if(min){
      isValid = isValid && value >= min;
    }

    if(max){
      isValid = isValid && value <= max;
    }
  }

  return isValid;
}



//Lets create some generic abstract class to make things more complex and scalable
abstract class Component<T extends HTMLElement, U extends HTMLElement>{
  templateElement: HTMLTemplateElement;
  hostingElement: T;
  element: U;

  constructor(templateName: string, hostingName: string, elementName?: string){
    this.templateElement = document.getElementById(templateName) as HTMLTemplateElement;
    this.hostingElement = document.getElementById(hostingName) as T;

    const importedName = document.importNode(this.templateElement.content, true);

    this.element = importedName.firstElementChild as U;
  }

  protected attach(insertType: 'beforeend' | 'afterbegin'){
    this.hostingElement.insertAdjacentElement(insertType, this.element)
  }

  // a class is made abstract, whenever it is not allowed to make an instance from the class.
  // but the extended concrete class is allowed to make objects

  // configure method is used to add event listeners to dom elements and stuff
  abstract configure(): void;

  abstract renderContent(): void;
  //defining methods as abstract in a abstract class means, the concrete class which is going to inherit from this abstract class
  // must have the two methods configure() and renderContent();

}



// Project List Class
class ProjectList extends Component<HTMLTemplateElement, HTMLElement> implements DragTarget{

  // templateElement: HTMLTemplateElement;
  // hostElement: HTMLDivElement;
  // element: HTMLElement;
  assignedProjects: ProjectDetail[]= [];

  private type: 'active' | 'finished'; // Here we did not use ProjectStatus enum because here it is only used for just displaying color ribbons.
  
  
  constructor(t: 'active' | 'finished'){
    super('project-list', 'app',)
    // this.templateElement = document.getElementById("project-list")! as HTMLTemplateElement;
    // console.log(this.templateElement.content);
    // console.log(this.templateElement)
    this.type = t;
    // this.hostElement = document.getElementById("app") as HTMLDivElement;

    // const importedNode = document.importNode(this.templateElement.content, true); // to create a deep copy of template content to be inserted to app
    
    // this.element = importedNode.firstElementChild as HTMLElement;
    this.element.id = `${t}-projects`

    this.configure();
    this.attach('beforeend');
    this.renderContent();
  }

  // private attach(){
  //   this.hostingElement.insertAdjacentElement("beforeend", this.element)
  // }
  @autobinder
  dropHandler(event: DragEvent){
    // console.log(event.dataTransfer?.getData('text/plain'));
    const pid = event.dataTransfer?.getData('text/plain');
    const newStatus = this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished;
    if(pid){
      projectState.moveProject(pid, newStatus);
      const listEl = this.element.querySelector('ul')!;
      listEl.classList.remove("droppable");
    }
    

  }

  // We should use, dragOverHandler and dragLeaveHandler to visualise the dragging feature.

  @autobinder
  dragOverHandler(event: DragEvent){
    // console.log(event);
    // Some times in real life scenarios, we have different draggable objects and to be dropped somewhere.
    // If to allow only particular types of objects to be dropped into target, we use this conditional execution.
    if(event.dataTransfer && event.dataTransfer.types[0] === 'text/plain'){

      // by default in javascript, dropHandler is called only when we call preventDefault on DragEvent object in dragOverHandler.
      // by default, no elements is allowed to be as a target for dropping.
      event.preventDefault(); 

      // console.log(event.dataTransfer?.types[0]); // the oprtional chaining here means, DragEvent is not same for all cases. It differs depending upon the scenario.
      const listEl = this.element.querySelector('ul')!;
      listEl.classList.add('droppable'); // this adds some dim background to project list container 
    }
    
  }

  @autobinder
  dragLeaveHandler(event: DragEvent){
    // console.log(event);
    const listEl = this.element.querySelector('ul')!;
    listEl.classList.remove('droppable'); // this removes the dim background to project list container.


  }

  configure(){
    // console.log(this.hostingElement);
    // console.log(this.element);
    projectState.addListener((projects: ProjectDetail[])=>{
      if(this.type === 'active'){
        this.assignedProjects = projects.filter(item => item.status === ProjectStatus.Active) 
      }
      else if(this.type === 'finished'){
        this.assignedProjects = projects.filter(item => item.status === ProjectStatus.Finished)
      }
      // this.assignedProjects = projects;
      this.renderProjects();
    })

    this.element.addEventListener("drop", this.dropHandler);
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);
  }

  renderContent(): void{
    let ulId = `${this.type}-project-list`
    this.element.querySelector('ul')!.id = ulId;
    this.element.querySelector("h2")!.textContent = `${this.type.toUpperCase()} - PROJECTS`
  }

  private renderProjects(){

    let ulid = `${this.type}-project-list`;
    const ullist = this.element.querySelector(`#${ulid}`)!;
    // console.log({ullist})
    ullist.innerHTML = ''
    console.log("I am here in renderProjects private method")
    for(const proj of this.assignedProjects){
      // if(proj.status === ProjectStatus.Finished){
      //   continue
      // }
      // const listItem = document.createElement('li');
      // listItem.textContent = proj.title;
      // ullist.appendChild(listItem)
      new ProjectItem(`${this.type}-project-list`, proj)
    }
  }
}

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable{

  private project: ProjectDetail;
  constructor(hostId: string, project: ProjectDetail){
    super('single-project',hostId, project.id);
    
    this.project = project;
    this.attach('beforeend');
    this.configure();
    this.renderContent();
  }

  @autobinder
  dragStartHandler(event: DragEvent){
    
    // console.log("Drag Start Handler is called")
    event.dataTransfer!.setData('text/plain', this.project.id); // first argument is similar to channel or key
    event.dataTransfer!.effectAllowed = 'move';
    // event.dataTransfer!.dropEffect = 'move'
    console.log(event);
  }

  @autobinder
  dragEndHandler(event: DragEvent){
    console.log("dragEnd Handler is called")
  }

  configure(){
    this.element.draggable = true;

    this.element.addEventListener('dragstart', this.dragStartHandler);
    this.element.addEventListener('dragend', this.dragEndHandler);
  }

  renderContent(){
    console.log(this.element, this.hostingElement, this.templateElement)
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.project.description;
    this.element.querySelector("p")!.textContent = `${this.project.peopleCount} people are assigned`;
  }
}
class ProjectInputForm extends Component<HTMLTemplateElement, HTMLElement> {
  // templateElement: HTMLTemplateElement;
  // hostElement: HTMLDivElement;
  // element: HTMLFormElement;

  titleElement: HTMLInputElement;
  descriptionElement: HTMLInputElement;
  peopleElement: HTMLInputElement;

  projectId: number;

  constructor(projId: number) {
    super('project-input', "app");
    this.projectId = projId;
    // this.templateElement = document.getElementById("project-input")! as HTMLTemplateElement;
    // this.hostElement = document.getElementById("app") as HTMLDivElement;

    // console.log({ templateElement: this.templateElement });

    // const importedNode = document.importNode(
    //   this.templateElement.content,
    //   true
    // ); //true means deeply copied
    // console.log({ importedNode });

    // this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = "user-input"; // style for this id element is defined in .css file.
    // console.log({ element: this.element });

    this.titleElement = this.element.querySelector(
      "#title"
    )! as HTMLInputElement;
    this.descriptionElement = this.element.querySelector(
      "#description"
    )! as HTMLInputElement;
    this.peopleElement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.configure();
    this.attach('afterbegin');
  }

  //this function is private and returns a tuple of values
  private getUserInputValues(): [string, string, number] | void {
    const titleValue = this.titleElement.value;
    const descriptionValue = this.descriptionElement.value;
    const peopleValue = this.peopleElement.value
    // this is a very trivial approach in validating the input values
    if(titleValue.trim().length === 0 || descriptionValue.trim().length === 0 || peopleValue.trim().length === 0){
        alert(`Invalid value entered in one of the field from project form ${this.projectId}`);
        return;
    }
    else{
        return [titleValue, descriptionValue, +peopleValue]
    }
  }

  //this function is more scalable way of validating the user input
  //the basic idea is to create a function which will take an object with value and conditions to be satisfied for sanity checks.
  private getValidatedUserInputValues(): [string, string, number] | void{
    let textValue = this.titleElement.value.trim();
    let descValue = this.descriptionElement.value.trim();
    let peopleValue = +this.peopleElement.value.trim();

    // Our main idea in scalability means, 
    if(validate({value: textValue, required: true, maxLength: 50}) && validate({value: descValue, required: true, maxLength: 1000}) && validate({value: peopleValue, required: true, maxLength: 10})){
      return [textValue, descValue, peopleValue]
    }
    else{
      alert("Improper values are provided in input elements: getValidatedUserInputValues");
      return;
    }
  }
  
  private clearForm(): void{
    console.log('clearForm is called')
    this.titleElement.value = '';
    this.descriptionElement.value = '';
    this.peopleElement.value = ''
  }

  @autobinder
  submitHandler(event: Event) {
    event.preventDefault();
    
    // console.log({
    //   title: this.titleElement.value,
    //   description: this.descriptionElement.value,
    //   people: this.peopleElement.value,
    // });
    // console.log(this.titleElement.value)
    // const userInput = this.getUserInputValues();
    const userInput = this.getValidatedUserInputValues();

    // since userInput will be an array, because there is no such kind as tuple during runtime.
    if(Array.isArray(userInput)){
        const [title, desc, people] = userInput;
        // console.log({title, desc, people})
        projectState.addProject({
          id: Math.random().toString(),
          title: title,
          description: desc,
          peopleCount: people,
        })

        this.clearForm();
    }


  }

  renderContent(){}

  configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  // private attach() {
  //   this.hostElement.insertAdjacentElement("afterbegin", this.element);
  // }
}

let prjInput = new ProjectInputForm(23);
let activeProjectList = new ProjectList('active');
let finishedProjectList = new ProjectList('finished')
// prjInput = new ProjectInputForm(24);
// prjInput = new ProjectInputForm(25)
// let prjList = new ProjectList();
