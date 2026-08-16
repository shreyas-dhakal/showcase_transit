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
  // Replace this UI-only handoff with the Resend endpoint when the API is wired.
  form.hidden = true;
  success.hidden = false;
});
