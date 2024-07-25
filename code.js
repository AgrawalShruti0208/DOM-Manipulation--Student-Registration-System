// Accessing form input fields using DOM (.value not working together)
let form = document.querySelector("form");
let ID = document.getElementById("studentID");
let sname = document.getElementById("studentName");
let mail = document.getElementById("studentEmail");
let contact = document.getElementById("studentContact");

//Accessing span elements for displaying error messages
let idError = document.getElementById("idError");
let nameError = document.getElementById("nameError");
let contactError = document.getElementById("contactError");
let mailError = document.getElementById("mailError");

//MAIN DIV TO DISPLAY LIST OF STUDENTS
const studentDiv = document.getElementById("DisplayList");

//scrollDiv DOM Element
let scrollDiv = document.getElementById("studentDiv");

//Declaring an empty array
let Students;

//calling getData() func to get array from localStorage
getData();

//forEach Method used on Students array to get inside createStudent function for every object and display it by creating divs
Students.forEach(createStudent);


// After setting array of objects inside localStorage, now everytime page reloads we have to retrieve array from localStorage to display List
    // Array can also be empty for new users 
    // We have to pass both the conditions to declare array : an empty array OR localStorage array using getItem(key) function
        // getItem() function will return a string of objects as everything is string inside localStorage using the same key used while setting item
        // To convert STRING OF OBJECTS into ARRAY OF OBJECTS we have to use JSON.parse()function

function getData(){
    let Data = localStorage.getItem("Students");
    if(Data){
        Students = JSON.parse(Data);
    }else{
        Students = [];
        setData();
    }
}



//Inserting this array of objects inside LOCAL STORAGE, so that array does not get lost on page reload
            // =>In localStorage values are stored as (key:value) pair and all values are string
            // =>setting array of objects inside localStorage using setItem 
            // =>setItem() method will convert array of objects into string but to avoid complications, 
                // we will convert array explicitly using JSON.stringify()
            // we need to mention (key,value) as pair inside setItem() func
function setData(){
    localStorage.setItem("Students",JSON.stringify(Students));
    
    // Displaying vertical scroll when List has more than 4 items
    // scrollDiv.style.overflowY = Students.length <3 ? "hidden" : "scroll";
   
}

// findObj func() to return index of the object matching with the Key passed
function findObj(Students,ID){
    for(var i = 0; i < Students.length; ++i) {
        var obj = Students[i];
        if(obj.ID == ID) {
            return i;
        }
    }
    return -1;
}

// DELETE FUNCTIONALITY: 
function deleteBtn(ID){
    // reseting input fields and displaying submit button and hiding update button
    resetData();
    submitBtn.style.display = "block";
    update.style.display = "none";

    //confirming from user before deleting record
    if(confirm("Do you want to delete this record?")){
       
        var i = findObj(Students,ID);
        
        console.log("____________________________");
        console.log("DELETE STATUS:");
        console.log("Record:",Students[i]," deleted successfully!");
        // splicing or removing object from array of objects using (index,count)
        Students.splice(i,1);

        // clearing all the records from the div
        studentDiv.innerHTML = "";

        // Calling setData() here to store edited array of objects inside localStorage
        setData();

        // calling forEach on Students array using createStudent func() reference [displaying the newEditedList]
        Students.forEach(createStudent);
    }
    

}

// SUBMIT and UPDATE BUTTONS DOM Element
let submitBtn = document.getElementById("submitBtn");
let update = document.getElementById("updateBtn");

//selectedIndex variable to store index of obj matching ID for updation before user updates it
let selectedIndex;

//UPDATE FUNCTIONALITY
//update func() called from display list btn
function updateBtn(id){

    //found index of obj matching with id
    var i = findObj(Students,id);

    // Displaying selected record items in input fields
    ID.value = Students[i].ID;
    sname.value = Students[i].sname;
    mail.value = Students[i].mail;
    contact.value = Students[i].contact;

    // REGISTER button=> hidden UPDATE button=>visible
    submitBtn.style.display = "none";
    update.style.display = "block";

    //storing the index 
    selectedIndex = i;
    
}
// formUpdate func() called from UPDATE button and validate func after validateData(caller) function executes
function formUpdate(){
    
    console.log("____________________________");
    console.log("UPDATE STATUS:");
    console.log("Before update",Students[selectedIndex]);

    // Assigning all the edited form inputs into Students[obj index]
    Students[selectedIndex].ID = ID.value;
    Students[selectedIndex].sname = sname.value ;
    Students[selectedIndex].mail = mail.value ;
    Students[selectedIndex].contact = contact.value ;

    console.log("After update",Students[selectedIndex]);
    
    // showing message of update
    alert("Updated Records Successfully!");

    // clearing all records 
    studentDiv.innerHTML = "";

    //set newEditedArray to localStorage
    setData();

    //Displaying List
    Students.forEach(createStudent);

    //Reseting Input fields, displaying REGISTER BUTTON again and hiding UPDATE BUTTON
    resetData();
    submitBtn.style.display = "block";
    update.style.display = "none";
}


//VALIDATION OF ALL 4 INPUT FIELDS
// validateData func() to validate all the inputs with a caller variable
function validateData(caller){

    //If any input field is empty,evoking window.alert
    if(ID.value == ""||sname.value == ""||mail.value == ""||contact.value == ""){
        alert("All Input Fields are Mandatory!");
        return false; //to stop further execution
    }
    else{
        //If all the input fields are filled, validating them:

            console.log("____________________________");
            console.log("VALIDATION STATUS:");

            //Checking for ID...
                isIDValid = validateID();
                console.log("ID:",ID.value,"|status:",isIDValid);
                
            //Checking for Name...   
                isNameValid = validateName();
                console.log("Name:",sname.value,"|status:",isNameValid);
               
            //Checking for Email...
                isMailValid = validateEmail();
                console.log("Email:",mail.value,"|status:",isMailValid);
                
            //Checking for Contact...   
                isContactValid = validateContact();
                console.log("Contact:",contact.value,"|status:",isContactValid);
            
               
            if(isIDValid==false || isNameValid==false || isMailValid==false || isContactValid==false){
                return false; //returning isValid, if false,then execution will wait.
            }else{
                // if true, then

                    //if validateData is called from submit button call formSave()
                        if (caller=='submit'){
                            // triggered from submit button
                            console.log("Validation Completed. Record Added Successfully!");
                            formSave();
                        }
                    
                    //if validateData is called from update button call formUpdate()
                else if(caller=='update'){
                    // triggered from function
                    console.log("Validation Completed. Updating Records...");
                    formUpdate();
                }
            }
            
            

            
   }   


   function formSave(){
                
        // passing all the input values to the function and func() returns the object containing all the values
        const student = addCustomer(ID.value,sname.value,mail.value,contact.value);
        
        alert("Data submitted");

        //Adding student to the List
        createStudent(student);

        //reseting input fields after adding student to the List
        resetData();
        

    }
       
}


function validateID(){
    // //Checking for ID....
    if(isNaN(ID.value)){ //isNaN(var) returns true if var is not a numerical

        //If ID is not a number, showing error and setting isValid to False
        idError.textContent = "*Only numericals allowed";
        return false;
    }else{
        idError.textContent = "";
        return true;
    }
}

function validateEmail(){
    //Checking for Email....
    var pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/; //regex pattern for email syntax

    if((!mail.value.match(pattern))){ //if email does not matches the pattern
        mailError.textContent = "*Enter Valid email format";//displaying error msg
        return false;//returning false
    }else{
        //if email matches the pattern remove error message and return true;
        mailError.textContent = "";
        return true;
    }

}

function validateName(){
    // //Checking for Name....
                //Using regular expression to check name contains only alphabets, it returns false if not
                let regex = /^[a-zA-Z]+$/;

                if(!sname.value.match(regex)){
                    //If Name string.matches(regex) == false, showing error and setting isValid to False
                    nameError.textContent = "*Only alphabets allowed";
                    return false;
                }else{
                    nameError.textContent = "";
                    return true;
                }
}

function validateContact(){
    //Checking for Contact....
    if(contact.value.length<10||contact.value.length>10||isNaN(contact.value)){
        //If Contact length is less or more than 10 or It is not a number,
        // showing error and setting isValid to False
        contactError.textContent = "*Enter a valid Contact no.";
        return false;
    }else{
        contactError.textContent = "";
        return true;
    }
    
}


        
        

//addCustomer(...) function to create object with all the valid inputs and pushing this object in Students array 
    function addCustomer(ID,sname,mail,contact){

        //pushing object in array
            Students.push({ID,sname,mail,contact});

            //setData() to store array in localStorage
            setData();

        //returning object;
            return {ID,sname,mail,contact};
      
    }


 

function createStudent({ID,sname,mail,contact}){ //deconstructing the object
    
    //creating grid-container and 5 inner items:id,name,mail,contact,div for update & delete buttons
        const stContainer = document.createElement("div");
        const stID = document.createElement("div");
        const stName = document.createElement("div");
        const stMail = document.createElement("div");
        const stContact =document.createElement("div");
        const stButtons = document.createElement("div");
    
    //filling container divs with our created object fields
        stID.textContent = ID;
        stName.textContent = sname;
        stMail.textContent = mail;
        stContact.textContent = contact;
        //creating both buttons inside stButton div using innerHTML
            stButtons.innerHTML = `<input type="button" id="update2Btn" class="btn" value="UPDATE" onclick="updateBtn(${ID})">
                                    <input type="button" id="deleteBtn" class="btn" value="DELETE" onclick="deleteBtn(${ID})">`

    
    //Adding required classes to the newly created divs for styling purposes
    stContainer.classList.add("sgrid");
    stID.classList.add("item","s");
    stName.classList.add("item","s");
    stMail.classList.add("item","s","email");
    stContact.classList.add("item","s");
    stButtons.classList.add("item");
    

    //appending all the child elements inside their parent element
    stContainer.append(stID,stName,stMail,stContact,stButtons);
    studentDiv.appendChild(stContainer);

    
    
    
}



//function to reset all the input fields
function resetData(){
    ID.value = "";
    sname.value = "";
    mail.value = "";
    contact.value = "";
    
}
  




    
