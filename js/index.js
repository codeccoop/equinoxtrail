document.addEventListener('DOMContentLoaded', function () {
    document.body.classList.add('loaded');
    // var headerHeight = window.innerWidth <= 600 ? 70 : 100;
    var iniciSection = document.getElementById("inici");
    if (iniciSection) {
        iniciSection.style.height = window.innerHeight + "px";
    }
    var scrollHandler = new ScrollHandler();
    var urlHandler = new UrlHandler();
    
    Array.apply(null, document.querySelectorAll('a[href*="#"]'))
      .filter(function (el) {  
        return el.getAttribute('href') !== "#" && el.getAttribute('href') !== "#0" && el.getAttribute('href')[0] === '#';
      }).map(function (el) {
        el.addEventListener('click', function (ev) {
            document.getElementsByClassName('navmenu-burger')[0].classList.remove('open');
            killEvent(ev);
            var section = document.getElementById(el.getAttribute('href').replace(/^\#/, ''));
            urlHandler.navigate(section.id, {
                silence: true
            });
            scrollHandler.scrollBy(section.getBoundingClientRect().top-(window.innerWidth > 600 ? 100 : 70), 0)
        });
      });
    
      // HEADER SCROLL HANDLING
    var header = document.getElementById('header');
    function headerScrollController (ev) {
        if (window.scrollY > 100) {
            document.body.classList.add("overflow");
            header.classList.add('opaque');
            WARN.active && document.body.classList.add("warned")

        } else {
            document.body.classList.remove("overflow");
            header.classList.remove('opaque')
        }
    }
    
    header.onScroll(headerScrollController);
    headerScrollController();
    
    // SECTIONS SCROLL HANDLING
    var sections = Array.apply(null, document.getElementsByClassName('section'));
    var navPanelTagger = (function () {
        var lastSection,
        elapsedSetter;
        return function navPanelTagger (ev) {
            var offsets = sections.map(function (section) {
                return {
                    section: section,
                    offset: getVisibleOffset(section).y
                }
            });
    
            currentSection = offsets.sort(function (d1, d2) {
                return d2.offset - d1.offset; 
            }).shift().section;
    
            if (currentSection) {
                if (lastSection != currentSection.id) {
                    clearTimeout(elapsedSetter);
                    elapsedSetter = setTimeout(function () {
                        urlHandler.navigate(currentSection.id, {
                            silence: true
                        });
                    }, 1000);
                }
                document.body.setAttribute('section', currentSection.id);
                lastSection = currentSection.id;
            } else {
                document.body.setAttribute('section', 'inici');
                lastSection = 'inici';
            }
        }
    })();
    
    scrollHandler.onScroll(navPanelTagger);
    navPanelTagger();
    
    var boxes = Array.apply(null, document.getElementsByClassName('track__info-btn')),
        box,
        target;

    Array.apply(null, document.getElementsByClassName("inscription-btn")).map(function (btn) {
        if (btn.getAttribute("disabled")) return;
        btn.addEventListener("mouseover", function (ev) {
            target = btn.getAttribute("target");
            box = boxes.filter(function (box) {
                return box.getAttribute("race") == target;
            }).pop();
            box.setAttribute("mouseover", "true");
        });
        btn.addEventListener("mouseout", function (ev) {
            target = btn.getAttribute("target");
            box = boxes.filter(function (box) {
                return box.getAttribute("race") == target;
            }).pop();
            box.removeAttribute("mouseover");
        });
    });
    
    function iframeResizer () {
        var iframe = document.getElementById('videoIframe');
        if (!iframe) return;
        var sf = window.innerWidth < 700 ? 0.90 : 1;
        iframe.setAttribute('width', window.innerWidth/(1.5*sf));
        iframe.setAttribute('height', iframe.getAttribute('width')/(1.9*sf));
    }
    
    // function openDocument () {
    //     event.stopPropagation();
    //     event.preventDefault();
    //     window.open(event.srcElement.getAttribute('data-url'));
    // }
    function isMobile () {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            document.body.classList.add('is-phone');
        } else {
            document.body.classList.remove("is-phone");
        }
    }

    var iframAutoFullScreen = (function () {
        var onFullScreenMode = false;
        var iframe = document.getElementById('videoIframe');
        if (iframe) {
            iframe.ownRequestFullscreen = function () {
                if (this.requestFullscreen) {
                    return this.requestFullscreen();
                } else if (this.mozRequestFullscreen) {
                    return this.mozRequestFullScreen();
                } else if (this.webkitRequestFullscreen) {
                    return this.webkitRequestFullscreen();
                } else if (this.msRequestFullscreen) {
                    return this.msRequestFullscreen();
                }
            }
            var parent = iframe.parentElement;
            var img = document.createElement("img");
            img.id = "videoIframe";
            img.style.cursor = "pointer";
            img.src = "img/video-screenshot.png";
            document.addEventListener("fullscreenchange", function (ev) {
                onFullScreenMode = !onFullScreenMode;
            });
    
            function onClick (ev) {
                parent.removeChild(img);
                parent.appendChild(iframe);
                iframe.ownRequestFullscreen();
            }
    
            return function () {
                if (onFullScreenMode) return;
                if (!document.body.classList.contains("is-phone")) {
                    iframe.src = "https://player.vimeo.com/video/373351629?portrait=0&autoplay=0";
                    if (parent.contains(img)) {
                        iframe.width = img.width;
                        iframe.height = img.height;
                        parent.removeChild(img);
                        parent.appendChild(iframe);
                    }
                } else {
                    iframe.src = "https://player.vimeo.com/video/373351629?portrait=1&autoplay=1";
                    if (parent.contains(iframe)) {
                        img.width = iframe.width;
                        img.height = iframe.height;
                        img.addEventListener("click", onClick);
                        parent.removeChild(iframe);
                        parent.appendChild(img);
                    }
                };
            }
        } else {
            return function () {}
        }
    })();

    window.onresize = function () {
        setTimeout(function () {
            iframeResizer();
            isMobile();
            iframAutoFullScreen();
        }, 0);
    };

    iframeResizer();
    isMobile();
    iframAutoFullScreen();
    
    function onClickOff (ev) {
        if (!ev.srcElement.classList.contains('scroll-link')) {
            ev.preventDefault();
            ev.stopPropagation();
            document.getElementsByClassName('navmenu-burger')[0].addEventListener('click', toggleNavBurgerVisibility);
        }
        document.body.removeEventListener('click', onClickOff);
        document.getElementsByClassName('navmenu-burger')[0].classList.remove('open');
    }

    function toggleNavBurgerVisibility (ev) {
        ev.stopPropagation();
        document.getElementsByClassName('navmenu-burger')[0].removeEventListener('click', toggleNavBurgerVisibility);
        document.body.addEventListener('click', onClickOff);
        if (ev.currentTarget.classList.contains('open')) {
            ev.currentTarget.classList.remove('open');
        } else {
            ev.currentTarget.classList.add('open');
        }
    }
    
    document.getElementsByClassName('navmenu-burger')[0].addEventListener('click', toggleNavBurgerVisibility);
});

function loadWarnings () {
    window.WARN = {
        active: false
    };
    const xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                const data = JSON.parse(this.response);
                if (data.active) {
                    window.WARN = data;
                }
                document.body.dispatchEvent(new CustomEvent("warn", {
                    detail: data
                }));
            } else {
                console.warn("Errror while loading the warnings");
            }
        }
    }

    xhr.open("GET", "/json/warnings.json", true);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

function onLoadWarnings () {
    WARN.active && document.body.classList.add("warn");
    document.getElementsByClassName("warn-band")[0].innerHTML = WARN.header;
    document.getElementsByClassName("warn-modal")[0].innerHTML = `<div class="warn-modal__wrapper">
            <div class="warn-modal__content">
                <h1>${WARN.modal}</h1>
                <p>Desplaça cap a baix per accedir a la pàgina</p>
            </div>
    </div>`;
}

loadWarnings();
document.body.addEventListener("warn", onLoadWarnings);