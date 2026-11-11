const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');
const toast = document.getElementById('toast');
const videoInput = document.getElementById('videoInput');
const uploadZone = document.getElementById('uploadZone');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

menuToggle?.addEventListener('click', () => sidebar.classList.toggle('open'));
document.addEventListener('click', (event) => {
  if (window.innerWidth <= 820 && sidebar.classList.contains('open') &&
      !sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
    sidebar.classList.remove('open');
  }
});

document.querySelectorAll('[data-page]').forEach(link => {
  link.addEventListener('click', (event) => {
    const page = link.dataset.page;
    document.querySelectorAll('.nav-link').forEach(item => item.classList.toggle('active', item.dataset.page === page));
    if (window.innerWidth <= 820) sidebar.classList.remove('open');
    if (page !== 'home' && page !== 'new-project') {
      event.preventDefault();
      const names = {'cut-engine':'AI Cut Engine','captions':'AI Captions','projects':'Projects','settings':'Settings'};
      showToast(`${names[page] || 'Section'} — visual prototype only`);
    }
  });
});

uploadZone.addEventListener('click', () => videoInput.click());
videoInput.addEventListener('change', () => {
  const file = videoInput.files?.[0];
  if (!file) return;
  document.getElementById('uploadTitle').textContent = file.name;
  document.getElementById('uploadSub').textContent = `${(file.size / 1024 / 1024).toFixed(1)} MB · Ready for preview`;
  showToast('Video selected — backend processing is not connected in this prototype.');
});

['dragenter','dragover'].forEach(name => uploadZone.addEventListener(name, e => {
  e.preventDefault(); uploadZone.classList.add('dragover');
}));
['dragleave','drop'].forEach(name => uploadZone.addEventListener(name, e => {
  e.preventDefault(); uploadZone.classList.remove('dragover');
}));
uploadZone.addEventListener('drop', e => {
  const file = e.dataTransfer.files?.[0];
  if (file && file.type.startsWith('video/')) {
    const transfer = new DataTransfer(); transfer.items.add(file); videoInput.files = transfer.files;
    videoInput.dispatchEvent(new Event('change'));
  } else showToast('Please drop a video file.');
});

document.querySelectorAll('.dots').forEach(button => button.addEventListener('click', () => showToast('Project actions are a visual placeholder.')));
document.getElementById('profileButton').addEventListener('click', () => showToast('Profile menu preview'));


const landingScreen = document.getElementById('landingScreen');
const dashboardApp = document.getElementById('dashboardApp');
document.getElementById('getStarted').addEventListener('click', () => {
  landingScreen.classList.add('is-leaving');
  dashboardApp.classList.remove('dashboard-hidden');
  document.body.classList.add('dashboard-active');
  setTimeout(() => { landingScreen.style.display = 'none'; }, 700);
});
document.getElementById('backHome').addEventListener('click', () => {
  landingScreen.style.display = 'flex';
  requestAnimationFrame(() => landingScreen.classList.remove('is-leaving'));
  dashboardApp.classList.add('dashboard-hidden');
  document.body.classList.remove('dashboard-active');
  window.scrollTo({top:0,behavior:'smooth'});
});
