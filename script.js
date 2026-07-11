const yearNode = document.querySelector("#year");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector("#site-nav");
const repoGrid = document.querySelector("#project-grid");
const repoStatus = document.querySelector("#repo-status");
const repoCount = document.querySelector("#repo-count");
const followerCount = document.querySelector("#follower-count");
const profileUpdated = document.querySelector("#profile-updated");

yearNode.textContent = new Date().getFullYear();

navToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

siteNav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    siteNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatNumber(value) {
  return new Intl.NumberFormat("en", { notation: "compact" }).format(value);
}

function renderProfile(profile) {
  repoCount.textContent = formatNumber(profile.public_repos ?? 0);
  followerCount.textContent = formatNumber(profile.followers ?? 0);
  profileUpdated.textContent = profile.updated_at
    ? dateFormatter.format(new Date(profile.updated_at))
    : "Live";
}

function fallbackDescription(repo) {
  return repo.description || "公开项目仓库，可进入 GitHub 查看代码、提交记录和最新进展。";
}

function renderRepos(repos) {
  const visibleRepos = repos.filter((repo) => !repo.fork).slice(0, 5);

  if (!visibleRepos.length) {
    repoStatus.textContent = "暂时没有可自动展示的公开仓库，已保留 GitHub 主页入口。";
    return;
  }

  repoGrid.innerHTML = visibleRepos
    .map((repo, index) => {
      const language = repo.language || "Repository";
      const updated = repo.updated_at ? dateFormatter.format(new Date(repo.updated_at)) : "Recently";
      const featuredClass = index === 0 ? " project-card-featured" : "";

      return `
        <article class="project-card${featuredClass}">
          <div>
            <p class="project-kicker">${escapeHtml(language)}</p>
            <h3>${escapeHtml(repo.name)}</h3>
            <p>${escapeHtml(fallbackDescription(repo))}</p>
            <div class="repo-meta">
              <span>${escapeHtml(repo.stargazers_count)} stars</span>
              <span>${escapeHtml(updated)}</span>
            </div>
          </div>
          <a href="${escapeHtml(repo.html_url)}">打开仓库</a>
        </article>
      `;
    })
    .join("");

  repoStatus.textContent = `已同步 ${visibleRepos.length} 个最近更新的公开仓库。`;
}

async function loadGitHubData() {
  try {
    const [profileResponse, repoResponse] = await Promise.all([
      fetch("https://api.github.com/users/CofZhang", {
        headers: { Accept: "application/vnd.github+json" },
      }),
      fetch("https://api.github.com/users/CofZhang/repos?sort=updated&per_page=8", {
        headers: { Accept: "application/vnd.github+json" },
      }),
    ]);

    if (!profileResponse.ok || !repoResponse.ok) {
      throw new Error("GitHub API unavailable");
    }

    const [profile, repos] = await Promise.all([
      profileResponse.json(),
      repoResponse.json(),
    ]);

    renderProfile(profile);
    renderRepos(repos);
  } catch (error) {
    repoCount.textContent = "GitHub";
    followerCount.textContent = "Live";
    profileUpdated.textContent = "Pages";
    repoStatus.textContent = "GitHub API 暂时不可用，已显示默认项目入口。";
  }
}

loadGitHubData();
