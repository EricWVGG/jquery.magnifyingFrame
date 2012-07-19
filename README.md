jQuery.magnifyingFrame.js
======================

Takes a shrunken image tag and creates a magnified-zoom that follows the cursor.

DIRECTIONS
Create a simple &lt;img&gt; tag, shrink the dimensions (say, present an 800x800 jpeg as 400x400), and initiate the javascript.

EXAMPLE
  &lt;img src="img/sample.jpg" class="magnifyingFrame" width="425" height="303"&gt;
  &lt;script type="text/javascript"&gt;
    $(function() {
      $('.magnifyingFrame').magnifyingFrame();
    });
  &lt;/script&gt;

DEFAULT SETTINGS
  $('.magnifyingFrame').magnifyingFrame({
    'css_transitions' : true, /* smooths motion a little, creates a bouncing effect */
    'refresh_interval' : 2, /* increase if you have CPU issues */
    'frame_shadow' : true, /* creates an inset shadow while zooming */
    'mouseenter' : function(), /* optional callback function */
    'mouseleave' : function(), /* optional callback function */
    'css_transition_speed' : '0.1s' /* self-explanatory, probably won't need to adjust */
  });

(c) 2012 Eric Jacobsen
