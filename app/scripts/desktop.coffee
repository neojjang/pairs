module.exports = class Desktop
  constructor: ->
    Socket     = require('./socket')
    Encryption = require('./encryption')

    @socket     = new Socket
    @encryption = new Encryption

    @rootUrl       = 'http://192.168.0.11:9000'
    @connectionKey = @initKey('connectionCode')
    @encryptionKey = @initKey('encryptionKey')
    @visualKey     = ''

    @qrCode = new QRCode document.getElementById("qr-code"),
      text  : 'pairs.io'
      width : 300
      height: 300

    $.supersized
      slides: [ { image : '../images/remotes_bg_min.png' }]

    $('#visual-code a').on 'click', =>
      @generateVisualKey()
      @generateQrCode()
      false

    @socket.io.on 'desktop:paired', => @onPaired()

    @socket.io.on 'desktop:command', (data) =>
      selector = @encryption.decryptAes(data.selector, @encryptionKey)
      event = @encryption.decryptAes(data.event, @encryptionKey)
      
      $(selector).trigger event

    $('#phone-wrapper').css 'margin-top', $(window).height()
    
    overlayEl = $('#overlay')
    overlayEl.fadeOut 1200

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


    @generateVisualKey()
    @generateQrCode()
    @connectToServer()

    #@onPaired()

  initKey: (keyName) ->
    key = localStorage.getItem(keyName)

    unless key
      key = @encryption.randString()
      localStorage.setItem keyName, key

    key

  connectToServer: ->
    @socket.io.emit 'desktop:connect', 
      connectionKey: @connectionKey

  generateVisualKey: ->
    @visualKey = @encryption.randString(5)
    $('#visual-code span').text @visualKey

  generateQrCode: ->
    json = JSON.stringify({ ck: @connectionKey, ek: @encryptionKey })
    enc  = @encryption.encryptAes(json, @visualKey)
    data = "#{@rootUrl}/remote.html##{enc}"
    
    @qrCode.clear()
    @qrCode.makeCode data
    #$('#qr-code').attr 'title', ''

  onPaired: ->
    $('.logo').addClass 'paired'
    
    $('#right-wrapper').animate
      top: "-#{$('#phone-wrapper').offset().top - 10}px" # these days i like it nasty
    , 'fast'