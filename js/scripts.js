// COMP 2112 | Assignment 1
// Ryan Quigley
// 200239087            
            
            // Array of Games
            let games = [
                {'publisher' : 'Namco', 
                'avatar' : 'https://archive.org/services/img/msdos_Pac-Man_1983', 
                'subject' : 'Pac-Man', 
                'body' : 'Pac-Man stars a little, yellow dot-muncher who works his way around to clear a maze of the dots.', 
                'date' : '1983', 
                'ifrmSrc' : 'https://archive.org/embed/msdos_Pac-Man_1983'},
             
                {'publisher' : 'Broderbund', 
                'avatar' : 'https://archive.org/services/img/msdos_Where_in_the_World_is_Carmen_Sandiego_1985', 
                'subject' : 'Where in the World is Carmen Sandiego', 
                'body' : 'Capture the thief that stole the artifact using clues dealing with your knowledge of geography.', 
                'date' : '1985', 
                'ifrmSrc' : 'https://archive.org/embed/msdos_Where_in_the_World_is_Carmen_Sandiego_1985'},
             
                {'publisher' : 'Ingenuity', 
                'avatar' : 'https://archive.org/services/img/msdos_Crosscountry_Canada_1991', 
                'subject' : 'Crosscountry Canada', 
                'body' : 'Drive an 18-wheel truck picking up and delivering a variety of commodities with typed-in commands.', 
                'date' : '1991', 
                'ifrmSrc' : 'https://archive.org/embed/msdos_Crosscountry_Canada_1991'},
            ];
            
            //Anchor Points
            let selectedGame = 0;
            let linkTrash = document.getElementById('linkTrash');
            let linkInbox = document.getElementById('linkInbox');
            let linkCompose = document.getElementById('linkCompose');

            // Clicking the "Inbox" link will display the games that haven't been deleted
            linkTrash.addEventListener('click', function(e) {
                e.preventDefault();
                let filtered = games.filter( game => game.deleted);
                selectedGame = 0;
                render(filtered);
            });
        
            // Clicking the "Trash" link will display the games that have been deleted
            linkInbox.addEventListener('click', function(e) {
                e.preventDefault();
                let mainInbox = games.filter( game => !game.deleted);
                selectedGame = 0;
                render(mainInbox); 
            });

            // The InnerHTML for the form to create a new game object
            linkCompose.addEventListener('click', composeForm);
            function composeForm(e) {
                e.preventDefault();
                let html_form = `
                <form name="newgame" class="pure-form pure-form-aligned">
                <fieldset>
                    <div class="pure-control-group">
                        <label for="subject">Game</label>
                        <input id="subject" type="text" placeholder="Subject">
                    </div>
                    <div class="pure-control-group">
                        <label for="publisher">Publisher</label>
                        <input id="publisher" type="text" placeholder="Publisher">
                    </div>
                    <div class="pure-control-group">
                        <label for="date">Year Created</label>
                        <input id="date" type="text" placeholder="Year">
                    </div>
                    <div class="pure-control-group">
                        <label for="body">Game Description</label>
                        <textarea id="body" type="text" class="pure-input-1-2" rows="5" cols="100"></textarea>
                    </div>
                    <div class="pure-control-group">
                        <label for="avatar">Picture URL</label>
                        <input id="avater" type="text" placeholder="Avatar">
                    </div>
                    <div class="pure-control-group">
                        <label for="iframe">IFrame URL</label>
                        <input id="iframe" type="text" placeholder="IFrame Code">
                        <span class="pure-form-message-inline"><a href="https://archive.org/details/softwarelibrary_msdos_games">Games Archive</span>
                    </div>
                    <div class="pure-controls">  
                        <button id="submit" type="submit" class="pure-button pure-button-primary">Submit</button>
                    </div>
                </fieldset>
            </form>
                `;
                let main = document.getElementById('main');
                main.innerHTML = html_form;

                let submit = document.getElementById('submit')
                submit.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // assigns each form field with an array id
                    let obj_newgame = {
                        publisher : document.forms.newgame.publisher.value,
                        avatar : document.forms.newgame.avater.value,
                        subject : document.forms.newgame.subject.value,
                        body : document.forms.newgame.body.value,
                        date : document.forms.newgame.date.value,
                        ifrmSrc : document.forms.newgame.iframe.value
                    }

                    // Puts the newly created object at the top of the array list and refreshes the list displayed
                    games.unshift(obj_newgame);
                    setLocalStorage();
                    linkInbox.click();
                });
            };

            // InnerHTML for the Inbox list and looped to display each item
            function render(games){
            let gameInfo = `
            ${games.map( (game, index) => `
                                <div class="email-item pure-g" data-id="${index}">
                                    <div class="pure-u"><img width="64" height="64" alt="" class="email-avatar" src="${game.avatar}"></div>
                                    <div class="pure-u-3-4">
                                        <h5 class="email-name">${game.publisher}</h5>
                                        <h4 class="email-subject">${game.subject}</h4>
                                        <p class="email-desc">${game.body}</p>
                                    </div>
                                </div>`).join('')}
            `;

            
            let inbox = document.getElementById('list');
            inbox.innerHTML = gameInfo;
            initialize(games);
            
    };

    // Creates a relationship between the Inbox list and what displays in the Body
    // When a different game is clicked on then the appropriate body will display
    function initialize(games) {
        let gameList = Array.from(document.querySelectorAll('[data-id]'));
        gameList.map( (game, index) => game.addEventListener('click', function(e) {
            gameList[selectedGame].classList.remove('email-item-selected');
            game.classList.add('email-item-selected');
            selectedGame = index;
            showGameBody(index, games);
        }))
    
        // if there are games in the list then it will display them, if not, then it will simply show "No Game"
        if (games.length) {
            gameList[selectedGame].classList.add('email-item-selected');
            showGameBody(selectedGame, games);
        } else {
            let main = document.getElementById('main');
            main.innerHTML = '<h1 style="color: #ccc; padding-left: 10px;">No Games</h1>';
        }
    
    };

    // InnerHTML for the body of the game
    function showGameBody(idx, games) {
        let displayGameBody = `
        <div class="email-content">
        <div class="email-content-header pure-g">
            <div class="pure-u-1-2">
                <h1 class="email-content-title">${games[idx].subject}</h1>
                <p class="email-content-subtitle">
                    By <a>${games[idx].publisher}</a> circa: <span>${games[idx].date}</span>
                </p>
            </div>

            <div class="email-content-controls pure-u-1-2">
                <button class="secondary-button pure-button">Reply</button>
                <button class="secondary-button pure-button">Forward</button>
                <button id="delete" class="secondary-button pure-button" data-id="${idx}">${games[idx].deleted == true ? 'Deleted' : 'Delete'}</button>
            </div>
        </div>

        <div class="email-content-body">
            <iframe src="${games[idx].ifrmSrc}" frameborder="0"></iframe>
        </div>
    </div>`;

    let main = document.getElementById('main');
    main.innerHTML = displayGameBody;

    // the "Delete" button is in the Body, so we must code it here
    let btn_delete = document.getElementById('delete');
    btn_delete.addEventListener('click', function() {
        deleteGame(this.dataset.id, games);
    });
    }

    // When the "Delete" button is clicked then game object will recieve a trait called "deleted"
    // if the game object already has the "deleted" trait, then it will delete that trait when clicked
    function deleteGame(index, games) {
        if (!games[index].deleted) {
            games[index].deleted = true;

            setLocalStorage();

            let mainInbox = games.filter( game => !game.deleted);
            selectedGame = 0;
            render(mainInbox); 
        } else {
            delete games[index].deleted;
            let filtered = games.filter( game => game.deleted);
            selectedGame = 0;
            render(filtered);
        }
        
    }

    function setLocalStorage() {
        localStorage.setItem('items', JSON.stringify(games));
    }
        
    
    
    if (localStorage.getItem('items')) {
        games = JSON.parse(localStorage.getItem('items'));
        let filtered = games.filter( game => !game.deleted);
        render(filtered);
    } else {
        render(games);
    }

    

    









    