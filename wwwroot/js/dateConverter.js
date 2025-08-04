function convertCurrentDateToDateTime(dateString = "now") {
    let now;

    if (dateString == "now") {
        now = new Date()
        return now.toISOString().slice(0, 19)
    } else {
        now = dateString
    }

    const [datePart, timePart, period] = now.split(/[\s:]+/)
    const [day, month, year] = datePart.split("/").map(Number)
    let hour = Number(timePart)
    const minute = Number(now.split(/[\s:]+/)[2])
    const second = Number(now.split(/[\s:]+/)[3])
    const ampm = now.split(" ")[2];

    if (ampm === "PM" && hour !== 12) hour += 12
    if (ampm === "AM" && hour === 12) hour = 0

    const pad = (n) => n.toString().padStart(2, "0")
    const formatted = `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:${pad(second)}`
    return formatted
}

function convertDateObjToDateTime(dateObj, startOrEndDay) {
    const year = dateObj.getFullYear()
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0")
    const day = dateObj.getDate().toString().padStart(2, "0")

    if (startOrEndDay == "start") {
        return `${year}-${month}-${day}T00:00:00` 
    } else {
        return `${year}-${month}-${day}T23:59:59` 
    }
}

export { convertCurrentDateToDateTime, convertDateObjToDateTime }