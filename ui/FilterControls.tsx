/*  global alert */
import { useState, useEffect, useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { isEmpty } from 'lodash';
import { useCombobox } from 'downshift';

import { FaqTerm } from '#/ui/FaqTerm';

export const FilterControls = ({
  data,
  incomingFilters,
  handleSearch,
  clearSearch,
}) => {
  const [grantee, setGrantee] = useState(incomingFilters.grantee || '');
  const [project, setProject] = useState(incomingFilters.project || '');
  const [category, setCategory] = useState(incomingFilters.category || '');

  const validateFilters = useCallback(
    (filters) => {
      handleSearch(filters);
    },
    [handleSearch],
  );

  useEffect(() => {
    setGrantee(incomingFilters.grantee || '');
    setCategory(incomingFilters.category || '');
    setProject(incomingFilters.project || '');

    if (!isEmpty(incomingFilters)) {
      validateFilters(incomingFilters);
    }
  }, [incomingFilters, validateFilters]);

  function getProjectsFilter(inputValue) {
    const lowerCasedInputValue = inputValue.toLowerCase();

    return function projectsFilter(project) {
      return (
        !inputValue ||
        project.fields.Name.toLowerCase().includes(lowerCasedInputValue)
      );
    };
  }

  const [filteredProjects, setFilteredProjects] = useState(data.projects);
  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
  } = useCombobox({
    onInputValueChange({ inputValue }) {
      setFilteredProjects(data.projects.filter(getProjectsFilter(inputValue)));
      setProject(inputValue);
    },
    items: filteredProjects,
    itemToString(project) {
      return project ? project.fields.Name : '';
    },
  });

  return (
    <div className="card bg-blue p-2 mb-3">
      <div className="row mb-2 text-white d-none d-lg-flex">
        <div className="col-lg-3 mb-2 mb-lg-0 d-flex align-items-center justify-content-start">
          <div>
            <b>
              <FaqTerm
                term="Categories"
                faqs={data.faqs}
                placement="auto"
                showTerm
              />
            </b>
          </div>
        </div>
        <div className="col-lg-2 mb-2 mb-lg-0 d-flex align-items-center justify-content-start">
          <div>
            <b>
              <FaqTerm
                term="Grantees"
                faqs={data.faqs}
                placement="auto"
                showTerm
              />
            </b>
          </div>
        </div>
        <div className="col-lg-3 d-flex align-items-center justify-content-start">
          <div>
            <b>Search projects</b>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-3 mb-2 mb-lg-0">
          <label htmlFor="program-category" className="visually-hidden">
            Program Category
          </label>
          <Select
            inputId="program-category"
            value={
              category &&
              category.map((c) => ({
                value: c,
                label: c,
              }))
            }
            onChange={(selectedOptions) => {
              if (selectedOptions && selectedOptions.length > 0) {
                setCategory(selectedOptions.map((c) => c.label));
              } else {
                setCategory(undefined);
              }
            }}
            options={
              data &&
              data.categories &&
              data.categories.map((c) => ({
                value: c.fields.Name,
                label: c.fields.Name,
              }))
            }
            isMulti={true}
            placeholder="Filter by Category"
          />
        </div>
        <div className="col-lg-2 mb-2 mb-lg-0">
          <label htmlFor="grantee" className="visually-hidden">
            Grantee
          </label>
          <Select
            inputId="grantee"
            value={
              grantee &&
              grantee.map((g) => ({
                value: g,
                label: g,
              }))
            }
            onChange={(selectedOptions) => {
              if (selectedOptions && selectedOptions.length > 0) {
                setGrantee(selectedOptions.map((g) => g.label));
              } else {
                setGrantee(undefined);
              }
            }}
            options={
              data &&
              data.grantees &&
              data.grantees.map((g) => ({
                value: g.fields.Name,
                label: g.fields.Name,
              }))
            }
            isMulti={true}
            placeholder="Filter by Grantee"
            disabled={!data}
          />
        </div>
        <div className="col-lg-3 mb-2 mb-lg-0">
          <div className="d-flex">
            <input
              placeholder="Project Name"
              className="filter-input flex-grow-1"
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  validateFilters({
                    grantee,
                    project,
                    category,
                  });
                }
              }}
              {...getInputProps()}
            />
            <button
              aria-label="toggle menu"
              className="combobox-button"
              type="button"
              {...getToggleButtonProps()}
            >
              <svg
                height="20"
                width="20"
                viewBox="0 0 20 20"
                aria-hidden="true"
                focusable="false"
                className={`combobox-icon ${isOpen && 'open'}`}
              >
                <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
              </svg>
            </button>
          </div>
          <ul
            className={`combobox-menu ${
              !(isOpen && filteredProjects.length) && 'hidden'
            }`}
            {...getMenuProps()}
          >
            {isOpen &&
              filteredProjects.map((item, index) => (
                <li
                  className={`
                    ${highlightedIndex === index && 'bg-blue-300'}
                    ${selectedItem === item && 'font-bold'}
                    py-1 px-2 shadow-sm flex flex-col
                  `}
                  key={item.id}
                  {...getItemProps({ item, index })}
                >
                  <span>{item.fields.Name}</span>
                </li>
              ))}
          </ul>
        </div>
        <div className="col-lg-2 col-6 mb-2 mb-lg-0">
          <div className="d-grid">
            <Button
              variant="secondary"
              onClick={() =>
                validateFilters({
                  grantee,
                  project,
                  category,
                })
              }
              disabled={!data}
            >
              <FontAwesomeIcon icon={faSearch} className="me-2" /> Search
            </Button>
          </div>
        </div>
        <div className="col-lg-2 col-6">
          <div className="d-grid">
            <Button variant="danger" onClick={clearSearch} disabled={!data}>
              Clear
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
