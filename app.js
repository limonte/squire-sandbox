const editor_div = document.getElementById('squire')
const editor = new Squire(editor_div)

const ua = navigator.userAgent
const isMac = /Mac OS X/.test(ua)
const ctrlKey = isMac ? 'meta-' : 'ctrl-'

let richTextMode = true
// TOGGLE SHORTCUTS
$('#disable-shortcuts').on('click', () => { richTextMode = false; editor.focus(); })
$('#enable-shortcuts').on('click', () => { richTextMode = true; editor.focus(); })

// SHOW SOURCE IN TEXTAREA
editor.addEventListener('input', (e) => {
  $('#editor-html').val(editor.getHTML())
})

// PASTING IMAGES
// this is needed for 'drop' event to fire
editor.addEventListener('dragover', (e) => {
  e.preventDefault()
})
editor.addEventListener('drop', (e) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    editor.insertImage(e.target.result)
  }
  reader.readAsDataURL(e.dataTransfer.files[0])
})

// SHORTCUTS
const mapKeyToFormat = (tag) => {
  return (self, event) => {
    event.preventDefault();
    if (!richTextMode) {
      return
    }
    const range = self.getSelection();
    if (self.hasFormat( tag, null, range)) {
      self.changeFormat( null, { tag: tag }, range );
    } else {
      self.changeFormat( { tag: tag }, null, range );
    }
  };
}
const noop = (self, event) => {
  event.preventDefault()
}
editor.setKeyHandler(ctrlKey + 'b', mapKeyToFormat('B'))
editor.setKeyHandler(ctrlKey + 'u', mapKeyToFormat('U'))
editor.setKeyHandler(ctrlKey + 'i', mapKeyToFormat('I'))
editor.setKeyHandler(ctrlKey + 'shift-7', noop) // default is 'S'
editor.setKeyHandler(ctrlKey + 'shift-5', noop) // default is 'SUB', { tag: 'SUP' }
editor.setKeyHandler(ctrlKey + 'shift-6', noop) // default is 'SUP', { tag: 'SUB' }
editor.setKeyHandler(ctrlKey + 'shift-8', noop) // default is 'makeUnorderedList'
editor.setKeyHandler(ctrlKey + 'shift-9', noop) // default is 'makeOrderedList'
editor.setKeyHandler(ctrlKey + '[', noop) // default is 'decreaseQuoteLevel'
editor.setKeyHandler(ctrlKey + ']', noop) // default is 'increaseQuoteLevel'
editor.setKeyHandler(ctrlKey + 'd', noop) // default is 'toggleCode'

// REMOVE FORMATTING
$('#remove-formatting').on('click', () => { editor.removeAllFormatting(); })
