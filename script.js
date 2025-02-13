/**
 * @file script.js
 * @description Script for managing job applications.
 * @author Michael Koch
 * @copyright © Michael Koch
 * @license MIT
 * @version 1.0.0
 * @date 2025
 */

document.addEventListener('DOMContentLoaded', init);

function init() {
  const form = document.getElementById('add-form');
  const tableBody = document.getElementById('application-table').querySelector('tbody');
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  const applications = JSON.parse(localStorage.getItem('applications')) || [];
  renderTable();

  const currentTheme = localStorage.getItem('theme') || 'light';
  body.classList.add(currentTheme);
  themeToggle.textContent = currentTheme === 'light' ? 'Dark Mode' : 'Light Mode';

  themeToggle.addEventListener('click', toggleTheme);

  form.addEventListener('submit', submitHandler);

  function toggleTheme() {
    body.classList.toggle('light');
    body.classList.toggle('dark');
    const newTheme = body.classList.contains('dark') ? 'dark' : 'light';
    themeToggle.textContent = newTheme === 'light' ? 'Dark Mode' : 'Light Mode';
    localStorage.setItem('theme', newTheme);
  }

  function submitHandler(event) {
    event.preventDefault();

    const company = document.getElementById('company').value;
    const position = document.getElementById('position').value;
    const date = document.getElementById('date').value;
    const status = document.getElementById('status').value;
    const descriptionLink = document.getElementById('description-link').value;

    if (!company || !position || !date || !status) {
      alert('Bitte fülle die Felder aus.');
      return;
    }

    const newApplication = {
      id: generateId(),
      company: company,
      position: position,
      date: date,
      status: status,
      descriptionLink: descriptionLink
    };

    applications.push(newApplication);
    localStorage.setItem('applications', JSON.stringify(applications));

    renderTable();
    form.reset();
  }

  function renderTable() {
    tableBody.innerHTML = ''; // Clear existing table rows
    applications.forEach(app => {
      const row = tableBody.insertRow();

      const companyCell = row.insertCell();
      const positionCell = row.insertCell();
      const dateCell = row.insertCell();
      const statusCell = row.insertCell();
      const descriptionCell = row.insertCell();
      const actionsCell = row.insertCell();

      companyCell.textContent = app.company;
      positionCell.textContent = app.position;
      dateCell.textContent = app.date;
      statusCell.textContent = app.status;
      descriptionCell.innerHTML = app.descriptionLink ? `<a href="${app.descriptionLink}" target="_blank">Link</a>` : '';

      actionsCell.classList.add('actions');
      actionsCell.innerHTML = `
        <button class="edit-btn" data-id="${app.id}">Edit</button>
        <button class="delete-btn" data-id="${app.id}">Delete</button>
      `;

      row.querySelector('.edit-btn').addEventListener('click', function() {
        editApplication(app.id);
      });

      row.querySelector('.delete-btn').addEventListener('click', function() {
        deleteApplication(app.id);
      });
    });
  }

  function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  function editApplication(id) {
    const application = applications.find(app => app.id === id);

    document.getElementById('company').value = application.company;
    document.getElementById('position').value = application.position;
    document.getElementById('date').value = application.date;
    document.getElementById('status').value = application.status;
    document.getElementById('description-link').value = application.descriptionLink;

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.textContent = 'Update Application';

    form.removeEventListener('submit', submitHandler);
    form.addEventListener('submit', function updateHandler(event) {
      event.preventDefault();

      application.company = document.getElementById('company').value;
      application.position = document.getElementById('position').value;
      application.date = document.getElementById('date').value;
      application.status = document.getElementById('status').value;
      application.descriptionLink = document.getElementById('description-link').value;

      localStorage.setItem('applications', JSON.stringify(applications));

      renderTable();

      form.reset();
      submitButton.textContent = 'Add Application';
      form.removeEventListener('submit', updateHandler);
      form.addEventListener('submit', submitHandler);
    });
  }

  function deleteApplication(id) {
    applications = applications.filter(app => app.id !== id);
    localStorage.setItem('applications', JSON.stringify(applications));
    renderTable();
  }
}
document.addEventListener('DOMContentLoaded', function() {
  const currentYear = new Date().getFullYear();
  document.getElementById('current-year').textContent = currentYear;
});
