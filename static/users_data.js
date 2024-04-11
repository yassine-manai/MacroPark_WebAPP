document.addEventListener("DOMContentLoaded", () => {
  const ipAddress = "127.0.0.1";  // Update with your server IP address
  const portep = "8200";  // Update with your server port

  const pass = "************";

  const barriersTable = document.getElementById("barriersTable");

  fetch(`http://${ipAddress}:${portep}/allusers`)
      .then(response => {
          if (!response.ok) {
              throw new Error("Network response was not ok");
          }
          return response.json();
      })
      .then(data => {
          console.log(data);
          console.log("table" +data.users.length);

          if (!data.users || data.users.length === 0) {
              // No users found, display a message
              const noDataMessageRow = document.createElement("tr");
              const noDataMessageCell = document.createElement("td");
              const span = document.createElement("span");
              span.textContent = "No users found";
              span.classList.add("text-dark", "fw-bold", "text-hover-primary", "d-block", "mb-1", "fs-6");
              noDataMessageCell.appendChild(span);
              noDataMessageCell.colSpan = 10; // Span across all columns
              noDataMessageCell.style.textAlign = "center"; // Center the text
              noDataMessageRow.appendChild(noDataMessageCell);
              barriersTable.appendChild(noDataMessageRow);
          } else {
              // Users found, populate the table
              data.users.forEach(user => {
                  const newRow = document.createElement("tr");

                  const idCell = createCell(user._id, true);
                  console.log("hello"+idCell);
                  const nameCell = createCell(user.name, true);
                  const phone = createCell(user.phone_number, true);
                  const email = createCell(user.email, true);
                  const pass = createCell("**********", true);
                  const lpn1 = createCell(user.lpn1, true);
                  const lpn2 = createCell(user.lpn2, true);
                  const lpn3 = createCell(user.lpn3, true);
                  const lpn4 = createCell(user.lpn4, true);

                  const actionCell = createActionCell(user._id);


                  newRow.appendChild(idCell);
                  newRow.appendChild(nameCell);
                  newRow.appendChild(phone);

                  newRow.appendChild(email);
                  newRow.appendChild(pass);
                  newRow.appendChild(lpn1);
                  console.log(lpn1)

                  newRow.appendChild(lpn2);
                  newRow.appendChild(lpn3);
                  newRow.appendChild(lpn4);

                  newRow.appendChild(actionCell);

                  barriersTable.appendChild(newRow);
              });
          }
      })
      .catch(error => {
          console.error("Error fetching users:", error);
      });
});

function createCell(content, addTextClasses) {
  const cell = document.createElement("td");
  if (addTextClasses) {
      const span = document.createElement("span");
      span.textContent = content;
      span.classList.add("text-dark", "fw-bold", "text-hover-primary", "d-block", "mb-1", "fs-6");
      cell.appendChild(span);
  } else {
      cell.textContent = content;
  }
  return cell;
}


function createActionCell(userId) {
  const cell = document.createElement("td");

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("btn", "btn-lg", "fw-bold", "btn-danger");

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
    deleteBarrier(userId);
  });
  cell.appendChild(deleteButton);

  return cell;
}

function deleteBarrier(userId) {
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
      fetch(`http://${ipAddress}:${portep}/deleteUser/${userId}`, 
      {
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
                location.reload();

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
          console.error(`Error deleting user with id ${userId}:`, error)
        );
    }
  });
}


