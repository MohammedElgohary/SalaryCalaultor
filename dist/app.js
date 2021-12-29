let dateFrom = document.querySelector("#startDate"),
  dateTo = document.querySelector("#endDate"),
  Name = document.querySelector("#name"),
  NumberOfWorkHours = document.querySelector("#NumberOfWorkHours"),
  Salary = document.querySelector("#Salary"),
  WorkedHours = document.querySelector("#WorkedHours"),
  SpendTime = document.querySelector("#SpendTime"),
  btnCopy = document.querySelector("#btnCopy"),
  resultDiv = document.querySelector("#result"),
  holidays = document.querySelectorAll(".holiday");

let days = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

let holidaysObject = {
  0: false,
  1: false,
  2: false,
  3: false,
  4: false,
  5: true,
  6: true,
};

const calculateDayNumber = (startDate, endDate, givenDay) => {
  startDate = new Date(startDate);
  endDate = new Date(endDate);
  let numberOfDates = 0;

  while (startDate < endDate) {
    if (startDate.getDay() === givenDay) {
      numberOfDates++;
    }
    startDate.setDate(startDate.getDate() + 1);
  }

  return numberOfDates;
};

let Report;

const getDaysDetils = ({
  workHours,
  holiDays,
  Salary,
  workedHours,
  spendTime,
  name,
}) => {
  let result = {};

  for (let key in days) {
    result[key] = {};

    result[key].daysNumber = calculateDayNumber(
      dateFrom.value,
      dateTo.value,
      days[key]
    );
    result[key].value = days[key];
  }

  let restDays = 0;
  let workDays = 0;
  let allDays = 0;

  for (let key in result) {
    if (~holiDays.indexOf(result[key].value)) {
      restDays += result[key].daysNumber;
    } else {
      workDays += result[key].daysNumber;
    }
    allDays += result[key].daysNumber;
    result[key] = result[key].daysNumber;
  }

  let sholdWork = workHours * workDays;

  let HourSalary = +Salary / +sholdWork;

  let YourSalary = (+workedHours - +spendTime) * +HourSalary;

  let OverTime = +workedHours - +spendTime - +sholdWork;

  let OverTimeSalary = +OverTime * +HourSalary;

  let theReturned = {
    name: name,
    duration: {
      from: dateFrom.value,
      to: dateTo.value,
    },
    daysDetails: { ...result },
    daysCount: `${allDays} day`,
    holiDays: `${restDays} day`,
    workDays: `${workDays} day`,
    hoursShouldWork: `${sholdWork} Hours`,
    workedHours: `${workedHours} Hours`,
    spentTime: `${spendTime} Hours`,
    overTime: `${OverTime} Hours`,
    overTimeSalary: `${OverTimeSalary} L.E`,
    hourSalary: `${HourSalary} L.E`,
    shouldSalary: `${Salary} L.E`,
    yourSalary: `${YourSalary} L.E`,
  };

  Report = theReturned;
  return theReturned;
};

const trigerdFunction = () => {
  let holis = [];
  
  for (const key in holidaysObject) {
    if (holidaysObject[key]) {
      holis.push(+key);
    }
  };

  console.log(holis);

  if (
    NumberOfWorkHours.value &&
    Salary.value &&
    WorkedHours.value &&
    SpendTime.value &&
    Name.value
  ) {
    resultDiv.innerHTML = JSON.stringify(
      getDaysDetils({
        workHours: NumberOfWorkHours.value,
        holiDays: holis,
        Salary: Salary.value,
        workedHours: WorkedHours.value,
        spendTime: SpendTime.value,
        name: Name.value,
      }),
      null,
      "\t"
    );
  }
};

dateFrom.addEventListener("change", (e) => {
  trigerdFunction();
});

dateTo.addEventListener("change", (e) => {
  trigerdFunction();
});

NumberOfWorkHours.addEventListener("keyup", (e) => {
  trigerdFunction();
});

Salary.addEventListener("keyup", (e) => {
  trigerdFunction();
});

WorkedHours.addEventListener("keyup", (e) => {
  trigerdFunction();
});

SpendTime.addEventListener("keyup", (e) => {
  trigerdFunction();
});

Name.addEventListener("keyup", (e) => {
  trigerdFunction();
});

const copy = (str) => {
  const el = document.createElement("textarea");
  el.value = str;
  el.setAttribute("readonly", "");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  const selected =
    document.getSelection().rangeCount > 0
      ? document.getSelection().getRangeAt(0)
      : false;
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  if (selected) {
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(selected);
  }
};

btnCopy.addEventListener("click", (e) => {
  if (Report) {
    copy((resultDiv.innerHTML = JSON.stringify(Report, null, "\t")));

    btnCopy.classList.add("success");
    setTimeout(() => {
      btnCopy.classList.remove("success");
    }, 1000);
  } else {
    btnCopy.classList.add("error");
    setTimeout(() => {
      btnCopy.classList.remove("error");
    }, 1000);
  }
});

holidays.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("active");
    holidaysObject[index] = !holidaysObject[index];
    trigerdFunction();
  });
});
