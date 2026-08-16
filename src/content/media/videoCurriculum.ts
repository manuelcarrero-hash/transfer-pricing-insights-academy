export type VideoCategory = 'welcome' | 'oecd' | 'fine-point' | 'case';

export type VideoCurriculumEntry = {
  id: string;
  category: VideoCategory;
  title: string;
  description: string;
  href?: string;
  primaryDestination: string;
  relatedDestinations?: string[];
  tags: string[];
  status: 'active' | 'link-pending';
};

export const videoCurriculum: VideoCurriculumEntry[] = [
  {
    id: 'welcome-academy',
    category: 'welcome',
    title: 'Bienvenido a Transfer Pricing Insights Academy',
    description: 'Introducción a la plataforma, su propósito y la forma recomendada de recorrer la ruta de aprendizaje.',
    href: 'https://drive.google.com/file/d/1yJEKxVnUAz2VdrCXIPhhNwZ70E0Pb-YB/view?usp=sharing',
    primaryDestination: 'Home',
    tags: ['onboarding', 'academy'],
    status: 'active',
  },
  {
    id: 'oecd-chapter-1', category: 'oecd', title: 'Directrices OCDE 2022 · Capítulo I — Plena Competencia',
    description: 'Video doctrinal sobre el principio de plena competencia, delimitación precisa y características económicamente relevantes.',
    href: 'https://drive.google.com/file/d/1njZMfDau0hSQAzE8Uq8yLVmkJpwjXvhD/view', primaryDestination: 'J2', relatedDestinations: ['J1', 'C1', 'S1'], tags: ['plena competencia', 'delimitación precisa', 'OCDE'], status: 'active',
  },
  {
    id: 'oecd-chapter-2', category: 'oecd', title: 'Directrices OCDE 2022 · Capítulo II — Métodos de Precios de Transferencia',
    description: 'Video doctrinal sobre los métodos de precios de transferencia y su aplicación.',
    href: 'https://drive.google.com/file/d/1wNKVhGDlulN2oMAsYXqoIOLTO6Nja1wN/view', primaryDestination: 'J4', relatedDestinations: ['C2', 'C3'], tags: ['métodos', 'OCDE'], status: 'active',
  },
  {
    id: 'oecd-chapter-3', category: 'oecd', title: 'Directrices OCDE 2022 · Capítulo III — Análisis de Comparabilidad',
    description: 'Video doctrinal sobre el proceso y los factores del análisis de comparabilidad.',
    href: 'https://drive.google.com/file/d/1MsuVCNa51IAuUm68TcrUQl_r7p0NBR6-/view', primaryDestination: 'J5', relatedDestinations: ['C4', 'C5', 'C6'], tags: ['comparabilidad', 'ajustes de comparabilidad', 'OCDE'], status: 'active',
  },
  {
    id: 'oecd-chapter-4', category: 'oecd', title: 'Directrices OCDE 2022 · Capítulo IV — Procedimientos administrativos',
    description: 'Video doctrinal sobre procedimientos administrativos para evitar y resolver controversias.',
    href: 'https://drive.google.com/file/d/1i3loUQIS1XQhyEG8sLUpdhWMak-HQiNr/view', primaryDestination: 'SS8', tags: ['controversias', 'OCDE'], status: 'active',
  },
  {
    id: 'oecd-chapter-5', category: 'oecd', title: 'Directrices OCDE 2022 · Capítulo V — Documentación',
    description: 'Video doctrinal sobre los niveles y principios de documentación de precios de transferencia.',
    href: 'https://drive.google.com/file/d/1GVJqK7w9P0NKM0srWOzOGJelnvEwxbPU/view', primaryDestination: 'C7', tags: ['documentación', 'OCDE'], status: 'active',
  },
  {
    id: 'oecd-chapter-6', category: 'oecd', title: 'Directrices OCDE 2022 · Capítulo VI — Intangibles y DEMPE',
    description: 'Video doctrinal sobre intangibles y funciones DEMPE.',
    href: 'https://drive.google.com/file/d/1XCZ66ZVKEgytO3TgHMbuTgxqCQaKm7tQ/view', primaryDestination: 'SS2', relatedDestinations: ['SS3'], tags: ['intangibles', 'DEMPE', 'OCDE'], status: 'active',
  },
  {
    id: 'oecd-chapter-7', category: 'oecd', title: 'Directrices OCDE 2022 · Capítulo VII — Servicios Intragrupo',
    description: 'Video doctrinal sobre servicios intragrupo.',
    href: 'https://drive.google.com/file/d/1m5HvnP1GulT2f4PJCic8mKSZeRPWEO3C/view', primaryDestination: 'SS1', tags: ['servicios intragrupo', 'OCDE'], status: 'active',
  },
  {
    id: 'oecd-chapter-8', category: 'oecd', title: 'Directrices OCDE 2022 · Capítulo VIII — Acuerdos de Reparto de Costos',
    description: 'Video doctrinal sobre acuerdos de reparto de costos.',
    href: 'https://drive.google.com/file/d/1jCHoH83WetpVqsrCYsBXD0xyWIeUAUcw/view', primaryDestination: 'SS7', tags: ['CCA', 'reparto de costos', 'OCDE'], status: 'active',
  },
  {
    id: 'oecd-chapter-9', category: 'oecd', title: 'Directrices OCDE 2022 · Capítulo IX — Reestructuras Empresariales',
    description: 'Video doctrinal sobre reestructuraciones empresariales.',
    href: 'https://drive.google.com/file/d/1xPt5Iqhpi3xDWtoiFMonEk2RWh8eDfHO/view', primaryDestination: 'SS6', tags: ['reestructuraciones', 'OCDE'], status: 'active',
  },
  {
    id: 'oecd-chapter-10', category: 'oecd', title: 'Directrices OCDE 2022 · Capítulo X — Transacciones Financieras',
    description: 'Video doctrinal sobre operaciones financieras intragrupo.',
    href: 'https://drive.google.com/file/d/11uAX8AOaMjQJeJwclSx7nugQ8CAjif9B/view', primaryDestination: 'SS4', relatedDestinations: ['SS5'], tags: ['financieras', 'OCDE'], status: 'active',
  },
];

export function getActiveVideosFor(destination: string) {
  return videoCurriculum.filter((video) =>
    video.status === 'active' &&
    (video.primaryDestination === destination || video.relatedDestinations?.includes(destination))
  );
}

export function getAllActiveVideos() {
  return videoCurriculum.filter((video) => video.status === 'active');
}
