// model.js - Data Model
// Dog Data Model Class

// First create a breed to image mapping
const breedImageMap = {
    'Bichon Frise': 'bichon.jpg',
    'Golden Retriever': 'golden.jpg',
    'Poodle': 'poodle.jpg',
    'Husky': 'husky.jpg',
    'Corgi': 'corgi.jpg',
    'Border Collie': 'border-collie.jpg',
    'Shiba Inu': 'shiba.jpg',
    'French Bulldog': 'french-bulldog.jpg',
    'Samoyed': 'samoyed.jpg',
    'Labrador Retriever': 'labrador.jpg',
    'Chinese Rural Dog': 'chinese-rural.jpg',
    'Pomeranian': 'pomeranian.jpg'
};

class Dog {
    constructor(id, name, breed, age, price, description, gender, size, color, vaccinated, trained, featured = false) {
        this.id = id;
        this.name = name;
        this.breed = breed;
        this.age = age;
        this.price = price;
        this.description = description;
        this.gender = gender;
        this.size = size;
        this.color = color;
        this.vaccinated = vaccinated;
        this.trained = trained;
        this.featured = featured;

        // Set image based on breed
        const breedKey = breed.trim();
        const imageFile = breedImageMap[breedKey] || 'default-dog.jpg';
        this.image = `images/dogs/${imageFile}`;
        this.thumbnail = `images/dogs/${imageFile}`;
    }
}

// Main Data Model Class
class DogModel {
    constructor() {
        this.dogs = [];
        this.filteredDogs = [];
        this.currentPage = 1;
        this.itemsPerPage = 6;
        this.totalPages = 1;
        this.currentSort = { sortBy: 'default', order: 'asc' };
        this.currentFilters = {};

        this.initializeData();
    }

    // Initialize data
    initializeData() {
        // Create initial dog data
        this.dogs = [
            new Dog(1, 'Xiao Bai', 'Bichon Frise', 2, 1500, 'A lively and cute white Bichon Frise, very affectionate and loves to play. All vaccinations completed, in good health.', 'Male', 'Small', 'White', true, true, true),
            new Dog(2, 'Wang Cai', 'Golden Retriever', 1, 2500, 'Gentle and intelligent Golden Retriever, friendly personality, suitable for family keeping. Basic training completed.', 'Male', 'Large', 'Golden', true, true, true),
            new Dog(3, 'Niu Niu', 'Poodle', 3, 1200, 'Smart and clever Poodle, small size, suitable for apartment living. Already spayed/neutered.', 'Female', 'Small', 'Brown', true, false, true),
            new Dog(4, 'Er Ha', 'Husky', 2, 3000, 'Energetic Husky, requires plenty of exercise, friendly but a bit mischievous.', 'Male', 'Large', 'Black and White', true, false, false),
            new Dog(5, 'Short Legs', 'Corgi', 1, 2800, 'Lovely Corgi with short legs and big ears, lively personality, enjoys interacting with people.', 'Female', 'Medium', 'Yellow and White', true, true, false),
            new Dog(6, 'Cong Cong', 'Border Collie', 2, 3500, 'Very intelligent Border Collie, strong learning ability, suitable for experienced owners.', 'Male', 'Medium', 'Black and White', true, true, false),
            new Dog(7, 'Dou Dou', 'Shiba Inu', 2, 3200, 'Loyal and independent Shiba Inu, expressive face, requires proper training and socialization.', 'Male', 'Medium', 'Tan', true, false, false),
            new Dog(8, 'Qiu Qiu', 'French Bulldog', 3, 4000, 'Gentle and lovely French Bulldog, suitable for indoor living, doesn\'t require much exercise.', 'Female', 'Small', 'Brindle', true, true, false),
            new Dog(9, 'Mao Mao', 'Samoyed', 1, 3800, 'Smiling angel Samoyed, gentle personality, requires regular grooming.', 'Male', 'Large', 'White', true, false, false),
            new Dog(10, 'Guai Guai', 'Labrador Retriever', 2, 2800, 'Gentle and friendly Labrador Retriever, suitable as a family pet or working dog.', 'Female', 'Large', 'Black', true, true, false),
            new Dog(11, 'Xiao Huang', 'Chinese Rural Dog', 1, 800, 'Intelligent and loyal Chinese Rural Dog, strong adaptability, easy to care for.', 'Male', 'Medium', 'Yellow', true, false, false),
            new Dog(12, 'Hua Hua', 'Pomeranian', 2, 2200, 'Lively and lovely Pomeranian, small size, suitable for companionship.', 'Female', 'Small', 'White', true, true, false)
        ];

        this.filteredDogs = [...this.dogs];
        this.updateTotalPages();
    }

    // Get all dogs
    getAllDogs() {
        return this.dogs;
    }

    // Get featured dogs
    getFeaturedDogs() {
        return this.dogs.filter(dog => dog.featured);
    }

    // Get dog by ID
    getDogById(id) {
        return this.dogs.find(dog => dog.id === id);
    }

    // Search dogs
    searchDogs(keyword) {
        if (!keyword || keyword.trim() === '') {
            return this.filteredDogs;
        }

        keyword = keyword.toLowerCase().trim();
        return this.filteredDogs.filter(dog => {
            return dog.name.toLowerCase().includes(keyword) ||
                dog.breed.toLowerCase().includes(keyword) ||
                dog.description.toLowerCase().includes(keyword) ||
                dog.color.toLowerCase().includes(keyword);
        });
    }

    // Filter dogs
    filterDogs(filters) {
        this.currentFilters = filters;

        let filtered = [...this.dogs];

        // Breed filter
        if (filters.breed && filters.breed !== '') {
            filtered = filtered.filter(dog => dog.breed === filters.breed);
        }

        // Size filter
        if (filters.size && filters.size !== '') {
            filtered = filtered.filter(dog => dog.size === filters.size);
        }

        // Gender filter
        if (filters.gender && filters.gender !== '') {
            filtered = filtered.filter(dog => dog.gender === filters.gender);
        }

        // Price filter
        if (filters.maxPrice && filters.maxPrice > 0) {
            filtered = filtered.filter(dog => dog.price <= filters.maxPrice);
        }

        // Vaccinated filter
        if (filters.vaccinated && filters.vaccinated === 'true') {
            filtered = filtered.filter(dog => dog.vaccinated === true);
        }

        // Trained filter
        if (filters.trained && filters.trained === 'true') {
            filtered = filtered.filter(dog => dog.trained === true);
        }

        this.filteredDogs = filtered;
        this.updateTotalPages();

        return this.filteredDogs;
    }

    // Sort dogs
    sortDogs(sortBy, order = 'asc') {
        this.currentSort = { sortBy, order };

        const sorted = [...this.filteredDogs];

        sorted.sort((a, b) => {
            let comparison = 0;

            switch (sortBy) {
                case 'price':
                    comparison = a.price - b.price;
                    break;
                case 'age':
                    comparison = a.age - b.age;
                    break;
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'default':
                default:
                    // Default sort by ID
                    comparison = a.id - b.id;
                    break;
            }

            return order === 'asc' ? comparison : -comparison;
        });

        this.filteredDogs = sorted;
        return this.filteredDogs;
    }

    // Update total pages
    updateTotalPages() {
        this.totalPages = Math.ceil(this.filteredDogs.length / this.itemsPerPage);
        if (this.totalPages === 0) this.totalPages = 1;
    }

    // Get current page dogs
    getCurrentPageDogs() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.filteredDogs.slice(start, end);
    }

    // Set current page
    setCurrentPage(page) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            return true;
        }
        return false;
    }

    // Get similar dogs (based on breed)
    getSimilarDogs(dogId, limit = 4) {
        const dog = this.getDogById(dogId);
        if (!dog) return [];

        return this.dogs
            .filter(d => d.id !== dogId && d.breed === dog.breed)
            .slice(0, limit);
    }

    // Reset filters and sorting
    resetFilters() {
        this.currentFilters = {};
        this.filteredDogs = [...this.dogs];
        this.updateTotalPages();
        return this.filteredDogs;
    }

    // Get available breed list
    getBreedOptions() {
        const breeds = new Set(this.dogs.map(dog => dog.breed));
        return Array.from(breeds);
    }

    // Get statistics
    getStats() {
        return {
            totalDogs: this.dogs.length,
            totalFiltered: this.filteredDogs.length,
            averagePrice: this.filteredDogs.length > 0 ?
                Math.round(this.filteredDogs.reduce((sum, dog) => sum + dog.price, 0) / this.filteredDogs.length) : 0,
            breedsCount: new Set(this.filteredDogs.map(dog => dog.breed)).size
        };
    }
}

// To make Dog and DogModel classes accessible to other modules
// If in browser environment, add them to global scope
if (typeof window !== 'undefined') {
    window.Dog = Dog;
    window.DogModel = DogModel;
}