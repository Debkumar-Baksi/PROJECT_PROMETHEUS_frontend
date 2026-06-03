function showDoc(id) {
  document.querySelectorAll('.doc-page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));

  const page = document.getElementById('doc-' + id);
  if (page) page.classList.add('active');

  document.querySelectorAll('.sidebar-link').forEach(link => {
    if (link.getAttribute('onclick')?.includes("'" + id + "'")) {
      link.classList.add('active');
    }
  });

  const docsEl = document.getElementById('docs');
  if (docsEl) {
    const y = docsEl.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Ensure the docs section is visible on load (prevents it remaining hidden
  // if the IntersectionObserver doesn't trigger immediately).
  const docsEl = document.getElementById('docs');
  if (docsEl) docsEl.classList.add('visible');

  window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (nav) {
      nav.style.borderBottomColor = '#e5e5e5';
    }
  });

  const repoList = document.getElementById('repoList');
  if (!repoList) return;

  fetch('data/repositories.json')
    .then(response => response.json())
    .then(repos => {
      repoList.innerHTML = repos.map((repo, index) => `
  <div class="ecosystem-item">
    <span class="eco-index">${String(index + 1).padStart(3, '0')}</span>

    <div>
      <div class="eco-name">
        ${
          repo.github
            ? `<a href="${repo.github}" target="_blank" rel="noopener noreferrer">${repo.name}</a>`
            : repo.name
        }
      </div>

      <div class="eco-desc">${repo.description}</div>
    </div>

    <span class="eco-lang">${repo.language}</span>
    <span class="eco-status ${repo.status.toLowerCase()}">${repo.status}</span>
  </div>
`).join('');
      // repoList.innerHTML = repos.map((repo, index) => `
      //   <div class="ecosystem-item">
      //     <span class="eco-index">${String(index + 1).padStart(3, '0')}</span>
      //     <div>
      //       <div class="eco-name">${repo.name}</div>
      //       <div class="eco-desc">${repo.description}</div>
      //     </div>
      //     <span class="eco-lang">${repo.language}</span>
      //     <span class="eco-status ${repo.status.toLowerCase()}">${repo.status}</span>
      //   </div>
      // `).join('');
    })
    .catch(error => {
      console.error('Failed to load repository data:', error);
      repoList.innerHTML = '<p class="section-body">Unable to load repository data at this time.</p>';
    });
});
