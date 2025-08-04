import { convertDateObjToDateTime } from "./dateConverter.js"

async function fetchRevenueByDateRange(startDateStr, endDateStr) {
    try {
        const response = await fetch(`/api/admin/home/revenue?startDateStr=${startDateStr}&endDateStr=${endDateStr}`)
        const result = await response.json()

        return result.revenues
    } catch (error) {
        console.log(error)
        return []
    }
}

const now = new Date()
const todayDateStr = convertDateObjToDateTime(now, "start")
const tomorrowDateStr = convertDateObjToDateTime(now, "end")
const revenueData = await fetchRevenueByDateRange(todayDateStr, tomorrowDateStr)

const chartEl = document.querySelector(".revenue-chart")
const dateInput = document.querySelector(".date-picker")
const chartError = document.querySelector(".chart-error")

if (chartEl && dateInput && chartError) {
    if (revenueData.length != 0) {
        const ctx = chartEl.getContext("2d");
        const revenueChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: revenueData.map(data => data.date),
                datasets: [{
                    label: "Revenue",
                    data: revenueData.map(data => data.revenue),
                    backgroundColor: ["#ffcc00"],
                    borderColor: ["#ffcc00"],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        
        const flatPickrObj = flatpickr(dateInput, {
            mode: "range",
            dateFormat: "M d, Y",
            maxDate: "today"
        })
        dateInput.onchange = async () => {
            if (flatPickrObj.selectedDates.length == 2) {
                const newStartDateObj = flatPickrObj.selectedDates[0]
                const newEndDateObj = flatPickrObj.selectedDates.at(-1)

                const newStartDateStr = convertDateObjToDateTime(newStartDateObj, "start")
                const newEndDateStr = convertDateObjToDateTime(newEndDateObj, "end")
                const newRevenues = await fetchRevenueByDateRange(newStartDateStr, newEndDateStr)

                revenueChart.data.labels = newRevenues.map(data => data.date)
                revenueChart.data.datasets[0].data = newRevenues.map(data => data.revenue);
                revenueChart.update();
            }
        }
    } else {
        chartError.classList.add("show")
        chartError.textContent = "Error showing the chart. Please check back later."
    }
}


