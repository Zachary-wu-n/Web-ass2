// controller.js - Controller Logic
// Home Controller
class HomeController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    // Load featured dogs
    loadFeaturedDogs() {
        const featuredDogs = this.model.getFeaturedDogs();
        this.view.renderFeaturedDogs(featuredDogs);
    }
}

// Dog List Controller
class DogController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.init();
    }

    init() {
        // Bind events
        this.view.bindSearch(() => this.handleSearch());
        this.view.bindFilterChange(() => this.handleFilterChange());
        this.view.bindResetFilters(() => this.handleResetFilters());
        this.view.bindSort((sortBy, order) => this.handleSort(sortBy, order));
        this.view.bindViewToggle((viewType) => this.handleViewToggle(viewType));
        this.view.bindPagination(
            () => this.handlePrevPage(),
            () => this.handleNextPage(),
            (page) => this.handlePageChange(page)
        );
        this.view.bindContactButtons((dogId) => this.handleContact(dogId));

        // Initial load
        this.updateView();
    }

    // Handle search
    handleSearch() {
        const keyword = this.view.getSearchKeyword();
        let results;

        if (keyword) {
            results = this.model.searchDogs(keyword);
        } else {
            results = this.model.filteredDogs;
        }

        // Apply current sorting
        const { sortBy, order } = this.model.currentSort;
        results = this.model.sortDogs(sortBy, order);

        this.model.filteredDogs = results;
        this.model.currentPage = 1;
        this.model.updateTotalPages();

        this.updateView();
    }

    // Handle filter change
    handleFilterChange() {
        const filters = this.view.getFilterValues();
        const results = this.model.filterDogs(filters);

        // Apply current sorting
        const { sortBy, order } = this.model.currentSort;
        this.model.sortDogs(sortBy, order);

        this.model.currentPage = 1;

        this.updateView();
    }

    // Handle reset filters
    handleResetFilters() {
        this.model.resetFilters();
        this.view.resetFilterForm();

        // Reset sorting
        this.model.sortDogs('default', 'asc');

        this.updateView();
    }

    // Handle sorting
    handleSort(sortBy, order) {
        this.model.sortDogs(sortBy, order);
        this.updateView();
    }

    // Handle view toggle
    handleViewToggle(viewType) {
        // View toggle is already handled in view, just update display
        this.updateView();
    }

    // Handle previous page
    handlePrevPage() {
        if (this.model.currentPage > 1) {
            this.model.currentPage--;
            this.updateView();
        }
    }

    // Handle next page
    handleNextPage() {
        if (this.model.currentPage < this.model.totalPages) {
            this.model.currentPage++;
            this.updateView();
        }
    }

    // Handle page change
    handlePageChange(page) {
        this.model.currentPage = page;
        this.updateView();
    }

    // Handle contact
    handleContact(dogId) {
        const dog = this.model.getDogById(dogId);
        if (dog) {
            alert(`Connecting you to customer service for information about ${dog.name}...\nCustomer Service Phone: 400-123-4567`);
        }
    }

    // Update view
    updateView() {
        const currentDogs = this.model.getCurrentPageDogs();
        const stats = this.model.getStats();

        this.view.renderDogList(
            currentDogs,
            stats,
            this.model.currentPage,
            this.model.totalPages
        );

        // Scroll to list top
        window.scrollTo({
            top: this.view.dogListContainer.offsetTop - 100,
            behavior: 'smooth'
        });
    }
}

// Dog Detail Controller
class DogDetailController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    // Load dog detail
    loadDogDetail(dogId) {
        this.view.showLoading();

        setTimeout(() => {
            const dog = this.model.getDogById(dogId);

            if (dog) {
                this.view.renderDogDetail(dog);

                // Load similar dogs
                const similarDogs = this.model.getSimilarDogs(dogId);
                this.view.renderSimilarDogs(similarDogs);

                // Bind events
                this.view.bindContactButton((id) => this.handleContact(id));
                this.view.bindFavoriteButton((id) => this.handleFavorite(id));
            } else {
                this.view.showError('Dog information not found, may have been adopted or information is incorrect.');
            }
        }, 500); // Simulate network delay
    }

    // Handle contact
    handleContact(dogId) {
        const dog = this.model.getDogById(dogId);
        if (dog) {
            alert(`Connecting you to customer service for information about ${dog.name}...\nCustomer Service Phone: 400-123-4567`);
        }
    }

    // Handle favorite
    handleFavorite(dogId) {
        const dog = this.model.getDogById(dogId);
        if (dog) {
            // Get existing favorites list
            let favorites = JSON.parse(localStorage.getItem('dog_favorites') || '[]');

            // Check if already favorited
            if (!favorites.includes(dogId)) {
                favorites.push(dogId);
                localStorage.setItem('dog_favorites', JSON.stringify(favorites));
                alert(`Successfully added ${dog.name} to favorites!`);
            } else {
                alert(`${dog.name} is already in your favorites list!`);
            }
        }
    }
}