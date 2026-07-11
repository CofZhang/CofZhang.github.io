const root = document.documentElement;
const toggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const year = document.querySelector("#year");
const projectGrid = document.querySelector("#project-grid");
const repoStatus = document.querySelector("#repo-status");

const storedTheme = localStorage.getItem("theme");
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const initialTheme = storedTheme || (systemPrefersDark ? "dark" : "light");

function setTheme(theme) {
  root.dataset.theme = theme;
  themeIcon.textContent = theme === "dark" ? "☀" : "☾";
  localStorage.setItem("theme", theme);
}

setTheme(initialTheme);
year.textContent = new Date().getFullYear();

toggle.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

const repoFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

function fallbackDescription(repo) {
  return repo.description || "GitHub 上的公开项目，可点击进入仓库查看代码、提交记录和最新更新。";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderRepos(repos) {
  const visibleRepos = repos
    .filter((repo) => !repo.fork)
    .slice(0, 6);

  if (!visibleRepos.length) {
    repoStatus.textContent = "暂无可展示的公开仓库，请前往 GitHub 主页查看。";
    return;
  }

  projectGrid.innerHTML = visibleRepos
    .map((repo) => {
      const language = repo.language || "Code";
      const updated = repo.updated_at
        ? repoFormatter.format(new Date(repo.updated_at))
        : "Recently";

      return `
        <article class="project-card">
          <div>
            <p class="project-kicker">${escapeHtml(language)}</p>
            <h3>${escapeHtml(repo.name)}</h3>
            <p>${escapeHtml(fallbackDescription(repo))}</p>
            <div class="repo-meta" aria-label="Repository metadata">
              <span>${escapeHtml(repo.stargazers_count)} stars</span>
              <span>Updated ${escapeHtml(updated)}</span>
            </div>
          </div>
          <a href="${escapeHtml(repo.html_url)}">打开仓库</a>
        </article>
      `;
    })
    .join("");

  repoStatus.textContent = `已展示 ${visibleRepos.length} 个最近更新的公开仓库。`;
}

async function loadRepos() {
  try {
    const response = await fetch(
      "https://api.github.com/users/CofZhang/repos?sort=updated&per_page=8",
      {
        headers: {
          Accept: "application/vnd.github+json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`);
    }

    const repos = await response.json();
    renderRepos(repos);
  } catch (error) {
    repoStatus.textContent =
      "暂时无法自动加载 GitHub 项目，已显示默认项目入口。";
  }
}

loadRepos();
