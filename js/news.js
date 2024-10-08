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

loadCategory();