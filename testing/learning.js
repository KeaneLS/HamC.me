/* interacting with elements:

    Create new element:
        const newElement = document.createElement('div'); <-- div is the container for the new element (divider)
        newElement.textContent = 'Hello, World!';
        document.body.appendChild(newElement);

    Assigning an element to a variable:
        From CSS name:
        const mainHeader = document.querySelector('main h1');
                                                 This is the same name as in css

        Can even select multiple elements:
        const allListItems = document.querySelectorAll('p'); <-- selects all paragraphs in the document
        
        From ID:
        const mainHeader = document.getElementById('main-header');
    
    Modifying an element:
        Once you set the element to a variable, you can modify it:
        mainHeader.textContent = 'New Header Text';
        mainHeader.style.color = 'blue';

    Removing an element (after assigning to a variable):
        mainHeader.remove();
    
Functions:

Functions are legit just like normal but the syntax is different

What I'm used to: functions defined seperately

ex: a known thing you want to change

const mainHeader = document.querySelector('main h1');
(ALWAYS first must assign an element to a variable to edit it)

function changeColor(){
    mainHeader.style.color = 'blue';
}

ex: some arbitrary thing you want to change

function changeColor(){
    this.style.color = 'blue';
} The THIS keyword is a placeholder for the element that triggers an EVENT with this function in it

Functions are all about being used in event listeners, however, standard practice
is to define the function WITHIN the event listener

Event listeners:
Event listeners are functions that are triggered when an event occurs.

syntax:
note: element is the element you want to listen to that was assigned to a variable

element.addEventListener('eventtype', function(){ <-- think of function as a keyword, it just lets javascript know that this is a new function
    //function code
});

ex:
lets say I want to change the color of the main header when I click on it 

const mainHeader = document.querySelector('main h1');
mainHeader.addEventListener('click', function(){
    this.style.color = 'blue';
});

All in all, javascript is about assigning elements to variables and being able to MODIFY them
*/