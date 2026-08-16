const modal = document.querySelector('#demo-modal');
const form = document.querySelector('#demo-form');
const success = document.querySelector('.form-success');

function setModal(open) {
  modal.classList.toggle('visible', open);
  modal.setAttribute('aria-hidden', String(!open));
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) {
    form.hidden = false;
    success.hidden = true;
    modal.querySelector('input').focus();
  }
}

document.querySelectorAll('.open-demo').forEach((button) => {
  button.addEventListener('click', () => setModal(true));
});

document.querySelector('.modal-close').addEventListener('click', () => setModal(false));
modal.addEventListener('click', (event) => {
  if (event.target === modal) setModal(false);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.classList.contains('visible')) setModal(false);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const button = form.querySelector('button[type="submit"]');
  const errorMessage = form.querySelector('.form-error');

  button.disabled = true;
  button.firstChild.textContent = 'Sending... ';
  errorMessage.hidden = true;

  fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Object.fromEntries(new FormData(form))),
  })
    .then(async (response) => {
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Unable to send your request right now.');

      form.reset();
      form.hidden = true;
      success.hidden = false;
    })
    .catch((error) => {
      errorMessage.textContent = error.message;
      errorMessage.hidden = false;
    })
    .finally(() => {
      button.disabled = false;
      button.firstChild.textContent = 'Request a demo ';
    });
});
