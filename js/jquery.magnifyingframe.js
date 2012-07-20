/*
 * jQuery Magnifying Frame plugin
 *   http://whiskyvangoghgo.com/projects/magnifyingFrame
 *
 * Takes a shrunken <img> and creates a magnified-zoom that follows
 * the cursor.
 *
 * usage example: take an 800x800 JPEG and...
 *   <img src="someimage.jpg" width="400" height="400">
 *   <script type="text/javascript">
 *     $('img').magnifyingFrame();
 *   </script>
 * 
 * I hope this plugin is fun and useful for you. Please email me with
 * examples of use and suggestions.
 * 
 * Copyright (c) 2012 Eric Jacobsen <eric@whiskyvangoghgo.com>
 *
 * Permission to use, copy, modify, and distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */


(function($) {
  $.fn.magnifyingFrame = function(arguments) {

    // Setting the cursor tracking as a global because we don't want multiple
    //  mousemove() events bound to the document.
    $(document).mousemove(function(event) {
      magnifyingFrame_cursor_tracking = {
        x: event.pageX,
        y: event.pageY
      };
    });

    var properties = $.extend({
      'css_transitions' : true, /* smooths motion a little, creates a bouncing effect */
      'css_transition_speed' : '0.1s', /* self-explanatory, probably won't need to adjust */
      'refresh_interval' : 2, /* increase if you have CPU issues */
      'frame_shadow' : 'inset 0px 0px 20px rgba(0,0,0,0.5)', /* creates an inset shadow while zooming */
      'mouseenter' : null, /* optional callback function */
      'mouseleave' : null, /* optional callback function */
      'frame' : null /* generated frame */
    }, arguments);

    return this.each(function() {

      var $image = null,
        magnifying_frame_active = null,
        multiplier = 1,
        frame_width = 0,
        frame_height = 0,
        zoomed_width = 0,
        zoomed_height = 0;
      
      var methods = {
        init : function(options) { // Initialises the plugin
          // keep track of cursor on screen
          return $(this).each(function() {
            $image = $(this);
            if (options) $.extend(properties, options);
            if (properties.mouseenter === null) properties.mouseenter = methods.mouseenter;
            if (properties.mouseleave === null) properties.mouseleave = methods.mouseleave;
            methods.replace_image_with_frame();
            methods.bind_events();
          });
        },
        mouseenter : function() {
          // callback function placeholder
          // do nothing
        },
        mouseleave : function() {
          // callback function placeholder
          // do nothing
        },
        replace_image_with_frame : function() { // Creates the div that files can be dropped on to
          // get zoomed image dimensions
            var img = new Image();
            img.onload = function() {
              zoomed_width = img.width;
              zoomed_height = img.height;
              img = '';
              // multiplier determines position of image relative to cursor's position in frame
              multiplier = (zoomed_width - frame_width) / frame_width;
            }
            img.src = $image.attr('src');
          // create, style frame
            frame_width = $image.attr('width');
            frame_height = $image.attr('height');
            var frame = $('<div/>', {
              class: 'magnifyingFrame',
            });
            frame.css({
              'width' : frame_width,
              'height' : frame_height,
              'background-image' : 'url("'+$image.attr('src')+'")',
              'background-size' : frame_width+'px '+frame_height+'px',
              'background-repeat' : 'no-repeat',
              'display' : 'inline-block'
            });
            if(properties.css_transitions) {
              frame.css({
                '-webkit-transition-property' : 'background-size, background-position, box-shadow',
                '-webkit-transition-duration' : properties.css_transition_speed,
                '-webkit-transition-timing-function' : 'ease-out',
                '-moz-transition-property' : 'background-size, background-position, box-shadow',
                '-moz-transition-duration' : properties.css_transition_speed,
                '-moz-transition-timing-function' : 'ease-out',
                '-ms-transition-property' : 'background-size, background-position, box-shadow',
                '-ms-transition-duration' : properties.css_transition_speed,
                '-ms-transition-timing-function' : 'ease-out',
                '-o-transition-property' : 'background-size, background-position, box-shadow',
                '-o-transition-duration' : properties.css_transition_speed,
                '-o-transition-timing-function' : 'ease-out',
                'transition-property' : 'background-size, background-position, box-shadow',
                'transition-duration' : properties.css_transition_speed,
                'transition-timing-function' : 'ease-out'
              });
            }
            if(properties.frame_shadow) {
              frame.data('box_shadow', properties.frame_shadow );
            }
          // replace image with frame
            $image.css('display', 'none').before(frame);
            properties.frame = frame;
        },
        bind_events : function() { // Bind plugin events
          properties.frame.mouseenter(function(){
            properties.mouseenter();
            properties.frame.addClass('magnifyingFrame_active').css('box-shadow', properties.frame.data('box_shadow'));
            magnifying_frame_active = setInterval(function() {
              var offset = properties.frame.offset(),
                dx = ( offset.left - magnifyingFrame_cursor_tracking.x ) * multiplier,
                dy = ( offset.top - magnifyingFrame_cursor_tracking.y ) * multiplier;
              properties.frame.css({
                'background-size' : zoomed_width+'px '+zoomed_height+'px',
                'background-position' : dx+'px '+dy+'px'
              });
            }, properties.refresh_interval);
          });
          properties.frame.mouseleave(function(){
            clearInterval(magnifying_frame_active);
            properties.mouseleave();
            properties.frame.removeClass('magnifyingFrame_active').css({
              'background-size': frame_width+'px '+frame_height+'px',
              'background-position' : '0px 0px',
              'box-shadow' : ''
            });
          });
        },
      };
  
      return methods.init.apply(this);

    });

  };
})(jQuery);

