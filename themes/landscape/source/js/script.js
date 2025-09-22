(function($){
  // Search
  var $searchWrap = $('#search-form-wrap'),
      isSearchAnim = false,
      searchAnimDuration = 200;

  var startSearchAnim = function(){
    isSearchAnim = true;
  };
  var stopSearchAnim = function(callback){
    setTimeout(function(){
      isSearchAnim = false;
      callback && callback();
    }, searchAnimDuration);
  };

  $('.nav-search-btn').on('click', function(){
    if (isSearchAnim) return;
    startSearchAnim();
    $('#search-container').addClass('show');
    stopSearchAnim(function(){
      $('#search-input').focus();
    });
  });

  $('.search-close').on('click', function(){
    $('#search-container').removeClass('show');
  });

  // Share
  $('body').on('click', function(){
    $('.article-share-box.on').removeClass('on');
  });

  $('body').on('click', '.article-share-link', function(e){
    e.preventDefault();
    e.stopPropagation();

    var $this = $(this),
        url = $this.data('url'),
        title = $this.data('title'),
        id = 'article-share-box-' + $this.data('id'),
        offset = $this.offset(),
        box = $('#' + id);

    if (!box.l
