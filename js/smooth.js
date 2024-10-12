const newsItem = document.getElementById('news-item');
const newsContainer = document.getElementById('news-container');

newsItem.addEventListener('click', () => {
    newsContainer.scrollIntoView({behavior: 'smooth'});
})