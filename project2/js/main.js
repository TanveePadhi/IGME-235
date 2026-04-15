"use strict";

        window.onload = (e) => {document.querySelector("#search-button").onclick = searchButtonClicked};

        //global scope variables
        let searchTerm = "";
        let sortType = "";
        let cardColor = "";
        let cardType = "";
        let cardRarity = "";
        let cardLang = "";
        let cardLimit;
        let cardData;

        //search button function
        function searchButtonClicked(){

            //the search link starting with order of cards
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

            //adding a limit check with for loop at the end since it seems the scryfall api doesnt have a limit command in url
            let limit = document.querySelector("#limit").value;
            cardLimit = limit;


            //adding a color
            let color = document.querySelector("#colors").value;
            cardColor = color;

            //checking if user did choose a color or not
            if(cardColor != 'none'){
                url += "+c:" + cardColor;
            }

            //adding a card type
            let type = document.querySelector("#types").value;
            cardType = type;

            //checking if user did choose a card type or not
            if(cardType != 'none'){
                url += "+t:" + cardType;
            }

            //adding a card rarity
            let rarity = document.querySelector("#rarities").value;
            cardRarity = rarity;

            if(cardRarity != 'none'){
                url += "+r:" + cardRarity;
            }

            //adding a card language
            let lang = document.querySelector("#langs").value;
            cardLang = lang;

            if(cardLang != 'none'){
                url += "+lang:" + cardLang;
            }

            //updating status
            document.querySelector("#status").innerHTML = `<h3>
            Searching for a card that contains ${term.toUpperCase()} in order of ${sortType.toUpperCase()} for 
            ${cardColor.toUpperCase()} colored cards of ${cardType.toUpperCase()} type and of ${cardRarity.toUpperCase()} rarity.</h3>`;

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

            let cardList = JSON.parse(xhr.responseText);

            if(!cardList.data || cardList.length == 0 ){
                document.querySelector("#status").innerHTML = `<h3>No results were found for searched term of ${searchTerm.toUpperCase()} of 
                ${cardColor.toUpperCase()} color and 
                ${cardType.toUpperCase()} type. Please try different search.</3>`;
                document.querySelector("#content").innerHTML  = "";
            }

            //reference to data object data
            let results = cardList.data;

            cardData = results.length;

            let bigstring = "";

            for(let i = 0; i < cardLimit; i++){
                if(i >= cardList.total_cards){
                    break;
                }
                let card = results[i];
                let name;
                
                try{
                    name = card.name;
                }
                catch(error){
                    console.log("error 1 caught");
                    name = "";
                }
                //fixing names that contain //
                if(name.indexOf("/") !== -1){
                    name = name.substring(0, name.indexOf("/"));
                }

                //removes all special characters except em dash
                let cleanName = name.replaceAll(/[^\w\s]|_/g, "");
            

                //finds the image through the exact card name
                let smallURL = "https://api.scryfall.com/cards/named?exact=" + cleanName + "&format=image";
                let cardLink;
                let anotherurl;

                try{
                    cardLink = "https://scryfall.com/card/" + card.set + "/" + card.collector_number+ "/"+ cleanName;
                    anotherurl = card['image_uris'];
                }
                catch(error){
                    console.log("error 2 caught");
                    cardLink = "";
                    anotherurl = ""
                }

                if(anotherurl){
                    smallURL = card['image_uris']['png'];
                }
                
                console.log(anotherurl);

                let line;

                if(name != ""){
                    line = `
                        <div class = 'card'>
                            <a target='_blank' href='${cardLink}'> ${name}</a>
                            <img src='${smallURL}' title = '${card.name}' /> 
                        </div>`;
                }
                else{
                    line = "";
                }
            
               //adding cards to content
                
                bigstring += line; 
            }

            document.querySelector("#content").innerHTML = bigstring;
            document.querySelector("#results").innerHTML =  `A total of ${cardList.total_cards} card(s) were found. You chose to display ${cardLimit} `;

        }

        //DOM references
        const searchTermField = document.querySelector("#term");
        const limitSelect = document.querySelector("#limit");
        const sortSelect = document.querySelector("#sorts");
        const colorSelect = document.querySelector("#colors");
        const typeSelect = document.querySelector("#types");
        const raritySelect = document.querySelector("#rarities");
        const langSelect = document.querySelector("#langs");
        //const status = document.querySelector("#status");

        //prefixes and keys
        const prefix = "tp5262- ";
        const searchKey = prefix + "search-term";
        const limitKey = prefix + "number-of-cards";
        const sortKey = prefix + "sort-type";
        const colorKey = prefix + "color";
        const typeKey = prefix + "card-type";
        const rarityKey = prefix + "card-rarity";
        const langKey = prefix + "language";

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
            //status.innerHTML = `Card type Saved "${e.target.value}"`;
        }

        raritySelect.onchange = function (e) {
            localStorage.setItem(rarityKey, e.target.value);
            //status.innerHTML = `Card type Saved "${e.target.value}"`;
        }

        langSelect.onchange = function (e) {
            localStorage.setItem(langKey, e.target.value);
            //status.innerHTML = `Card type Saved "${e.target.value}"`;
        }

        //getting from local storgate getting input
        const storedTerm = localStorage.getItem(searchKey);
        const storedLimit = localStorage.getItem(limitKey);
        const storedSort = localStorage.getItem(sortKey);
        const storedColor = localStorage.getItem(colorKey);
        const storedType = localStorage.getItem(typeKey);
        const storedRarity = localStorage.getItem(rarityKey);
        const storedLang = localStorage.getItem(langKey);


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
        if( storedRarity ){
            raritySelect.value = storedRarity;
        }
        if( storedLang ){
            langSelect.value = storedLang;
        }

        //making the accordion function for mobile version

        let acc = document.querySelector(".accordion");
        let filters = document.querySelector("#widgets");


            acc.addEventListener("click", function() {

            if (filters.style.display === "flex") {
                filters.style.display = "none";
            } 
            else {
                filters.style.display = "flex";
            }
        });
        