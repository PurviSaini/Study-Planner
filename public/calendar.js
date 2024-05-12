let date = new Date();
let year = date.getFullYear();
let month = date.getMonth();
 
const day = document.querySelector(".calendar-dates");
 
const currmonth = document
    .querySelector(".month");

const curryear = document.querySelector(".year");
 
const prenexIcons = document
    .querySelectorAll(".calendar-navigation span");
 
// Array of month names
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];
 
// Function to generate the calendar
const manipulate = () => {
 
    // Get the first day of the month
    let dayone = new Date(year, month, 1).getDay();
 
    // Get the last date of the month
    let lastdate = new Date(year, month + 1, 0).getDate();
 
    // Get the day of the last date of the month
    let dayend = new Date(year, month, lastdate).getDay();
 
    // Get the last date of the previous month
    let monthlastdate = new Date(year, month, 0).getDate();
 
    // Variable to store the generated calendar HTML
    let lit = "";
 
    // Loop to add the last dates of the previous month
    for (let i = dayone; i > 0; i--) {
        lit +=
            `<li class="inactive">${monthlastdate - i + 1}</li>`;
    }
 
    // Loop to add the dates of the current month
    for (let i = 1; i <= lastdate; i++) {
 
        // Check if the current date is today
        let isToday = i === date.getDate()
            && month === new Date().getMonth()
            && year === new Date().getFullYear()
            ? "active"
            : "";
        lit += `<li class="${isToday}">${i}</li>`;
    }
 
    // Loop to add the first dates of the next month
    for (let i = dayend; i < 6; i++) {
        lit += `<li class="inactive">${i - dayend + 1}</li>`
    }
 
    // Update the text of the current date element 
    // with the formatted current month and year
    currmonth.innerText = `${months[month]}`;
    curryear.innerText = `${year}`;
 
    // update the HTML of the dates element 
    // with the generated calendar
    day.innerHTML = lit;
}
 
manipulate();
 
// Attach a click event listener to each icon
prenexIcons.forEach(icon => {
 
    // When an icon is clicked
    icon.addEventListener("click", () => {
 
        // Check if the icon is "calendar-prev"
        // or "calendar-next"
        month = icon.id === "calendar-prev" ? month - 1 : month + 1;
 
        // Check if the month is out of range
        if (month < 0 || month > 11) {
 
            // Set the date to the first day of the 
            // month with the new year
            date = new Date(year, month, new Date().getDate());
 
            // Set the year to the new year
            year = date.getFullYear();
 
            // Set the month to the new month
            month = date.getMonth();
        }
 
        else {
 
            // Set the date to the current date
            date = new Date();
        }
 
        // Call the manipulate function to 
        // update the calendar display
        manipulate();
    });
});

// Get the modal element
const modal1 = document.getElementById("myModal1");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

// Add click event listeners to the button
const btn = document.querySelector("#add-task");
btn.addEventListener("click", () => {
    modal1.style.display = "block";
});

// Close the modal when the user clicks on the close (x) button
span.onclick = function() {
  modal1.style.display = "none";
}

// Close the modal when the user clicks outside of it
window.onclick = function(event) {
  if (event.target == modal1) {
    modal1.style.display = "none";
  }
}

// Get the modal element
const modal2 = document.getElementById("myModal2");

// Get the <span> element that closes the modal
const span2 = document.querySelectorAll(".close")[1];

day.addEventListener("click", (event) => {
    // Check if the clicked element is a date element (li)
    if (event.target.tagName === "LI") {
        const clickedDateEl = event.target;
      const clickedDate = event.target.innerText;
      // ... (rest of the addGoal function logic)
      const clickedMonth = document.querySelector(".month").innerText;
    let clickedMonthno = 0;
    for(let i=0;i<12;i=i+1)
    {
        if(clickedMonth == months[i])
        {
            clickedMonthno = i;
            break;
        }
    }
    const clickedYear = document.querySelector(".year").innerText;
    const clickedDateSet = new Date(clickedYear, clickedMonthno, clickedDate);
    const currentDate = new Date();
    if(clickedDateSet > currentDate && !clickedDateEl.classList.contains("goal-set"))
    {
        modal2.style.display = "block";
    }
    else if(clickedDateEl.classList.contains("goal-set"))
    {
    }
    else
    {
        alert(`Click on an upcoming date!`);
    }
    }
  });


// Close the modal when the user clicks on the close (x) button
span2.onclick = function() {
    modal2.style.display = "none";
  }

// Close the modal when the user clicks outside of it
window.onclick = function(event) {
    if (event.target == modal2) {
      modal2.style.display = "none";
    }
  }

//update the status of checkboxes in the backend
function setStatus(taskId,status){
fetch('/updateStatus', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        taskId: taskId,
        status:status
    })
})
    .then(response => {
        if (response.ok) {
            console.log('Status updated successfully');
        } else {
            console.log('Failed to update status');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// count checkboxes
let progress = 0;
const countCheckedBoxes = async() => {
    let checkedCount=0;
    let totalCount = 0;
    let upcomingTaskTitles=[];
    for (let checkbox of checkboxes) {
        if(checkbox.checked) {
            checkedCount++;
            //set the status of the task in backend
            let response = await setStatus(checkbox.id.slice(0, -1),"checked");
        }
        else{
            let response = await setStatus(checkbox.id.slice(0, -1),"");
            upcomingTaskTitles.push(document.querySelector(`label[for="${checkbox.id}"]`).innerText);
        }
        totalCount++;
    }
    localStorage.setItem("upcomingTaskTitles", JSON.stringify(upcomingTaskTitles));
    progress = (checkedCount*100)/totalCount;
    if(!progress){
        progress=0;
    }
    document.querySelector(".progress-bar").ariaValueNow = progress;
    document.querySelector(".progress-bar").style.width = progress+"%";
    localStorage.setItem("progress", progress);
}

//Add subtasks for goals
const addSubT = document.querySelector(".add-subtask");
addSubT.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector(".div-subtask").style.display="block";
})

//display subtasks on adding
const addSubTask = document.getElementById("subtask-submit");
let subT = "";
addSubTask.addEventListener("click", (e) => {
    e.preventDefault();
    const subTList = document.querySelector(".subtasks");
    let subTask = document.getElementById("subtask").value;
    subT += `<li class="font2">${subTask}</li>`;
    subTList.innerHTML = subT;
    document.querySelector(".div-subtask").style.display="none";
})

  // Function to display task
  let checkboxes;
  function getTasks(){
    let userEmail=localStorage.getItem("email");
    fetch(`/getTasks?email=${userEmail}`)
    .then(response => response.json())
    .then(data => {
      let tasksList=document.querySelector(".tasks-list");
      data.forEach(task=>{
        tasksList.innerHTML+= `
             <section id=${task._id}>
              <input type="checkbox" id=${task._id+"T"} ${task.status}>
                <label for=${task._id+"T"} class="blue">${task.taskTitle}</label><span class="ms-4" id="delete" onclick="deleteTask('${task._id}')">🚫</span><br>
              <ul>
                <li>${task.taskDesc}</li>
              </ul>
              </section>`        
      })
      checkboxes=document.querySelectorAll('input[type="checkbox"]');
      countCheckedBoxes();
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener("click", countCheckedBoxes);
      });
    })
  }
  getTasks();

  async function postData(url = "", data = {}) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  let userEmail=localStorage.getItem("email");
  document.getElementById("email").innerText=userEmail;
  document.getElementById("logout").addEventListener("click",()=>{
    localStorage.removeItem("email");
    window.location.href="/";  
  })

  // add new task
  let submitTaskBtn=document.getElementById("task-submit");
  submitTaskBtn.addEventListener('click',async (e)=>{
    e.preventDefault();
    let taskHeading=document.getElementById("input-task").value;
    let taskDescription=document.getElementById("text-description").value;
    let startDate = new Date();
    let dueDate = new Date();
    dueDate.setDate(startDate.getDate() + 1);

    let taskObj={
      userEmail:userEmail,
      taskTitle:taskHeading,
      taskDesc:taskDescription,
      startDate:startDate,
      dueDate:dueDate,
    };
    //need to make a post request for adding task
    let response= await postData("/addTask",taskObj);
    if(response.title=="Task added successfully"){
      const taskId=response.taskId;
      document.querySelector(".tasks-list").innerHTML+= `
              <section id=${taskId}>
              <input type="checkbox" id=${taskId+"T"}>
                <label for=${taskId+"T"} class="blue">${taskHeading}</label><span class="ms-4" id="delete" onclick="deleteTask('${taskId}')">🚫</span><br>
              <ul>
                <li>${taskDescription}</li>
              </ul>
              </section>`;
      checkboxes=document.querySelectorAll('input[type="checkbox"]');
      countCheckedBoxes();
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener("click", countCheckedBoxes);
      });
    }
    else{
      alert("Task not added");
    }
  })

  // Delete task
  async function deleteTask(taskId) {
    const response = await fetch(`/deleteTask?taskId=${taskId}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    // Handle the response from the backend
    if (data.title=="Task deleted successfully") {
      document.getElementById(taskId).remove();
      checkboxes=document.querySelectorAll('input[type="checkbox"]');
      countCheckedBoxes();
    } else {
      alert('Failed to delete task');
    }
  }
  let clickDate;
  let clickDateEle;
    // Function to handle click event on calendar dates
    let calendarDates = document.querySelector(".calendar-dates");
    calendarDates.addEventListener("click", async function(event) {
      // Handle the click event here
    clickDateEle=event.target;
    const month = months.indexOf(document.querySelector(".month").innerText); // Example month value
    const year =  parseInt(document.querySelector(".year").innerText); // Example year value
    const day = parseInt(event.target.innerText); // Example day number value
    // Create a new Date object using the given month, year, and day
     clickDate = new Date(year, month, day+1);
    // Use the date object as needed
    if(clickDateEle.classList.contains("goal-set")){
      const userEmail = localStorage.getItem("email");
      await postData("/getGoals", { userEmail, clickDate })
            .then(response => {

              const goals = response;
              const goalsList = document.querySelector(".goals");
              goalsList.innerHTML = "";
                goalsList.innerHTML += `<h5>📍${goals.goalTitle}</h5><span> Due Date: ${goals.dueDate.substring(0, 10)}</span>`;
                goals.subTasks.forEach(subTask => {
                  goalsList.innerHTML += `<li>${subTask}</li>`;
              });
            })
            .catch(error => {
              console.log("Error:", error);
            });

    }
    });
  // submit weekly goals
let goalSubmitBtn=document.querySelector("#goal-submit");
goalSubmitBtn.addEventListener("click", async(e) => {
    e.preventDefault();
    const userEmail = localStorage.getItem("email");
    let goalTitle = document.querySelector("#input-goal").value;
    let goalSubtasks = document.querySelectorAll(".subtasks li");
    let startDate = clickDate;
    let dueDate =new Date();
    dueDate.setDate(startDate.getDate() + 7);

    let subTaskList = [];
    for(let i=0;i<goalSubtasks.length;i++)
    {
        subTaskList.push(goalSubtasks[i].innerText);
    }
    let goalObj={
      userEmail:userEmail,
      goalTitle:goalTitle,
      subTasks:subTaskList,
      startDate:startDate,
      dueDate:dueDate,
    };
    let response = await postData("/addGoal", goalObj);
    if (response.title=="Goal added successfully") {
      alert("Goal added successfully");
      document.querySelector(".goals").innerHTML = `<h5>📍${goalTitle}</h5>`;
      subTaskList.forEach(subTask => {
        document.querySelector(".goals").innerHTML += `<li>${subTask}</li>`;
      });
      clickDateEle.classList.add("goal-set");
    } else {
        console.log('Failed to add goal');
    }
})

// Function to get goal dates and add class goal-set
async function getGoalDates() {
const userEmail = localStorage.getItem("email");
await postData("/getGoalDates", { userEmail })
  .then(response => {
  const goalDates = response;
  const calendarDates = document.querySelector(".calendar-dates");
  const activeLiElements = Array.from(calendarDates.childNodes).filter(node => !node.classList.contains("inactive"));
  goalDates.forEach(date => {
    const day = date.startDate.substring(8, 10);
    const dateElement = activeLiElements.find(element => element.innerText === day);
    dateElement.classList.add("goal-set");
  });
  })
    .catch(error => {
      console.log("Error:", error);
    });
}
getGoalDates();
