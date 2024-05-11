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

// Function to handle click event on calendar dates
/*const handleDateClick = (e) => {
    // Get the clicked date text
    const clickedDate = e.target.innerText;

    // Display the modal
    modal.style.display = "block";

    // Update modal content with the clicked date
    document.querySelector(".task-content ul").innerHTML = `<li>You clicked on ${clickedDate}</li>`;
}
*/

// Add click event listeners to all calendar dates
const btn = document.querySelector("#add-task");
btn.addEventListener("click", () => {
    console.log("Add Task");
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

const modal2 = document.getElementById("myModal2");
const span2 = document.querySelectorAll(".close")[1];
const dates = document.querySelectorAll(".calendar-dates li");

const addGoal = (e) => {
    const clickedDate = e.target.innerText;
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
    if(clickedDateSet > currentDate)
    {
        modal2.style.display = "block";
    }
    else
    {
        alert(`Click on an upcoming date!`);
    }
}

dates.forEach(aDate => {
    aDate.addEventListener("click", addGoal);
});

span2.onclick = function() {
    modal2.style.display = "none";
  }
  
  // Close the modal when the user clicks outside of it
//   window.onclick = function(event) {
//     if (event.target == modal2) {
//       modal2.style.display = "none";
//     }
//   }

// count checkboxes
// const checkboxes = document.querySelectorAll('input[type="checkbox"]');
function setStatus(taskId){
fetch('/updateStatus', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        taskId: taskId
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

let progress = 0;

const countCheckedBoxes = async() => {
    let checkedCount=0;
    let totalCount = 0;
    let upcomingTaskTitles=[];
    for (let checkbox of checkboxes) {
        if(checkbox.checked) {
            checkedCount++;
            //set the status of the task in backend
            let response = await setStatus(checkbox.id.slice(0, -1));
        }
        else{
            upcomingTaskTitles.push(document.querySelector(`label[for="${checkbox.id}"]`).innerText);
        }
        localStorage.setItem("upcomingTaskTitles", JSON.stringify(upcomingTaskTitles));
        totalCount++;
    }

    progress = (checkedCount*100)/totalCount;
    document.querySelector(".progress-bar").ariaValueNow = progress;
    document.querySelector(".progress-bar").style.width = progress+"%";
    localStorage.setItem("progress", progress);
    // console.log(progress);
}


  const addSubT = document.querySelector(".add-subtask");

  addSubT.addEventListener("click", (e) => {
      e.preventDefault();
      
      document.querySelector(".div-subtask").style.display="block";
  })
  
  const addSubTask = document.getElementById("subtask-submit");
  let subT = "";
  addSubTask.addEventListener("click", (e) => {
      e.preventDefault();
      const subTList = document.querySelector(".subtasks");
      let subTask = document.getElementById("subtask").value;
      subT += `<li>${subTask}</li>`;
      subTList.innerHTML = subT;
      document.querySelector(".div-subtask").style.display="none";
  })