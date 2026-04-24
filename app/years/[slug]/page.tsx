import type { Metadata } from 'next';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import { Footer } from '#/ui/Footer';
import { Header } from '#/ui/Header';
import { YearProjectsTable } from '#/ui/YearProjectsTable';
import FiscalYearSelector from '#/ui/FiscalYearSelect';

import { getCurrentFiscalYear } from '#/lib/util';
import { fetchData } from '#/lib/api.js';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ slug: string }>;
};

const siteUrl = 'https://2016measureb.vta.org';
const defaultSocialImage = `${siteUrl}/meta/measureb-logo-square.png`;

const slugIsValid = (slug: string) => {
  return (
    !isNaN(Number(slug)) &&
    Number(slug) >= 2018 &&
    Number(slug) <= getCurrentFiscalYear()
  );
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  if (!slugIsValid(slug)) {
    return {
      title: 'Invalid Fiscal Year',
      description: 'The requested fiscal year is invalid.',
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `Audited Expenditures for Fiscal Year ${slug} | 2016 Measure B`,
    description: `See all audited expenditures for fiscal year ${slug} for 2016 Measure B projects.`,
    alternates: {
      canonical: `/years/${slug}`,
    },
    openGraph: {
      title: `Audited Expenditures for Fiscal Year  ${slug} | 2016 Measure B`,
      description: `See all audited expenditures for fiscal year ${slug} for 2016 Measure B projects.`,
      url: `${siteUrl}/years/${slug}`,
      siteName: '2016 Measure B',
      images: [
        {
          url: defaultSocialImage,
          width: 1200,
          height: 1200,
          alt: '2016 Measure B',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Audited Expenditures for Fiscal Year ${slug} | 2016 Measure B`,
      description: `See all audited expenditures for fiscal year ${slug} for 2016 Measure B projects.`,
      creator: '@VTA',
      site: '@VTA',
      images: [defaultSocialImage],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;

  if (!slugIsValid(slug)) {
    return notFound();
  }

  const { awards, auditedExpenditures, projects, faqs } = await fetchData();
  const auditedExpendituresForYear = auditedExpenditures.filter(
    (expenditure) => {
      return (
        expenditure.fields['Audited Fiscal Year'] === slug &&
        expenditure.fields.Amount > 0
      );
    },
  );

  const awardIdsForYear = new Set();
  for (const auditedExpenditure of auditedExpendituresForYear) {
    for (const awardId of auditedExpenditure.fields.Award ?? []) {
      awardIdsForYear.add(awardId);
    }
  }

  const awardsForYear = awards.filter((award) => {
    return awardIdsForYear.has(award.id);
  });

  const projectIdsForYear = new Set();
  for (const award of awardsForYear) {
    for (const projectId of award.fields.Project) {
      projectIdsForYear.add(projectId);
    }
  }

  const projectsForYear = projects.filter((project) => {
    return projectIdsForYear.has(project.id);
  });

  const tableData = projectsForYear.map((project) => {
    const projectAuditedExpenditureIds = new Set();

    for (const awardId of project.fields.Awards) {
      const award = awards.find((award) => award.id === awardId);
      if (award && award.fields['Audited Expenditures']) {
        for (const auditedExpenditureId of award.fields[
          'Audited Expenditures'
        ] ?? []) {
          const auditedExpenditure = auditedExpendituresForYear.find(
            (auditedExpenditure) =>
              auditedExpenditure.id === auditedExpenditureId,
          );
          if (auditedExpenditure) {
            projectAuditedExpenditureIds.add(auditedExpenditureId);
          }
        }
      }
    }

    // Each audited expenditure is counted only once for a project
    const totalAuditedExpenditureAmountForYear = [
      ...projectAuditedExpenditureIds,
    ].reduce((memo, auditedExpenditureId) => {
      const auditedExpenditure = auditedExpendituresForYear.find(
        (auditedExpenditure) => auditedExpenditure.id === auditedExpenditureId,
      );
      if (auditedExpenditure) {
        return memo + auditedExpenditure.fields.Amount;
      }
      return memo;
    }, 0);

    return {
      name: project.fields.Name,
      grantee: project.fields['Grantee Name'],
      category: project.fields.CategoryName,
      url: project.fields.URL,
      totalAuditedExpenditureAmountForYear:
        totalAuditedExpenditureAmountForYear,
    };
  });

  return (
    <div>
      <Header />

      <div className="container" style={{ maxWidth: '1140px' }}>
        <div className="mt-4">
          <FiscalYearSelector selectedFiscalYear={slug} />
        </div>

        <div className="card my-4">
          <div className="card-body">
            <h1>Audited Expenditures for Fiscal Year {slug}</h1>
            <YearProjectsTable
              year={slug}
              tableData={tableData}
              faqs={faqs}
              showButtons={true}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
