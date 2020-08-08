// Constants.
const ENTER_KEY = 13;
const GALLERY_SEARCH_PATTERN = '.net/galleries/';
const PAGE_COUNT_SEARCH_PATTERN = 'num_pages\\u0022:';

// Member variables.
var loaded = false;
var sauce = 0;
var gallerySauce = 0;

// Init.
$('#sauceInput').mask('00000000');

$('#loadBtn').click(function() {
    loadSauce();
});

$('#menuBtn').on('click', () => {
    if (!loaded)
        return;
    
    $('#loadBtn').attr('disabled', false);
    unloadSauce();
});

$(document).on('keydown', (event) => {
    if (!loaded && event.keyCode === ENTER_KEY) {
        loadSauce();
    }
});

function loadSauce() {
    $('#loadBtn').attr('disabled', true);
    loaded = true;
    sauce = $('#sauceInput').val();

    updateTabName();

    // Fade out sauce form and fade in sauce.
    animateCSS('#sauceForm', 'fadeOut', function() {
        $('#sauceForm').hide();
        $('#sauceView').show();
        animateCSS('#sauceView', 'fadeIn', null);
    });

    let sauceLink = `https://nhentai.net/g/${sauce}`;

    $.getJSON('https://api.allorigins.win/get?url=' + encodeURIComponent(sauceLink), function (data) {
        if (data.status.http_code != 200) {
            alert("Status code: " + data.status.http_code);
            return;
        }

        str = data.contents;
        let start = str.indexOf(GALLERY_SEARCH_PATTERN) + GALLERY_SEARCH_PATTERN.length;
        let end = str.indexOf('/', start);

        if (end > start && end > -1) {
            // Parse gallery number.
            gallerySauce = str.substring(start, end);
            console.log(gallerySauce);

            // Parse page count.
            let pageCountStart = str.lastIndexOf(PAGE_COUNT_SEARCH_PATTERN) + PAGE_COUNT_SEARCH_PATTERN.length;
            let pageCount = 0;

            if (pageCountStart > PAGE_COUNT_SEARCH_PATTERN.length) {
                let pageCountEnd = str.indexOf(',', pageCountStart);
                pageCount = parseInt(str.substring(pageCountStart, pageCountEnd));
            }

            let htmlBuild = '<p><a href="' + sauceLink + '">Direct Sauce Link</a></p>';
            htmlBuild += '<p>Page Count: ' + pageCount + '</p>';

            for (let i = 0; i < pageCount; i++) {
                let page = i + 1;   // One index...
                htmlBuild += '<img src="https://i.nhentai.net/galleries/' + gallerySauce + '/' + page + '.jpg">'
            }

            $('#sauceContents').html(htmlBuild);
        }
    });
}

function unloadSauce() {
    if (loaded) {
        // Fade out sauce and fade in sauce form.
        animateCSS('#sauceView', 'fadeOut', function() {
            $('#loadBtn').attr('disabled', false);
            $('#sauceView').hide();
            
            $('#sauceForm').show();
            animateCSS('#sauceForm', 'fadeIn', null);
        });

        loaded = false;
        updateTabName();
    }
}

function updateTabName() {
    if (loaded)
        document.title = sauce + ' | Gimme Dat Sauce';
    else
        document.title = 'Gimme Dat Sauce';
}
