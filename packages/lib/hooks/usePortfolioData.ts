import portfolioData from '../../data/portfolio.json';
import { PortfolioItem } from '../../types/portfolio';

export function usePortfolioData(): PortfolioItem[] {
	return portfolioData as PortfolioItem[];
}
