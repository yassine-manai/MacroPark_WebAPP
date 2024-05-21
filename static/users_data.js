document.addEventListener("DOMContentLoaded", () => {
  const ipAddress = "127.0.0.1";  // Update with your server IP address
  const portep = "8200";  // Update with your server port

  const pass = "************";

  const usersTable = document.getElementById("usersTable");

  Swal.fire({
    title: "Fetching Users data . . . ",
    didOpen: () => {
      Swal.showLoading();
    },
  });

  fetch(`http://${ipAddress}:${portep}/allusers`)
      .then(response => {

          if (!response.ok) {

            Swal.fire({
              text: "Error ",
              icon: "warning",
              buttonsStyling: false,
              showConfirmButton: false,
              timer: 1500,
            })
              throw new Error("Network response was not ok");
          }
          return response.json();
      })
      .then(data => {

        Swal.close();


          console.log(data);
          console.log("table" +data.users.length);

          if (!data.users || data.users.length === 0) {
              // No users found, display a message
              const noDataMessageRow = document.createElement("tr");
              const noDataMessageCell = document.createElement("td");
              const span = document.createElement("span");
              span.textContent = "No Users found";
              span.classList.add("text-dark", "fw-bold", "text-hover-primary", "d-block", "mb-1", "fs-6");
              noDataMessageCell.appendChild(span);
              noDataMessageCell.colSpan = 10; 
              noDataMessageCell.style.textAlign = "center";
              noDataMessageRow.appendChild(noDataMessageCell);
              usersTable.appendChild(noDataMessageRow);
          } else {
              data.users.forEach(user => {
                  const newRow = document.createElement("tr");

                  const idCell = createCell(user._id, true);
                  console.log("hello"+idCell);
                  
                  const nameCell = createCell(user.name, true);
                  const phone = createCell(user.phoneNumber, true);
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

                  usersTable.appendChild(newRow);
              });
          }
      })
      .catch(error => {

        Swal.close();

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

  const modifyButton = document.createElement("button");
  modifyButton.classList.add("btn", "btn-sm", "fw-bold", "btn-primary");
  modifyButton.innerHTML = `
							<i class="ki-duotone ki-pencil fs-2">
								<span class="path1"></span>
								<span class="path2"></span>
							</i>
						`;
  modifyButton.addEventListener("click", function () {
    modifyusers(userId);
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
    deleteuser(userId);
  });
  cell.appendChild(deleteButton);

  return cell;
}

function deleteuser(userId) {
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


function modifyusers(userId) {
  fetch(`http://${ipAddress}:${portep}/userid/${userId}`)
    .then((response) => {


      if (response.ok) {

        return response.json();
      } else {

        Swal.fire({
          text: "Error ",
          icon: "warning",
          buttonsStyling: false,
          showConfirmButton: false,
          timer: 1500,
        })
        throw new Error("Failed to fetch user data");
      }
    })
    .then((data) => {
      const modifyNameInput = document.getElementById("name_modify");
      const modifyPhoneInput = document.getElementById("phone_modify");
      const modifyEmailInput = document.getElementById("email_modify");
      const modifyPasswordInput = document.getElementById("password_modify");
      const modifyLpn1Input = document.getElementById("lpn1_modify");
      const modifyLpn2Input = document.getElementById("lpn2_modify");
      const modifyLpn3Input = document.getElementById("lpn3_modify");
      const modifyLpn4Input = document.getElementById("lpn4_modify");

      if (
        !modifyNameInput ||
        !modifyPhoneInput ||
        !modifyEmailInput ||
        !modifyPasswordInput ||
        !modifyLpn1Input ||
        !modifyLpn2Input ||
        !modifyLpn3Input ||
        !modifyLpn4Input
      ) {
        return;
      }

      modifyNameInput.value = data.user.name || "";
      modifyPhoneInput.value = data.user.phoneNumber || "";
      modifyEmailInput.value = data.user.email || "";
      modifyPasswordInput.value = "**********"; 
      modifyLpn1Input.value = data.user.lpn1 || "";
      modifyLpn2Input.value = data.user.lpn2 || "";
      modifyLpn3Input.value = data.user.lpn3 || "";
      modifyLpn4Input.value = data.user.lpn4 || "";

      const modifyModal = new bootstrap.Modal(document.getElementById("kt_modal_modify"));
      modifyModal.show();
    })
    
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Failed to fetch user data",
        showConfirmButton: false,
        timer: 1500,
      });
    });

  document.getElementById("modify").addEventListener("click", function (event) {
    event.preventDefault();

    const name = document.getElementById("name_modify").value;
    const phone = document.getElementById("phone_modify").value;
    const email = document.getElementById("email_modify").value;
    const lpn1 = document.getElementById("lpn1_modify").value;
    const lpn2 = document.getElementById("lpn2_modify").value;
    const lpn3 = document.getElementById("lpn3_modify").value;
    const lpn4 = document.getElementById("lpn4_modify").value;

    const requestBody = {
      name: name,
      phoneNumber: phone,
      email: email,
      lpn1: lpn1,
      lpn2: lpn2,
      lpn3: lpn3,
      lpn4: lpn4
    };

    fetch(`http://${ipAddress}:${portep}/modifyWeb/${userId}`, {
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
            title: "User Modified Successfully",
            showConfirmButton: false,
            timer: 1500,
          }).then(function () {
            location.reload(); // Reload the page after successful modification
          });
        } else {
          throw new Error("Failed to modify user data");
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Failed to modify user data",
          showConfirmButton: false,
          timer: 1500,
        });
      });

    const modifyModal = new bootstrap.Modal(document.getElementById("kt_modal_modify"));
    modifyModal.hide(); // Hide the modal after modification
  });
}


document.getElementById('logoutbtn').addEventListener('click', function() {
  Swal.fire({
      title: 'Are you sure you want to Logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      buttonsStyling: false,
      customClass: {
          confirmButton: 'btn btn-danger',
          cancelButton: 'btn btn-secondary'
      }
  }).then((result) => {
      if (result.isConfirmed) {
          window.location.href = 'login.html';
      }
  });
});