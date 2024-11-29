// Fetch JSON Data
fetch('data.json')
  .then((response) => response.json())
  .then((data) => {
    // Store exercises
    const exercises = data.exercises;
    const sidebarLinksData = data.sidebarLinks; // New data for the additional list

    // Initialize first exercise
    let currentExerciseId = exercises[0].id;
    initializeExercise(exercises.find((ex) => ex.id === currentExerciseId));

    // Populate Exercise Dropdown
    const dropdownMenu = document.querySelector('.dropdown-menu');
    exercises.forEach((exercise) => {
      const dropdownItem = document.createElement('li');
      dropdownItem.innerHTML = `
        <a class="dropdown-item" data-id="${exercise.id}" href="#">${exercise.title}</a>
      `;
      dropdownMenu.appendChild(dropdownItem);
    });

    // Add Event Listeners for Dropdown Items
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior
        const exerciseId = parseInt(e.target.getAttribute('data-id'), 10);
        currentExerciseId = exerciseId;
        initializeExercise(exercises.find((ex) => ex.id === exerciseId));

        // Update Dropdown Button Text
        const dropdownButton = document.getElementById('exerciseDropdown');
        dropdownButton.textContent = e.target.textContent;
      });
    });

    // Populate Sidebar Links
    exercises.forEach((exercise) => {
      const linkItem = document.createElement('li');
      linkItem.innerHTML = `<a href="#exercise-${exercise.id}" data-id="${exercise.id}">${exercise.title}</a>`;
      sidebarLinks.appendChild(linkItem);
    });

    // Add Additional Links from sidebarLinksData
    sidebarLinksData.forEach((linkText) => {
      const linkItem = document.createElement('li');
      linkItem.innerHTML = `<a href="#">${linkText}</a>`;
      sidebarLinks.appendChild(linkItem);
    });

    // Add Event Listeners for Sidebar Exercise Links
    sidebarLinks.querySelectorAll('a[data-id]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const exerciseId = parseInt(e.target.getAttribute('data-id'), 10);
        initializeExercise(exercises.find((ex) => ex.id === exerciseId));
        sidebar.classList.remove('open'); // Close sidebar after selection
      });
    });
  });

// DOM Elements
const stepsContainer = document.getElementById('steps-container');
const previewBox = document.getElementById('preview-box');
const resetButton = document.getElementById('reset-btn');

// Store selected values
let selectedSteps = {};

// Initialize Exercise
function initializeExercise(exercise) {
  // Update the title and description
  document.getElementById('exercise-title').textContent = exercise.title;
  document.getElementById('exercise-description').textContent = exercise.description;

  // Populate Steps
  stepsContainer.innerHTML = '';
  exercise.steps.forEach((step, index) => {
    const stepCard = document.createElement('div');
    stepCard.className = 'col-md-12';
    stepCard.innerHTML = `
      <div class="card p-3">
        <p class="step-title">${index + 1}. ${step.question}</p>
        <div class="d-flex flex-wrap gap-2">
          ${step.options
            .map(
              (option) => `
                <button class="btn btn-outline-primary step-btn" 
                        data-step="${index + 1}" 
                        data-value="${option}">
                  ${option}
                </button>
              `
            )
            .join('')}
        </div>
      </div>
    `;
    stepsContainer.appendChild(stepCard);
  });

  // Add Event Listeners to Buttons
  const stepButtons = document.querySelectorAll('.step-btn');
  stepButtons.forEach((button) => {
    button.addEventListener('click', handleButtonClick);
  });

  // Reset Preview
  resetPreview();
}

// Handle Button Click
function handleButtonClick(event) {
  const button = event.target;
  const step = button.getAttribute('data-step');
  const value = button.getAttribute('data-value');
  selectedSteps[step] = value;

  // Highlight the selected button
  document
    .querySelectorAll(`.step-btn[data-step="${step}"]`)
    .forEach((btn) => btn.classList.remove('active'));
  button.classList.add('active');

  // Update preview
  updatePreview();
}

// Update Preview
function updatePreview() {
  const description = Object.keys(selectedSteps)
    .sort() // Ensure steps are in order
    .map((step) => selectedSteps[step])
    .filter(Boolean)
    .join(' ');
  previewBox.textContent = description || 'Your description will appear here.';
}

// Reset Preview
function resetPreview() {
  selectedSteps = {};
  previewBox.textContent = 'Your description will appear here.';
  const stepButtons = document.querySelectorAll('.step-btn');
  stepButtons.forEach((btn) => btn.classList.remove('active'));
}

// Reset Button Event Listener
resetButton.addEventListener('click', resetPreview);

// Sidebar Toggle
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebarClose = document.getElementById('sidebar-close');
const sidebarLinks = document.getElementById('sidebar-links');

// Open Sidebar
sidebarToggle.addEventListener('click', () => {
  sidebar.classList.add('open');
});

// Close Sidebar
sidebarClose.addEventListener('click', () => {
  sidebar.classList.remove('open');
});
