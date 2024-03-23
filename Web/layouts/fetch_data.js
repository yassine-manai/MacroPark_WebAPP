fetch("http://127.0.0.1:8100/getall")
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Failed to fetch data");
        }
    })
    .then(data => {
        console.log(data);
        const barriersTable = document.getElementById("barriersTable");
        if (data.length === 0) {
            const noDataMessage = document.createElement("p");
            noDataMessage.textContent = "No barriers found";
            barriersTable.appendChild(noDataMessage);
        } else {
            data.forEach(barrier => {
                const newRow = document.createElement("tr");

                // Populate cells with data
                const idCell = document.createElement("td");
                idCell.textContent = barrier.id;
                newRow.appendChild(idCell);

                const ipCell = document.createElement("td");
                ipCell.textContent = barrier.ip;
                newRow.appendChild(ipCell);

                const portCell = document.createElement("td");
                portCell.textContent = barrier.port;
                newRow.appendChild(portCell);

                const opCmdCell = document.createElement("td");
                opCmdCell.textContent = barrier.op_cmd;
                newRow.appendChild(opCmdCell);

                const clCmdCell = document.createElement("td");
                clCmdCell.textContent = barrier.cl_cmd;
                newRow.appendChild(clCmdCell);

                const descCell = document.createElement("td");
                descCell.textContent = barrier.description;
                newRow.appendChild(descCell);

                // Create action buttons cell
                const actionCell = document.createElement("td");
                const modifyBtn = document.createElement("button");
                modifyBtn.classList.add("btn", "btn-sm", "fw-bold", "btn-primary", "ms-2");
                modifyBtn.innerHTML = `<i class="ki ki-bold-edit icon-sm"></i> Modify`;
                modifyBtn.addEventListener("click", () => {
                    // Handle modify button click
                    console.log("Modify button clicked for barrier id:", barrier.id);
                });
                actionCell.appendChild(modifyBtn);

                const deleteBtn = document.createElement("button");
                deleteBtn.classList.add("btn", "btn-sm", "fw-bold", "btn-danger", "ms-2");
                deleteBtn.innerHTML = `<i class="ki ki-bold-trash icon-sm"></i> Delete`;
                deleteBtn.addEventListener("click", () => {
                    // Handle delete button click
                    console.log("Delete button clicked for barrier id:", barrier.id);
                });
                actionCell.appendChild(deleteBtn);

                newRow.appendChild(actionCell);

                barriersTable.appendChild(newRow);
            });
        }
    })
    .catch(error => {
        console.error("Error fetching data:", error);
        const barriersTable = document.getElementById("barriersTable");
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "No data found!";
        barriersTable.appendChild(errorMessage);
    });
