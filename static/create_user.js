"use strict";

var KTCreateApp = (function () {
  var stepper, form, validator;

  var initStepper = function () {
    stepper = new KTStepper(document.getElementById("kt_modal_create_app_stepper"));
    form = document.getElementById("kt_modal_create_app_form");
    validator = FormValidation.formValidation(form, {
      fields: {
        name: {
          validators: {
            notEmpty: {
              message: "Barrier Name is required"
            }
          }
        },
        phone: {
          validators: {
            notEmpty: {
              message: "phone number is required"
            }
          }
        },
        email: {
          validators: {
            notEmpty: {
              message: "Email is required"
            }
          }
        },
        password: {
          validators: {
            notEmpty: {
              message: "Password is required"
            }
          }
        },
        lpn1: {
          validators: {
            notEmpty: {
              message: "Licence Plate is required"
            }
          }
        },
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
  };

  var initEventListeners = function () {
    document.getElementById("add").addEventListener("click", function () 
    {

      validator.validate().then(function (status) {
        if (status === "Valid") {
          var name = document.getElementById("name").value;
          var phone = document.getElementById("phone").value;
          var email = document.getElementById("email").value;
          var password = document.getElementById("password").value;
          var lpn1 = document.getElementById("lpn1").value;
          var lpn2 = document.getElementById("lpn2").value;
          var lpn3 = document.getElementById("lpn3").value;
          var lpn4 = document.getElementById("lpn4").value;

          var hashedPassword = md5(password);


          var formData = {
            name: name,
            phoneNumber: phone,
            email : email,
            password: hashedPassword,
            lpn1: lpn1,
            lpn2: lpn2,
            lpn3: lpn3,
            lpn4: lpn4,
          };

            console.log(formData);
            
  Swal.fire({
    title: "Fetching Users data . . . ",
    didOpen: () => {
      Swal.showLoading();
    },
  });

          fetch(`http://${ipAddress}:${portep}/adduser`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
          })
          .then(response => {
            if (response.status === 400) {
              throw new Error('User with the same ID already exists');
            } else if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            Swal.close();


            Swal.fire({
              icon: 'success',
              title: 'User   Added Successfully',
              showConfirmButton: false,
              timer: 1500
            }).then(function () {
              KTUtil.scrollTop();
              setTimeout(function () {
                location.reload();
              }, 300);
            });
          })
          .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            Swal.fire({
              title: error.message || "Error!",
              text: "Please try again",
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
  };

  return {
    init: function () {
      initStepper();
      initEventListeners();
    }
  };
})();

KTUtil.onDOMContentLoaded(function () {
  KTCreateApp.init();
});
