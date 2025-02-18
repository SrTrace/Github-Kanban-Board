import { useSelector } from "react-redux";
import { generateBreadcrumb } from "../utils/utils";
import { RepoState } from "../types";

const Breadcrumbs = ({ stars }: { stars: number | null }) => {
  const baseUrl = "https://github.com/";
  const currentRepoName = useSelector(
    (state: { repo: RepoState }) => state.repo.currentRepo
  );
  const url = baseUrl + currentRepoName;
  const repoLink = url + "/issues";
  const breadcrumb = generateBreadcrumb(url);
  const formatedStarsCount = stars ? Math.floor(stars / 1000) : null;

  return (
    <section id="repo-info" className="p-2 d-flex gap-3">
      <a href={repoLink} target="_blank" className="text-decoration-none">
        {breadcrumb}
      </a>
      <div>
        {formatedStarsCount ? (
          <>
            <span className="star-icon">🌟</span> {formatedStarsCount}K stars
          </>
        ) : (
          ""
        )}
      </div>
    </section>
  );
};
export default Breadcrumbs;
