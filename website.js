/**
 * Of the many projects I work on at any given time.
 * Porting this dated website from jQuery to a modern
 * JavaScript framework is not one of them.
 */
$(document).ready(function() {
  var isMobile = null,
      aVisible = null,
      sVisible = null;

  // Check mobile device.
  if (navigator.userAgent.match(/(Android|iPad|iPhone|iPod|Mobile|WebOS)/i)
    || isTouchDevice()) {
    isMobile = true;
  }

  var project_slider = $('#projects').jSlipNSlide(),
      content_about  = $('#about'),
      content_intro  = $('#intro');

  // Toggle project slider visibility.
  $('strong', content_intro)
    .on('click', function(event) {
      event.preventDefault();

      if (sVisible) {
        hideScroller(function() {
          project_slider.jSlipNSlide('reset');
          sVisible = null;
        });
      }
      else {
        showScroller(function() {
          project_slider.jSlipNSlide('generate');
          sVisible = true;
        });
      }
    });

  // Randomize "one" link target.
  var links = project_slider.find('a'),
      rand  = Math.round(Math.random() * links.length),
      href  = links.eq(rand).attr('href');

  $('.random_project', content_intro).attr('href', href);

  // Show colored photo.
  content_about.on('hover mouseover', function() {
    if (aVisible) {
      viewPhotoColor();
    }
  });

  var link_about = $('footer .links .about');

  // Toggle "About Me" content visibility.
  link_about.on('click', function(event) {
    event.preventDefault();

    if (sVisible) {
      hideScroller(function() {
        hideIntro(function() {
          viewAbout(function() {
            $(this).addClass('open');
            sVisible = null;
            aVisible = true;
          });
        });
      });
    }
    else
    if (aVisible) {
      hideAbout(function() {
        viewIntro(function() {
          content_about.removeClass('open');
          aVisible = null;
        });
      });
    }
    else {
      hideIntro(function() {
        viewAbout(function() {
          $(this).addClass('open');
          aVisible = true;
        })
      });
    }
  });

  if (isMobile) {

    // Reset viewport on orientation event.
    window.onorientationchange = function() {
      this.location.reload();
    };
  }

  /**
   * Show project slider.
   *
   * @param {Function} callback
   */
  function showScroller(callback) {
    project_slider.stop().slideDown({
      duration: 1000,
      easing:   'easeOutBounce',
      complete: callback
    });
  }

  /**
   * Hide project slider.
   *
   * @param {Function} callback
   */
  function hideScroller(callback) {
    project_slider.jSlipNSlide('reset');
    project_slider.stop().slideUp({
      duration: 1000,
      easing:   'easeInExpo',
      complete: callback
    });
  }

  /**
   * Show page content.
   *
   * @param {Function} callback
   */
  function viewIntro(callback) {
    content_intro.stop().fadeIn('slow', callback);
  }

  /**
   * Hide page content.
   *
   * @param {Function} callback
   */
  function hideIntro(callback) {
    content_intro.fadeOut('slow', callback);
  }

  /**
   * Show "About Me" content.
   *
   * @param {Function} callback
   */
  function viewAbout(callback) {
    content_about.show(0).stop().animate({
      left: '+=' + getObjCenter(content_about)
    }, 'slow','easeOutExpo', callback);

    link_about.addClass('open');
  }

  /**
   * Hide "About Me" content.
   *
   * @param {Function} callback
   */
  function hideAbout(callback) {
    content_about.stop().fadeOut('slow', function() {
      $(this).animate({
          left: '-=' + getObjCenter(content_about)
        },
        'slow','easeOutExpo', function() {
          window.scrollTo(0, 0);

          callback();
        });
    });

    viewPhotoVector();

    link_about.removeClass('open');
  }

  /**
   * Show color photo.
   */
  function viewPhotoColor() {
    $('.photo .image1', content_about).stop().fadeOut('slow', function() {
      $(this).css({
        display:    'block',
        visibility: 'hidden'
      });
    });
  }

  /**
   * Show vector photo.
   */
  function viewPhotoVector() {
    $('.photo .image1', content_about).fadeIn('slow').css({
      display:    'block',
      visibility: 'visible'
    });
  }

  /**
   * Return X position, align center, in the browser viewport.
   *
   * @param {Object} obj
   *
   * @return {Number}
   */
  function getObjCenter(obj) {
    var winWidth = $(window).width(),
        objWidth = obj.width();

    return winWidth - ((winWidth - objWidth) / 2);
  }

  /**
   * Return true if touch device.
   *
   * @return {Boolean}
   */
  function isTouchDevice() {
    return 'ontouchstart' in window;
  }
});
