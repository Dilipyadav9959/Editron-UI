const $ = id => document.getElementById(id);
const sidebar = $('sidebar'), toast = $('toast'), input = $('videoInput'), zone = $('uploadZone');
const landing = $('landing'), app = $('app'), ready = $('ready'), video = $('preview');
const mq = matchMedia('(max-width:820px)');
let timer, blobUrl;

const showToast = msg => {
  toast.textContent = msg; toast.classList.add('show');
  clearTimeout(timer); timer = setTimeout(() => toast.classList.remove('show'), 2800);
};

/* Sidebar drawer: closed drawer is removed from the tab order on mobile */
const syncSidebar = () => { sidebar.inert = mq.matches && !sidebar.classList.contains('open'); };
mq.addEventListener('change', syncSidebar); syncSidebar();
$('menuToggle').addEventListener('click', () => { sidebar.classList.toggle('open'); syncSidebar(); });
document.addEventListener('click', e => {
  if (mq.matches && sidebar.classList.contains('open') && !sidebar.contains(e.target) && !$('menuToggle').contains(e.target)) {
    sidebar.classList.remove('open'); syncSidebar();
  }
});

const names = {'cut-engine':'AI Cut Engine','captions':'AI Captions','projects':'Projects','settings':'Settings'};
document.querySelectorAll('[data-page]').forEach(link => link.addEventListener('click', e => {
  const page = link.dataset.page;
  document.querySelectorAll('.nav-link').forEach(n => n.classList.toggle('active', n.dataset.page === page));
  sidebar.classList.remove('open'); syncSidebar();
  if (names[page]) { e.preventDefault(); showToast(`${names[page]} is not built yet in this prototype.`); }
}));

/* Cut Engine waveform: grey bars are the sections the engine would remove */
const wave = $('wave');
for (let i = 0; i < 64; i++) {
  const s = document.createElement('span');
  const h = 18 + Math.abs(Math.sin(i * .55) * Math.cos(i * .21)) * 82;
  s.style.setProperty('--h', h.toFixed(0) + '%');
  if ((i > 13 && i < 21) || (i > 38 && i < 46)) { s.className = 'cut'; s.style.setProperty('--h', '14%'); }
  wave.appendChild(s);
}

/* Upload: previews the real file locally */
const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
function loadFile(file) {
  if (!file || !file.type.startsWith('video/')) return showToast('That file is not a video. Try MP4, MOV or WebM.');
  if (file.size > 500 * 1024 * 1024) return showToast('That video is over 500 MB. Choose a smaller file.');
  if (blobUrl) URL.revokeObjectURL(blobUrl);
  blobUrl = URL.createObjectURL(file);
  video.src = blobUrl;
  $('fileName').textContent = file.name;
  $('fileMeta').textContent = `${(file.size / 1048576).toFixed(1)} MB`;
  video.onloadedmetadata = () => {
    $('fileMeta').textContent = `${fmt(video.duration)} · ${video.videoWidth}×${video.videoHeight} · ${(file.size / 1048576).toFixed(1)} MB`;
    video.currentTime = Math.min(1, video.duration / 2);
  };
  zone.hidden = true; ready.hidden = false;
}
zone.addEventListener('click', () => input.click());
$('replace').addEventListener('click', () => input.click());
$('continue').addEventListener('click', () => showToast('Editing is not connected in this prototype.'));
input.addEventListener('change', () => { loadFile(input.files[0]); input.value = ''; });
['dragenter','dragover'].forEach(n => $('new-project').addEventListener(n, e => { e.preventDefault(); zone.classList.add('dragover'); }));
['dragleave','drop'].forEach(n => $('new-project').addEventListener(n, e => { e.preventDefault(); zone.classList.remove('dragover'); }));
$('new-project').addEventListener('drop', e => loadFile(e.dataTransfer.files[0]));

document.querySelectorAll('.dots').forEach(b => b.addEventListener('click', () => showToast('Project actions are a placeholder.')));
$('profileButton').addEventListener('click', () => showToast('Account menu is a placeholder.'));

/* Landing: cursor-follow light, then enter */
landing.addEventListener('pointermove', e => {
  landing.style.setProperty('--mx', e.clientX + 'px'); landing.style.setProperty('--my', e.clientY + 'px');
});
$('getStarted').addEventListener('click', () => {
  landing.classList.add('is-leaving'); app.classList.remove('dash-hidden');
  setTimeout(() => { landing.style.display = 'none'; }, 750);
});
$('backHome').addEventListener('click', () => {
  landing.style.display = 'flex';
  requestAnimationFrame(() => landing.classList.remove('is-leaving'));
  app.classList.add('dash-hidden'); scrollTo({ top: 0 });
});
