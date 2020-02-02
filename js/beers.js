const API_KEY = 'K8DSA0C-DKZ44V1-GEHS35S-R5ECFWV';
const URL = 'https://beerflix-api.herokuapp.com/api/v1/beers';

const text = document.getElementById('textBeer');
const month = document.getElementById('monthFilter');
const year = document.getElementById('yearFilter');

var idItem = "";

document.querySelector('#btnSearch').addEventListener('click', Listar);

async function Listar() {
    try {
        var filter = `?search=${text.value}`;

        const monthValue = month.value;
        const yearValue = year.value;

        var URLComplete = URL + filter;

        if (!monthValue && !yearValue)
            filter = `?search=${text.value}&limit=10`;

        const response = await fetch(URL + filter, {
            method: 'GET',
            headers: {
                'X-API-KEY': API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error('Error retrieving shows');
        }
        const data = await response.json();

        const render = document.querySelector('#TableBeers');
        render.innerHTML = '';

        var i = 1;

        for (let item in data.beers) {

            if (monthValue || yearValue) {

                const mm = data.beers[item].firstBrewed.substring(0, 2).toString();
                const aaaa = data.beers[item].firstBrewed.substring(3, 7).toString();

                if (monthValue && !yearValue) {
                    if (mm === monthValue) {
                        render.innerHTML += `
                        <tr>
                            <td>${i++}</td>
                            <td>${data.beers[item].beerId}</td>
                            <td>${data.beers[item].name}</td>
                            <td>${data.beers[item].description}</td>
                            <td>${data.beers[item].firstBrewed}</td>
                            <td>
                                <img src="${data.beers[item].image}" height="80">
                            </td>
                            <td>
                                <button type="button" class="btn btn-primary" onclick="window.location.href = '#modal'; Details(${data.beers[item].beerId})">Details</button>
                            </td>
                        </tr>
                    `
                    }
                }
                else if (!monthValue && yearValue) {
                    if (aaaa === yearValue) {
                        render.innerHTML += `
                        <tr>
                        <td>${i++}</td>
                        <td>${data.beers[item].beerId}</td>
                        <td>${data.beers[item].name}</td>
                        <td>${data.beers[item].description}</td>
                        <td>${data.beers[item].firstBrewed}</td>
                        <td>
                            <img src="${data.beers[item].image}" height="80">
                        </td>
                        <td>
                        <button type="button" class="btn btn-primary" onclick="window.location.href = '#modal'; Details(${data.beers[item].beerId})">Details</button>
                        </td>
                    </tr>
                    `
                    }
                }
                else {
                    if (aaaa === yearValue && mm === monthValue) {
                        render.innerHTML += `
                        <tr>
                        <td>${i++}</td>
                        <td>${data.beers[item].beerId}</td>
                        <td>${data.beers[item].name}</td>
                        <td>${data.beers[item].description}</td>
                        <td>${data.beers[item].firstBrewed}</td>
                        <td>
                            <img src="${data.beers[item].image}" height="80">
                        </td>
                        <td>
                        <button type="button" class="btn btn-primary" onclick="window.location.href = '#modal'; Details(${data.beers[item].beerId})">Details</button>
                        </td>
                    </tr>
                    `
                    }
                }
            }
            else if (!monthValue && !yearValue) {
                render.innerHTML += `
                <tr>
                <td>${i++}</td>
                <td>${data.beers[item].beerId}</td>
                <td>${data.beers[item].name}</td>
                <td>${data.beers[item].description}</td>
                <td>${data.beers[item].firstBrewed}</td>
                <td>
                    <img src="${data.beers[item].image}" height="80">
                </td>
                <td>
                <button type="button" class="btn btn-primary" onclick="window.location.href = '#modal'; Details(${data.beers[item].beerId})">Details</button>
                </td>
            </tr>
            `
            }
        }
    }
    catch (err) {
        return console.log(err.message);
    }
}

async function Details(id) {
    try {
        var contributedBy = document.getElementById('contributedBy');
        var brewersTips = document.getElementById('brewersTips');
        var price = document.getElementById('price');
        var firstBrewed = document.getElementById('firstBrewed');
        var titleBeer = document.getElementById('titleBeer');
        var image = document.getElementById('image');
        var likeItem = document.getElementById('like');
        var comments = document.getElementById('comments');

        const TableComments = document.querySelector('#TableComments');
        TableComments.innerHTML = '';

        idItem = id;

        brewersTips.innerHTML = "";
        contributedBy.innerHTML = "";
        price.innerHTML = "";
        firstBrewed.innerHTML = "";
        titleBeer.innerHTML = "";
        image.src = "";
        likeItem.innerHTML = "";

        comments.value = "";

        var filter = `/${id}`;

        const response = await fetch(URL + filter, {
            method: 'GET',
            headers: {
                'X-API-KEY': API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error('Error retrieving shows');
        }

        const data = await response.json();

        titleBeer.innerHTML = data.beer.beerId + ": " + data.beer.name;
        image.src = data.beer.image;
        brewersTips.innerHTML = data.beer.brewersTips;
        contributedBy.innerHTML = data.beer.contributedBy;
        price.innerHTML = "$" + data.beer.price + ".00";
        firstBrewed.innerHTML = data.beer.firstBrewed;
        likeItem.innerHTML = data.beer.likes;

        TableComments.innerHTML = '';
        var i = 1;

        for (let item in data.beer.comments) {
            TableComments.innerHTML += `
                <tr>
                    <td>${i++}</td>
                    <td>${data.beer.comments[item].comment}</td>
                    <td>${data.beer.comments[item].dateComment}</td>                
                </tr>
            `
        }
    }
    catch (err) {
        return console.log(err.message);
    }

}

document.getElementById("saveLike").addEventListener("click", function () {
    Likes();
});

async function Likes() {

    try {

        var filter = `/${idItem}/like`;

        const response = await fetch(URL + filter, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'X-API-KEY': API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error('Error retrieving shows');
        }

        const responseBody = await response.json();
        Details(idItem);

    }
    catch (err) {
        return console.log(err.message);
    }
}

document.getElementById("saveComment").addEventListener("click", function () {
    var comments = document.getElementById('comments');
    saveComment(comments.value);
});

async function saveComment(text) {

    try {

        console.log(text);

        var filter = `/${idItem}/comment`;

        const response = await fetch(URL + filter, {
            method: 'POST',
            body: JSON.stringify({ comment: text }),
            headers: {
                'Content-type': 'application/json',
                'X-API-KEY': API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error('Error retrieving shows');
        }

        const responseBody = await response.json();

    }
    catch (err) {
        return console.log(err.message);
    }

}