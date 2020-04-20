$(document).ready(function ($) {

    var config = {
        'load-more': true,
        'infinite-scroll': false,
        'infinite-scroll-step': 9999,
        'content-api-host': 'https://our.status.im',
        'content-api-key': '10e7f8c1f793d2945ea1177076',
    };

    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
        h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

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

    setGalleryRation();

    var msnry;

    $('[data-toggle="tooltip"]').tooltip();

    $('#load-posts').addClass('active');
    $('.pagination-links').addClass('d-none');

    $(window).on('load', function(event) {

        setGalleryRation();


        var currentPage = 1;
        var pathname = window.location.pathname;
        var step = 0;

        // remove hash params from pathname
        pathname = pathname.replace(/#(.*)$/g, '').replace('/\//g', '/');

        // Load more posts on click
        if (config['load-more']) {

            $('#load-posts').on('click', function(event) {
                event.preventDefault();

                if (currentPage == maxPages) {
                    $('#load-posts').addClass('end').text($('#load-posts').attr('data-end'));
                    $('body').addClass('end-posts');
                    return;
                };

                var $this = $(this);

                // next page
                currentPage++;

                if ($('body').hasClass('paged')) {
                    pathname = '/';
                };

                // Load more
                var nextPage = pathname + 'page/' + currentPage + '/';

                $.get(nextPage, function (content) {
                    step++;
                    var post = $(content).find('.post');
                    $('#content .loop-grid').append( post );
                    $('[data-toggle="tooltip"]').tooltip();
                });

            });
        };

        // Infinite scroll
        if (config['infinite-scroll'] && config['load-more']) {
            var checkTimer = 'on';
            if ($('#load-posts').length > 0) {
                $(window).on('scroll', function(event) {
                    var timer;
                    if (isScrolledIntoView('#load-posts') && checkTimer == 'on' && step < config['infinite-scroll-step']) {
                        $('#load-posts').click();
                        checkTimer = 'off';
                        timer = setTimeout(function() {
                            checkTimer = 'on';
                            if (step == config['infinite-scroll-step']) {
                                $('#load-posts').addClass('step');
                            };
                        }, 1000);
                    };
                });
            };
        };

    });

    // Check if element is into view when scrolling
    function isScrolledIntoView(elem) {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();

        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(elem).height();

        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }

    var checkIfSticky = 0;
    if(w >= 992){
        $(".share").stick_in_parent({
            offset_top: 30
        });
        $(".dark-mode-toggle").stick_in_parent({
            offset_top: 91
        });
        checkIfSticky = 1;
    }

    $(window).on('resize', function(event) {
        w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        if (w < 992) {
            $(".share").trigger("sticky_kit:detach");
            checkIfSticky = 0;
        }else{
            if (checkIfSticky == 0) {
                $(".share").stick_in_parent({
                    offset_top: 30
                });
                checkIfSticky++;
            }
        };
    });

    // Set the right proportion for images inside the gallery
    function setGalleryRation(){
        $('.kg-gallery-image img').each(function(index, el) {
            var container = $(this).closest('.kg-gallery-image');
            var width = $(this)[0].naturalWidth;
            var height = $(this)[0].naturalHeight;
            var ratio = width / height;
            container.attr('style', 'flex: ' + ratio + ' 1 0%');
        });
    }

    $('.dark-mode-toggle a').on('click', function(event) {
        event.preventDefault();
        $('body').toggleClass('dark-mode');
    });

});