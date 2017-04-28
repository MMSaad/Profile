$(document).ready(function () {
  //  All Alternate stylesheets Selector
  var $links = $('link[rel*=alternate][title]');

  $('body').prepend('<div class="style-switcher"><span class="style-switcher__header">Styles Selector</span><span class="style-switcher__control"></span></div>');
  var markup= '<div class="style-switcher__list">';
        markup += '<span class="style-switcher__property-heading">Color scheme</span>';
        markup += '<a stylesheet="css/red.css" class="style-switcher__link style-switcher__link--red"></a>';
        markup += '<a stylesheet="css/lightgreen.css" class="style-switcher__link style-switcher__link--lightgreen"></a>';
        markup += '<a stylesheet="css/violet.css" class="style-switcher__link style-switcher__link--violet"></a>';
        markup += '<a stylesheet="css/bluegreen.css" class="style-switcher__link style-switcher__link--bluegreen"></a>';
      markup += '</div>';


  $('.style-switcher').append(markup);

  $('.style-switcher__control').on('click', function(e){
    e.preventDefault();
    $('.style-switcher').toggleClass('style-switcher--is-active');
  });

  $('.style-switcher__list').on('click', 'a', function(e){
    e.preventDefault();
    $('link[rel*=changed]').remove();
    $('head').append('<link rel="stylesheet changed" href='+ e.target.attributes['stylesheet'].value +' type="text/css" />');
  });

});
