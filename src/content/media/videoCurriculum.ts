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
  ...Array.from({ length: 10 }, (_, index) => {
    const chapter = index + 1;
    const destinations = ['J2', 'J4', 'Comparabilidad', 'SS8', 'Documentación', 'SS2', 'Servicios intragrupo', 'Semi Senior', 'SS6', 'Operaciones financieras'];
    const tags = ['plena competencia', 'métodos', 'comparabilidad', 'controversias', 'documentación', 'intangibles', 'servicios', 'CCA', 'reestructuraciones', 'financieras'];
    return {
      id: `oecd-chapter-${chapter}`,
      category: 'oecd' as const,
      title: `Directrices OCDE 2022 · Capítulo ${chapter}`,
      description: 'Video doctrinal complementario asociado al capítulo correspondiente de las Directrices de la OCDE.',
      primaryDestination: destinations[index],
      tags: [tags[index], 'OCDE'],
      status: 'link-pending' as const,
    };
  }),
];

export function getActiveVideosFor(destination: string) {
  return videoCurriculum.filter((video) =>
    video.status === 'active' &&
    (video.primaryDestination === destination || video.relatedDestinations?.includes(destination))
  );
}
