const { Hook } = require("mocha");

// Your code here
// Utility function to parse a date stamp
function parseDateStamp(dateStamp) {
    let [date, time] = dateStamp.split(' ');
    let [year, month, day] = date.split('-');
    let [hour, minute] = time.split('');
    return new Date(year, month - 1, day, hour, minute);
}

// Utility function to format a date object
function formatDate(date) {
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Utility function to calculate hours elapsed between two dates
function calculateHoursElapsed(date1, date2) {
    let hoursElapsed = (date2 - date1) / (60 * 60 * 1000);
    return Math.floor(hoursElapsed);
}

function createEmployeeRecord(recordData) {
    let [firstName, familyName, title, payPerHour] = recordData;
    return {
        firstName,
        familyName,
        title,
        payPerHour,
        timeInEvents: [],
        timeOutEvents: []
    };
}

function createEmployeeRecords(recordsData) {
    return recordsData.map(createEmployeeRecord);
}

function createTimeInEvent(employeeRecord, dateStamp) {
    let date = parseDateStamp(dateStamp);
    employeeRecord.timeInEvents.push({ type: 'TimeIn', hour: date.getHours(), date: formatDate(date) });
    return employeeRecord;
}

function createTimeOutEvent(employeeRecord, dateStamp) {
    let date = parseDateStamp(dateStamp);
    employeeRecord.timeOutEvents.push({ type: 'TimeOut', hour: date.getHours(), date: formatDate(date) });
    return employeeRecord;
}

function hoursWorkedOnDate(employeeRecord, date) {
    let timeInEvents = employeeRecord.timeInEvents.filter(event => event.date === date);
    let timeOutEvents = employeeRecord.timeOutEvents.filter(event => event.date === date);
    if (timeInEvents.length === 0 || timeOutEvents.length === 0) {
        return 0;
    }
    let timeIn = parseDateStamp(`${date} ${timeInEvents[0].hour.toString().padStart(2, '0')}:00`);
    let timeOut = parseDateStamp(`${date} ${timeOutEvents[0].hour.toString().padStart(2, '0')}:00`);
    return calculateHoursElapsed(timeIn, timeOut);
}

function wagesEarnedOnDate(employeeRecord, date) {
    let hoursWorked = hoursWorkedOnDate(employeeRecord, date);
    return hoursWorked * employeeRecord.payPerHour;
}

function allWagesFor(employeeRecord) {
    let wages = [];
    for (let timeInEvent of employeeRecord.timeInEvents) {
        let date = timeInEvent.date;
        let wage = wagesEarnedOnDate(employeeRecord, date);
        wages.push(wage);
    }
    return wages.reduce((a, b) => a + b, 0);
}

function calculatePayroll(employeeRecords) {
    let totalWages = 0;
    for (let employeeRecord of employeeRecords) {
        let wages = allWagesFor(employeeRecord);
        totalWages += wages;
    }
    return totalWages;
}
