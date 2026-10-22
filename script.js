/**
 * @author Michael Koch
 * @license MIT
 */
document.addEventListener('DOMContentLoaded', init);

function init() {
  const form = document.getElementById('add-form');
  const tableBody = document.querySelector('#application-table tbody');
  const themeToggle = document.getElementById('theme-toggle');
  const submitButton = form.querySelector('[type="submit"]');
  const cancelButton = document.getElementById('cancel-edit');
  const message = document.getElementById('message');
  const statuses = { Applied: 'Beworben', Interviewing: 'Vorstellungsgespräch', Offer: 'Angebot', Rejected: 'Absage' };
  let applications = [];
  let editingId = null;
  let storageReadable = true;

  function notify(text) {
    message.textContent = text;
  }

  function safeUrl(value) {
    try {
      const url = new URL(value);
      return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
    } catch {
      return null;
    }
  }

  function validApplication(app) {
    return app !== null && typeof app === 'object'
      && ['id', 'company', 'position', 'date', 'status'].every(key => typeof app[key] === 'string')
      && app.id.length > 0 && app.company.trim().length > 0 && app.position.trim().length > 0
      && /^\d{4}-\d{2}-\d{2}$/.test(app.date)
      && Object.hasOwn(statuses, app.status)
      && (app.descriptionLink === undefined || typeof app.descriptionLink === 'string');
  }

  try {
    const stored = JSON.parse(localStorage.getItem('applications') || '[]');
    if (!Array.isArray(stored) || !stored.every(validApplication)
      || new Set(stored.map(app => app.id)).size !== stored.length) {
      throw new Error('Invalid stored applications');
    }
    applications = stored;
  } catch {
    storageReadable = false;
    notify('Gespeicherte Bewerbungen konnten nicht geladen werden. Die vorhandenen Daten werden nicht überschrieben. Bitte prüfe den Browserspeicher.');
  }

  function save(nextApplications) {
    if (!storageReadable) {
      notify('Speichern ist gesperrt, da vorhandene Browserdaten nicht geladen werden konnten.');
      return false;
    }
    try {
      localStorage.setItem('applications', JSON.stringify(nextApplications));
      applications = nextApplications;
      return true;
    } catch {
      notify('Speichern fehlgeschlagen. Bitte prüfe den verfügbaren Browserspeicher. Deine Eingaben bleiben im Formular.');
      return false;
    }
  }

  function setTheme(theme) {
    document.body.classList.toggle('dark', theme === 'dark');
    document.body.classList.toggle('light', theme !== 'dark');
    themeToggle.textContent = theme === 'dark' ? 'Hellmodus' : 'Dunkelmodus';
    themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
  }

  let theme = 'light';
  try {
    theme = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
  } catch {
    notify('Der Browserspeicher ist nicht verfügbar. Änderungen können nicht dauerhaft gespeichert werden.');
  }
  setTheme(theme);
  themeToggle.addEventListener('click', () => {
    const nextTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
    setTheme(nextTheme);
    try {
      localStorage.setItem('theme', nextTheme);
    } catch {
      notify('Das Farbschema konnte nicht dauerhaft gespeichert werden.');
    }
  });

  function resetForm() {
    editingId = null;
    form.reset();
    submitButton.textContent = 'Hinzufügen';
    cancelButton.hidden = true;
  }

  cancelButton.addEventListener('click', resetForm);
  form.addEventListener('submit', event => {
    event.preventDefault();
    const company = form.elements.company.value.trim();
    const position = form.elements.position.value.trim();
    const date = form.elements.date.value;
    const status = form.elements.status.value;
    const descriptionLink = form.elements['description-link'].value.trim();
    if (!company || !position || !date || !Object.hasOwn(statuses, status)) {
      notify('Bitte fülle alle Pflichtfelder aus.');
      return;
    }
    if (descriptionLink && !safeUrl(descriptionLink)) {
      notify('Bitte verwende einen vollständigen Link mit http:// oder https://.');
      return;
    }
    const application = { id: editingId || Array.from(crypto.getRandomValues(new Uint32Array(4)), value => value.toString(16).padStart(8, '0')).join(''), company, position, date, status, descriptionLink };
    const nextApplications = editingId
      ? applications.map(app => app.id === editingId ? application : app)
      : [...applications, application];
    if (!save(nextApplications)) return;
    resetForm();
    renderTable();
    notify('Bewerbung gespeichert.');
  });

  function editApplication(app) {
    editingId = app.id;
    for (const key of ['company', 'position', 'date', 'status']) form.elements[key].value = app[key];
    form.elements['description-link'].value = app.descriptionLink || '';
    submitButton.textContent = 'Änderungen speichern';
    cancelButton.hidden = false;
    form.elements.company.focus();
  }

  function deleteApplication(id) {
    if (!save(applications.filter(app => app.id !== id))) return;
    if (editingId === id) resetForm();
    renderTable();
    notify('Bewerbung gelöscht.');
  }

  function renderTable() {
    tableBody.replaceChildren();
    if (applications.length === 0) {
      const cell = tableBody.insertRow().insertCell();
      cell.colSpan = 6;
      cell.textContent = storageReadable ? 'Noch keine Bewerbungen vorhanden.' : 'Bewerbungen konnten nicht geladen werden.';
    }
    for (const app of applications) {
      const row = tableBody.insertRow();
      for (const value of [app.company, app.position, app.date, statuses[app.status]]) {
        row.insertCell().textContent = value;
      }
      const linkCell = row.insertCell();
      const url = safeUrl(app.descriptionLink);
      if (url) {
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Stellenanzeige';
        linkCell.append(link);
      }
      const actionsCell = row.insertCell();
      actionsCell.className = 'actions';
      for (const [label, className, action] of [
        ['Bearbeiten', 'edit-btn', () => editApplication(app)],
        ['Löschen', 'delete-btn', () => deleteApplication(app.id)]
      ]) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = className;
        button.textContent = label;
        button.setAttribute('aria-label', `${label}: ${app.company}, ${app.position}`);
        button.addEventListener('click', action);
        actionsCell.append(button);
      }
    }
  }

  renderTable();
  document.getElementById('current-year').textContent = new Date().getFullYear();
}
