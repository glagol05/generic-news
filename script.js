const articlesContainer = document.getElementById("articles-container");
const createBtn = document.getElementById("create-btn");

let articles = JSON.parse(localStorage.getItem("articles")) || [];

renderArticles();

createBtn.addEventListener("click", () => {

    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const imageInput = document.getElementById("image");

    if (!title || !content) {
        showToast("Fill all fields");
        return;
    }

    const file = imageInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function () {

            const article = {
                id: Date.now(),
                title,
                content,
                image: reader.result,
                date: new Date().toLocaleDateString()
            };

            articles.push(article);
            saveArticles();
            renderArticles();
            showToast("Article created");
            clearForm();
        };

        reader.readAsDataURL(file);

    } else {

        const article = {
            id: Date.now(),
            title,
            content,
            image: "",
            date: new Date().toLocaleDateString()
        };

        articles.push(article);
        saveArticles();
        renderArticles();
        showToast("Article created");
        clearForm();
    }
});

function renderArticles() {

    const existingArticles =
        articlesContainer.querySelectorAll(".generated-article");

    existingArticles.forEach(article => {
        article.remove();
    });

    articles.forEach(article => {
        const shortContent =
            article.content.length > 60
            ? article.content.substring(0, 60) + "..."
            : article.content;

        const articleDiv = document.createElement("div");
        articleDiv.classList.add(
            "main-article",
            "generated-article"
        );

        if (article.image) {
            const image = document.createElement("img");
            image.src = article.image;
            image.classList.add("headline-photo");
            articleDiv.appendChild(image);
        }

        const titleElement = document.createElement("h1");
        titleElement.textContent = article.title;
        titleElement.classList.add("main-headline");
        articleDiv.appendChild(titleElement);

        const contentElement = document.createElement("p");
        contentElement.textContent = shortContent;
        articleDiv.appendChild(contentElement);

        const dateElement = document.createElement("small");
        dateElement.textContent = article.date;
        articleDiv.appendChild(dateElement);

        const breakLine = document.createElement("br");
        articleDiv.appendChild(breakLine);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", () => {
            deleteArticle(article.id);
        });

        articleDiv.appendChild(deleteBtn);
        articlesContainer.appendChild(articleDiv);
    });
}

function deleteArticle(id) {
    articles = articles.filter(article => article.id !== id);

    saveArticles();
    renderArticles();
    showToast("Article deleted");
}

function saveArticles() {
    localStorage.setItem("articles", JSON.stringify(articles));
}

function clearForm() {
    document.getElementById("title").value = "";
    document.getElementById("content").value = "";
    document.getElementById("image").value = "";
}

function showToast(message) {
    const toastContainer =
        document.getElementById("toast-container");

    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.textContent = message;

    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}