const loadCategory = async () => {
    try {
        const response = await fetch('https://openapi.programming-hero.com/api/news/categories');
        const jsonData = await response.json();
        const categories = jsonData.data.news_category;
        displayCategories(categories);
    } catch (error) {
        console.error('Error loading data', error);
    }
}

const displayCategories = (categories) => {
    const newsCategories = document.getElementById('news-categories');
    newsCategories.innerHTML = ''; // Clear existing categories if any

    const categoriesList = document.createElement('ul');
    categoriesList.classList.add('w-full', 'menu', 'menu-horizontal', 'px-1', 'justify-around', 'items-center', 'text-[#858585]')

    categories.forEach(category => {
        const categoryItem = document.createElement('li');
        categoryItem.classList.add('category-button');
        categoryItem.setAttribute('data-category-id', category.category_id);
        categoryItem.innerHTML = `<a>${category.category_name || ''}</a>`;
        categoriesList.appendChild(categoryItem);
    });

    newsCategories.append(categoriesList);

    // Add event listeners after creating the buttons
    addCategoryEventListeners();
}

// Updated to properly use the categoryId parameter
const categoriesWiseNews = async (categoryId) => {
    loadingSpinner(true);
    try {
        const response = await fetch(`https://openapi.programming-hero.com/api/news/category/${categoryId}`);
        const jsonData = await response.json();
        const newsData = jsonData.data;
        
        // Clear and display new news
        const newsCard = document.getElementById('news-card');
        newsCard.innerHTML = ''; // Clear existing news
        setTimeout(() => {
            displayNews(newsData);
        }, 1000);
    } catch (error) {
        console.error('Category news Error', error);
    }
} 

const addCategoryEventListeners = () => {
    const buttons = document.querySelectorAll('.category-button');
    
    buttons.forEach((button) => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            buttons.forEach(btn => {
                btn.classList.remove('text-primary-color', 'font-extrabold', 'underline');
                btn.style.backgroundColor = ''; // Reset background color
            });
            
            // Add active class to clicked button
            this.classList.add('text-primary-color', 'font-extrabold', 'underline');
            
            const categoryId = this.getAttribute('data-category-id');
            if (categoryId) {
                categoriesWiseNews(categoryId);
            } else if (this.textContent === 'Home') {
                loadNews(); // Assuming you want to load default news for Home
            } else {
                console.error('Category ID not found');
            }
        });
    });
}

const loadNews = async () => {
    loadingSpinner(true);

    try {
        const response = await fetch('https://openapi.programming-hero.com/api/news/category/01');
        const jsonData = await response.json();
        const newsData = jsonData.data;

        setTimeout(() => {
            displayNews(newsData);
        }, 1000);
    } catch (error) {
        console.error('Data load error', error);
    }
}

const displayNews = (newsData) => {
    const newsCard = document.getElementById('news-card');
    const noSearchMessage = document.getElementById('no-search-message');
    
    if (!newsData || newsData.length === 0) {
        loadingSpinner(false);
        noSearchMessage.classList.remove('hidden');
        newsCard.classList.add('hidden');
        return;
    }

    noSearchMessage.classList.add('hidden');
    newsCard.classList.remove('hidden');
    
    newsData.forEach(data => {
        const truncatedDetails = data.details 
        ? (data.details.length > 100 
            ? data.details.slice(0, 800) + '...' 
            : data.details)
        : 'Details not available';

        const cardDiv = document.createElement('div');
        cardDiv.classList.add('hero', 'bg-white', 'mt-14', 'rounded-xl');
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

        newsCard.appendChild(cardDiv);
    });

    loadingSpinner(false);
}

const loadingSpinner = (isLoading) => {
    const spinner = document.getElementById('spinner');

    if (isLoading) {
        spinner.classList.remove('hidden');
    } else {
        spinner.classList.add('hidden');
    }
}

// modal
// Modal open function
const openModal = async (news_id) => {
    try {
        const response = await fetch(`https://openapi.programming-hero.com/api/news/${news_id}`);
        const jsonData = await response.json();
        
        if (jsonData.status && jsonData.data && jsonData.data.length > 0) {
            displayMoreNews(jsonData.data[0]);
        } else {
            console.error('No news data found');
        }
    } catch (error) {
        console.error('Modal open error', error);
    }
}

// Display modal content function
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
            
            <p class="py-4 text-[#706F6F]">
                ${newsData.details || 'No details available'}
            </p>
            
            <div class="divider"></div>
            
            <div class="modal-action">
                <form method="dialog" class="w-full flex justify-end">
                    <button class="btn bg-primary-color text-white font-extrabold">Close</button>
                </form>
            </div>
        </div>
    `;
    
    myModal.showModal();
}


// Helper function to generate star SVGs
const generateStars = (count) => {
    let stars = '';
    for (let i = 0; i < count; i++) {
        stars += `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
            </svg>
        `;
    }
    return stars;
}

loadCategory();
loadNews();