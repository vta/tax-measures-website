import Image from 'next/image';

import { categoryCards } from '#/lib/category-cards.js';
import { getDocumentById } from '#/lib/util.js';

export const CategoryCards = ({ data, setIncomingFilters, handleSearch }) => {
  // Merge category cards and categories
  for (const categoryCard of categoryCards) {
    const category = data.categories.find(
      (c) => c.fields.Name === categoryCard.key,
    );
    categoryCard.description = category && category.fields.Description;
    categoryCard.description2 = category && category.fields['Description 2'];
    categoryCard.documents =
      category &&
      category.fields.Documents &&
      category.fields.Documents.map((id) =>
        getDocumentById(id, data.documents),
      );
    categoryCard.parentCategory =
      category && category.fields['Parent Category'];
  }

  return (
    <div className="row justify-content-center d-print-none">
      {categoryCards
        .filter((card) => !card.parentCategory)
        .map(({ key, image }) => (
          <div className="col-lg-5col col-md-4 col-xs-6 mb-3" key={key}>
            <a
              className="card h-100"
              title={`Show all ${key} projects`}
              href="#"
              onClick={(event) => {
                event.preventDefault();

                const categoryFilters = {
                  category: [key],
                };

                setIncomingFilters(categoryFilters);
                handleSearch(categoryFilters);
                window.scrollTo(0, 0);
              }}
            >
              <div className="card-body d-flex flex-column justify-content-between">
                <h2 className="text-center">{key}</h2>
                <Image
                  src={`/images/programs/${image}`}
                  alt=""
                  width="300"
                  height="300"
                  sizes="100vw"
                  style={{
                    width: '100%',
                    height: 'auto',
                  }}
                />
              </div>
            </a>
          </div>
        ))}
    </div>
  );
};
