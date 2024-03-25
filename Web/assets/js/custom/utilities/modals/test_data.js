// Function to fetch data and populate the table
function fetchDataAndPopulateTable() {
    fetch("http://127.0.0.1:8100/Barrier")
        .then(response => response.json())
        .then(data => {
            const barriersTable = document.getElementById("barriersTable");
            if (data.length === 0) {
                const noDataMessage = document.createElement("p");
                noDataMessage.textContent = "No barriers found";
                barriersTable.appendChild(noDataMessage);
            } else {
                data.forEach(barrier => {
                    const newRow = document.createElement("tr");

                    const idCell = createCell(barrier[0], true);
                    const ipCell = createCell(barrier[1], true);
                    const portCell = createCell(barrier[2], true);
                    const opCmdCell = createCell(barrier[3], true);
                    const clCmdCell = createCell(barrier[4], true);

                    const inputCell = document.createElement("td");
                    const input = document.createElement("input");
                    input.type = "text";
                    input.placeholder = "Enter extra data";
                    input.classList.add("form-control", "form-control-solid", "w-150px"); 
                    inputCell.appendChild(input);
                    const ed = input.value;

                    const actionCell = createActionCell(barrier[0], barrier[3], barrier[4], ed); 

                    newRow.appendChild(idCell);
                    newRow.appendChild(ipCell);
                    newRow.appendChild(portCell);
                    newRow.appendChild(opCmdCell);
                    newRow.appendChild(clCmdCell);
                    newRow.appendChild(inputCell);
                    newRow.appendChild(actionCell);

                    barriersTable.appendChild(newRow);
                });
            }
        })
        .catch(error => console.error("Error fetching data:", error));
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

function createActionCell(barrierId, openCmd, closeCmd, inputField) {
    const cell = document.createElement("td");

    const openButton = document.createElement("button");
    openButton.classList.add("btn", "btn-sm", "fw-bold", "btn-primary");
    openButton.innerHTML = `<i class="ki ki-lock-open fs-8"> OPEN</i>`;
    openButton.addEventListener("click", function () {

        Swal.fire({
            title: "Connecting to the barrier. . . ",
            didOpen: () => {
              Swal.showLoading();
            },
          });
        
        const extraData = inputField.value;
        openBarrier(barrierId, openCmd, extraData);
    });
    cell.appendChild(openButton);

    cell.appendChild(document.createTextNode("\u00A0"));

    const closeButton = document.createElement("button");
    closeButton.classList.add("btn", "btn-sm", "fw-bold", "btn-danger");
    closeButton.innerHTML = `<i class="ki ki-lock fs-8">CLOSE</i>`;
    closeButton.addEventListener("click", function () {

        Swal.fire({
            title: "Connecting to the barrier. . . ",
            didOpen: () => {
              Swal.showLoading();
            },
          });
                  
        const extraData = inputField.value; 
        closeBarrier(barrierId, closeCmd, extraData);
    });
    cell.appendChild(closeButton);

    return cell;
}

function openBarrier(barrierId, openCmd, extraData) {
    fetch(`http://127.0.0.1:8100/open/${barrierId}`, {
        method: "POST",
        body: JSON.stringify({ command: openCmd, extra_data: extraData }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (response.ok) {
            Swal.fire({
                title: "OPENED !",
                text: `Barrier ${barrierId} Opened successfully`,
                icon: "success"
            });
        } else if (response.status === 404) {
            Swal.fire({
                title: "Problem !",
                text: `404 - Barrier ${barrierId} not found`,
                icon: "error"
            });
        } else if (response.status === 500) {
            Swal.fire({
                title: " Barrier Disconnected ! ",
                text: `Check barrier ${barrierId} connection`,
                icon: "error"
            });
        }
    })
    .catch(error => console.error(`Error opening barrier with id ${barrierId}:`, error));
}

function closeBarrier(barrierId, closeCmd, extraData) {
    fetch(`http://127.0.0.1:8100/close/${barrierId}`, {
        method: "POST",
        body: JSON.stringify({ command: closeCmd, extra_data: extraData }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (response.ok) {
            Swal.fire({
                title: "CLOSED !",
                text: `Barrier  ${barrierId} closed successfully`,
                icon: "success"
            });
        } else if (response.status === 404) {
            Swal.fire({
                title: "Problem!",
                text: `404 - Barrier ${barrierId} not found`,
                icon: "error"
            });
        } else if (response.status === 500) {
            Swal.fire({
                title: " Barrier Disconnedted ! ",
                text: `Check barrier  ${barrierId} connection`,
                icon: "error"
            });
        }
    })
    .catch(error => console.error(`Error closing barrier with id ${barrierId}:`, error));
}

fetchDataAndPopulateTable();
