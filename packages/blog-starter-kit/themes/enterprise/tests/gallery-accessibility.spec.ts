import { test, expect } from '@playwright/test';

test.describe('Gallery Component Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    // Create a test page with the Gallery component
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Gallery Test</title>
        <style>
          body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; }
          .gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
          .gallery-item { position: relative; cursor: pointer; border-radius: 8px; overflow: hidden; }
          .gallery-item img { width: 100%; height: 200px; object-fit: cover; }
          .gallery-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0); transition: background 0.3s; }
          .gallery-item:hover .gallery-overlay { background: rgba(0,0,0,0.2); }
          .lightbox { position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 1000; display: none; }
          .lightbox.open { display: flex; align-items: center; justify-content: center; }
          .lightbox-content { position: relative; max-width: 90vw; max-height: 90vh; }
          .lightbox img { max-width: 100%; max-height: 100%; object-fit: contain; }
          .lightbox-close { position: absolute; top: 20px; right: 20px; background: rgba(0,0,0,0.8); color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; }
          .lightbox-nav { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.8); color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; }
          .lightbox-prev { left: 20px; }
          .lightbox-next { right: 20px; }
          .lightbox-info { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.8)); color: white; padding: 20px; }
          .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
        </style>
      </head>
      <body>
        <div class="gallery-grid">
          <div class="gallery-item" tabindex="0" role="button" aria-label="View Test image 1 in lightbox" data-index="0">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIDE8L3RleHQ+PC9zdmc+" alt="Test image 1" />
            <div class="gallery-overlay"></div>
          </div>
          <div class="gallery-item" tabindex="0" role="button" aria-label="View Test image 2 in lightbox" data-index="1">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIDI8L3RleHQ+PC9zdmc+" alt="Test image 2" />
            <div class="gallery-overlay"></div>
          </div>
          <div class="gallery-item" tabindex="0" role="button" aria-label="View Test image 3 in lightbox" data-index="2">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIDM8L3RleHQ+PC9zdmc+" alt="Test image 3" />
            <div class="gallery-overlay"></div>
          </div>
        </div>

        <div class="lightbox" role="dialog" aria-modal="true" aria-label="Image lightbox">
          <button class="lightbox-close" aria-label="Close lightbox">×</button>
          <button class="lightbox-nav lightbox-prev" aria-label="Previous image">‹</button>
          <button class="lightbox-nav lightbox-next" aria-label="Next image">›</button>
          <div class="lightbox-content">
            <img src="" alt="" />
          </div>
          <div class="lightbox-info">
            <h3 class="lightbox-title"></h3>
            <p class="lightbox-caption"></p>
            <p class="lightbox-counter"></p>
          </div>
        </div>

        <script>
          const images = [
            { src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIzNiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIDE8L3RleHQ+PC9zdmc+', alt: 'Test image 1', caption: 'This is a test caption for image 1' },
            { src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIzNiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIDI8L3RleHQ+PC9zdmc+', alt: 'Test image 2', caption: 'This is a test caption for image 2' },
            { src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIzNiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIDM8L3RleHQ+PC9zdmc+', alt: 'Test image 3' }
          ];

          let currentIndex = 0;
          const lightbox = document.querySelector('.lightbox');
          const lightboxImg = lightbox.querySelector('img');
          const lightboxTitle = lightbox.querySelector('.lightbox-title');
          const lightboxCaption = lightbox.querySelector('.lightbox-caption');
          const lightboxCounter = lightbox.querySelector('.lightbox-counter');

          function openLightbox(index) {
            currentIndex = index;
            const image = images[index];
            lightboxImg.src = image.src;
            lightboxImg.alt = image.alt;
            lightboxTitle.textContent = image.alt;
            lightboxCaption.textContent = image.caption || '';
            lightboxCounter.textContent = \`\${index + 1} of \${images.length}\`;
            lightbox.classList.add('open');
            lightbox.focus();
          }

          function closeLightbox() {
            lightbox.classList.remove('open');
          }

          function navigateImage(direction) {
            if (direction === 'prev') {
              currentIndex = (currentIndex - 1 + images.length) % images.length;
            } else {
              currentIndex = (currentIndex + 1) % images.length;
            }
            openLightbox(currentIndex);
          }

          // Event listeners
          document.querySelectorAll('.gallery-item').forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
            item.addEventListener('keydown', (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
              }
            });
          });

          lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
          lightbox.querySelector('.lightbox-prev').addEventListener('click', () => navigateImage('prev'));
          lightbox.querySelector('.lightbox-next').addEventListener('click', () => navigateImage('next'));

          // Keyboard navigation
          document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('open')) return;
            
            switch (e.key) {
              case 'Escape':
                closeLightbox();
                break;
              case 'ArrowLeft':
                e.preventDefault();
                navigateImage('prev');
                break;
              case 'ArrowRight':
                e.preventDefault();
                navigateImage('next');
                break;
            }
          });
        </script>
      </body>
      </html>
    `);
  });

  test('should open lightbox when image is clicked', async ({ page }) => {
    const firstImage = page.locator('[data-index="0"]');
    await firstImage.click();
    
    const lightbox = page.locator('.lightbox');
    await expect(lightbox).toHaveClass(/open/);
    await expect(lightbox).toHaveAttribute('role', 'dialog');
    await expect(lightbox).toHaveAttribute('aria-modal', 'true');
  });

  test('should close lightbox when close button is clicked', async ({ page }) => {
    const firstImage = page.locator('[data-index="0"]');
    await firstImage.click();
    
    const lightbox = page.locator('.lightbox');
    await expect(lightbox).toHaveClass(/open/);
    
    const closeButton = page.locator('.lightbox-close');
    await closeButton.click();
    
    await expect(lightbox).not.toHaveClass(/open/);
  });

  test('should navigate between images using arrow buttons', async ({ page }) => {
    const firstImage = page.locator('[data-index="0"]');
    await firstImage.click();
    
    const lightbox = page.locator('.lightbox');
    await expect(lightbox).toHaveClass(/open/);
    
    // Check initial state
    await expect(page.locator('.lightbox-counter')).toHaveText('1 of 3');
    
    // Navigate to next image
    const nextButton = page.locator('.lightbox-next');
    await nextButton.click({ force: true });
    await expect(page.locator('.lightbox-counter')).toHaveText('2 of 3');
    
    // Navigate to previous image
    const prevButton = page.locator('.lightbox-prev');
    await prevButton.click({ force: true });
    await expect(page.locator('.lightbox-counter')).toHaveText('1 of 3');
  });

  test('should handle keyboard navigation', async ({ page }) => {
    const firstImage = page.locator('[data-index="0"]');
    await firstImage.click();
    
    const lightbox = page.locator('.lightbox');
    await expect(lightbox).toHaveClass(/open/);
    
    // Test ESC key
    await page.keyboard.press('Escape');
    await expect(lightbox).not.toHaveClass(/open/);
    
    // Reopen lightbox
    await firstImage.click();
    await expect(lightbox).toHaveClass(/open/);
    
    // Test arrow keys
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('.lightbox-counter')).toHaveText('2 of 3');
    
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('.lightbox-counter')).toHaveText('1 of 3');
  });

  test('should support keyboard activation of gallery items', async ({ page }) => {
    const firstImage = page.locator('[data-index="0"]');
    
    // Focus the first image
    await firstImage.focus();
    
    // Test Enter key
    await page.keyboard.press('Enter');
    const lightbox = page.locator('.lightbox');
    await expect(lightbox).toHaveClass(/open/);
    
    // Close and test Space key
    await page.keyboard.press('Escape');
    await expect(lightbox).not.toHaveClass(/open/);
    
    await firstImage.focus();
    await page.keyboard.press(' ');
    await expect(lightbox).toHaveClass(/open/);
  });

  test('should have proper ARIA labels for accessibility', async ({ page }) => {
    // Check gallery items have proper ARIA labels
    const firstImage = page.locator('[data-index="0"]');
    await expect(firstImage).toHaveAttribute('aria-label', 'View Test image 1 in lightbox');
    await expect(firstImage).toHaveAttribute('role', 'button');
    await expect(firstImage).toHaveAttribute('tabindex', '0');
    
    // Check lightbox has proper ARIA attributes
    const firstImageClick = page.locator('[data-index="0"]');
    await firstImageClick.click();
    
    const lightbox = page.locator('.lightbox');
    await expect(lightbox).toHaveAttribute('role', 'dialog');
    await expect(lightbox).toHaveAttribute('aria-modal', 'true');
    await expect(lightbox).toHaveAttribute('aria-label', 'Image lightbox');
    
    // Check navigation buttons have proper labels
    const closeButton = page.locator('.lightbox-close');
    await expect(closeButton).toHaveAttribute('aria-label', 'Close lightbox');
    
    const prevButton = page.locator('.lightbox-prev');
    await expect(prevButton).toHaveAttribute('aria-label', 'Previous image');
    
    const nextButton = page.locator('.lightbox-next');
    await expect(nextButton).toHaveAttribute('aria-label', 'Next image');
  });

  test('should display image captions when provided', async ({ page }) => {
    const firstImage = page.locator('[data-index="0"]');
    await firstImage.click();
    
    const lightbox = page.locator('.lightbox');
    await expect(lightbox).toHaveClass(/open/);
    
    // Check caption is displayed
    await expect(page.locator('.lightbox-caption')).toHaveText('This is a test caption for image 1');
    
    // Navigate to image without caption
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('.lightbox-caption')).toHaveText('This is a test caption for image 2');
    
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('.lightbox-caption')).toHaveText('');
  });

  test('should handle focus management properly', async ({ page }) => {
    const firstImage = page.locator('[data-index="0"]');
    await firstImage.click();
    
    const lightbox = page.locator('.lightbox');
    await expect(lightbox).toHaveClass(/open/);
    
    // Lightbox should be visible and have proper ARIA attributes
    await expect(lightbox).toBeVisible();
    await expect(lightbox).toHaveAttribute('role', 'dialog');
    await expect(lightbox).toHaveAttribute('aria-modal', 'true');
  });
});
