$(document).ready(function ($) {

    var config = {
        'load-more': true,
        'infinite-scroll': true,
        'infinite-scroll-step': 9999,
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

    function setDemoImages(){
        $('img').each(function (index, element) {
            $(this).attr('src', $(this).attr('src').replace("http://localhost:2368", "https://our.status.im"));
        });
    }

    setGalleryRation();
    setDemoImages();

    var msnry;

    $('[data-toggle="tooltip"]').tooltip();

    $(window).on('load', function(event) {

        setGalleryRation();

        // var elem = document.querySelector('.loop-grid');
        // msnry = new Masonry(elem, {
        //     itemSelector: '.loop-grid .post',
        //     // columnWidth: 340,
        //     percentPosition: true,
        //     gutter: 0,
        //     transitionDuration: 0
        // });

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
                    // post.addClass('invisible');
                    $('#content .loop-grid').append( post );
                    setDemoImages();
                    $('[data-toggle="tooltip"]').tooltip();
                    // $.each(post, function(index, val) {
                    //     var $this = $(this);
                    //     $('#content .loop-grid').imagesLoaded( function() {
                    //         msnry.appended( $this );
                    //         $this.removeClass('invisible');
                    //     });
                    // });
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

    $(".share").stick_in_parent({
        offset_top: 50
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

});