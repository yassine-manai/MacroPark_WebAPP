fetch("http://127.0.0.1:8100/Barrier")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    const barriersTable = document.getElementById("barriersTable");
    if (data.length === 0) {
		const noDataMessageRow = document.createElement("tr");
		const noDataMessageCell = document.createElement("td");
		const span = document.createElement("span");
		//span.textContent = `No event found with this id ${searchText}`;
		span.textContent = "No barrier jfound";
		span.classList.add("text-dark", "fw-bold", "text-hover-primary", "d-block", "mb-1", "fs-6");
		noDataMessageCell.appendChild(span);
		noDataMessageCell.colSpan = 7; // Span across all columns
		noDataMessageCell.style.textAlign = "center"; // Center the text
		noDataMessageRow.appendChild(noDataMessageCell);
		barriersTable.appendChild(noDataMessageRow);
    } else {
      data.forEach((barrier) => {
        const newRow = document.createElement("tr");

        const idCell = createCell(barrier[0], true);
        const ipCell = createCell(barrier[1], true);
        const portCell = createCell(barrier[2], true);
        const opCmdCell = createCell(barrier[3], true);
        const clCmdCell = createCell(barrier[4], true);
        const descCell = createCell(barrier[5], true);
        const actionCell = createActionCell(barrier[0]);

        newRow.appendChild(idCell);
        newRow.appendChild(ipCell);
        newRow.appendChild(portCell);
        newRow.appendChild(opCmdCell);
        newRow.appendChild(clCmdCell);
        newRow.appendChild(descCell);
        newRow.appendChild(actionCell);

        barriersTable.appendChild(newRow);
      });
    }
  })
  .catch((error) => console.error("Error fetching data:", error));

function createCell(content, addTextClasses) {
  const cell = document.createElement("td");
  if (addTextClasses) {
    const span = document.createElement("span");
    span.classList.add(
      "text-dark",
      "fw-bold",
      "text-hover-primary",
      "d-block",
      "mb-1",
      "fs-6"
    );
    span.textContent = content;
    cell.appendChild(span);
  } else {
    cell.textContent = content;
  }
  return cell;
}

function createActionCell(barrierId) {
  const cell = document.createElement("td");

  const modifyButton = document.createElement("button");
  modifyButton.classList.add("btn", "btn-sm", "fw-bold", "btn-primary");
  modifyButton.innerHTML = `
							<i class="ki-duotone ki-pencil fs-2">
								<span class="path1"></span>
								<span class="path2"></span>
							</i>
						`;
  modifyButton.addEventListener("click", function () {
    modifyBarriers(barrierId);
  });
  cell.appendChild(modifyButton);

  cell.appendChild(document.createTextNode("\u00A0"));

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("btn", "btn-sm", "fw-bold", "btn-danger");

  deleteButton.innerHTML = `
							<i class="ki-duotone ki-trash fs-2">
								<span class="path1"></span>
								<span class="path2"></span>
								<span class="path3"></span>
								<span class="path4"></span>
								<span class="path5"></span>
							</i>
						`;
  deleteButton.addEventListener("click", function () {
    deleteBarrier(barrierId);
  });
  cell.appendChild(deleteButton);

  return cell;
}

function deleteBarrier(barrierId) {
  Swal.fire({
    text: "Are you sure you want to delete?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, cancel",
    buttonsStyling: false,
    customClass: {
      confirmButton: "btn btn-danger",
      cancelButton: "btn btn-secondary",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`http://127.0.0.1:8100/delete/${barrierId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            Swal.fire({
              text: "Deleted Successfully",
              icon: "success",
              buttonsStyling: false,
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              KTUtil.scrollTop();
              setTimeout(() => {
                location.reload();
              });
            });
          } else {
            Swal.fire({
              text: " Error",
              icon: "error",
              buttonsStyling: false,
              confirmButtonText: "Ok, got it!",
              customClass: { confirmButton: "btn btn-dark" },
            }).then(() => {
              KTUtil.scrollTop();
            });
          }
        })
        .catch((error) =>
          console.error(`Error deleting barrier with id ${barrierId}:`, error)
        );
    }
  });
}

function modifyBarriers(barrierId) {
  fetch(`http://127.0.0.1:8100/Barrier/${barrierId}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to fetch barrier data");
      }
    })
    .then((data) => {
      const modifyIdInput = document.getElementById("id_modify");
      const modifyIpInput = document.getElementById("ip_modify");
      const modifyPortInput = document.getElementById("port_modify");
      const modifyOpenCodeInput = document.getElementById("open_modify");
      const modifyCloseCodeInput = document.getElementById("close_modify");
      const modifyDescriptionInput =
        document.getElementById("description_modify");

      if (
        !modifyIdInput ||
        !modifyIpInput ||
        !modifyPortInput ||
        !modifyOpenCodeInput ||
        !modifyCloseCodeInput ||
        !modifyDescriptionInput
      ) {
        return;
      }

      modifyIdInput.value = data.id || "";
      modifyIpInput.value = data.ip || "";
      modifyPortInput.value = data.port || "";
      modifyOpenCodeInput.value = data.op_cmd || "";
      modifyCloseCodeInput.value = data.cl_cmd || "";
      modifyDescriptionInput.value = data.description || "";

      const modifyModal = new bootstrap.Modal(
        document.getElementById("kt_modal_modify")
      );
      modifyModal.show();
    })

    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Failed !",
        showConfirmButton: false,
        timer: 1500,
      });
    });

  document.getElementById("modify").addEventListener("click", function (event) {
    event.preventDefault();

    const id = document.getElementById("id_modify").value;
    const ip = document.getElementById("ip_modify").value;
    const port = document.getElementById("port_modify").value;
    const opCmd = document.getElementById("open_modify").value;
    const clCmd = document.getElementById("close_modify").value;
    const description = document.getElementById("description_modify").value;

    const requestBody = {
      id: id,
      ip: ip,
      port: port,
      op_cmd: opCmd,
      cl_cmd: clCmd,
      description: description,
    };

    fetch(`http://127.0.0.1:8100/modify/${barrierId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Barrier Modified Successfully",
            showConfirmButton: false,
            timer: 1500,
          }).then(function () {
            KTUtil.scrollTop();
            setTimeout(function () {
              location.reload();
            }, 1500);
          });
        } else {
          throw new Error("Failed to modify barrier data");
          Swal.fire({
            icon: "error",
            title: "Failed to modify barrier data",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Failed",
          test: "Try again !",
          showConfirmButton: false,
          timer: 1500,
        });
      });

    const modifyModal = new bootstrap.Modal(
      document.getElementById("kt_modal_modify")
    );
    modifyModal.hide();
  });
}
