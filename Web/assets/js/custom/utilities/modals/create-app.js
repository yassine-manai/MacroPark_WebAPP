"use strict";

var KTCreateApp = (function () {
  var stepper, form, validator;

  return {
    init: function () {
      stepper = new KTStepper(document.getElementById("kt_modal_create_app_stepper"));
      form = document.getElementById("kt_modal_create_app_form");
      validator = FormValidation.formValidation(form, {
        fields: {
          id: {
            validators: {
              notEmpty: {
                message: "Barrier ID is required"
              }
            }
          },
          ip: {
            validators: {
              notEmpty: {
                message: "Barrier IP is required"
              }
            }
          },
          port: {
            validators: {
              notEmpty: {
                message: "Barrier Port is required"
              }
            }
          },
          open: { // Change to "open"
            validators: {
              notEmpty: {
                message: "Barrier Open Code is required"
              }
            }
          },
          close: { // Change to "close"
            validators: {
              notEmpty: {
                message: "Barrier Close Code is required"
              }
            }
          }
        },
        plugins: {
          trigger: new FormValidation.plugins.Trigger(),
          bootstrap: new FormValidation.plugins.Bootstrap5({
            rowSelector: ".fv-row",
            eleInvalidClass: "",
            eleValidClass: "",
          }),
        },
      });

      // Event listener for "Add" button
      document.getElementById("add").addEventListener("click", function () {
        validator.validate().then(function (status) {
          if (status === "Valid") {
            var id = document.getElementById("id").value;
            var ip = document.getElementById("ip").value;
            var port = document.getElementById("port").value;
            var op_cmd = document.getElementById("open").value;
            var cl_cmd = document.getElementById("close").value;
            var description = document.getElementById("description").value;

            var formData = {
              id: id,
              ip: ip,
              port: port,
              op_cmd: op_cmd,
              cl_cmd: cl_cmd,
              description: description
            };

            

            fetch('http://localhost:8100/add', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData)
            })
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then(data => {

              Swal.fire({
                icon: 'success',
                title: 'Barrier Added Successfully',
                showConfirmButton: false,
                timer: 1500 
            }).then(function () {
                KTUtil.scrollTop();
                setTimeout(function() {
                    location.reload();
                }, 1500); 
            });
            
              
            })
            .catch(error => {
              console.error('There was a problem with the fetch operation:', error);
              Swal.fire({
                title:"Error ! ",
                text: " Please try again",
                icon: "error",
                buttonsStyling: false,
                showConfirmButton: false,
                timer: 1500
              })
            });
          } else {
            Swal.fire({
              text: "Sorry, looks like there are some errors detected, please fill all the fields.",
              icon: "error",
              buttonsStyling: false,
              confirmButtonText: "Ok, got it!",
              customClass: { confirmButton: "btn btn-dark" },
            }).then(function () {
              KTUtil.scrollTop();
            });
          }
        });
      });
    },
  };
})();

KTUtil.onDOMContentLoaded(function () {
  KTCreateApp.init();
});
