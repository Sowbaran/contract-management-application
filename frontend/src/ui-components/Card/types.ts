import { VariantProps } from 'class-variance-authority';
import { ReactNode } from 'react';
import { CardVariants } from './styles';

export interface CardProps extends React.BaseHTMLAttributes<HTMLDivElement> , VariantProps<typeof CardVariants> {
  headerContent? : ReactNode;
  mainContent : ReactNode;
  footerContent? : ReactNode;
  headerMainContainerStyle? : string;
}