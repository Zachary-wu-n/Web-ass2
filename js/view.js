// view.js - View Logic
// Home View Class
class HomeView {
    constructor() {
        this.featuredDogsContainer = document.getElementById('featured-dogs-container');
    }

    // Render featured dogs
    renderFeaturedDogs(dogs) {
        if (!this.featuredDogsContainer) return;

        this.featuredDogsContainer.innerHTML = '';

        if (dogs.length === 0) {
            this.featuredDogsContainer.innerHTML = `
                <div class="no-results">
                    <p>No featured dogs available</p>
                </div>
            `;
            return;
        }

        dogs.forEach(dog => {
            const dogCard = this.createDogCard(dog);
            this.featuredDogsContainer.appendChild(dogCard);
        });
    }

    // Create dog card
    createDogCard(dog) {
        const card = document.createElement('div');
        card.className = 'dog-card';
        card.innerHTML = `
            <img src="${dog.image}" alt="${dog.name}" onerror="this.src='images/default-dog.jpg'">
            <div class="dog-info">
                <h3>${dog.name}</h3>
                <div class="dog-meta">
                    <span class="breed">${dog.breed}</span>
                    <span class="age">${dog.age} years</span>
                    <span class="gender">${dog.gender}</span>
                    <span class="size">${dog.size}</span>
                </div>
                <p class="description">${dog.description.substring(0, 80)}...</p>
                <div class="dog-footer">
                    <span class="price">¥${dog.price}</span>
                    <a href="dog-detail.html?id=${dog.id}" class="btn btn-primary">View Details</a>
                </div>
            </div>
        `;
        return card;
    }
}

// Dog List View Class
class DogListView {
    constructor() {
        this.dogListContainer = document.getElementById('dog-list');
        this.searchInput = document.getElementById('search-input');
        this.searchButton = document.getElementById('search-btn');
        this.filterForm = document.getElementById('filter-form');
        this.resetFiltersButton = document.getElementById('reset-filters');
        this.resetAllButton = document.getElementById('reset-all');
        this.sortButtons = document.querySelectorAll('.sort-btn');
        this.viewButtons = document.querySelectorAll('.view-btn');
        this.prevPageButton = document.getElementById('prev-page');
        this.nextPageButton = document.getElementById('next-page');
        this.pageNumbersContainer = document.getElementById('page-numbers');
        this.dogsCountElement = document.getElementById('dogs-count');
        this.noResultsElement = document.getElementById('no-results');
        this.priceRangeInput = document.getElementById('price-range');
        this.priceValueElement = document.getElementById('price-value');

        this.currentView = 'grid'; // 'grid' or 'list'
    }

    // Render dog list
    renderDogList(dogs, stats, currentPage, totalPages) {
        this.dogListContainer.innerHTML = '';

        // Update statistics
        if (this.dogsCountElement) {
            const countSpan = this.dogsCountElement.querySelector('span');
            if (countSpan) {
                countSpan.textContent = stats.totalFiltered;
            }
        }

        // Show/hide no results message
        if (this.noResultsElement) {
            if (dogs.length === 0) {
                this.noResultsElement.style.display = 'block';
            } else {
                this.noResultsElement.style.display = 'none';
            }
        }

        // Render dog cards
        if (dogs.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.innerHTML = `
                <h3>No dogs found matching your criteria</h3>
                <p>Please try adjusting your filters or search keywords</p>
            `;
            this.dogListContainer.appendChild(noResults);
            return;
        }

        dogs.forEach(dog => {
            const dogCard = this.createDogCard(dog);
            this.dogListContainer.appendChild(dogCard);
        });

        // Update pagination
        this.updatePagination(currentPage, totalPages);
    }

    // Create dog card
    createDogCard(dog) {
        const card = document.createElement('div');
        card.className = `dog-card ${this.currentView === 'list' ? 'list-view' : ''}`;

        const vaccinatedIcon = dog.vaccinated ? '✅' : '❌';
        const trainedIcon = dog.trained ? '✅' : '❌';

        card.innerHTML = `
            <img src="${dog.image}" alt="${dog.name}" onerror="this.src='images/default-dog.jpg'">
            <div class="dog-info">
                <div class="dog-header">
                    <h3>${dog.name}</h3>
                    <span class="dog-badge ${dog.featured ? 'featured' : ''}">
                        ${dog.featured ? 'Featured' : dog.breed}
                    </span>
                </div>
                <div class="dog-meta">
                    <span class="age">${dog.age} years</span>
                    <span class="gender">${dog.gender}</span>
                    <span class="size">${dog.size}</span>
                    <span class="color">${dog.color}</span>
                </div>
                <p class="description">${dog.description.substring(0, 100)}...</p>
                <div class="dog-features">
                    <span class="feature" title="Vaccinated">${vaccinatedIcon} Vaccinated</span>
                    <span class="feature" title="Trained">${trainedIcon} Trained</span>
                </div>
                <div class="dog-footer">
                    <span class="price">¥${dog.price.toLocaleString()}</span>
                    <div class="dog-actions">
                        <a href="dog-detail.html?id=${dog.id}" class="btn btn-primary">View Details</a>
                        <button class="btn btn-secondary btn-contact" data-id="${dog.id}">Inquire</button>
                    </div>
                </div>
            </div>
        `;

        return card;
    }

    // Update pagination
    updatePagination(currentPage, totalPages) {
        if (!this.pageNumbersContainer || !this.prevPageButton || !this.nextPageButton) return;

        // Update page button status
        this.prevPageButton.disabled = currentPage === 1;
        this.nextPageButton.disabled = currentPage === totalPages;

        // Clear page numbers container
        this.pageNumbersContainer.innerHTML = '';

        // Generate page numbers
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Adjust start page
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // Add page numbers
        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('button');
            pageButton.className = `page-number ${i === currentPage ? 'active' : ''}`;
            pageButton.textContent = i;
            pageButton.dataset.page = i;
            this.pageNumbersContainer.appendChild(pageButton);
        }

        // Add ellipsis if needed
        if (startPage > 1) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.className = 'page-ellipsis';
            this.pageNumbersContainer.insertBefore(ellipsis, this.pageNumbersContainer.firstChild);
        }

        if (endPage < totalPages) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.className = 'page-ellipsis';
            this.pageNumbersContainer.appendChild(ellipsis);
        }
    }

    // Bind events
    bindSearch(handler) {
        if (this.searchButton) {
            this.searchButton.addEventListener('click', () => handler());
        }

        if (this.searchInput) {
            this.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handler();
            });
        }
    }

    bindFilterChange(handler) {
        if (this.filterForm) {
            this.filterForm.addEventListener('change', () => handler());
        }

        if (this.priceRangeInput && this.priceValueElement) {
            this.priceRangeInput.addEventListener('input', (e) => {
                this.priceValueElement.textContent = e.target.value;
                handler();
            });
        }
    }

    bindResetFilters(handler) {
        if (this.resetFiltersButton) {
            this.resetFiltersButton.addEventListener('click', () => handler());
        }

        if (this.resetAllButton) {
            this.resetAllButton.addEventListener('click', () => handler());
        }
    }

    bindSort(handler) {
        if (this.sortButtons) {
            this.sortButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const sortBy = e.target.dataset.sort;
                    const order = e.target.dataset.order;

                    // Update active button
                    this.sortButtons.forEach(btn => btn.classList.remove('active'));
                    e.target.classList.add('active');

                    handler(sortBy, order);
                });
            });
        }
    }

    bindViewToggle(handler) {
        if (this.viewButtons) {
            this.viewButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const viewType = e.target.id === 'grid-view' ? 'grid' : 'list';

                    if (viewType === this.currentView) return;

                    this.currentView = viewType;

                    // Update active button
                    this.viewButtons.forEach(btn => btn.classList.remove('active'));
                    e.target.classList.add('active');

                    // Switch view class
                    this.dogListContainer.className = viewType === 'grid' ? 'dog-grid' : 'dog-grid dog-list-layout';

                    handler(viewType);
                });
            });
        }
    }

    bindPagination(prevHandler, nextHandler, pageHandler) {
        if (this.prevPageButton) {
            this.prevPageButton.addEventListener('click', () => prevHandler());
        }

        if (this.nextPageButton) {
            this.nextPageButton.addEventListener('click', () => nextHandler());
        }

        if (this.pageNumbersContainer) {
            this.pageNumbersContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('page-number')) {
                    const page = parseInt(e.target.dataset.page);
                    pageHandler(page);
                }
            });
        }
    }

    bindContactButtons(handler) {
        // Use event delegation for dynamically generated buttons
        if (this.dogListContainer) {
            this.dogListContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-contact')) {
                    const dogId = parseInt(e.target.dataset.id);
                    handler(dogId);
                }
            });
        }
    }

    // Get search keyword
    getSearchKeyword() {
        return this.searchInput ? this.searchInput.value.trim() : '';
    }

    // Get filter values
    getFilterValues() {
        if (!this.filterForm) return {};

        const formData = new FormData(this.filterForm);
        const filters = {};

        // Get all filter values
        for (const [key, value] of formData.entries()) {
            if (value !== '') {
                filters[key] = value;
            }
        }

        return filters;
    }

    // Reset filter form
    resetFilterForm() {
        if (this.filterForm) {
            this.filterForm.reset();
        }

        if (this.priceValueElement && this.priceRangeInput) {
            this.priceRangeInput.value = 10000;
            this.priceValueElement.textContent = '10000';
        }

        if (this.searchInput) {
            this.searchInput.value = '';
        }

        // Reset sort button to default
        if (this.sortButtons) {
            this.sortButtons.forEach(btn => {
                if (btn.dataset.sort === 'default') {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }
    }
}

// Dog Detail View Class
class DogDetailView {
    constructor() {
        this.dogDetailContainer = document.getElementById('dog-detail-container');
        this.similarDogsContainer = document.getElementById('similar-dogs-container');
    }

    // Render dog detail
    renderDogDetail(dog) {
        if (!this.dogDetailContainer) return;

        const vaccinatedText = dog.vaccinated ? 'All vaccinations completed' : 'Not vaccinated';
        const trainedText = dog.trained ? 'Basic training completed' : 'Not trained';

        this.dogDetailContainer.innerHTML = `
            <div class="dog-detail">
                <div class="dog-detail-header">
                    <img src="${dog.image}" alt="${dog.name}" class="dog-detail-image" onerror="this.src='images/default-dog.jpg'">
                    <span class="dog-detail-badge">${dog.featured ? 'Featured Dog' : 'Available'}</span>
                </div>
                <div class="dog-detail-content">
                    <div class="dog-detail-title">
                        <h2>${dog.name}</h2>
                        <div class="dog-detail-price">¥${dog.price.toLocaleString()}</div>
                    </div>
                    
                    <div class="dog-detail-info">
                        <div class="info-item">
                            <h4>Breed</h4>
                            <p>${dog.breed}</p>
                        </div>
                        <div class="info-item">
                            <h4>Age</h4>
                            <p>${dog.age} years</p>
                        </div>
                        <div class="info-item">
                            <h4>Gender</h4>
                            <p>${dog.gender}</p>
                        </div>
                        <div class="info-item">
                            <h4>Size</h4>
                            <p>${dog.size}</p>
                        </div>
                        <div class="info-item">
                            <h4>Color</h4>
                            <p>${dog.color}</p>
                        </div>
                        <div class="info-item">
                            <h4>Health Status</h4>
                            <p>${vaccinatedText}</p>
                        </div>
                    </div>
                    
                    <div class="dog-detail-description">
                        <h3>About ${dog.name}</h3>
                        <p>${dog.description}</p>
                        
                        <h4>Features</h4>
                        <ul>
                            <li>Breed: ${dog.breed}</li>
                            <li>Age: ${dog.age} years</li>
                            <li>Gender: ${dog.gender}</li>
                            <li>Size: ${dog.size}</li>
                            <li>Color: ${dog.color}</li>
                            <li>Vaccination Status: ${vaccinatedText}</li>
                            <li>Training Status: ${trainedText}</li>
                        </ul>
                    </div>
                    
                    <div class="dog-detail-actions">
                        <button class="btn btn-primary btn-contact" data-id="${dog.id}">Inquire Now</button>
                        <button class="btn btn-secondary btn-favorite" data-id="${dog.id}">Add to Favorites</button>
                        <a href="dogs.html" class="btn btn-outline">Back to List</a>
                    </div>
                </div>
            </div>
        `;
    }

    // Render similar dogs
    renderSimilarDogs(dogs) {
        if (!this.similarDogsContainer || dogs.length === 0) return;

        this.similarDogsContainer.innerHTML = '';

        dogs.forEach(dog => {
            const dogCard = this.createSimilarDogCard(dog);
            this.similarDogsContainer.appendChild(dogCard);
        });
    }

    // Create similar dog card
    createSimilarDogCard(dog) {
        const card = document.createElement('div');
        card.className = 'dog-card';
        card.innerHTML = `
            <img src="${dog.image}" alt="${dog.name}" onerror="this.src='images/default-dog.jpg'">
            <div class="dog-info">
                <h3>${dog.name}</h3>
                <div class="dog-meta">
                    <span class="breed">${dog.breed}</span>
                    <span class="age">${dog.age} years</span>
                </div>
                <div class="dog-footer">
                    <span class="price">¥${dog.price}</span>
                    <a href="dog-detail.html?id=${dog.id}" class="btn btn-primary">View Details</a>
                </div>
            </div>
        `;
        return card;
    }

    // Bind events
    bindContactButton(handler) {
        if (this.dogDetailContainer) {
            this.dogDetailContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-contact')) {
                    const dogId = parseInt(e.target.dataset.id);
                    handler(dogId);
                }
            });
        }
    }

    bindFavoriteButton(handler) {
        if (this.dogDetailContainer) {
            this.dogDetailContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-favorite')) {
                    const dogId = parseInt(e.target.dataset.id);
                    handler(dogId);
                }
            });
        }
    }

    // Show error message
    showError(message) {
        if (!this.dogDetailContainer) return;

        this.dogDetailContainer.innerHTML = `
            <div class="error-message">
                <h3>Loading Failed</h3>
                <p>${message}</p>
                <a href="dogs.html" class="btn btn-primary">Back to Dogs List</a>
            </div>
        `;
    }

    // Show loading state
    showLoading() {
        if (!this.dogDetailContainer) return;

        this.dogDetailContainer.innerHTML = `
            <div class="loading">
                Loading dog information...
            </div>
        `;
    }
}