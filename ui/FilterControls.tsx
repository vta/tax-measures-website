/*  global alert */
import { useState, useEffect, useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { capitalize, isEmpty } from 'lodash';

import { FaqTerm } from '#/ui/FaqTerm';

export const FilterControls = ({
  data,
  incomingFilters,
  handleSearch,
  clearSearch,
}) => {
  const [transactionType, setTransactionType] = useState(
    incomingFilters.transactionType || 'award',
  );
  const [grantee, setGrantee] = useState(incomingFilters.grantee || '');
  const [project, setProject] = useState(incomingFilters.project || '');
  const [category, setCategory] = useState(incomingFilters.category || '');

  const validateFilters = useCallback(
    (filters) => {
      if (!filters.transactionType) {
        /*  eslint-disable-next-line no-alert */
        return alert('You must specify a transaction type');
      }

      handleSearch(filters);
    },
    [handleSearch],
  );

  useEffect(() => {
    setTransactionType(incomingFilters.transactionType || 'award');
    setGrantee(incomingFilters.grantee || '');
    setCategory(incomingFilters.category || '');
    setProject(incomingFilters.project || '');

    if (!isEmpty(incomingFilters)) {
      validateFilters(incomingFilters);
    }
  }, [incomingFilters, validateFilters]);

  return (
    <div className="card bg-blue p-2 mb-3">
      <div className="row mb-2 text-white">
        <div className="col-lg-2 mb-2 mb-lg-0 d-flex align-items-center justify-content-start">
          <div className="number-list">1</div>
          <div>
            <b>Transaction Type</b>
          </div>
        </div>
        <div className="col-lg-4 mb-2 mb-lg-0 d-flex align-items-center justify-content-start">
          <div className="number-list">2</div>
          <div>
            <b>
              <FaqTerm
                id="1293896"
                term="Program Categories"
                faqs={data.faqs}
                placement="auto"
                showTerm
              />{' '}
              or{' '}
              <FaqTerm
                id="1293956"
                term="Grantees"
                faqs={data.faqs}
                placement="auto"
                showTerm
              />
            </b>{' '}
            (optional)
          </div>
        </div>
        <div className="col-lg-3 d-flex align-items-center justify-content-start">
          <div className="number-list">3</div>
          <div>
            <b>Search and select projects</b> (optional)
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-2 mb-2 mb-lg-0">
          <label htmlFor="transaction-type" className="sr-only">
            Transaction Type
          </label>
          <Select
            inputId="transaction-type"
            value={
              transactionType && [
                {
                  value: transactionType,
                  label: capitalize(transactionType),
                },
              ]
            }
            onChange={(selectedOption) =>
              setTransactionType(selectedOption.value)
            }
            options={[
              {
                label: 'Expenditure',
                value: 'expenditure',
              },
              {
                label: 'Award',
                value: 'award',
              },
            ]}
            placeholder="Select Transaction Type"
          />
        </div>
        <div className="col-lg-2 mb-2 mb-lg-0">
          <label htmlFor="program-category" className="sr-only">
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
          <label htmlFor="grantee" className="sr-only">
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
        <div className="col-lg-2 mb-2 mb-lg-0">
          <Form.Control
            type="text"
            onChange={(event) => setProject(event.target.value)}
            placeholder="Project Name"
            value={project}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                validateFilters({
                  transactionType,
                  grantee,
                  project,
                  category,
                });
              }
            }}
          />
        </div>
        <div className="col-lg-2 col-6 mb-2 mb-lg-0">
          <div className="d-grid">
            <Button
              variant="secondary"
              onClick={() =>
                validateFilters({
                  transactionType,
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
