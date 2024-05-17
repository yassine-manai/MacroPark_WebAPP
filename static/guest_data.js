console.log(`IP Address: ${ipAddress}`);
console.log(`Port: ${portep}`);


Swal.fire({
  title: "Fetching Guests data . . . ",
  didOpen: () => {
    Swal.showLoading();
  },
});


fetch(`http://${ipAddress}:${portep}/allguests`)
  .then((response) => {
    if (!response.ok) {
      Swal.fire({
        text: "Error ",
        icon: "warning",
        buttonsStyling: false,
        showConfirmButton: false,
        timer: 1500,
      })

      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    return response.json();
  })
  .then((data) => {

    Swal.close();

    console.log("Fetched data:", data);

    const guestTable = document.getElementById("guestsTable");
    const guests = data.guest; 

    if (!Array.isArray(guests) || guests.length === 0) {
      const noDataMessageRow = document.createElement("tr");
      const noDataMessageCell = document.createElement("td");
      const span = document.createElement("span");
      span.textContent = "No Guests found";
      span.classList.add(
        "text-dark",
        "fw-bold",
        "text-hover-primary",
        "d-block",
        "mb-1",
        "fs-6"
      );
      noDataMessageCell.appendChild(span);
      noDataMessageCell.colSpan = 10;
      noDataMessageCell.style.textAlign = "center"; 
      noDataMessageRow.appendChild(noDataMessageCell);
      guestTable.appendChild(noDataMessageRow);
    } else {
      guests.forEach((guest) => {
        const newRow = document.createElement("tr");

        const idCell = createCell(guest._id, true);
        const nameCell = createCell(guest.name, true);
        const phoneCell = createCell(guest.phoneNumber, true);
        const emailCell = createCell(guest.email, true);
        const passCell = createCell("**********", true);
        const lpn1Cell = createCell(guest.lpn1, true);
        const lpn2Cell = createCell(guest.lpn2, true);
        const lpn3Cell = createCell(guest.lpn3, true);
        const lpn4Cell = createCell(guest.lpn4, true);



        const actionCell = createActionCell(guest.email); 
        console.log(guest.email);

        newRow.appendChild(idCell);
        newRow.appendChild(nameCell);
        newRow.appendChild(phoneCell);
        newRow.appendChild(emailCell);
        newRow.appendChild(passCell);

        newRow.appendChild(lpn1Cell ? lpn1Cell:"Empty");
        newRow.appendChild(lpn2Cell ? lpn2Cell:"Empty");
        newRow.appendChild(lpn3Cell ? lpn3Cell:"Empty");
        newRow.appendChild(lpn4Cell ? lpn4Cell:"Empty");
        newRow.appendChild(actionCell);

        guestTable.appendChild(newRow);
      });
    }
  })
  .catch((error) => console.error("Error fetching or processing data:", error));

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

function createActionCell(guestEmail) {
  const cell = document.createElement("td");

  const acceptButton = document.createElement("button");
  acceptButton.classList.add("btn", "btn-sm", "fw-bold", "btn-primary");
  acceptButton.innerHTML = `<i class="ki-duotone ki-plus fs-1"></i>`;
  acceptButton.addEventListener("click", function () {
    acceptGuest(guestEmail);
  });
  cell.appendChild(acceptButton);

  cell.appendChild(document.createTextNode("\u00A0"));

  const declineButton = document.createElement("button");
  declineButton.classList.add("btn", "btn-sm", "fw-bold", "btn-danger");
  declineButton.innerHTML = `
    <i class="ki-duotone ki-cross fs-1">
      <span class="path1"></span>
      <span class="path2"></span>
    </i>
  `;
  declineButton.addEventListener("click", function () {
    declineGuest(guestEmail);
  });
  cell.appendChild(declineButton);

  return cell;
}

function declineGuest(guestEmail) {
  Swal.fire({
    text: "Are you sure you want to decline this user?",
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

      fetch(`http://${ipAddress}:${portep}/delete_guest/${guestEmail}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            Swal.fire({
              text: "Declined Successfully",
              icon: "success",
              buttonsStyling: false,
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              KTUtil.scrollTop(); 
              location.reload();
            });
          } else {
            throw new Error("Failed to decline user");
          }
        })
        .catch((error) =>
          console.error(`Error declining user with Email ${guestEmail}:`, error)
        );
    }
  });
}


function acceptGuest(guestEmail) {
  Swal.fire({
    text: "Are you sure you want to accept this user?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, accept it!",
    cancelButtonText: "No, cancel",
    buttonsStyling: false,
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-secondary",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`http://${ipAddress}:${portep}/approve_guest/${guestEmail}`, {
        method: "GET", 
      })
        .then((response) => {
          if (response.ok) {
            Swal.fire({
              text: "Accepted Successfully",
              icon: "success",
              buttonsStyling: false,
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              KTUtil.scrollTop();
              location.reload();
            });
          } else {
            throw new Error("Failed to accept user");
          }
        })
        .catch((error) =>
          console.error(`Error accepting user with Email ${guestEmail}:`, error)
        );
    }
  });
}


document.getElementById('logout').addEventListener('click', function() {
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