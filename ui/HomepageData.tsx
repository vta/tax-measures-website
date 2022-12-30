'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { isEmpty } from 'lodash';

import { FilterControls } from '#/ui/FilterControls';
import { FilterAlert } from '#/ui/FilterAlert';
import { Loading } from '#/ui/Loading';
import { Results } from '#/ui/Results';
import { CategoryCards } from '#/ui/CategoryCards';
import { HomepageChart } from '#/ui/HomepageChart';
import { IntroSection } from '#/ui/IntroSection';
import { ProjectsMap } from '#/ui/ProjectsMap';
import { ProjectModal } from '#/ui/ProjectModal';
import {
  applyFilters,
  updateUrlWithFilters,
  getFiltersFromQuery,
} from '#/lib/util.js';
import * as gtag from '#/lib/gtag.js';

export const HomePageData = ({ data }) => {
  const [results, setResults] = useState();
  const [loading, setLoading] = useState(false);
  const [incomingFilters, setIncomingFilters] = useState({});
  const [currentFilters, setCurrentFilters] = useState();
  const [projectModalProjects, setProjectModalProjects] = useState();

  const searchParams = useSearchParams();

  const handleSearch = useCallback(
    async (filters) => {
      setLoading(true);
      setResults(
        await applyFilters(
          filters,
          data.awards,
          data.expenditures,
          data.projects,
          data.categories,
          data.grantees
        )
      );
      updateUrlWithFilters(
        filters,
        (projectModalProjects || []).map((p) => p.id)
      );
      setCurrentFilters(filters);
      setLoading(false);
    },
    [
      data.awards,
      data.expenditures,
      data.projects,
      data.categories,
      data.grantees,
      projectModalProjects,
    ]
  );

  const clearSearch = () => {
    setResults();
    setIncomingFilters({});
    setCurrentFilters();
    updateUrlWithFilters();
  };

  useEffect(() => {
    if (!projectModalProjects || projectModalProjects.length === 0) {
      updateUrlWithFilters(currentFilters);
    } else {
      updateUrlWithFilters(
        currentFilters,
        projectModalProjects.map((p) => p.id)
      );
    }
  }, [projectModalProjects, currentFilters]);

  useEffect(() => {
    const filters = getFiltersFromQuery(searchParams);

    if (!isEmpty(filters)) {
      setIncomingFilters(filters);
      handleSearch(filters);
    }
  }, [searchParams, handleSearch]);

  useEffect(() => {
    const modalProjectIds = searchParams.has('project_ids')
      ? searchParams.get('project_ids').split(',')
      : undefined;

    if (modalProjectIds) {
      setProjectModalProjects(
        modalProjectIds.map((projectId) =>
          data.projects.find((p) => p.id === projectId)
        )
      );
    }
  }, [searchParams, data.projects]);

  // Track each filter change as a pageview
  useEffect(() => {
    gtag.pageview(window.location.href);
  }, [currentFilters]);

  return (
    <div className="container-fluid main-container">
      <div className="row pt-3 d-print-none">
        <div className="col">
          <FilterControls
            handleSearch={handleSearch}
            clearSearch={clearSearch}
            data={data}
            incomingFilters={incomingFilters}
          />

          <FilterAlert results={results} currentFilters={currentFilters} />
        </div>
      </div>

      {!results && <IntroSection data={data} />}

      <Loading loading={loading} />

      <Results
        loading={loading}
        results={results}
        data={data}
        setProjectModalProjects={setProjectModalProjects}
      />

      <CategoryCards
        data={data}
        setIncomingFilters={setIncomingFilters}
        handleSearch={handleSearch}
      />

      {!results && !loading && (
        <div className="card mb-3">
          <div className="card-body card-graph">
            <div className="row">
              <div className="col-md-6">
                <HomepageChart data={data} />
              </div>
              <div className="col-md-6">
                {data.geojsons && (
                  <ProjectsMap
                    data={data}
                    projectsToMap={data.projects}
                    setProjectModalProjects={setProjectModalProjects}
                    height="490px"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <ProjectModal
        show={Boolean(projectModalProjects)}
        selectedProjects={projectModalProjects}
        onHide={() => setProjectModalProjects()}
        data={data}
        setProjectModalProjects={setProjectModalProjects}
      />
    </div>
  );
};
