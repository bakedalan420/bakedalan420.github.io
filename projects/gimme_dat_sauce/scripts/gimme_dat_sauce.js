// Constants.
const ENTER_KEY = 13;
const JSON_SEARCH_PATTERN = 'window._gallery = JSON.parse(\"';

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

function getImageExtension(type) {
    switch(type) {
        case 'j':
            return '.jpg';
        case 'p':
            return '.png';
        case 'g':
            return '.gif';
    }

    console.log(`Cannot parse type ${type}`);
    return '';
}

function loadSauce() {
    $('#loadBtn').attr('disabled', true);
    loaded = true;
    sauce = $('#sauceInput').val();

    // Fade out sauce form and fade in sauce.
    animateCSS('#sauceForm', 'fadeOut', function() {
        $('#sauceForm').hide();
        $('#sauceView').show();
        animateCSS('#sauceView', 'fadeIn', null);
    });

    let sauceLink = `https://nhentai.net/g/${sauce}`;

    $.getJSON('https://api.allorigins.win/get?url=' + encodeURIComponent(sauceLink), function (data) {
        if (data.status.http_code != 200) {
            alert(`Status code: ${data.status.http_code}`);
            return;
        }

        // Extract API JSON from HTML source.
        str = data.contents;
        let jsonDataStart = str.indexOf(JSON_SEARCH_PATTERN) + JSON_SEARCH_PATTERN.length;
        let jsonDataEnd = str.indexOf('\");', jsonDataStart);

        if (jsonDataStart === -1 || jsonDataEnd === -1 || jsonDataStart >= jsonDataEnd)
        {
            alert('Failed to parse JSON');
            return;
        }

        str = str.substring(jsonDataStart, jsonDataEnd);

        // Unescape unicode.
        let regex = /\\u([\d\w]{4})/gi;

        str = str.replace(regex, function (match, group) {
            return String.fromCharCode(parseInt(group, 16));
        });

        let apiJson = JSON.parse(str);
        gallerySauce = apiJson.media_id;
        let pageCount = apiJson.num_pages;

        let htmlBuild = `<p><a href=\"${sauceLink}\">Direct Sauce Link</a></p>`;
        htmlBuild += `<p>Title: ${apiJson.title.english}</p>`;
        htmlBuild += `<p>Page Count: ${pageCount}</p>`;

        for (let i = 0; i < pageCount; i++) {
            let pageData = apiJson.images.pages[i];
            let pageNum = i + 1;

            let targetURL = `https://i.nhentai.net/galleries/${gallerySauce}/${pageNum}${getImageExtension(pageData.t)}`;
            targetURL = encodeURIComponent(targetURL);
            htmlBuild += `<img src=\"http://34.86.126.25/?url=${targetURL}&maxRes=1920&quality=70&enforceJPEG\" style=\"width:100%;\">`;
        }

        $('#sauceContents').html(htmlBuild);
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
    }
}
