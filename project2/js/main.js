"use strict";

        window.onload = (e) => {document.querySelector("#search-button").onclick = searchButtonClicked};

        let searchTerm = "";
        let sortType = "";
        let cardColor = "";
        let cardType = "";
        let cardLimit;
        let cardData;

        function searchButtonClicked(){

            const SCRYFALL_URL = "https://api.scryfall.com/cards/search?order=";

            let url = SCRYFALL_URL;

            //adding a sort type
            let sort = document.querySelector("#sorts").value;
            sortType = sort;

            url += sortType;

            //retrieving search term from search bar
            let term = document.querySelector("#term").value
            searchTerm = term;

            term.trim();

            //handleing empty search bar
            if(!term) {
                url += "&q=";
            }
            else{
                url += "&q=fo:" + term;
            }

            //adding a limtit check with proffessor since it seems the scryfall api doesnt have a limit
            let limit = document.querySelector("#limit").value;
            cardLimit = limit;


            //adding a color
            let color = document.querySelector("#colors").value;
            cardColor = color;

            if(cardColor != 'none'){
                url += "+c:" + cardColor;
            }

            //adding a card type
            let type = document.querySelector("#types").value;
            cardType = type;

            if(cardType != 'none'){
                url += "+t:" + cardType;
            }

            //updating status
            document.querySelector("#status").innerHTML = `<h3>
            Searching in order of ${sortType.toUpperCase()} for 
            ${cardColor.toUpperCase()} colored cards of ${cardType.toUpperCase()} type </h3>`;

            //calling getData method 
            getData(url);

        }
        //getting data from api
        function getData(url){
            let xhr = new XMLHttpRequest();

            xhr.onload = dataLoaded;
            xhr.onerror = (e) => {
                console.log("an error has happened");
            }

            xhr.open("GET", url);
            xhr.send();           

            }

        function dataLoaded(e){
            let xhr = e.target;

            let data = JSON.parse(xhr.responseText);

            if(!data.data || data.length == 0 ){
                document.querySelector("#status").innerHTML = `<h3>No results were found for searched term of ${searchTerm.toUpperCase()} of 
                ${cardColor.toUpperCase()} color and 
                ${cardType.toUpperCase()} type. Please try different search.</3>`;
            }

            //reference to data object data
            let results = data.data;

            cardData = results.length;

            let bigstring = "";

            if(cardLimit == "all"){
                cardLimit = cardData;
            }


            for(let i = 0; i < cardLimit; i++){
                let card = results[i];

                //replacing spaces with +
                let name = card.name;
                 //console.log(name);
                //fixing names that contain //
                if(name.indexOf("/") !== -1){
                    name = name.substring(0, name.indexOf("/"));
                }

                //removes all special characters except em dash
                let cleanName = name.replaceAll(/[^\w\s]|_/g, "");
            

                //finds the image through the exact card name
                let smallURL = "https://api.scryfall.com/cards/named?exact=" + cleanName + "&format=image";
                let cardLink = "https://scryfall.com/card/" + card.set + "/" + card.collector_number+ "/"+ cleanName;

                let anotherurl = card['image_uris'];

                if(anotherurl){
                    smallURL = card['image_uris']['png'];
                }
                
                console.log(anotherurl);
            
               //adding cards to content
                let line = `
                <div class = 'card'>
                    <a target='_blank' href='${cardLink}'> ${name}</a>
                    <img src='${smallURL}' title = '${card.name}' /> 
                </div>`;
                
                bigstring += line; 
            }

            document.querySelector("#content").innerHTML = bigstring;
            document.querySelector("#results").innerHTML =  `A total of ${cardData} card(s) were found`;

        }

        //DOM references
        const searchTermField = document.querySelector("#term");
        const limitSelect = document.querySelector("#limit");
        const sortSelect = document.querySelector("#sorts");
        const colorSelect = document.querySelector("#colors");
        const typeSelect = document.querySelector("#types");
        const status = document.querySelector("#status");

        //prefixes and keys
        const prefix = "tp5262- ";
        const searchKey = prefix + "search-term";
        const limitKey = prefix + "number-of-cards";
        const sortKey = prefix + "sort-type";
        const colorKey = prefix + "color";
        const typeKey = prefix + "card-type";

        //function for onchange adds to local storgate, setting variables
        searchTermField.onchange = function (e) {
            localStorage.setItem(searchKey, e.target.value);
           // status.innerHTML = `Term Saved "${e.target.value}"`;
        }

        limitSelect.onchange = function (e) {
            localStorage.setItem(limitKey, e.target.value);
            //status.innerHTML = `Card limit Saved "${e.target.value}"`;
        }

        sortSelect.onchange = function (e) {
            localStorage.setItem(sortKey, e.target.value);
           // status.innerHTML = `Sort type Saved "${e.target.value}"`;
        }

        colorSelect.onchange = function (e) {
            localStorage.setItem(colorKey, e.target.value);
           // status.innerHTML = `Color Saved "${e.target.value}"`;
        }

        typeSelect.onchange = function (e) {
            localStorage.setItem(typeKey, e.target.value);
           // status.innerHTML = `Card type Saved "${e.target.value}"`;
        }

        //getting from local storgate getting input
        const storedTerm = localStorage.getItem(searchKey);
        const storedLimit = localStorage.getItem(limitKey);
        const storedSort = localStorage.getItem(sortKey);
        const storedColor = localStorage.getItem(colorKey);
        const storedType = localStorage.getItem(typeKey);


        //saving the input from local storage
        if( storedTerm ){
            searchTermField.value = storedTerm;
        }
        if( storedLimit ){
            limitSelect.value = storedLimit;
        }
        if( storedSort ){
            sortSelect.value = storedSort;
        }
        if( storedColor ){
            colorSelect.value = storedColor;
        }
        if( storedType ){
            typeSelect.value = storedType;
        }

        //making the accordion function for mobile version

        let acc = document.querySelector(".accordion");
        let filters = document.querySelector("#widgets");


            acc.addEventListener("click", function() {
            console.log("clicking works");
            if (filters.style.display === "flex") {
                filters.style.display = "none";
            } 
            else {
                filters.style.display = "flex";
            }
        });
        