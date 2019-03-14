$(document).ready(function ($) {

    var config = {
        'load-more': true,
        'infinite-scroll': false,
        'infinite-scroll-step': 1,
        'content-api-host': 'http://localhost:2368',
        'content-api-key': '8a13e02a8917186f02014db742',
    };

    var ghostSearch = new GhostSearch({
        host: config['content-api-host'],
        key: config['content-api-key'],
        input: '#search-input',
        results: '#search-results',
        api: {
            parameters: { 
                fields: ['title', 'slug', 'url'],
            },
        },
        template: function(result) {
            return '<a href="' + result.url + '">' + result.title + '</a>';  
        }
    });

    window.addEventListener('click', function(e){   
        if (document.getElementById('search-form').contains(e.target)){
            $('#search-form').removeClass('inactive');
        } else{
            $('#search-form').addClass('inactive');
        }
    });

    $('img').each(function (index, element) {
        $(this).attr('src', $(this).attr('src').replace("http://localhost:2368", "https://our.status.im"));
    });

    var msnry;
    
    var elem = document.querySelector('.loop');
    msnry = new Masonry(elem, {
        itemSelector: '.loop .post',
        // columnWidth: 340,
        percentPosition: true,
        gutter: 0,
        transitionDuration: 0
    });

});