fetch("http://127.0.0.1:8100/getall")
						.then(response => response.json())
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

									// Create and append cells for each data item
									const idCell = createCell(barrier[0], true);
									const ipCell = createCell(barrier[1], true);
									const portCell = createCell(barrier[2], true);
									const opCmdCell = createCell(barrier[3], true);
									const clCmdCell = createCell(barrier[4], true);
									const descCell = createCell(barrier[5], true);
									const actionCell = createActionCell(barrier[0]); // Assuming the first item in the barrier data is the ID

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
						.catch(error => console.error("Error fetching data:", error));

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

					function createActionCell(barrierId) {
						const cell = document.createElement("td");

						// Create Modify button
						const modifyButton = document.createElement("button");
						modifyButton.classList.add("btn", "btn-sm", "fw-bold", "btn-primary");
						modifyButton.innerHTML = `
							<i class="ki-duotone ki-pencil fs-2">
								<span class="path1"></span>
								<span class="path2"></span>
							</i>
						`;
						modifyButton.addEventListener("click", function () {
							// Handle modify button click event
							console.log("Modify button clicked for barrier id:", barrierId);
							modifyBarriers(barrierId);
						});
						cell.appendChild(modifyButton);

						// Add space between buttons
						cell.appendChild(document.createTextNode("\u00A0"));

						// Create Delete button
						const deleteButton = document.createElement("button");
						deleteButton.classList.add("btn", "btn-sm", "fw-bold", "btn-primary");
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
							// Handle delete button click event
							deleteBarrier(barrierId);
							console.log("Delete button clicked for barrier id:", barrierId);

						});
						cell.appendChild(deleteButton);

						return cell;
					}

					function deleteBarrier(barrierId) 
					{
	
							console.log("deleted");
							fetch(`http://127.0.0.1:8100/delete/${barrierId}`, {
							method: "DELETE",
							})
							.then((response) => {
								if (response.ok) {
								console.log(
									`Barrier with id ${barrierId} deleted successfully`
								);

								Swal.fire({
									text: "Deleted Successfully",
									buttonsStyling: false,
									showConfirmButton: false,
    								timer: 2500 
								}).then(function () {
									KTUtil.scrollTop();
									setTimeout(function() {
										location.reload();
									}, 3000); // Adjust the delay time in milliseconds (2000 milliseconds = 2 seconds)
								});

								} else {
								console.error(
									`Failed to delete barrier with id ${barrierId}`
								);

								Swal.fire({
									text: " Error",
									icon: "error",
									buttonsStyling: false,
									confirmButtonText: "Ok, got it!",
									customClass: { confirmButton: "btn btn-dark" },
									}).then(function () {
									KTUtil.scrollTop();
									});
								}
							})
							.catch((error) =>
								console.error(
								`Error deleting barrier with id ${barrierId}:`,
								error
								)
							);
						}


						function modifyBarriers(barrierId) {
							// Fetch the barrier data based on the barrierId
							fetch(`http://127.0.0.1:8100/getBarrier/${barrierId}`)
							.then(response => {
								if (response.ok) {
									return response.json();
								} else {
									throw new Error("Failed to fetch barrier data");
								}
							})
							.then(data => {
								// Fill the form fields with the fetched barrier data
								const modifyIdInput = document.getElementById("modify_id");
								const modifyIpInput = document.getElementById("modify_ip");
								const modifyPortInput = document.getElementById("modify_port");
								const modifyOpenCodeInput = document.getElementById("modify_open_code");
								const modifyCloseCodeInput = document.getElementById("modify_close_code");
								const modifyDescriptionInput = document.getElementById("modify_description");

								if (!modifyIdInput || !modifyIpInput || !modifyPortInput || !modifyOpenCodeInput || !modifyCloseCodeInput || !modifyDescriptionInput) {
									console.error("One or more elements not found in the DOM");
									return; // Exit function if any element is missing
								}

								modifyIdInput.value = data.id; 
								modifyIpInput.value = data.ip; 
								modifyPortInput.value = data.port; 
								modifyOpenCodeInput.value = data.op_cmd; 
								modifyCloseCodeInput.value = data.cl_cmd; 
								modifyDescriptionInput.value = data.description; 

								// Show the modify form
								const modifyModal = new bootstrap.Modal(document.getElementById('kt_modal_modify'));
								modifyModal.show();

								console.log("Modify button clicked for barrier id:", barrierId);
								console.log("Barrier IP:", data.ip);
								console.log("Barrier Port:", data.port);
								console.log("Description:", data.description);
							})
							.catch(error => {
								console.error("Error fetching barrier data:", error);
								alert("Failed to fetch barrier data. Please try again.");
							});

							// Add event listener to the modify form
							document.getElementById("kt_modal_modify_form").addEventListener("submit", function (event) {
								event.preventDefault();
								
								// Retrieve modified barrier data from the form
								const id = document.getElementById("modify_id").value;
								const ip = document.getElementById("modify_ip").value;
								const port = document.getElementById("modify_port").value;
								const opCmd = document.getElementById("modify_open_code").value;
								const clCmd = document.getElementById("modify_close_code").value;
								const description = document.getElementById("modify_description").value;

								// Log the modified barrier data
								console.log("Modified Barrier ID:", id);
								console.log("Modified Barrier IP:", ip);
								console.log("Modified Barrier Port:", port);
								console.log("Modified Open Code:", opCmd);
								console.log("Modified Close Code:", clCmd);
								console.log("Modified Description:", description);

								// Construct the request body
								const requestBody = {
									id: id,
									ip: ip,
									port: port,
									op_cmd: opCmd,
									cl_cmd: clCmd,
									description: description
								};

								// Send the modified data through the "modifyButton" endpoint
								fetch(`http://127.0.0.1:8100/modify/${barrierId}`, {
									method: 'PUT',
									headers: {
										'Content-Type': 'application/json'
									},
									body: JSON.stringify(requestBody)
								})
								.then(response => {
									if (response.ok) {
										console.log("Barrier data modified successfully");
										// Show success message and reload the page
										Swal.fire({
											icon: 'success',
											title: 'Barrier Modified Successfully',
											showConfirmButton: false,
											timer: 1500
										}).then(function () {
											KTUtil.scrollTop();
											setTimeout(function() {
												location.reload();
											}, 1500);
										});
									} else {
										throw new Error("Failed to modify barrier data");
									}
								})
								.catch(error => {
									console.error("Error modifying barrier data:", error);
									alert("Failed to modify barrier data. Please try again.");
								});

								// Hide the modify form after submission
								const modifyModal = new bootstrap.Modal(document.getElementById('kt_modal_modify'));
								modifyModal.hide();
							});
						}

