import {
  SiAmazonaws,
  SiJest,
  SiNestjs,
  SiNextdotjs,
  SiTypescript,
} from 'react-icons/si'
import { TiGroup } from 'react-icons/ti'

export interface IconProps {
  width?: number
  height?: number
}

export const ICONS = {
  nestjs: {
    icon: <SiNestjs />,
    name: 'NestJS',
    link: 'https://nestjs.com/',
  },
  typescript: {
    icon: <SiTypescript />,
    name: 'TypeScript',
    link: 'https://www.typescriptlang.org/',
  },
  aws: {
    icon: <SiAmazonaws />,
    name: 'AWS',
    link: 'https://aws.amazon.com/es/',
  },
  nextjs: {
    icon: <SiNextdotjs />,
    name: 'NextJS',
    link: 'https://nextjs.org/',
  },
  leaderShip: {
    icon: <TiGroup />,
    name: 'Liderazgo',
    link: 'https://www.youtube.com/watch?v=md-42DDH2JY',
  },
  jest: {
    icon: <SiJest />,
    name: 'Jest',
    link: 'https://jestjs.io/',
  },
}
