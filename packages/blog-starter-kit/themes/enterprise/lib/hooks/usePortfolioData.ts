import { PortfolioItem } from '../../types/portfolio';
import portfolioData from '../../data/portfolio.json';

export function usePortfolioData(): PortfolioItem[] {
  return portfolioData as PortfolioItem[];
} 