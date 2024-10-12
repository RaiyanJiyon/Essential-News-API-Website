// Function to load news categories
const loadCategory = async () => {
    try {
        const response = await fetch('https://openapi.programming-hero.com/api/news/categories');
        const jsonData = await response.json();
        const data = jsonData.data;
        const newsData = data.news_category;
        displayCategory(newsData); // Display categories after fetching
    } catch (error) {
        console.error("Load category error", error);
    }
}

// Function to display categories
const displayCategory = (newsData) => {
    const newsCategoriesContainer = document.getElementById('news-categories-container');

    // Create an unordered list for categories
    const list = document.createElement('ul');
    list.classList.add('w-full', 'menu', 'menu-horizontal', 'px-1', 'justify-around', 'items-center', 'text-[#858585]');

    const fragment = document.createDocumentFragment();

    // Loop over categories and create list items
    newsData.forEach(data => {
        const item = document.createElement('li');
        item.classList.add('category-id');
        item.setAttribute('category-id', data.category_id); // Set category id to each item
        item.innerHTML = `<a>${data.category_name}</a>`; // Set category name
        fragment.append(item);
    });

    list.append(fragment);
    newsCategoriesContainer.append(list); // Append the list to the container

    addCategoryEventListener(); // Add event listeners after categories are rendered
}

// Function to load news for a specific category
const loadNews = async (category_id, categoryName) => {
    loadingSpinner(true);

    try {
        const response = await fetch(`https://openapi.programming-hero.com/api/news/category/${category_id}`);
        const jsonData = await response.json();
        const newsData = jsonData.data;

        setTimeout(() => {
            displayNews(newsData, categoryName); // Pass category name to displayNews
        }, 1000);
    } catch (error) {
        console.error("Load news error", error);
    }
}

// Function to display news cards and dynamic total items message
const displayNews = (newsData, selectedCategoryName) => {
    const newsCardContainer = document.getElementById('news-card-container');
    const noSearchMessage = document.getElementById('no-search-message');
    const totalItemsMessage = document.getElementById('total-items-message'); // New element

    newsCardContainer.innerHTML = ''; // Clear previous news

    // Update the message with the total number of items and the category name
    totalItemsMessage.innerHTML = `${newsData.length} items found for category ${selectedCategoryName}`;

    if (newsData.length === 0) {
        loadingSpinner(false);
        noSearchMessage.classList.remove('hidden');
        newsCardContainer.classList.add('hidden');
        return;
    }

    noSearchMessage.classList.add('hidden');
    newsCardContainer.classList.remove('hidden');

    const fragment = document.createDocumentFragment();

    // Loop over the news data and create news cards
    newsData.forEach(data => {
        const truncatedDetails = data.details?.slice(0, 800) || 'Details not available';

        const cardDiv = document.createElement('div');
        cardDiv.classList.add('hero', 'bg-white', 'mt-14', 'rounded-xl');

        // Inner HTML for each news card
        cardDiv.innerHTML = `
        <div class="hero-content flex-col lg:flex-row">
                <img src="${data.thumbnail_url}" class="max-w-sm rounded-lg shadow-2xl" />
                <div>
                    <h1 class="text-2xl font-bold">${data.title || 'Title not available'}</h1>
                    <p class="pt-2 text-[#949494]">${truncatedDetails}</p>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:flex justify-between items-center mt-6 gap-2">
                        <div class="flex items-center gap-2">
                            <div class="avatar">
                                <div class="w-12 rounded-full">
                                    <img src="${data.author?.img}" />
                                </div>
                            </div>
                            <div>
                                <h4>${data.author?.name || 'Author name not available'}</h4>
                                <p class="text-[#949494] text-sm">
                                    ${data.author?.published_date || 'Date not available'}
                                </p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            <h3 class="text-lg text-[#515151] font-bold">
                                ${data.total_view || 'View not available'}
                            </h3>
                        </div>
                        <button onclick="openModal('${data._id}')" class="btn btn-outline btn-primary">Read More</button>
                    </div>
                </div>
            </div>
        `;

        fragment.append(cardDiv);
    });

    loadingSpinner(false);
    
    newsCardContainer.append(fragment); // Append all news cards to the container
}

// Function to add event listeners to each category
const addCategoryEventListener = () => {
    const allItems = document.querySelectorAll('.category-id');

    allItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all
            allItems.forEach(item => {
                item.classList.remove('text-primary-color', 'font-extrabold', 'underline');
            });

            // Add active class to the clicked item
            this.classList.add('text-primary-color', 'font-extrabold', 'underline');

            // Get the category ID and load news
            const categoryId = this.getAttribute('category-id');
            const categoryName = this.textContent; // Get the category name

            if (categoryId) {
                loadNews(categoryId, categoryName); // Load news for the selected category
            } else {
                console.error('Category ID not found');
            }
        });
    });
}

// Function to show or hide the loading spinner
const loadingSpinner = (isLoading) => {
    const spinner = document.getElementById('spinner');

    if (isLoading) {
        spinner.classList.remove('hidden');    
    } else {
        spinner.classList.add('hidden');    
    }
}

// Function to open the modal with more news details
const openModal = async (news_id) => {
    try {
        const response = await fetch(`https://openapi.programming-hero.com/api/news/${news_id}`);
        const jsonData = await response.json();
        displayMoreNews(jsonData.data[0])
    } catch (error) {
        console.error('Modal open error', error);
    }
}

// Function to display more news details in a modal
const displayMoreNews = (newsData) => {
    const myModal = document.getElementById('my_modal_5');
    
    myModal.innerHTML = `
        <div class="modal-box w-11/12 mx-auto p-10">
            <h2 class="text-lg font-bold">${newsData.title || 'Title not available'}</h2>
            
            <div class="divider"></div>
            
            <div class="">
                <figure class="w-full text-center">
                    <img class="w-full rounded-lg" src="${newsData.image_url}" alt="News image" />
                </figure>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 md:flex justify-between items-center mt-6 gap-2">
                <div class="flex items-center gap-2">
                    <div class="avatar">
                        <div class="w-12 rounded-full">
                            <img src="${newsData.author?.img}" />
                        </div>
                    </div>
                    <div>
                        <h4>${newsData.author?.name || 'Author name not available'}</h4>
                        <p class="text-[#949494] text-sm">
                            ${newsData.author?.published_date || 'Date not available'}
                        </p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    <h3 class="text-lg text-[#515151] font-bold">
                        ${newsData.total_view || 'View not available'}
                    </h3>
                </div>
            </div>
            <p class="py-4 text-sm">
                ${newsData.details}
            </p>
            <div class="modal-action">
                <button class="btn btn-outline bg-primary-color text-white font-bold" onclick="window.my_modal_5.close()">Close</button>
            </div>
        </div>
    `;

    window.my_modal_5.showModal(); // Show the modal
}

// Load categories when the page loads
loadCategory();
loadNews('08', 'All News');