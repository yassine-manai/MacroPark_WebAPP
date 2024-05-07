console.log(`IP Address: ${ipAddress}`);
console.log(`Port: ${portep}`);

Swal.fire({
    title: "Fetching History . . . ",
    didOpen: () => {
        Swal.showLoading();
    },
});

fetch(`http://${ipAddress}:${portep}/alluserevents`)
    .then(response => {
        if (!response.ok) {
            Swal.fire({
                text: "Error fetching data",
                icon: "error",
                buttonsStyling: false,
                showConfirmButton: false,
                timer: 2000,
            });
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {
        Swal.close();

        console.log(data);
        renderTable(data.users);
    })
    .catch(error => {
        console.error("Error fetching data:", error);
        Swal.fire({
            text: "Error fetching data",
            icon: "error",
            buttonsStyling: false,
            showConfirmButton: false,
            timer: 2000,
        });
    });

function renderTable(users) {
    const eventsTable = document.getElementById("eventsTable");
    const tableBody = eventsTable.querySelector("tbody");
    tableBody.innerHTML = ""; // Clear existing table rows

    if (!Array.isArray(users) || users.length === 0) {
        const noDataMessageRow = document.createElement("tr");
        const noDataMessageCell = document.createElement("td");
        noDataMessageCell.textContent = "No data found";
        noDataMessageCell.colSpan = 8;
        noDataMessageCell.style.textAlign = "center";
        noDataMessageRow.appendChild(noDataMessageCell);
        tableBody.appendChild(noDataMessageRow);
    } else {
        users.forEach(user => {
            const newRow = document.createElement("tr");
            const userData = [
                user.id_user,
                user.user_name,
                user.license,
                user.minQuality,
                user.deviceId,
                user.date,
                user.time,
                user.Methode,
            ];

            userData.forEach(dataValue => {
                const cell = createCell(dataValue, true);
                newRow.appendChild(cell);
            });
            tableBody.appendChild(newRow);
        });
    }
}

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

async function updateTableBySearchInput() {
    const searchInput = document.querySelector('[data-kt-customer-table-filter="search"]');
    const searchText = searchInput.value.trim().toLowerCase();

    try {
        let endpoint = `http://${ipAddress}:${portep}/usersLogs`;

        if (searchText) {
            endpoint += `/${searchText}`;
        }

        const response = await fetch(endpoint);

        if (response.status === 404) {
            const eventsTable = document.getElementById("eventsTable");
            const tableBody = eventsTable.querySelector("tbody");
            tableBody.innerHTML = ""; // Clear existing table rows
            
            const noDataMessageRow = document.createElement("tr");
            const noDataMessageCell = document.createElement("td");
            noDataMessageCell.textContent = "No event found";
            noDataMessageCell.colSpan = 8; // Span across all columns
            noDataMessageCell.style.textAlign = "center"; // Center the text
            noDataMessageRow.appendChild(noDataMessageCell);
            tableBody.appendChild(noDataMessageRow);

            return; 
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const events = await response.json();
        renderTable(events.users);
    } catch (error) {
        console.error("Error fetching events:", error);
        Swal.fire({
            text: "Error fetching events",
            icon: "error",
            buttonsStyling: false,
            showConfirmButton: false,
            timer: 2000,
        });
    }
}

// Add event listener to search input
document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.querySelector('[data-kt-customer-table-filter="search"]');
    searchInput.addEventListener("input", updateTableBySearchInput);

    // Initial table update on page load
    updateTableBySearchInput();
});
