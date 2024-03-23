document.addEventListener("DOMContentLoaded", function() {
    fetch("http://127.0.0.1:8100/getEvents")
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            const eventsTable = document.getElementById("eventsTable");
            if (data.length === 0) {
                const noDataMessage = document.createElement("p");
                noDataMessage.textContent = "No events found";
                eventsTable.appendChild(noDataMessage);
            } else {
                data.forEach(eventData => {
                    const newRow = document.createElement("tr");

                    // Create and append cells for each data item
                    eventData.forEach(eventAttribute => {
                        const cell = createCell(eventAttribute, true);
                        newRow.appendChild(cell);
                    });

                    eventsTable.querySelector("tbody").appendChild(newRow);
                });
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });

    function createCell(content, addTextClasses) {
        const cell = document.createElement("td");
        if (addTextClasses) {
            const span = document.createElement("span");
            span.classList.add("text-dark", "fw-bold", "text-hover-primary", "d-block", "mb-1", "fs-6");
            span.textContent = content;
            cell.appendChild(span);
        } else {
            cell.textContent = content;
        }
        return cell;
    }
});