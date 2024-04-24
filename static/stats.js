// Update Users Section
const usersNewValue = 42;

// Select the users progress bar element by ID
const usersProgressBar = document.getElementById('users_progress');

// Update the aria-valuenow attribute of the users progress bar
usersProgressBar.setAttribute('aria-valuenow', usersNewValue);
// Update the style width of the users progress bar to reflect the new value visually
usersProgressBar.style.width = `${usersNewValue}%`;

// Update the displayed number for users
const usersNumberSpan = document.getElementById('users_number');
if (usersNumberSpan) {
    usersNumberSpan.textContent = usersNewValue.toString();
}
    
