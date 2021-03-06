Socket     = require('../socket')
Encryption = require('../encryption')
Keys       = require('../keys')
Layout     = require('./layout')

class Remote
  constructor: ->
    @socket     = new Socket
    @encryption = new Encryption
    @keys       = new Keys
    @layout     = new Layout

    @socket.io.on 'paired', =>
      @layout.onPaired()

    @socket.io.on 'message', (data) =>
      if data.name is 'update'
        imgSrc = @encryption.decryptAes(data.data, @keys.encryptionKey)

        $('#playing img').attr 'src', imgSrc
        $('html,body').animate({ scrollLeft: 250 }, 100)

      if data.name is 'play'
        el = $('#play')

        if el.hasClass 'playing'
          el.removeClass 'playing'
          el.html '<i class="fa fa-play"></i>'
        else
          el.addClass 'playing'
          el.html '<i class="fa fa-pause"></i>'

    $('#next').on 'click', =>
      @socket.io.emit 'message', { pairId: @keys.pairId, name: 'next', data: {}}
      false

    $('#prev').on 'click', =>
      @socket.io.emit 'message', { pairId: @keys.pairId, name: 'prev', data: {}}
      false

    hash = location.hash

    if hash.length isnt 0
      @hashData = hash.split('#')[1]
    else
      if localStorage.getItem('pairId') # always set, init by @keys
        @connect()
      else
        $('#nohash').show()
        $('#visual-key-wrapper').hide()

    visualKeyErrorEl = $('#visual-key-wrapper .error')
    visualKeyInputEl = $('#visual-key-input')

    $('#visual-key-form').on 'submit', (e) =>
      if @hashData
        key = visualKeyInputEl.val()
        ret = @keys.decryptWithVisualKey(key, @hashData)

        if ret is true
          @connect()
          visualKeyErrorEl.hide()
        else
          visualKeyErrorEl.show()

      e.preventDefault()
      false

    $('#reset').on 'click', =>
      @keys.clear()
      false

    $('#button-dim').click =>
      @sendCommand { command: 'dim', event: 'click', selector: '#button-dim' }

      false

  connect: ->
    @socket.io.emit 'connect',
      pairId    : @keys.pairId
      deviceType: 'remote'

  sendCommand: (data) ->
    command  = @encryption.encryptAes(data.command, @keys.encryptionKey)
    event    = @encryption.encryptAes(data.event, @keys.encryptionKey)
    selector = @encryption.encryptAes(data.selector, @keys.encryptionKey)
    
    @socket.io.emit 'message',
      command      : command
      event        : event
      selector     : selector
      pairId       : @keys.pairId


jQuery ->
  new Remote