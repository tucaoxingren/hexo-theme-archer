let toggleHeader = function () {
    // 判断是否为post-page
    let isPostPage = 0;
    if (typeof document.getElementsByClassName('post-body')[0] !== 'undefined') {
        isPostPage = 1;
    }

    let $banner = $('.banner:first'),
        $postBanner = $banner.find('.post-title a'),
        $bgEle = $('.site-intro:first'),
        $homeLink = $('.home-link:first'),
        $backTop = $('.back-top:first'),
        $sidebarMenu = $('.header-sidebar-menu:first'),
        bgTitleHeight = $bgEle.offset().top + $bgEle.outerHeight();
    // $toc = $('.toc:first'),

    // 滚动式切换文章标题和站点标题    
    let previousHeight = 0,
        continueScroll = 0;

    function isScrollingUpOrDown(currTop) {
        continueScroll += currTop - previousHeight;
        if (continueScroll > 50) {
            // 向下滑动
            continueScroll = 0;
            return 1;
        } else if (continueScroll < -50) {
            //向上滑动
            continueScroll = 0;
            return -1;
        } else {
            return 0;
        }
    }

    let crossingState = -1;
    let isHigherThanIntro = false;

    function isCrossingIntro(currTop) {
        // 向下滑动超过intro
        if (currTop > bgTitleHeight) {
            if (crossingState !== 1) {
                crossingState = 1;
                isHigherThanIntro = false;
                return 1;
            }
        }
        // 向上滑动超过intro
        else {
            if (crossingState !== -1) {
                crossingState = -1;
                isHigherThanIntro = true;
                return -1;
            }
        }
        return 0;
    }

    let ticking = false;
    function scrollHandler(that) {
        if (!ticking) {
            requestAnimationFrame(function update() {
                let scrollTop = $(document).scrollTop();
                let crossingState = isCrossingIntro(scrollTop);
                // intro边界切换
                if (crossingState == 1) {
                    $homeLink.addClass('home-link-hide');
                    $backTop.addClass('back-top-show');
                    $sidebarMenu.addClass('header-sidebar-menu-black');
                } else if (crossingState == -1) {
                    $homeLink.removeClass('home-link-hide');
                    $banner.removeClass('banner-show');
                    $backTop.removeClass('back-top-show');
                    $sidebarMenu.removeClass('header-sidebar-menu-black');
                }
                // 上下滑动切换
                // 如果不是post-page 以下忽略
                if (isPostPage) {
                    let upDownState = isScrollingUpOrDown(scrollTop);
                    if (upDownState == 1) {
                        $banner.removeClass('banner-show');
                    } else if (upDownState == -1 && !isHigherThanIntro) {
                        $banner.addClass('banner-show');
                    }
                }
                previousHeight = $(that).scrollTop();
                ticking = false;
            });
            ticking = true;
        }
    }


    $(document).on('scroll', function () {
        scrollHandler(this);
    });


    // 返回顶部
    function backTop(event) {
        event.preventDefault();
        let topTimer = setInterval(function () {
            let currTop = $(document).scrollTop();
            window.scrollTo(0, Math.max(Math.floor(currTop * 0.8)));
            if (currTop === 0) {
                clearInterval(topTimer);
            }
        }, 20);
    }
    [$postBanner, $backTop].forEach(function (ele) {
        ele.on('click', backTop);
    });
};



export {
    toggleHeader
};