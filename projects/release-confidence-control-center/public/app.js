const summary = document.querySelector('#summary');
const releases = document.querySelector('#releases');
const updated = document.querySelector('#updated');

const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));

function renderSummary(items) {
  const pass = items.filter(item => item.decision === 'PASS').length;
  const hold = items.length - pass;
  const average = items.length ? items.reduce((sum, item) => sum + item.scorePercent, 0) / items.length : 0;
  summary.innerHTML = [
    ['Candidates', items.length, 'Total under review'],
    ['Ready', pass, 'Evidence meets policy'],
    ['On hold', hold, 'Action required'],
    ['Average score', `${average.toFixed(1)}%`, 'Weighted evidence index']
  ].map(([label, value, caption]) => `<article class="metric"><span>${label}</span><strong>${value}</strong><small>${caption}</small></article>`).join('');
}

function renderReleases(items) {
  releases.innerHTML = items.map(item => `<article class="release-card ${item.decision.toLowerCase()}">
    <div class="card-top"><div><span class="release-id">${escapeHtml(item.releaseId)}</span><h3>${escapeHtml(item.name)}</h3></div><span class="decision">${item.decision}</span></div>
    <div class="score-row"><strong>${item.scorePercent}%</strong><span>weighted evidence score</span></div>
    <div class="bar"><i style="width:${item.scorePercent}%"></i></div>
    <ul>${item.checks.map(check => `<li><span class="dot ${check.status}"></span><span>${escapeHtml(check.name)}</span><em>${escapeHtml(check.status)}</em></li>`).join('')}</ul>
    <p class="recommendation">${escapeHtml(item.recommendation)}</p>
  </article>`).join('');
}

async function load() {
  const response = await fetch('/api/releases');
  const payload = await response.json();
  renderSummary(payload.releases);
  renderReleases(payload.releases);
  updated.textContent = `Updated ${new Date().toLocaleTimeString()}`;
}

load().catch(error => {
  releases.innerHTML = `<p class="error">Unable to load release evidence: ${escapeHtml(error.message)}</p>`;
});
