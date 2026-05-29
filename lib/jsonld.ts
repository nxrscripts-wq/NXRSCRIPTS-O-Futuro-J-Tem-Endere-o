import { COMPANY_INFO } from '../constants';

const BASE_URL = COMPANY_INFO.domain;

// Schema 1: Organization — usado em todas as páginas
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: COMPANY_INFO.name,
    url: BASE_URL,
    logo: `${BASE_URL}/nxrscripts-logo.png`,
    description: 'Empresa angolana de tecnologia especializada em cibersegurança, desenvolvimento de software e transformação digital.',
    foundingDate: String(COMPANY_INFO.founded),
    address: {
      '@type': 'PostalAddress',
      streetAddress: COMPANY_INFO.address.street,
      addressLocality: COMPANY_INFO.address.city,
      addressCountry: 'AO',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: COMPANY_INFO.contact.phone,
      contactType: 'customer service',
      availableLanguage: ['Portuguese'],
      email: COMPANY_INFO.contact.email,
    },
    sameAs: Object.values(COMPANY_INFO.social).filter(Boolean) as string[],
  };
}

// Schema 2: LocalBusiness — reforça presença local em Angola
export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService'],
    '@id': `${BASE_URL}/#business`,
    name: COMPANY_INFO.name,
    image: `${BASE_URL}/og-image.png`,
    url: BASE_URL,
    telephone: COMPANY_INFO.contact.phone,
    email: COMPANY_INFO.contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: COMPANY_INFO.address.street,
      addressLocality: COMPANY_INFO.address.city,
      addressRegion: 'Luanda',
      addressCountry: 'AO',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: COMPANY_INFO.geo.latitude,
      longitude: COMPANY_INFO.geo.longitude,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    priceRange: '$$',
    areaServed: { '@type': 'Country', name: 'Angola' },
  };
}

// Schema 3: WebSite — activa Sitelinks Search Box na Home
export function webSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    name: COMPANY_INFO.name,
    url: BASE_URL,
    inLanguage: 'pt-AO',
    publisher: { '@type': 'Organization', '@id': `${BASE_URL}/#organization` },
  };
}

// Schema 4: Service — usado na página Services
export function serviceSchema(name: string, description: string, serviceType: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    serviceType,
    provider: { '@type': 'Organization', '@id': `${BASE_URL}/#organization` },
    areaServed: { '@type': 'Country', name: 'Angola' },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${BASE_URL}/contact`,
    },
  };
}
