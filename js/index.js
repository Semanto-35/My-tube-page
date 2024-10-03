
function getTime(time) {
    const hours = parseInt(time / 3600);
    let remainSec = time % 3600;
    const minute = parseInt(remainSec / 60);
    remainSec = minute % 60;
    return `${hours} hours ${minute} minute ${remainSec} seconds ago`;
};
const removeAvtiveClass = () => {
    const buttons = document.getElementsByClassName('category-btn');
    for (const btn of buttons) {
        btn.classList.remove('active');
    }
};
const loadModal = async (videoId) => {
    const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
    const response = await fetch(url);
    const json = await response.json();
    displayModal(json.video);
};
const displayModal =(details) => {
    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = `
        <img src=${details.thumbnail}>
        <p class="font-bold text-xl mt-4">${details.title}</p>
        <p>${details.description}</p>
    `;
    console.log(details);
    // document.getElementById('modal-btn').click();
    document.getElementById('customModal').showModal();
}
function loadCatagoriesVideos(id) {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
        .then((response) => response.json())
        .then((json) => {
            removeAvtiveClass();
            const activeBtn = document.getElementById(`btn-${id}`);
            console.log(activeBtn);
            activeBtn.classList.add('active');
            displayVideos(json.category);
        })
        .catch((error) => console.log(error));
}

// load button catagories
const loadCatagories = () => {
    fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
        .then((response) => response.json())
        .then((json) => displayCatagories(json.categories))
        .catch((error) => console.log(error));
};
loadCatagories();
// const displayCatagories = (catagories) => {
//     catagories.forEach((item) => {
//         const buttonContainer = document.getElementById('btn-container');
//         const button = document.createElement('button');
//         button.classList = 'btn';
//         button.innerText = item.category;
//         button.onclick = 
//         buttonContainer.append(button);
//     });
// };
const displayCatagories = (catagories) => {
    catagories.forEach((item) => {
        const buttonContainer = document.getElementById('btn-container');
        const buttonDiv = document.createElement('div');
        buttonDiv.innerHTML = `
            <button id="btn-${item.category_id}" onclick="loadCatagoriesVideos(${item.category_id})" class="btn category-btn">${item.category}</button>
        `;
        buttonContainer.append(buttonDiv);
    });
};

// load videos catagories
const loadVideosCatagories = (searchValue = "") => {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchValue}`)
        .then((response) => response.json())
        .then((json) => displayVideos(json.videos))
        .catch((error) => console.log(error));
};
loadVideosCatagories();
const displayVideos = (catagories) => {
    const videosContainer = document.getElementById('videos');
    videosContainer.innerHTML = '';
    if (catagories.length == 0) {
        videosContainer.classList.remove('grid');
        videosContainer.innerHTML = `
            <div class="min-h-screen flex flex-col gap-5 justify-center items-center">
              <img src="./images/Icon.png">
              <h3 class="text-2xl font-bold text-center">Opps!! Sorry, There is no content here</h3>
            </div>
        `;
    }
    else {
        videosContainer.classList.add('grid');
    }
    catagories.forEach((item) => {
        const card = document.createElement('div');
        card.classList = 'card';
        card.innerHTML = `
            <div class="h-48 relative">
                <img class="w-full h-full object-cover" src=${item.thumbnail}>
                ${item.others.posted_date?.length == 0 ? ""
                : `<span class="absolute right-2 bottom-2 bg-black px-5 py-4 rounded text-xs text-white">${getTime(item.others.posted_date)}</span>`
            }
            </div>
            <div class="flex py-4 gap-3">
                <div>
                    <img class="w-10 h-10 rounded-full object-cover" src=${item.authors[0].profile_picture}>
                </div>
                <div class="w-full">
                    <h3 class="font-bold text-xl">${item.title}</h3>
                    <div class="flex items-center gap-2 font-medium">
                        <p class="text-gray-400">${item.authors[0].profile_name}</p>
                        ${item.authors[0].verified == true ? `<img class="w-4 h-4" src="https://img.icons8.com/?size=48&id=98A4yZTt9abw&format=png">` : ""
            }
                    </div>
                    <p class="text-gray-400 font-medium">${item.others.views} views</p>
                    <div class="flex justify-end px-6">
                        <button onclick="loadModal('${item.video_id}')" class="btn btn-sm btn-error text-white">Details</button>
                    </div>
                </div>
            </div>
        `;
        videosContainer.append(card);
    });
};

document.getElementById('searchInput').addEventListener('keyup', (e) => {
    loadVideosCatagories(e.target.value);
});
