import $ from 'jquery'

const editor_div = document.getElementById('squire')
const editor = new window.Squire(editor_div as HTMLElement)

// SHOW SOURCE IN TEXTAREA
editor.addEventListener('input', () => {
  $('#editor-html').val(editor.getHTML())
})
// SET DEMO HTML
editor.setHTML(`
<h1>Installation</h1>
<ol>
  <li>Download the source from <a href="https://github.com/neilj/Squire">neilj/Squire</a></li>
 <li>Copy the contents of the <code>build/</code> directory onto your
 server.</li>

 <li>Edit the <code>&lt;style&gt;</code> block in <u>document.html</u> to add the
 default styles you <b>would</b> <i>like the editor</i> to use (or link to an external
 stylesheet).</li>

 <li>In your application, instead of a <code>&lt;textarea&gt;</code>, use an
 <code>&lt;iframe src="path/to/document.html"&gt;</code>.</li>

 <li>In your JS, attach an event listener to the <code>load</code> event of
 the iframe. When this fires you can grab a reference to the editor object
 through <code>iframe.contentWindow.editor</code>.</li>

 <li>Use the API below with the <code>editor</code> object to set and get
 data and integrate with your application or framework.</li>
</ol>
`)

const ua = navigator.userAgent
const isMac = /Mac OS X/.test(ua)
const ctrlKey = isMac ? 'meta-' : 'ctrl-'

let richTextMode = true
// TOGGLE SHORTCUTS
$('#disable-shortcuts').on('click', () => { richTextMode = false; editor.focus(); })
$('#enable-shortcuts').on('click', () => { richTextMode = true; editor.focus(); })

// PASTING IMAGES
// this is needed for 'drop' event to fire
editor.addEventListener('dragover', (e: DragEvent) => {
  e.preventDefault()
})
editor.addEventListener('drop', (e: DragEvent) => {
  if (!e.dataTransfer?.files.length) {
    return
  }
  const file = e.dataTransfer.files[0]
  const reader = new FileReader();
  reader.onload = () => {
    editor.insertImage(reader.result as ArrayBuffer, {
      name: file.name
    })
  }
  reader.readAsDataURL(file)
})

// SHORTCUTS
const mapKeyToFormat = (tag: string) => {
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
