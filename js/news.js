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

    const categoriesList = document.createElement('ul');
    categoriesList.classList.add('w-full', 'menu', 'menu-horizontal', 'px-1', 'justify-around', 'items-center', 'text-[#858585]')

    const homeItem = document.createElement('li');
    homeItem.textContent = 'Home';
    categoriesList.appendChild(homeItem);

    categories.forEach(category => {
        const categoryItem = document.createElement('li');
        categoryItem.innerHTML = `<a>${category.category_name || ''}</a>`;
        categoriesList.appendChild(categoryItem);
    });

    newsCategories.append(categoriesList);
}

const loadNews = async () => {
    try {
        const response = await fetch('https://openapi.programming-hero.com/api/news/category/01');
        const jsonData = await response.json();
        const newsData = jsonData.data;
        displayData(newsData);
    } catch (error) {
        console.error('Data load error', error);
    }
}

const displayData = (newsData) => {
    const newsCard = document.getElementById('news-card');

    newsData.forEach(data => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('hero', 'bg-white', 'mt-14', 'rounded-xl');
        cardDiv.innerHTML = `
            <div class="hero-content flex-col lg:flex-row">
                <img src="${data.thumbnail_url}" class="max-w-sm rounded-lg shadow-2xl" />
                <div>
                    <h1 class="text-2xl font-bold">${data.title || 'Title not available'}</h1>
                    <p class="pt-2 text-[#949494]">${data.details || 'Details not available'}</p>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:flex justify-between items-center mt-6 gap-2">
                        <!-- author details -->
                        <div class="flex items-center gap-2">
                            <div class="avatar">
                                <div class="w-12 rounded-full">
                                    <img src="${data.author.img}" />
                                </div>
                            </div>
                            <div>
                                <h4>${data.author.name || 'Author name not available'}</h4>
                                <p class="text-[#949494] text-sm">
                                    ${data.author.published_date || 'Author name not available'}
                                </p>
                            </div>
                        </div>

                        <!-- views -->
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

                        <!-- rating -->
                        <div class="flex items-center cursor-pointer">
                            ${generateStars(5)}
                        </div>

                        <!-- arrow -->
                        <div class="w-10 h-10 bg-primary-color rounded-full p-2 cursor-pointer hover:bg-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                stroke-width="1.5" stroke="currentColor" class="size-6 text-white">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        `;

        newsCard.append(cardDiv);
    });
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