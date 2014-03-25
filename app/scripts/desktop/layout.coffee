module.exports = class Layout
  constructor: ->
    $.supersized
      slides: [ { image : '../images/remotes_bg_min.png' }]

    $('#phone-wrapper').css 'margin-top', $(window).height()

    overlayEl = $('#overlay')

    $('#button-dim').click ->
      spanEl = $(@).children('span')

      if overlayEl.css('display') is 'none'
        overlayEl.fadeIn 'slow'
        spanEl.text 'On'
        spanEl.addClass 'dim-on'
        spanEl.removeClass 'dim-off'
      else
        overlayEl.fadeOut 'slow'
        spanEl.text 'Off'
        spanEl.addClass 'dim-off'
        spanEl.removeClass 'dim-on'
      false

    $('#steps li').on 'click', ->
      liEl = $(@)

      $('#steps .open').removeClass 'open'
      liEl.addClass 'open'

    $('<img src="images/remotes_bg_min.png">').on 'load', ->
      overlayEl.fadeOut 1200
      $('body').css 'overflow', 'auto'
      $('#loading').fadeOut 800

    $('#haeh').on 'click', ->
      $('#credits').fadeIn 'fast'
      $(@).fadeOut 'fast'

    $('#credits .close').on 'click', ->
      $(@).parent().fadeOut 'fast'
      $('#haeh').fadeIn 'fast'

    $('#right-wrapper').css
      height: $(window).height()
      overflow: 'hidden'

    @statsEl  = $('#stats')
    @visitsEl = $('#stats-visits', @statsEl)
    @pairsEl  = $('#stats-pairings', @statsEl)

  updateStats: (stats) ->
    @visitsEl.text stats.visits
    @pairsEl.text stats.pairs
    @statsEl.fadeIn 'slow'

  onPaired: ->
    $('.logo').addClass 'paired'
    top = $('#phone-wrapper').offset().top - 10
    
    $('#verification-wrapper').animate
      top: "-#{top}px" # these days i like it nasty
    , 'fast'

    $('#phone-wrapper').animate
      top: "-#{top}px" # these days i like it nasty
    , 'fast'

    $('#subscribe-wide').children().fadeOut('slow')

    $('#steps h4 span').addClass 'paired'

  setVisualKey: (visualKey) ->
    $('#visual-code span').text visualKey