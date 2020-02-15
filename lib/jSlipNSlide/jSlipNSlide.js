/**
 *  JavaScript slipNSlide
 *  A lightweight horizontal content slider in jQuery.
 *
 *  Copyright 2012, Marc S. Brooks (http://mbrooks.info)
 *  Licensed under the MIT license:
 *  http://www.opensource.org/licenses/mit-license.php
 *
 *  Dependencies:
 *    jquery.js
 *    jquery-ui.js
 */

if (!window.jQuery || (window.jQuery && parseInt(window.jQuery.fn.jquery.replace('.', '')) < parseInt('1.8.3'.replace('.', '')))) {
  throw new Error('slipNSlide requires jQuery 1.8.3 or greater.');
}

(function($) {

  /**
   * @namespace jSlipNSlide
   */
  var methods = {

    /**
     * Create new instance of jSlipNSlide
     *
     * @memberof jSlipNSlide
     * @method init
     *
     * @example
     * $('#container').jSlipNSlide(options, callback);
     *
     * @param {Object} settings
     * @param {Object} callback
     */
    "init": function(settings, callback) {

      // Default options
      var defaults = $.extend({
        scrollEasing: 'easeOutCirc',
        scrollSpeed:  400,
        showCounter:  false
      }, settings);

      return this.each(function() {
        var $this = $(this),
            data  = $this.data();

        if ( $.isEmptyObject(data) ) {
          $this.data({
            slider:     $this.children('.slider'),
            nodes:      $this.children('.slider > div'),
            buttonLast: $this.children('.slider_button_last'),
            buttonNext: $this.children('.slider_button_next'),
            options:    defaults
          });

          $this.jSlipNSlide('generate', callback);
        }
      });
    },

    /**
     * Perform cleanup.
     *
     * @memberof jSlipNSlide
     * @method destroy
     *
     * @example
     * $('#container').jSlipNSlide('destroy');
     */
    "destroy": function() {
      return this.each(function() {
        $(this).removeData();
      });
    },

    /**
     * Generate horizontally slider elements.
     *
     * @memberof jSlipNSlide
     * @method generate
     *
     * @example
     * $('#container').jSlipNSlide('generate', callback);
     *
     * @param {Function} callback
     */
    "generate": function(callback) {
      return this.each(function() {
        var $this = $(this),
            data  = $this.data();

        var sizes = [];

        // Save elements current width.
        data.nodes.each(function() {
          sizes.push( $(this).width() );
        });

        // Remove elements white-space.
        var str = data.slider.html();
        if (str) {
          str = str.replace(/>\s+</g, '><');
          data.slider.html(str);
        }
        else {
          $.error('No slider elements can be found');
        }

        // Reset element properties.
        data.nodes.each(function(num) {
          $(this).width(sizes[num]);
        });

        data.nodes = $this.find('.slider > div');

        $this.jSlipNSlide('_createSlider', data, callback);
      });
    },

    /**
     * Return slider to the start position.
     *
     * @memberof jSlipNSlide
     * @method reset
     *
     * @example
     * $('#container').jSlipNSlide('reset');
     */
    "reset": function() {
      return this.each(function() {
        var $this = $(this),
            data  = $this.data();

        data.buttonLast.hide();
        data.buttonNext.hide();

        data.nodes.stop().animate({
          left: 0
        },
        data.options.scrollSpeed, data.options.scrollEasing);
      });
    },

    /**
     * Create slider elements.
     *
     * @memberof jSlipNSlide
     * @method _createSlider
     *
     * @param {Object} data
     * @param {Function} callback
     *
     * @private
     */
    "_createSlider": function(data, callback) {
      var totalNodes = data.nodes.length,
          totalWidth = 0;

      data.nodes.each(function(index) {
        totalWidth += $(this).width();

        // Add counter to element.
        if (data.options.showCounter) {
          $(this).append(
            $('<span />')
              .addClass('counter')
              .append( (index + 1) + ' of ' + totalNodes)
          );
        }
      });

      if (totalWidth > data.slider.width()) {

        // Set visibility on load.
        data.buttonLast.hide();
        data.buttonNext.show(0);

        var viewButtonLast = false,
            viewButtonNext = true;

        // Show buttons on mouseover events.
        data.slider.parent().hover(
          function() {
            if (viewButtonLast) {
              data.buttonLast.show();
            }

            if (viewButtonNext) {
              data.buttonNext.show();
            }
          },
          function() {
            if (viewButtonLast) {
              data.buttonLast.fadeOut('fast');
            }

            if (viewButtonNext) {
              data.buttonNext.fadeOut('fast');
            }
          }
        );

        // Start slider on clickable events.
        data.buttonLast.on('click', function() {
          data.buttonNext.fadeIn('fast');

          var posX = data.nodes.position().left;

          if (posX + data.slider.width() <= 0) {
            data.nodes.stop().animate({
              left: '+=' + data.slider.width()
            },
            data.options.sliderSpeed, data.options.sliderEasing,
              function() {
                if (posX + data.slider.width() === 0) {
                  data.buttonLast.fadeOut('fast');
                }
              }
            );

            viewButtonNext = true;
          }
          else {
            data.buttonLast.fadeOut('fast');

            data.nodes.stop().animate({
              left: 0
            },
            data.options.scrollSpeed, data.options.scrollEasing);

            viewButtonLast = false;
          }

          if (typeof callback === 'function') {
            callback(data.slider);
          }
        });

        data.buttonNext.on('click', function() {
          data.buttonLast.fadeIn('fast');

          var posX = totalWidth + (data.nodes.position().left - data.slider.width());

          if (posX >= data.slider.width() ) {
            data.nodes.stop().animate({
              left: '-=' + data.slider.width()
            },
            data.options.scrollSpeed, data.options.scrollEasing,
              function() {
                if (posX === data.slider.width()) {
                  data.buttonNext.fadeOut('fast');
                }
              }
            );

            viewButtonLast = true;
          }
          else {
            data.buttonNext.fadeOut('fast');

            data.nodes.stop().animate({
              left: data.slider.width() - totalWidth
            },
            data.options.scrollSpeed, data.options.scrollEasing);

            viewButtonNext = false;
          }

          if (typeof callback === 'function') {
            callback(data.slider);
          }
        });
      }
    }
  };

  $.fn.jSlipNSlide = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    }
    else
    if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    }
    else {
      $.error('Method ' +  method + ' does not exist in jQuery.jSlipNSlide');
    }
  };
})(jQuery);
