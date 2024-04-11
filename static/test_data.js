"use strict";


console.log(`IP Address: ${ipAddress}`);
console.log(`Port: ${portep}`);

fetch(`http://${ipAddress}:${portep}/Barrier`)

// Function to fetch data and populate the table
async function fetchDataAndPopulateTable() {
    try {
        const response = await fetch(`http://${ipAddress}:${portep}/Barrier`);
        const data = await response.json();
        const barriersTable = document.getElementById("barriersTable");

        if (data && data.length > 0) {
            data.forEach(barrier => {
                const newRow = document.createElement("tr");

                
                const open_cmd = "55 03 01 02 00 ED E7";
                const close_cmd = "55 03 01 02 00 ED E7";
                const lock_cmd = "55 03 01 01 01 A8 95";
                const unlock_cmd = "55 03 01 01 02 98 F6";

                newRow.appendChild(createCell(barrier[1], true)); 
                newRow.appendChild(createCell(barrier[3], true));
                newRow.appendChild(createCell(barrier[4], true)); 

                newRow.appendChild(createCell(open_cmd, true)); 
                newRow.appendChild(createCell(close_cmd, true)); 
                newRow.appendChild(createCell(lock_cmd, true)); 
                newRow.appendChild(createCell(unlock_cmd , true)); 
                console.log(barrier)

                const inputCell = document.createElement("td");
                const input = document.createElement("input");
                input.type = "text";
                input.placeholder = "Enter extra data";
                input.classList.add("form-control", "form-control-solid", "w-150px");
                inputCell.appendChild(input);
                newRow.appendChild(inputCell);

                newRow.appendChild(createActionCell(barrier[1], barrier[5], barrier[6], barrier[7], barrier[8], input));

                barriersTable.appendChild(newRow);
            });
        } else {
            const noDataMessage = document.createElement("p");
            noDataMessage.textContent = "No barriers found";
            barriersTable.appendChild(noDataMessage);
        }
    } catch (error) {
        console.error("Error fetching data:", error);

        const barriersTable = document.getElementById("barriersTable");
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Error fetching barriers data. Please try again later.";
        barriersTable.appendChild(errorMessage);
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

function createActionCell(barrierId, openCmd, closeCmd, lockCmd, unlockCmd, inputField) {
    const cell = document.createElement("td");
    const createButton = (imgSrc, altText, width, height, btnClass, clickHandler) => {
        const button = document.createElement("button");
        button.classList.add("btn", "btn-sm", "fw-bold", btnClass);
        const img = document.createElement("img");
        img.src = imgSrc;
        img.alt = altText;
        img.width = width; // Add width attribute
        img.height = height; // Add height attribute
        button.appendChild(img);
        button.addEventListener("click", () => {
            Swal.fire({
                title: "Connecting to the barrier. . . ",
                didOpen: () => {
                  Swal.showLoading();
                },
              });
            clickHandler();
        });
        return button;
    };

    cell.appendChild(createButton("/static/br_open.svg", "", 30, 30, "btn", () => handleBarrierAction("open", barrierId, openCmd, inputField.value)));
    cell.appendChild(document.createTextNode("\u00A0"));
    cell.appendChild(createButton("/static/br_closed.svg", "", 30, 30, "btn", () => handleBarrierAction("close", barrierId, closeCmd, inputField.value)));
    cell.appendChild(document.createTextNode("\u00A0"));
    cell.appendChild(createButton("/static/lock.svg", "", 30, 30, "btn", () => handleBarrierAction("lock", barrierId, lockCmd, inputField.value)));
    cell.appendChild(document.createTextNode("\u00A0"));
    cell.appendChild(createButton("/static/unlock.svg", "", 30, 30, "btn", () => handleBarrierAction("unlock", barrierId, unlockCmd, inputField.value)));

    return cell;
}


async function handleBarrierAction(action, barrierId, command, extraData) {
    const endpoint = `http://${ipAddress}:${portep}/${action}/${barrierId}`;
    const requestBody = { command: command, extra_data: extraData };

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const data = await response.json();
            Swal.fire({
                icon: "success",
                title: `${action.toUpperCase()} Successful!`,
                text: `Barrier ${barrierId} ${action}ed successfully`,
                showConfirmButton: false,
                timer: 1500
            });
        } else {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error(`Error ${action}ing barrier ${barrierId}:`, error);
        Swal.fire({
            icon: "error",
            title: `Error ${action}ing Barrier`,
            text: `An error occurred while ${action}ing Barrier ${barrierId}`,
            showConfirmButton: false,
            timer: 1500
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    fetchDataAndPopulateTable();
});
