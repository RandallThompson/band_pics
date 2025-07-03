import { render, screen } from '@testing-library/react';
import Gallery from '@/components/Gallery';

const mockImages = [
  {
    id: 1,
    src: 'https://via.placeholder.com/300x200?text=Rock+Band+1',
    alt: 'rock band 1',
    caption: 'Rock Band 1'
  },
  {
    id: 2,
    src: 'https://via.placeholder.com/300x200?text=Rock+Band+2',
    alt: 'rock band 2',
    caption: 'Rock Band 2'
  }
];

describe('Gallery Component', () => {
  it('renders gallery with title and images', () => {
    render(<Gallery title="Rock Bands" id="rock" images={mockImages} />);
    
    expect(screen.getByText('Rock Bands')).toBeInTheDocument();
    expect(screen.getByText('Rock Band 1')).toBeInTheDocument();
    expect(screen.getByText('Rock Band 2')).toBeInTheDocument();
  });

  it('shows placeholder message when no images', () => {
    render(<Gallery title="Rock Bands" id="rock" images={[]} />);
    
    expect(screen.getByText(/No images yet/)).toBeInTheDocument();
    expect(screen.getByText(/Add your rock bands pictures to the \/rock directory/)).toBeInTheDocument();
  });

  it('filters images based on search term', () => {
    render(<Gallery title="Rock Bands" id="rock" images={mockImages} searchTerm="band 1" />);
    
    expect(screen.getByText('Rock Band 1')).toBeInTheDocument();
    expect(screen.queryByText('Rock Band 2')).not.toBeInTheDocument();
  });

  it('shows no results message when search term matches no images', () => {
    render(<Gallery title="Rock Bands" id="rock" images={mockImages} searchTerm="jazz" />);
    
    expect(screen.getByText('No results found for: jazz')).toBeInTheDocument();
    expect(screen.queryByText('Rock Band 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Rock Band 2')).not.toBeInTheDocument();
  });

  it('renders images with correct alt text and captions', () => {
    render(<Gallery title="Rock Bands" id="rock" images={mockImages} />);
    
    const image1 = screen.getByAltText('rock band 1');
    const image2 = screen.getByAltText('rock band 2');
    
    expect(image1).toBeInTheDocument();
    expect(image2).toBeInTheDocument();
  });
});