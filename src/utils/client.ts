export const fetchRepoData = async (repoUrl: string) => {
  const repoPath = repoUrl.replace("https://github.com/", "").trim();
  if (!repoPath.includes("/")) {
    throw new Error("Invalid repository URL format");
  }

  const [owner, repo] = repoPath.split("/");

  const [starsRes, issuesRes] = await Promise.all([
    fetch(`https://api.github.com/repos/${owner}/${repo}`),
    fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=10`
    ),
  ]);

  if (!starsRes.ok || !issuesRes.ok) {
    throw new Error("Failed to fetch repository data");
  }

  const starsData = await starsRes.json();
  const issuesData = await issuesRes.json();

  return {
    repoName: `${owner}/${repo}`,
    stars: starsData.stargazers_count || 0,
    issues: issuesData,
  };
};
